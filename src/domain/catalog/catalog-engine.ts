import { productPrice } from '../products/pricing'
import type { PublicProduct, PublicTaxonomyReference } from '../products/product'

export type CatalogSort = 'featured' | 'new' | 'price-asc' | 'price-desc' | 'name'
export interface CatalogFilters {
  query: string
  category: string[]
  brand: string[]
  concern: string[]
  collection: string[]
  minPrice?: number
  maxPrice?: number
  promotion: boolean
  availability: boolean
  sort: CatalogSort
}

export const defaultCatalogFilters: CatalogFilters = {
  query: '', category: [], brand: [], concern: [], collection: [], promotion: false, availability: false, sort: 'featured',
}

export const normalizeSearch = (value: string): string => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim()

const taxonomyMatches = (values: PublicTaxonomyReference[], selected: string[]) =>
  selected.length === 0 || values.some((value) => selected.includes(value.slug))

export function searchProducts(products: PublicProduct[], query: string): PublicProduct[] {
  const needle = normalizeSearch(query)
  if (!needle) return products
  return products.filter((product) => normalizeSearch([
    product.name, product.shortDescription, product.taxonomy.brand?.name,
    ...product.taxonomy.categories.map((item) => item.name), ...product.taxonomy.concerns.map((item) => item.name),
  ].filter(Boolean).join(' ')).includes(needle))
}

export function filterProducts(products: PublicProduct[], filters: CatalogFilters): PublicProduct[] {
  return searchProducts(products, filters.query).filter((product) => {
    const price = productPrice(product)
    return taxonomyMatches(product.taxonomy.categories, filters.category)
      && (!product.taxonomy.brand || filters.brand.length === 0 || filters.brand.includes(product.taxonomy.brand.slug))
      && taxonomyMatches(product.taxonomy.concerns, filters.concern)
      && taxonomyMatches(product.taxonomy.collections, filters.collection)
      && (filters.minPrice === undefined || (price !== null && price >= filters.minPrice))
      && (filters.maxPrice === undefined || (price !== null && price <= filters.maxPrice))
      && (!filters.promotion || product.promotionalPrice !== undefined)
      && (!filters.availability || product.available)
  })
}

export function sortProducts(products: PublicProduct[], sort: CatalogSort): PublicProduct[] {
  const result = [...products]
  if (sort === 'price-asc') return result.sort((a, b) => (productPrice(a) ?? Number.POSITIVE_INFINITY) - (productPrice(b) ?? Number.POSITIVE_INFINITY))
  if (sort === 'price-desc') return result.sort((a, b) => (productPrice(b) ?? Number.NEGATIVE_INFINITY) - (productPrice(a) ?? Number.NEGATIVE_INFINITY))
  if (sort === 'name') return result.sort((a, b) => a.name.localeCompare(b.name, 'es'))
  if (sort === 'new') return result.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)))
  return result.sort((a, b) => Number(b.featured) - Number(a.featured))
}

export const applyCatalog = (products: PublicProduct[], filters: CatalogFilters): PublicProduct[] =>
  sortProducts(filterProducts(products, filters), filters.sort)

export function relatedProducts(product: PublicProduct, products: PublicProduct[], limit = 4): PublicProduct[] {
  const score = (candidate: PublicProduct) => {
    const overlap = (a: PublicTaxonomyReference[], b: PublicTaxonomyReference[]) => a.filter((item) => b.some((other) => other.id === item.id)).length
    return overlap(candidate.taxonomy.concerns, product.taxonomy.concerns) * 4
      + overlap(candidate.taxonomy.categories, product.taxonomy.categories) * 2
      + overlap(candidate.taxonomy.collections, product.taxonomy.collections)
  }
  return products.filter((candidate) => candidate.id !== product.id && candidate.available)
    .map((candidate) => ({ candidate, score: score(candidate) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.name.localeCompare(b.candidate.name, 'es'))
    .slice(0, limit).map((entry) => entry.candidate)
}

export function uniqueTaxonomy(products: PublicProduct[], key: 'categories' | 'concerns' | 'collections'): PublicTaxonomyReference[] {
  const values = new Map<string, PublicTaxonomyReference>()
  products.flatMap((product) => product.taxonomy[key]).forEach((item) => values.set(item.id, item))
  return [...values.values()].sort((a, b) => a.name.localeCompare(b.name, 'es'))
}
