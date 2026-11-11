
import { ArrowRight, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  formatMoney,
  lineTotal,
} from '../../domain/products/pricing'
import {
  selectCartCount,
  selectCartCurrency,
  selectCartSubtotal,
  useCartStore,
} from '../../stores/cart-store'
import { useStorefrontUiStore } from '../../stores/storefront-ui-store'
import { Drawer } from '../ui/Overlays'
import { IconButton } from '../ui/IconButton'
import { ProductMedia } from '../commerce/ProductMedia'
import { QuantitySelector } from '../commerce/QuantitySelector'

export function CartDrawer() {
  const open = useStorefrontUiStore(
    (state) => state.cartOpen,
  )

  const close = useStorefrontUiStore(
    (state) => state.closeCart,
  )

  const items = useCartStore(
    (state) => state.items,
  )

  const count = useCartStore(selectCartCount)
  const total = useCartStore(selectCartSubtotal)
  const currency = useCartStore(selectCartCurrency)

  const setQuantity = useCartStore(
    (state) => state.setQuantity,
  )

  const remove = useCartStore(
    (state) => state.remove,
  )

  return (
    <Drawer
      open={open}
      onClose={close}
      title={`Tu selección · ${count}`}
    >
      <div className="cart-drawer">

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <h3>
              Tu selección empieza aquí.
            </h3>

            <p>
              Explora nuestro catálogo y añade
              los productos que deseas consultar.
            </p>

            <Link
              className="button button--primary"
              to="/catalogo"
              onClick={close}
            >
              Explorar catálogo
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <>
            {/* PRODUCTOS DEL CARRITO */}
            <div className="cart-lines">
              {items.map((item) => (
                <article
                  className="cart-line"
                  key={`${item.productId}-${item.variantId ?? ''}`}
                >
                  <Link
                    to={`/producto/${item.slug}`}
                    onClick={close}
                  >
                    <ProductMedia
                      image={{
                        id: 'cart',
                        url: item.imageUrl ?? '',
                        alt: item.name,
                        sortOrder: 0,
                        placeholderTone: item.imageTone,
                      }}
                    />
                  </Link>

                  <div className="cart-line__info">
                    <Link
                      to={`/producto/${item.slug}`}
                      onClick={close}
                    >
                      <strong>{item.name}</strong>
                    </Link>

                    {item.variantName && (
                      <span>{item.variantName}</span>
                    )}

                    <span>
                      {formatMoney(
                        item.unitPrice,
                        item.currency,
                      )}
                    </span>

                    <QuantitySelector
                      compact
                      value={item.quantity}
                      onChange={(quantity) =>
                        setQuantity(
                          item.productId,
                          item.variantId,
                          quantity,
                        )
                      }
                    />
                  </div>

                  <div className="cart-line__end">
                    <IconButton
                      aria-label={`Eliminar ${item.name}`}
                      onClick={() =>
                        remove(
                          item.productId,
                          item.variantId,
                        )
                      }
                    >
                      <Trash2 size={16} />
                    </IconButton>

                    <strong>
                      {formatMoney(
                        lineTotal(
                          item.unitPrice,
                          item.quantity,
                        ),
                        item.currency,
                      )}
                    </strong>
                  </div>
                </article>
              ))}
            </div>

            {/* RESUMEN Y ACCIONES */}
            <footer className="cart-drawer__footer">
              <div>
                <span>Subtotal referencial</span>

                <strong>
                  {currency
                    ? formatMoney(total, currency)
                    : 'Por confirmar'}
                </strong>
              </div>

              <small>
                Los precios, disponibilidad, descuentos
                y entrega deberán confirmarse antes
                de realizar la compra.
              </small>

              <Link
                className="button button--primary"
                to="/carrito"
                onClick={close}
              >
                Revisar solicitud
                <ArrowRight size={17} />
              </Link>

              <Link
                className="button button--secondary"
                to="/catalogo"
                onClick={close}
              >
                Seguir explorando
              </Link>
            </footer>
          </>
        )}
      </div>
    </Drawer>
  )
}
