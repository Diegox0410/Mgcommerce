import type { EntityId, ISODateString } from '../shared/types'

export type OrderEventType = 'payment_proof_received' | 'payment_approved' | 'payment_rejected' | 'status_changed' | 'dispatched' | 'delivered'
export type OrderActorType = 'customer' | 'owner' | 'automation' | 'system'
export interface OrderEvent {
  id: EntityId
  orderId: EntityId
  tenantId: EntityId
  type: OrderEventType
  timestamp: ISODateString
  actor: { type: OrderActorType; id?: EntityId }
}
