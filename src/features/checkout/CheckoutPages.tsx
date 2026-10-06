import { ArrowLeft, Check, LockKeyhole } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Input, Textarea } from '../../components/ui/FormControls'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/Surface'
import { validateCheckout, type CheckoutErrors } from '../../domain/orders/order-draft'
import { formatMoney, lineTotal } from '../../domain/products/pricing'
import { usePageMeta } from '../../hooks/use-page-meta'
import { selectCartCurrency, selectCartSubtotal, useCartStore } from '../../stores/cart-store'
import { useCheckoutStore, type CheckoutConfirmation } from '../../stores/checkout-store'
import { useStoreConfigStore } from '../../stores/store-config-store'

const createIdempotencyKey = () =>
  `mg-checkout-${crypto.randomUUID().replace(/-/g, '')}`

const orderIdentifier = (order: Record<string, unknown>): string | null => {
  for (const key of ['orderNumber', 'number', 'id']) {
    const value = order[key]
    if (typeof value === 'string' && value.trim()) return value
  }
  return null
}

export function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const total = useCartStore(selectCartSubtotal)
  const currency = useCartStore(selectCartCurrency)
  const clearCart = useCartStore((state) => state.clear)
  const config = useStoreConfigStore((state) => state.config.checkout)
  const complete = useCheckoutStore((state) => state.complete)
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  usePageMeta('Finalizar pedido')

  if (!items.length) {
    return (
      <section className="checkout-page container">
        <EmptyState
          title="No hay productos para confirmar"
          description="Añade productos al carrito antes de finalizar tu pedido."
        />
        <Link className="button button--primary empty-action" to="/catalogo">
          Ir al catálogo
        </Link>
      </section>
    )
  }

  if (
    config.mode !== 'live' ||
    !config.paymentMethods.some((method) => method.enabled && !method.sampleOnly)
  ) {
    return (
      <section className="checkout-page container">
        <EmptyState
          title="Checkout pendiente de configuración"
          description="MG todavía no tiene métodos comerciales habilitados para recibir pedidos."
        />
      </section>
    )
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    const data = new FormData(event.currentTarget)
    const input = {
      name: String(data.get('name') ?? ''),
      phone: String(data.get('phone') ?? ''),
      email: String(data.get('email') ?? ''),
      address: String(data.get('address') ?? ''),
      city: String(data.get('city') ?? ''),
      reference: String(data.get('reference') ?? ''),
      paymentMethodId: String(data.get('payment') ?? ''),
    }

    const nextErrors = validateCheckout(input)
    setErrors(nextErrors)
    setSubmitError('')

    if (Object.keys(nextErrors).length) return

    setSubmitting(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey: createIdempotencyKey(),
          customer: {
            name: input.name.trim(),
            phone: input.phone.trim(),
            ...(input.email.trim()
              ? { email: input.email.trim().toLowerCase() }
              : {}),
          },
          shipping: {
            city: input.city.trim(),
            address: input.address.trim(),
            ...(input.reference.trim()
              ? { reference: input.reference.trim() }
              : {}),
          },
          paymentMethod: input.paymentMethodId,
          lines: items.map((item) => ({
            productId: item.productId,
            ...(item.variantId ? { variantId: item.variantId } : {}),
            quantity: item.quantity,
          })),
        }),
      })

      const payload: unknown = await response.json().catch(() => null)

      if (
        !response.ok ||
        !payload ||
        typeof payload !== 'object' ||
        !(payload as { ok?: boolean }).ok
      ) {
        const message =
          payload &&
          typeof payload === 'object' &&
          'error' in payload &&
          typeof (payload as { error?: unknown }).error === 'string'
            ? String((payload as { error: string }).error)
            : 'No se pudo registrar el pedido. Intenta nuevamente.'

        throw new Error(message)
      }

      const result = payload as Partial<CheckoutConfirmation> & { ok: true }

      if (
        result.tenantId !== 'tenant-mg' ||
        !result.order ||
        typeof result.order !== 'object' ||
        !result.receipt ||
        typeof result.receipt !== 'object'
      ) {
        throw new Error('La confirmación del pedido no es válida.')
      }

      complete({
        tenantId: result.tenantId,
        order: result.order,
        receipt: result.receipt,
      })

      clearCart()
      navigate('/exito', { replace: true })
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'No se pudo registrar el pedido. Intenta nuevamente.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const enabled = (field: typeof config.enabledFields[number]) =>
    config.enabledFields.includes(field)

  const paymentMethods = config.paymentMethods.filter(
    (method) => method.enabled && !method.sampleOnly,
  )

  return (
    <section className="checkout-page container">
      <Link className="checkout-back" to="/carrito">
        <ArrowLeft size={16} /> Volver al carrito
      </Link>

      <div className="checkout-heading">
        <span className="eyebrow">FINALIZAR PEDIDO</span>
        <h1>Confirma tus datos.</h1>
        <p>
          MG registrará tu pedido y validará precio y disponibilidad antes de confirmarlo.
        </p>
      </div>

      <form className="checkout-layout" onSubmit={submit} noValidate>
        <div className="checkout-form">
          <section>
            <div className="checkout-section-title">
              <span>01</span>
              <div>
                <h2>Contacto</h2>
                <p>Datos para identificar tu pedido y mantenerte informado.</p>
              </div>
            </div>

            <div className="form-grid">
              {enabled('name') && (
                <Input
                  id="name"
                  name="name"
                  label="Nombre completo"
                  autoComplete="name"
                  error={errors.name}
                  required
                />
              )}

              {enabled('phone') && (
                <Input
                  id="phone"
                  name="phone"
                  label="Teléfono"
                  type="tel"
                  autoComplete="tel"
                  error={errors.phone}
                  required
                />
              )}

              {enabled('email') && (
                <Input
                  id="email"
                  name="email"
                  label="Correo electrónico (opcional)"
                  type="email"
                  autoComplete="email"
                  error={errors.email}
                />
              )}
            </div>
          </section>

          <section>
            <div className="checkout-section-title">
              <span>02</span>
              <div>
                <h2>Entrega</h2>
                <p>Indica dónde debemos gestionar la entrega de tu pedido.</p>
              </div>
            </div>

            <div className="form-grid">
              {enabled('address') && (
                <Input
                  id="address"
                  name="address"
                  label="Dirección"
                  autoComplete="street-address"
                  error={errors.address}
                  required
                />
              )}

              {enabled('city') && (
                <Input
                  id="city"
                  name="city"
                  label="Ciudad"
                  autoComplete="address-level2"
                  error={errors.city}
                  required
                />
              )}

              {enabled('reference') && (
                <Textarea
                  id="reference"
                  name="reference"
                  label="Referencia o notas (opcional)"
                  rows={3}
                />
              )}
            </div>
          </section>

          <section>
            <div className="checkout-section-title">
              <span>03</span>
              <div>
                <h2>Método de pago</h2>
                <p>El pago será verificado antes de continuar con la preparación.</p>
              </div>
            </div>

            <fieldset className="payment-options">
              <legend className="sr-only">Método de pago</legend>

              {paymentMethods.map((method) => (
                <label key={method.id}>
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    disabled={submitting}
                  />
                  <span>
                    <LockKeyhole />
                    {method.label}
                  </span>
                </label>
              ))}

              {errors.payment && (
                <small className="form-error">{errors.payment}</small>
              )}
            </fieldset>
          </section>

          {submitError && (
            <p className="form-error" role="alert">
              {submitError}
            </p>
          )}
        </div>

        <aside className="checkout-summary">
          <span className="eyebrow">Resumen del pedido</span>

          {items.map((item) => (
            <div
              className="checkout-item"
              key={`${item.productId}-${item.variantId ?? ''}`}
            >
              <span>
                {item.quantity} × {item.name}
                {item.variantName ? ` · ${item.variantName}` : ''}
              </span>
              <strong>
                {formatMoney(
                  lineTotal(item.unitPrice, item.quantity),
                  item.currency,
                )}
              </strong>
            </div>
          ))}

          <div className="checkout-total">
            <span>Subtotal mostrado</span>
            <strong>
              {currency
                ? formatMoney(total, currency)
                : 'Moneda por confirmar'}
            </strong>
          </div>

          <p>
            Precio y disponibilidad serán validados nuevamente por MG antes de registrar el pedido.
          </p>

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Registrando pedido…' : 'Confirmar pedido'}
            {!submitting && <Check size={17} />}
          </Button>
        </aside>
      </form>
    </section>
  )
}

export function SuccessPage() {
  const confirmation = useCheckoutStore((state) => state.confirmation)
  const consume = useCheckoutStore((state) => state.consume)

  usePageMeta('Pedido recibido')

  if (!confirmation || confirmation.tenantId !== 'tenant-mg') {
    return <Navigate to="/carrito" replace />
  }

  const identifier = orderIdentifier(confirmation.order)

  return (
    <section className="success-page container">
      <div className="success-mark">
        <Check />
      </div>

      <span className="eyebrow">PEDIDO RECIBIDO</span>
      <h1>Gracias, {confirmation.receipt.customer.name}.</h1>

      <p>
        Tu pedido fue registrado correctamente en MG.
        {identifier ? ` Referencia: ${identifier}.` : ''}
        {' '}El pago deberá ser verificado antes de preparar el pedido.
      </p>

      <div className="success-actions">
        <Link
          className="button button--primary"
          to="/"
          onClick={consume}
        >
          Volver al inicio
        </Link>

        <Link
          className="button button--secondary"
          to="/catalogo"
          onClick={consume}
        >
          Explorar catálogo
        </Link>
      </div>
    </section>
  )
}