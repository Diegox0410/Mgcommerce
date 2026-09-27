import type { EntityId, ISODateString } from '../shared/types'

export interface TaxonomyEntity {
  id: EntityId
  slug: string
  name: string
  description?: string
  imageUrl?: string
  status: 'active' | 'draft' | 'archived'
  sortOrder: number
  createdAt: ISODateString
  updatedAt: ISODateString
}

export type Category = TaxonomyEntity
export type Brand = TaxonomyEntity
export type Concern = TaxonomyEntity
export type Collection = TaxonomyEntity
