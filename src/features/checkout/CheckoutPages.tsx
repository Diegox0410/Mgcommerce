import { ArrowLeft, Check, LockKeyhole } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Input, Textarea } from '../../components/ui/FormControls'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/Surface'
import { completeOrderDraft, createOrderDraft, validateCheckout, type CheckoutErrors } from '../../domain/orders/order-draft'
import { formatMoney, lineTotal } from '../../domain/products/pricing'
import { usePageMeta } from '../../hooks/use-page-meta'
import { selectCartSubtotal, useCartStore } from '../../stores/cart-store'
import { useCheckoutStore } from '../../stores/checkout-store'
import { useStoreConfigStore } from '../../stores/store-config-store'

export function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const total = useCartStore(selectCartSubtotal)
  const clearCart = useCartStore((state) => state.clear)
  const config = useStoreConfigStore((state) => state.config.checkout)
  const complete = useCheckoutStore((state) => state.complete)
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const navigate = useNavigate()
  usePageMeta('Checkout de demostración')
  if (!items.length) return <section className="checkout-page container"><EmptyState title="No hay productos para confirmar" description="Añade productos al carrito antes de iniciar el checkout de demostración." /><Link className="button button--primary empty-action" to="/catalogo">Ir al catálogo</Link></section>
  if (config.mode === 'disabled' || !config.paymentMethods.some((method) => method.enabled)) return <section className="checkout-page container"><EmptyState title="Checkout pendiente de configuración" description="MG todavía no tiene métodos comerciales habilitados. No se procesará ninguna orden." /></section>
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const input = { name: String(data.get('name') ?? ''), phone: String(data.get('phone') ?? ''), email: String(data.get('email') ?? ''), address: String(data.get('address') ?? ''), city: String(data.get('city') ?? ''), reference: String(data.get('reference') ?? ''), paymentMethodId: String(data.get('payment') ?? '') }
    const nextErrors = validateCheckout(input)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    const draft = completeOrderDraft(createOrderDraft({ ...input, items }))
    complete(draft)
    clearCart()
    navigate('/exito', { replace: true })
  }
  const enabled = (field: typeof config.enabledFields[number]) => config.enabledFields.includes(field)
  return <section className="checkout-page container"><Link className="checkout-back" to="/carrito"><ArrowLeft size={16} /> Volver al carrito</Link><div className="checkout-heading"><span className="eyebrow">SAMPLE CHECKOUT MODE</span><h1>Completa la demostración.</h1><p>Los datos permanecen solo en memoria durante esta sesión. No se envían ni almacenan.</p></div><form className="checkout-layout" onSubmit={submit} noValidate><div className="checkout-form"><section><div className="checkout-section-title"><span>01</span><div><h2>Contacto</h2><p>Datos para validar el formulario local.</p></div></div><div className="form-grid">{enabled('name') && <Input id="name" name="name" label="Nombre completo" autoComplete="name" error={errors.name} required />}{enabled('phone') && <Input id="phone" name="phone" label="Teléfono" type="tel" autoComplete="tel" error={errors.phone} required />}{enabled('email') && <Input id="email" name="email" label="Correo electrónico (opcional)" type="email" autoComplete="email" error={errors.email} />}</div></section><section><div className="checkout-section-title"><span>02</span><div><h2>Entrega</h2><p>La logística real todavía no está configurada.</p></div></div><div className="form-grid">{enabled('address') && <Input id="address" name="address" label="Dirección" autoComplete="street-address" error={errors.address} required />}{enabled('city') && <Input id="city" name="city" label="Ciudad" autoComplete="address-level2" error={errors.city} required />}{enabled('reference') && <Textarea id="reference" name="reference" label="Referencia o notas (opcional)" rows={3} />}</div></section><section><div className="checkout-section-title"><span>03</span><div><h2>Confirmación</h2><p>No existe pago real en este hito.</p></div></div><fieldset className="payment-options"><legend className="sr-only">Opción de confirmación</legend>{config.paymentMethods.filter((method) => method.enabled).map((method) => <label key={method.id}><input type="radio" name="payment" value={method.id} /><span><LockKeyhole />{method.label}{method.sampleOnly && <small>Solo QA local</small>}</span></label>)}{errors.payment && <small className="form-error">{errors.payment}</small>}</fieldset></section></div><aside className="checkout-summary"><span className="eyebrow">Resumen SAMPLE</span>{items.map((item) => <div className="checkout-item" key={`${item.productId}-${item.variantId ?? ''}`}><span>{item.quantity} × {item.name}{item.variantName ? ` · ${item.variantName}` : ''}</span><strong>{formatMoney(lineTotal(item.unitPrice, item.quantity))}</strong></div>)}<div className="checkout-total"><span>Subtotal</span><strong>{formatMoney(total)}</strong></div><p>No se crea un pedido real, no se reserva inventario y no se procesa un pago.</p><Button type="submit">Completar demostración <Check size={17} /></Button></aside></form></section>
}

export function SuccessPage() {
  const draft = useCheckoutStore((state) => state.completedDraft)
  usePageMeta('Confirmación de demostración')
  if (!draft?.completedAt || draft.mode !== 'sample') return <Navigate to="/carrito" replace />
  return <section className="success-page container"><div className="success-mark"><Check /></div><span className="eyebrow">DEMOSTRACIÓN COMPLETADA</span><h1>El flujo funciona.</h1><p>Se validó un OrderDraft local por {formatMoney(draft.subtotal)}. No se creó un pedido, número comercial, pago ni registro remoto.</p><div className="success-actions"><Link className="button button--primary" to="/">Volver al inicio</Link><Link className="button button--secondary" to="/catalogo">Explorar catálogo</Link></div></section>
}
