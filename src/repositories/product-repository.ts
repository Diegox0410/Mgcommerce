import type { Product, PublicProduct } from '../domain/products/product'
import type { ReadRepository, Repository } from './repository'

export type ProductRepository = Repository<Product>
export interface PublicCatalogRepository extends ReadRepository<PublicProduct> {
  getBySlug(slug: string): Promise<PublicProduct | null>
}
