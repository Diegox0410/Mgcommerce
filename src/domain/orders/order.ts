import type { EntityId, ISODateString } from '../shared/types'
import type { CommercialAgreementSnapshot, SalesAttribution } from './sales-attribution'

export type OrderStatus = 'new' | 'pending_payment' | 'payment_review' | 'paid' | 'preparing' | 'ready' | 'dispatched' | 'delivered' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'proof_received' | 'under_review' | 'paid' | 'rejected' | 'refunded'
export type FulfillmentStatus = 'unfulfilled' | 'preparing' | 'ready' | 'dispatched' | 'delivered' | 'cancelled'

export interface OrderItemSnapshot {
  productId: EntityId
  variantId?: EntityId
  productName: string
  variantLabel?: string
  unitPrice: number
  quantity: number
  lineTotal: number
  categoryId?: EntityId
  brandId?: EntityId
}

export interface Order {
  id: EntityId
  tenantId: EntityId
  customerId: EntityId
  items: OrderItemSnapshot[]
  currency: 'USD'
  subtotal: number
  discountTotal: number
  shippingTotal: number
  taxTotal: number
  grandTotal: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  fulfillmentStatus: FulfillmentStatus
  source: SalesAttribution['source']
  attribution: SalesAttribution
  commercialAgreement: CommercialAgreementSnapshot
  createdAt: ISODateString
  updatedAt: ISODateString
}

export function createOrderItemSnapshot(item: Omit<OrderItemSnapshot, 'lineTotal'>): OrderItemSnapshot {
  if (!Number.isInteger(item.unitPrice) || item.unitPrice < 0 || !Number.isInteger(item.quantity) || item.quantity < 1) {
    throw new Error('El ítem del pedido debe usar centavos y una cantidad entera positiva.')
  }
  return { ...item, lineTotal: item.unitPrice * item.quantity }
}

export interface CreateOrderInput {
  id: EntityId
  tenantId: EntityId
  customerId: EntityId
  items: OrderItemSnapshot[]
  discountTotal?: number
  shippingTotal?: number
  taxTotal?: number
  attribution: SalesAttribution
  commercialAgreement: CommercialAgreementSnapshot
  now?: Date
}

export function createOrder(input: CreateOrderInput): Order {
  if (!input.id || !input.tenantId || !input.customerId || input.items.length === 0) throw new Error('El pedido requiere identidad, tenant, cliente e ítems.')
  if (input.items.some((item) => !Number.isInteger(item.unitPrice) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.lineTotal !== item.unitPrice * item.quantity)) {
    throw new Error('El pedido contiene un snapshot de ítem inconsistente.')
  }
  const subtotal = input.items.reduce((total, item) => total + item.lineTotal, 0)
  const discountTotal = input.discountTotal ?? 0
  const shippingTotal = input.shippingTotal ?? 0
  const taxTotal = input.taxTotal ?? 0
  if (![subtotal, discountTotal, shippingTotal, taxTotal].every((value) => Number.isInteger(value) && value >= 0) || discountTotal > subtotal) {
    throw new Error('Los totales del pedido deben ser centavos enteros válidos.')
  }
  const timestamp = (input.now ?? new Date()).toISOString()
  return {
    id: input.id, tenantId: input.tenantId, customerId: input.customerId,
    items: input.items.map((item) => ({ ...item })), currency: 'USD', subtotal, discountTotal,
    shippingTotal, taxTotal, grandTotal: subtotal - discountTotal + shippingTotal + taxTotal,
    status: 'new', paymentStatus: 'unpaid', fulfillmentStatus: 'unfulfilled',
    source: input.attribution.source, attribution: { ...input.attribution }, commercialAgreement: { ...input.commercialAgreement },
    createdAt: timestamp, updatedAt: timestamp,
  }
}
