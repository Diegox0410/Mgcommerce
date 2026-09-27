import type { EntityId } from '../shared/types'

export interface CartItem {
  productId: EntityId
  variantId?: EntityId
  slug: string
  name: string
  variantName?: string
  imageUrl?: string
  imageTone?: 'sage' | 'sand' | 'clay' | 'mist' | 'ink' | 'lime'
  unitPrice: number
  quantity: number
}

export interface Cart {
  items: CartItem[]
  currency: 'USD'
}
