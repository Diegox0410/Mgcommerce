import type { EntityId, ISODateString } from '../shared/types'

export interface Promotion {
  id: EntityId
  name: string
  type: 'percentage' | 'fixed'
  value: number
  scope: 'all' | 'products' | 'categories' | 'brands' | 'collections'
  targetIds: EntityId[]
  startsAt?: ISODateString
  endsAt?: ISODateString
  status: 'draft' | 'scheduled' | 'active' | 'ended'
}
