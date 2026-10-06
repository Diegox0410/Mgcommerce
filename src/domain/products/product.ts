import type { EntityId, ISODateString, SeoMetadata } from '../shared/types'

export interface ProductImage {
  id: EntityId
  url: string
  alt: string
  sortOrder: number
  placeholderTone?: 'sage' | 'sand' | 'clay' | 'mist' | 'ink' | 'lime'
}

export interface ProductVariant {
  id: EntityId
  sku: string
  name: string
  attributes: Record<string, string>
  regularPrice: number
  promotionalPrice?: number
  active: boolean
  imageId?: EntityId
}

export interface ProductInformation {
  benefits?: string[]
  usage?: string
  ingredients?: string
  additional?: string
}

export interface PublicTaxonomyReference {
  id: EntityId
  slug: string
  name: string
}

export interface Product {
  id: EntityId
  slug: string
  name: string
  shortDescription: string
  description: string
  brandId?: EntityId
  categoryIds: EntityId[]
  concernIds: EntityId[]
  collectionIds: EntityId[]
  images: ProductImage[]
  variants: ProductVariant[]
  regularPrice: number
  promotionalPrice?: number
  cost: number
  status: 'draft' | 'active' | 'archived'
  featured: boolean
  isNew?: boolean
  information?: ProductInformation
  seo: SeoMetadata
  createdAt: ISODateString
  updatedAt: ISODateString
}

export interface PublicProductVariant {
  id: EntityId
  name: string
  attributes: Record<string, string>
  regularPrice: number | null
  promotionalPrice?: number | null
  active: boolean
  imageId?: EntityId
  available: boolean
  availableQuantity: number | null
  availabilityStatus?: string
}

export interface PublicProduct {
  id: EntityId
  slug: string
  name: string
  shortDescription: string
  description: string
  brandId?: EntityId
  categoryIds: EntityId[]
  concernIds: EntityId[]
  collectionIds: EntityId[]
  images: ProductImage[]
  variants: PublicProductVariant[]
  regularPrice: number | null
  promotionalPrice?: number | null
  currency: string | null
  pricingStatus: 'READY' | 'PENDING'
  featured: boolean
  isNew?: boolean
  available: boolean
  availableQuantity: number | null
  availabilityStatus?: string
  information?: ProductInformation
  taxonomy: {
    brand?: PublicTaxonomyReference
    categories: PublicTaxonomyReference[]
    concerns: PublicTaxonomyReference[]
    collections: PublicTaxonomyReference[]
  }
  source?: 'sample' | 'remote'
  seo: SeoMetadata
  updatedAt?: ISODateString
}
