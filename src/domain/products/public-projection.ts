import type { Inventory } from '../inventory/inventory'
import type { Product, PublicProduct, PublicTaxonomyReference } from './product'

export interface PublicTaxonomyProjection {
  brand?: PublicTaxonomyReference
  categories?: PublicTaxonomyReference[]
  concerns?: PublicTaxonomyReference[]
  collections?: PublicTaxonomyReference[]
}

export function toPublicProduct(
  product: Product,
  inventory?: Inventory,
  taxonomy: PublicTaxonomyProjection = {},
): PublicProduct {
  const { cost: _privateCost, ...safe } = product
  void _privateCost

  const available =
    product.status === 'active' &&
    (inventory?.available ?? 0) > 0

  return {
    ...safe,
    variants: product.variants.map(({ sku: _sku, ...variant }) => {
      void _sku

      return {
        ...variant,
        available,
        availableQuantity: inventory?.available ?? null,
      }
    }),
    currency: null,
    pricingStatus: 'READY',
    available,
    availableQuantity: inventory?.available ?? null,
    taxonomy: {
      brand: taxonomy.brand,
      categories: taxonomy.categories ?? [],
      concerns: taxonomy.concerns ?? [],
      collections: taxonomy.collections ?? [],
    },
  }
}
