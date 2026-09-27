import { sampleInventory, sampleProducts, sampleTaxonomy } from '../data/sample/sample-catalog'
import { toPublicProduct } from '../domain/products/public-projection'
import type { PublicProduct, PublicTaxonomyReference } from '../domain/products/product'
import type { PublicCatalogRepository } from './product-repository'

const ref = ({ id, slug, name }: { id: string; slug: string; name: string }): PublicTaxonomyReference => ({ id, slug, name })

const project = (productId: string): PublicProduct | null => {
  const product = sampleProducts.find((item) => item.id === productId)
  if (!product) return null
  const findAll = (ids: string[], source: typeof sampleTaxonomy.categories) => source.filter((item) => ids.includes(item.id)).map(ref)
  const projected = toPublicProduct(product, sampleInventory.find((item) => item.productId === product.id), {
    brand: sampleTaxonomy.brands.find((item) => item.id === product.brandId),
    categories: findAll(product.categoryIds, sampleTaxonomy.categories),
    concerns: findAll(product.concernIds, sampleTaxonomy.concerns),
    collections: findAll(product.collectionIds, sampleTaxonomy.collections),
  })
  return { ...projected, source: 'sample' }
}

export class SamplePublicCatalogRepository implements PublicCatalogRepository {
  async list(): Promise<PublicProduct[]> {
    return sampleProducts.map((product) => project(product.id)).filter((product): product is PublicProduct => product !== null)
  }

  async getById(id: string): Promise<PublicProduct | null> { return project(id) }

  async getBySlug(slug: string): Promise<PublicProduct | null> {
    const product = sampleProducts.find((item) => item.slug === slug)
    return product ? project(product.id) : null
  }
}

export const publicCatalogRepository: PublicCatalogRepository = new SamplePublicCatalogRepository()
