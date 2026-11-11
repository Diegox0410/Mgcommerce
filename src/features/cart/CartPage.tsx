
import { useState } from 'react'
import {
  ArrowRight,
  Check,
  Copy,
  MessageCircle,
  Trash2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductMedia } from '../../components/commerce/ProductMedia'
import { QuantitySelector } from '../../components/commerce/QuantitySelector'
import { IconButton } from '../../components/ui/IconButton'
import { EmptyState } from '../../components/ui/Surface'
import { formatMoney, lineTotal } from '../../domain/products/pricing'
import { usePageMeta } from '../../hooks/use-page-meta'
import {
  selectCartCount,
  selectCartCurrency,
  selectCartSubtotal,
  useCartStore,
} from '../../stores/cart-store'
import { useStoreConfigStore } from '../../stores/store-config-store'

export function CartPage() {
  const items = useCartStore((state) => state.items)
  const count = useCartStore(selectCartCount)
  const total = useCartStore(selectCartSubtotal)
  const currency = useCartStore(selectCartCurrency)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const remove = useCartStore((state) => state.remove)
  const clear = useCartStore((state) => state.clear)

  const whatsapp = useStoreConfigStore(
    (state) => state.config.whatsapp,
  )

  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState('')

  usePageMeta('Tu selección')

  const digits = whatsapp.number.replace(/\D/g, '')
  const whatsappReady =
    whatsapp.enabled &&
    digits.length >= 8 &&
    digits.length <= 15

  const message = [
    'Hola, MG Salud & Belleza.',
    '',
    'Me gustaría solicitar los siguientes productos:',
    '',
    ...items.flatMap((item, index) => [
      `${index + 1}. ${item.name}`,
      `Código: ${item.productId}`,
      ...(item.variantName
        ? [`Variante: ${item.variantName}`]
        : []),
      `Cantidad: ${item.quantity}`,
      `Precio mostrado: ${formatMoney(item.unitPrice, item.currency)}`,
      '',
    ]),
    currency
      ? `Subtotal referencial: ${formatMoney(total, currency)}`
      : 'Subtotal por confirmar',
    '',
    'Por favor, confirmen precios, disponibilidad y opciones de entrega.',
    '',
    'Origen: MGcommerce - Catálogo web',
  ].join('\n')

  const whatsappUrl = whatsappReady
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : null

  const copyRequest = async () => {
    setCopyError('')

    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
    } catch {
      setCopyError('No se pudo copiar la solicitud.')
    }
  }

  if (!items.length) {
    return (
      <section className="cart-page container">
        <header className="cart-page__header">
          <div>
            <span className="eyebrow">Tu selección</span>
            <h1>Carrito</h1>
          </div>
        </header>

        <EmptyState
          title="Tu selección empieza aquí"
          description="Explora el catálogo y agrega los productos que deseas consultar."
        />

        <Link
          className="button button--primary empty-action"
          to="/catalogo"
        >
          Explorar catálogo
        </Link>
      </section>
    )
  }

  return (
    <section className="cart-page container">
      <header className="cart-page__header">
        <div>
          <span className="eyebrow">
            Tu selección · {count}
          </span>
          <h1>Tu selección</h1>
        </div>

        <button type="button" onClick={clear}>
          Vaciar carrito
        </button>
      </header>

      <div className="cart-page__layout">
        <div className="cart-page__lines">
          {items.map((item) => (
            <article
              className="cart-page-line"
              key={`${item.productId}-${item.variantId ?? ''}`}
            >
              <Link to={`/producto/${item.slug}`}>
                <ProductMedia
                  image={{
                    id: 'cart-page',
                    url: item.imageUrl ?? '',
                    alt: item.name,
                    sortOrder: 0,
                    placeholderTone: item.imageTone,
                  }}
                />
              </Link>

              <div>
                <Link to={`/producto/${item.slug}`}>
                  <h2>{item.name}</h2>
                </Link>

                {item.variantName && (
                  <p>{item.variantName}</p>
                )}

                <span>
                  {formatMoney(item.unitPrice, item.currency)}
                  {' '}por unidad
                </span>

                <div className="cart-page-line__controls">
                  <QuantitySelector
                    value={item.quantity}
                    onChange={(quantity) =>
                      setQuantity(
                        item.productId,
                        item.variantId,
                        quantity,
                      )
                    }
                  />

                  <IconButton
                    aria-label={`Eliminar ${item.name}`}
                    onClick={() =>
                      remove(item.productId, item.variantId)
                    }
                  >
                    <Trash2 size={17} />
                  </IconButton>
                </div>
              </div>

              <strong>
                {formatMoney(
                  lineTotal(item.unitPrice, item.quantity),
                  item.currency,
                )}
              </strong>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <span className="eyebrow">
            Resumen de solicitud
          </span>

          <div>
            <span>Subtotal referencial</span>
            <strong>
              {currency
                ? formatMoney(total, currency)
                : 'Por confirmar'}
            </strong>
          </div>

          <p>
            Precios, descuentos, disponibilidad y entrega
            deberán confirmarse antes de realizar la compra.
          </p>

          {whatsappUrl ? (
            <a
              className="button button--primary"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Solicitar por WhatsApp
              <MessageCircle size={18} />
            </a>
          ) : (
            <p>
              El envío por WhatsApp estará disponible cuando
              configuremos el número oficial.
            </p>
          )}

          <button
            type="button"
            className="button button--secondary"
            onClick={() => void copyRequest()}
          >
            {copied ? 'Solicitud copiada' : 'Copiar solicitud'}
            {copied ? <Check size={17} /> : <Copy size={17} />}
          </button>

          {copyError && (
            <p role="alert">{copyError}</p>
          )}

          <Link className="text-link" to="/catalogo">
            Seguir explorando
            <ArrowRight size={17} />
          </Link>
        </aside>
      </div>
    </section>
  )
}
