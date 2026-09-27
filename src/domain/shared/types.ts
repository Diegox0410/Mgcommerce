export type EntityId = string
export type ISODateString = string

export interface SeoMetadata {
  title?: string
  description?: string
  canonicalPath?: string
}

export interface Money {
  amount: number
  currency: 'USD'
}
