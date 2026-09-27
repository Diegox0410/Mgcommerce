import { defaultCatalogFilters, type CatalogFilters, type CatalogSort } from './catalog-engine'

const sorts: CatalogSort[] = ['featured', 'new', 'price-asc', 'price-desc', 'name']
const finite = (value: string | null): number | undefined => {
  if (!value) return undefined
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : undefined
}

export function parseCatalogParams(params: URLSearchParams): CatalogFilters {
  const sort = params.get('orden') as CatalogSort | null
  return {
    ...defaultCatalogFilters,
    query: params.get('q')?.trim() ?? '',
    category: params.getAll('categoria').filter(Boolean),
    brand: params.getAll('marca').filter(Boolean),
    concern: params.getAll('necesidad').filter(Boolean),
    collection: params.getAll('coleccion').filter(Boolean),
    minPrice: finite(params.get('precio-min')),
    maxPrice: finite(params.get('precio-max')),
    promotion: params.get('promocion') === '1',
    availability: params.get('disponible') === '1',
    sort: sort && sorts.includes(sort) ? sort : 'featured',
  }
}

export function toCatalogParams(filters: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.query) params.set('q', filters.query)
  filters.category.forEach((value) => params.append('categoria', value))
  filters.brand.forEach((value) => params.append('marca', value))
  filters.concern.forEach((value) => params.append('necesidad', value))
  filters.collection.forEach((value) => params.append('coleccion', value))
  if (filters.minPrice !== undefined) params.set('precio-min', String(filters.minPrice))
  if (filters.maxPrice !== undefined) params.set('precio-max', String(filters.maxPrice))
  if (filters.promotion) params.set('promocion', '1')
  if (filters.availability) params.set('disponible', '1')
  if (filters.sort !== 'featured') params.set('orden', filters.sort)
  return params
}

export const activeFilterCount = (filters: CatalogFilters): number =>
  filters.category.length + filters.brand.length + filters.concern.length + filters.collection.length
  + Number(filters.minPrice !== undefined || filters.maxPrice !== undefined) + Number(filters.promotion) + Number(filters.availability) + Number(Boolean(filters.query))
