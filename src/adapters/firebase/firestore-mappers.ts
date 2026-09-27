import type { Conversation } from '../../domain/conversations/conversation'
import type { HumanEscalation } from '../../domain/conversations/human-escalation'
import type { Customer } from '../../domain/customers/customer'
import type { OrderEvent } from '../../domain/orders/order-event'
import type { Order } from '../../domain/orders/order'
import type { PaymentProof } from '../../domain/orders/payment'

export type FirestoreData = Record<string, unknown>
export interface FirestoreTimestampLike { toDate(): Date }
export interface FirestoreMapper<T extends { id: string }> {
  toFirestore(entity: T): FirestoreData
  fromFirestore(id: string, data: FirestoreData): T
}

const asIsoString = (value: unknown, field: string): string => {
  const date = value instanceof Date ? value : isTimestampLike(value) ? value.toDate() : null
  if (!date || Number.isNaN(date.getTime())) throw new Error(`${field} no contiene una fecha Firestore válida.`)
  return date.toISOString()
}

const isTimestampLike = (value: unknown): value is FirestoreTimestampLike =>
  typeof value === 'object' && value !== null && 'toDate' in value && typeof value.toDate === 'function'

function removeUndefined(value: unknown): unknown {
  if (value instanceof Date || value === null || typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map(removeUndefined)
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined).map(([key, item]) => [key, removeUndefined(item)]))
}

function mapper<T extends { id: string }>(dateFields: readonly string[]): FirestoreMapper<T> {
  return {
    toFirestore(entity) {
      const data: FirestoreData = { ...entity }
      delete data.id
      for (const field of dateFields) {
        if (typeof data[field] === 'string') {
          const date = new Date(data[field] as string)
          if (Number.isNaN(date.getTime())) throw new Error(`${field} no contiene una fecha ISO válida.`)
          data[field] = date
        }
      }
      return removeUndefined(data) as FirestoreData
    },
    fromFirestore(id, data) {
      const domain: FirestoreData = { ...data, id }
      for (const field of dateFields) {
        if (domain[field] !== undefined) domain[field] = asIsoString(domain[field], field)
      }
      return domain as unknown as T
    },
  }
}

export const customerFirestoreMapper = mapper<Customer>(['createdAt', 'updatedAt'])
export const orderFirestoreMapper = mapper<Order>(['createdAt', 'updatedAt'])
export const paymentProofFirestoreMapper = mapper<PaymentProof>(['submittedAt'])
export const conversationFirestoreMapper = mapper<Conversation>(['createdAt', 'updatedAt'])
export const humanEscalationFirestoreMapper = mapper<HumanEscalation>(['createdAt', 'resolvedAt'])
export const orderEventFirestoreMapper = mapper<OrderEvent>(['timestamp'])
