import type { Address } from '../customers/customer'
import type { EntityId, ISODateString } from '../shared/types'

export type OrderStatus =
  | 'new'
  | 'pending_payment'
  | 'payment_review'
  | 'paid'
  | 'preparing'
  | 'ready'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface OrderCustomerSnapshot {
  customerId?: EntityId
  firstName: string
  lastName: string
  email: string
  phone: string
  shippingAddress: Address
}

export interface OrderItemSnapshot {
  productId: EntityId
  variantId?: EntityId
  sku?: string
  name: string
  variantName?: string
  imageUrl?: string
  categoryIds: EntityId[]
  brandId?: EntityId
  unitPrice: number
  unitCost: number
  quantity: number
  discount: number
  lineTotal: number
}

export interface OrderSnapshot {
  customer: OrderCustomerSnapshot
  items: OrderItemSnapshot[]
  currency: 'USD'
  subtotal: number
  discount: number
  shipping: number
  total: number
}

export interface Order {
  id: EntityId
  number: string
  status: OrderStatus
  paymentStatus: 'pending' | 'review' | 'paid' | 'rejected' | 'refunded'
  snapshot: OrderSnapshot
  inventoryCommitted: boolean
  createdAt: ISODateString
  updatedAt: ISODateString
}

export function createOrderItemSnapshot(
  item: Omit<OrderItemSnapshot, 'lineTotal'>,
): OrderItemSnapshot {
  const lineTotal = item.unitPrice * item.quantity - item.discount
  if (item.quantity < 1 || !Number.isInteger(item.quantity) || lineTotal < 0) {
    throw new Error('El ítem del pedido no es válido.')
  }
  return { ...item, lineTotal }
}
