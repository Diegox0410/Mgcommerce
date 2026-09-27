import type { Order, OrderStatus } from './order'

const transitions: Readonly<Record<OrderStatus, readonly OrderStatus[]>> = {
  new: ['pending_payment', 'cancelled'],
  pending_payment: ['payment_review', 'cancelled'],
  payment_review: ['paid', 'pending_payment', 'cancelled'],
  paid: ['preparing'],
  preparing: ['ready'],
  ready: ['dispatched'],
  dispatched: ['delivered'],
  delivered: [],
  cancelled: [],
}

export const allowedOrderTransitions = (status: OrderStatus): readonly OrderStatus[] => transitions[status]
export const canTransitionOrder = (from: OrderStatus, to: OrderStatus): boolean => transitions[from].includes(to)

export function transitionOrder(order: Order, next: OrderStatus, now = new Date()): Order {
  if (!canTransitionOrder(order.status, next)) throw new Error(`Transición de pedido inválida: ${order.status} → ${next}.`)
  const fulfillmentStatus = next === 'preparing' ? 'preparing'
    : next === 'ready' ? 'ready'
      : next === 'dispatched' ? 'dispatched'
        : next === 'delivered' ? 'delivered'
          : next === 'cancelled' ? 'cancelled'
            : order.fulfillmentStatus
  return { ...order, status: next, paymentStatus: next === 'paid' ? 'paid' : order.paymentStatus, fulfillmentStatus, updatedAt: now.toISOString() }
}
