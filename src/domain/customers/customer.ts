import type { EntityId, ISODateString } from '../shared/types'
import type { SalesSource } from '../orders/sales-attribution'

export interface Address {
  province: string
  city: string
  line1: string
  reference?: string
}

export interface Customer {
  id: EntityId
  tenantId: EntityId
  name: string
  phone: string
  email?: string
  source?: SalesSource
  createdAt: ISODateString
  updatedAt: ISODateString
}
