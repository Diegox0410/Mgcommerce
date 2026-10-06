import type {
  ProductImage,
  PublicProduct,
  PublicProductVariant,
  PublicTaxonomyReference,
} from '../domain/products/product'
import type { PublicCatalogRepository } from './product-repository'

type ChopifyImage = {
  url?: unknown
  alt?: unknown
}

type ChopifyVariant = {
  variantId?: unknown
  name?: unknown
  color?: unknown
  price?: unknown
  pricingStatus?: unknown
  available?: unknown
  availableQuantity?: unknown
  availabilityStatus?: unknown
  images?: unknown
}

type ChopifyProduct = {
  productId?: unknown
  slug?: unknown
  name?: unknown
  description?: unknown
  commercialSummary?: unknown
  category?: unknown
  price?: unknown
  currency?: unknown
  pricingStatus?: unknown
  available?: unknown
  availableQuantity?: unknown
  availabilityStatus?: unknown
  imageUrl?: unknown
  images?: unknown
  variants?: unknown
}

const text = (value: unknown): string =>
  typeof value === 'string' ? value : ''

const nullableNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null

const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const mapImages = (
  value: unknown,
  fallbackUrl = '',
): ProductImage[] => {
  const source = Array.isArray(value) ? value : []
  const mapped = source
    .map((entry, index): ProductImage | null => {
      if (!entry || typeof entry !== 'object') return null
      const image = entry as ChopifyImage
      const url = text(image.url)
      if (!url) return null
      return {
        id: `image-${index + 1}`,
        url,
        alt: text(image.alt),
        sortOrder: index,
      }
    })
    .filter((image): image is ProductImage => image !== null)

  if (mapped.length || !fallbackUrl) return mapped

  return [{
    id: 'image-1',
    url: fallbackUrl,
    alt: '',
    sortOrder: 0,
  }]
}

const mapVariant = (
  value: ChopifyVariant,
  index: number,
): PublicProductVariant | null => {
  const id = text(value.variantId)
  if (!id) return null

  const color = text(value.color)

  return {
    id,
    name: text(value.name) || color || `Opcion ${index + 1}`,
    attributes: color ? { color } : {},
    regularPrice: nullableNumber(value.price),
    active: value.available !== false,
    available: value.available === true,
    availableQuantity: nullableNumber(value.availableQuantity),
    availabilityStatus: text(value.availabilityStatus) || undefined,
  }
}

const categoryReference = (
  category: string,
): PublicTaxonomyReference[] =>
  category
    ? [{ id: `category-${slugify(category)}`, slug: slugify(category), name: category }]
    : []

const mapProduct = (value: unknown): PublicProduct | null => {
  if (!value || typeof value !== 'object') return null

  const source = value as ChopifyProduct
  const id = text(source.productId)
  const slug = text(source.slug)
  const name = text(source.name)

  if (!id || !slug || !name) return null

  const description = text(source.description)
  const summary = text(source.commercialSummary)
  const category = text(source.category)
  const price = nullableNumber(source.price)
  const currency = text(source.currency).trim()
  const pricingStatus =
    source.pricingStatus === 'READY' && price !== null && currency
      ? 'READY'
      : 'PENDING'

  const variants = Array.isArray(source.variants)
    ? source.variants
        .map((variant, index) =>
          variant && typeof variant === 'object'
            ? mapVariant(variant as ChopifyVariant, index)
            : null,
        )
        .filter((variant): variant is PublicProductVariant => variant !== null)
    : []

  return {
    id,
    slug,
    name,
    shortDescription: summary || description,
    description,
    categoryIds: category ? [`category-${slugify(category)}`] : [],
    concernIds: [],
    collectionIds: [],
    images: mapImages(source.images, text(source.imageUrl)),
    variants,
    regularPrice: price,
    currency: currency || null,
    pricingStatus,
    featured: false,
    available: source.available === true,
    availableQuantity: nullableNumber(source.availableQuantity),
    availabilityStatus: text(source.availabilityStatus) || undefined,
    taxonomy: {
      categories: categoryReference(category),
      concerns: [],
      collections: [],
    },
    source: 'remote',
    seo: {
      title: name,
      description: summary || description,
    },
  }
}

const readCatalog = async (): Promise<PublicProduct[]> => {
  const response = await fetch('/api/catalog', {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error('No se pudo cargar el catalogo de MG.')
  }

  const value: unknown = await response.json()

  if (!Array.isArray(value)) {
    throw new Error('Chopify devolvio un catalogo invalido.')
  }

  return value
    .map(mapProduct)
    .filter((product): product is PublicProduct => product !== null)
}

export class ChopifyPublicCatalogRepository implements PublicCatalogRepository {
  async list(): Promise<PublicProduct[]> {
    return readCatalog()
  }

  async getById(id: string): Promise<PublicProduct | null> {
    return (await readCatalog()).find((product) => product.id === id) ?? null
  }

  async getBySlug(slug: string): Promise<PublicProduct | null> {
    return (await readCatalog()).find((product) => product.slug === slug) ?? null
  }
}

export const publicCatalogRepository: PublicCatalogRepository =
  new ChopifyPublicCatalogRepository()
