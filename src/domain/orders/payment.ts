import type { EntityId, ISODateString } from '../shared/types'
import type { Order } from './order'
import { transitionOrder } from './order-lifecycle'

export type PaymentProofStatus = 'received' | 'under_review' | 'approved' | 'rejected'
export interface PaymentProof {
  id: EntityId
  tenantId: EntityId
  orderId: EntityId
  submittedAt: ISODateString
  status: PaymentProofStatus
  assetReference?: string
  externalReference?: string
}
export interface PaymentActionResult { order: Order; proof: PaymentProof }

export function submitPaymentProof(order: Order, input: Omit<PaymentProof, 'tenantId' | 'orderId' | 'submittedAt' | 'status'> & { now?: Date }): PaymentActionResult {
  if (order.status !== 'pending_payment') throw new Error('El pedido no está esperando comprobante.')
  if (!input.id) throw new Error('El comprobante requiere identidad.')
  const now = input.now ?? new Date()
  const proof: PaymentProof = { id: input.id, tenantId: order.tenantId, orderId: order.id, submittedAt: now.toISOString(), status: 'received', assetReference: input.assetReference, externalReference: input.externalReference }
  return { order: { ...transitionOrder(order, 'payment_review', now), paymentStatus: 'proof_received' }, proof }
}

export function markPaymentProofUnderReview(order: Order, proof: PaymentProof, now = new Date()): PaymentActionResult {
  assertProofOwnership(order, proof)
  if (proof.status !== 'received') throw new Error('Solo un comprobante recibido puede pasar a revisión.')
  return { order: { ...order, paymentStatus: 'under_review', updatedAt: now.toISOString() }, proof: { ...proof, status: 'under_review' } }
}

export function approvePayment(order: Order, proof: PaymentProof, now = new Date()): PaymentActionResult {
  assertProofOwnership(order, proof)
  if (order.status !== 'payment_review' || !['received', 'under_review'].includes(proof.status)) throw new Error('El pago no puede aprobarse en su estado actual.')
  return { order: transitionOrder(order, 'paid', now), proof: { ...proof, status: 'approved' } }
}

export function rejectPaymentProof(order: Order, proof: PaymentProof, now = new Date()): PaymentActionResult {
  assertProofOwnership(order, proof)
  if (order.status !== 'payment_review' || !['received', 'under_review'].includes(proof.status)) throw new Error('El comprobante no puede rechazarse en su estado actual.')
  return { order: { ...transitionOrder(order, 'pending_payment', now), paymentStatus: 'rejected' }, proof: { ...proof, status: 'rejected' } }
}

function assertProofOwnership(order: Order, proof: PaymentProof): void {
  if (proof.orderId !== order.id || proof.tenantId !== order.tenantId) throw new Error('El comprobante no pertenece al pedido y tenant indicados.')
}
