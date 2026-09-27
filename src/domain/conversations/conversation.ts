import type { EntityId, ISODateString } from '../shared/types'

export type ConversationChannel = 'whatsapp' | 'instagram' | 'facebook' | 'web' | 'other'
export type ConversationStatus = 'open' | 'automated' | 'human_required' | 'closed'
export type ConversationAssignedMode = 'automation' | 'human'

export interface Conversation {
  id: EntityId
  tenantId: EntityId
  customerId: EntityId
  channel: ConversationChannel
  status: ConversationStatus
  assignedMode: ConversationAssignedMode
  automationAgent?: string
  createdAt: ISODateString
  updatedAt: ISODateString
}
