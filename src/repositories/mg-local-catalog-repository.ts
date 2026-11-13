import catalog from '../data/local/mg-catalog.json'
import type {
  PublicProduct,
  PublicTaxonomyReference,
} from '../domain/products/product'
import type { PublicCatalogRepository } from './product-repository'

const slugify = (value: string): string =>
  value.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const reference = (name: string): PublicTaxonomyReference => ({
  id: slugify(name),
  slug: slugify(name),
  name,
})

export const mgLocalProducts: PublicProduct[] = catalog.map(
  (item, index) => ({
    id: item.code,
    slug: `${item.code.toLowerCase()}-${slugify(item.name)}`,
    name: item.name,
    shortDescription: item.presentation || '',
    description: '',
    brandId: item.brand ? slugify(item.brand) : undefined,
    categoryIds: [slugify(item.category)],
    concernIds: [],
    collectionIds: [],
    images: [{
      id: `${item.code}-portada`,
      url: item.cover,
      alt: `${item.name} - ${item.code}`,
      sortOrder: 0,
    }],
    variants: [],
    regularPrice: null,
    currency: null,
    pricingStatus: 'PENDING',
    featured: index < 4,
    available: false,
    availableQuantity: null,
    availabilityStatus: 'UNKNOWN',
    taxonomy: {
      brand: item.brand ? reference(item.brand) : undefined,
      categories: [reference(item.category)],
      concerns: [],
      collections: [],
    },
    seo: {
      title: `${item.name} - ${item.code}`,
      description: [
        item.name,
        item.brand,
        item.presentation,
      ].filter(Boolean).join(' - '),
    },
  }),
)

export class MgLocalCatalogRepository
  implements PublicCatalogRepository {
  async list(): Promise<PublicProduct[]> {
    return mgLocalProducts
  }

  async getById(id: string): Promise<PublicProduct | null> {
    return mgLocalProducts.find(p => p.id === id) ?? null
  }

  async getBySlug(slug: string): Promise<PublicProduct | null> {
    return mgLocalProducts.find(p => p.slug === slug) ?? null
  }
}
