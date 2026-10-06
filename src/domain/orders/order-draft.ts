import type { CartItem } from '../cart/cart'
import { subtotal } from '../products/pricing'

export interface CheckoutContact {
  name: string
  phone: string
  email?: string
}

export interface CheckoutDelivery {
  address: string
  city: string
  reference?: string
}

export interface OrderDraft {
  id: string
  mode: 'sample'
  contact: CheckoutContact
  delivery: CheckoutDelivery
  paymentMethodId: string
  items: CartItem[]
  currency: string
  subtotal: number
  createdAt: string
  completedAt?: string
}

export type CheckoutErrors = Partial<Record<'name' | 'phone' | 'email' | 'address' | 'city' | 'payment', string>>

export function validateCheckout(input: CheckoutContact & CheckoutDelivery & { paymentMethodId: string }): CheckoutErrors {
  const errors: CheckoutErrors = {}
  if (input.name.trim().length < 2) errors.name = 'Ingresa un nombre válido.'
  if (!/^[+\d][\d\s()-]{6,}$/.test(input.phone.trim())) errors.phone = 'Ingresa un teléfono válido.'
  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) errors.email = 'Revisa el correo electrónico.'
  if (input.address.trim().length < 5) errors.address = 'Ingresa una dirección válida.'
  if (input.city.trim().length < 2) errors.city = 'Ingresa una ciudad válida.'
  if (!input.paymentMethodId) errors.payment = 'Selecciona una opción de confirmación.'
  return errors
}

export function createOrderDraft(input: CheckoutContact & CheckoutDelivery & { paymentMethodId: string; items: CartItem[]; now?: Date }): OrderDraft {
  if (input.items.length === 0) throw new Error('No se puede crear un borrador sin productos.')
  const errors = validateCheckout(input)
  if (Object.keys(errors).length) throw new Error('El checkout contiene datos inválidos.')
  const currencies = new Set(input.items.map((item) => item.currency.trim()).filter(Boolean))
  if (currencies.size !== 1) throw new Error('El carrito debe tener una sola moneda válida.')
  const currency = [...currencies][0]
  const now = input.now ?? new Date()
  return {
    id: crypto.randomUUID(), mode: 'sample',
    contact: { name: input.name.trim(), phone: input.phone.trim(), email: input.email?.trim() || undefined },
    delivery: { address: input.address.trim(), city: input.city.trim(), reference: input.reference?.trim() || undefined },
    paymentMethodId: input.paymentMethodId, items: input.items.map((item) => ({ ...item })), currency, subtotal: subtotal(input.items), createdAt: now.toISOString(),
  }
}

export const completeOrderDraft = (draft: OrderDraft, now = new Date()): OrderDraft => ({ ...draft, completedAt: now.toISOString() })
