import type { EntityId, ISODateString } from '../shared/types'

export interface Address {
  province: string
  city: string
  line1: string
  reference?: string
}

export interface Customer {
  id: EntityId
  firstName: string
  lastName: string
  email: string
  phone: string
  addresses: Address[]
  tags: string[]
  notes: string[]
  createdAt: ISODateString
  updatedAt: ISODateString
}
