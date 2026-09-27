import type { EntityId, ISODateString } from '../shared/types'

export type EscalationPriority = 'low' | 'normal' | 'high' | 'urgent'
export type EscalationStatus = 'open' | 'resolved'
export type EscalationReason = 'customer_request' | 'complaint' | 'payment_issue' | 'pricing_exception' | 'stock_conflict' | 'return_request' | 'unknown_product' | 'system_error' | 'other'

export interface HumanEscalation {
  id: EntityId
  tenantId: EntityId
  conversationId: EntityId
  reason: EscalationReason
  priority: EscalationPriority
  status: EscalationStatus
  createdAt: ISODateString
  resolvedAt?: ISODateString
}

export function requestHumanEscalation(input: Omit<HumanEscalation, 'status' | 'createdAt'> & { now?: Date }): HumanEscalation {
  if (!input.id || !input.tenantId || !input.conversationId) throw new Error('La escalación requiere identidad, tenant y conversación.')
  return { id: input.id, tenantId: input.tenantId, conversationId: input.conversationId, reason: input.reason, priority: input.priority, status: 'open', createdAt: (input.now ?? new Date()).toISOString() }
}

export function resolveHumanEscalation(escalation: HumanEscalation, now = new Date()): HumanEscalation {
  if (escalation.status !== 'open') throw new Error('La escalación ya está resuelta.')
  return { ...escalation, status: 'resolved', resolvedAt: now.toISOString() }
}
