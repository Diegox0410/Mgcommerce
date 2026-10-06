import { beforeAll, describe, expect, it } from 'vitest'
import { applyCatalog, defaultCatalogFilters, filterProducts, normalizeSearch, relatedProducts, searchProducts, sortProducts } from '../src/domain/catalog/catalog-engine'
import { activeFilterCount, parseCatalogParams, toCatalogParams } from '../src/domain/catalog/catalog-query'
import { applyInventoryDelta, type Inventory } from '../src/domain/inventory/inventory'
import { completeOrderDraft, createOrderDraft, validateCheckout } from '../src/domain/orders/order-draft'
import { createOrder, createOrderItemSnapshot } from '../src/domain/orders/order'
import { discountAmount, discountPercent, effectivePrice, productPrice, formatMoney, lineTotal, subtotal } from '../src/domain/products/pricing'
import { toPublicProduct } from '../src/domain/products/public-projection'
import type { Product, PublicProduct } from '../src/domain/products/product'
import { defaultStoreConfig } from '../src/domain/store/store-config'
import { SamplePublicCatalogRepository } from '../src/repositories/sample-public-catalog-repository'
import { migrateCartState, sameCartLine, selectCartCount, selectCartCurrency, selectCartSubtotal, useCartStore } from '../src/stores/cart-store'

const privateProduct: Product = {
  id: 'p-1', slug: 'sample', name: 'SAMPLE_DATA', shortDescription: '', description: '',
  categoryIds: [], concernIds: [], collectionIds: [], images: [], variants: [{ id: 'v-1', sku: 'PRIVATE-SKU', name: 'Única', attributes: {}, regularPrice: 20, active: true }],
  regularPrice: 20, promotionalPrice: 15, cost: 9, status: 'active', featured: false, seo: {}, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
}
let products: PublicProduct[] = []
beforeAll(async () => { products = await new SamplePublicCatalogRepository().list() })

describe('pricing and safe money', () => {
  it('uses a valid promotional price', () => expect(effectivePrice(20, 15)).toBe(15))
  it('rejects negative and inflated promotions', () => {
    expect(() => effectivePrice(20, -1)).toThrow()
    expect(() => effectivePrice(20, 21)).toThrow()
  })
  it('calculates decimal line totals through integer cents', () => expect(lineTotal(10.1, 3)).toBe(30.3))
  it('sums mixed decimal lines without floating point drift', () => expect(subtotal([{ unitPrice: 0.1, quantity: 1 }, { unitPrice: 0.2, quantity: 1 }])).toBe(0.3))
  it('calculates discount amount and percentage', () => {
    expect(discountAmount(24.9, 21.9)).toBe(3)
    expect(discountPercent(24.9, 21.9)).toBe(12)
  })
  it('formats USD for Ecuador', () => expect(formatMoney(21.9, 'USD')).toContain('21,90'))
})

describe('inventory invariants', () => {
  const inventory: Inventory = { productId: 'p-1', available: 3, reserved: 0, minimumStock: 1, updatedAt: '2026-01-01T00:00:00.000Z' }
  it('applies integer deltas without mutating input', () => {
    expect(applyInventoryDelta(inventory, -2).available).toBe(1)
    expect(inventory.available).toBe(3)
  })
  it('prevents negative stock and fractional units', () => {
    expect(() => applyInventoryDelta(inventory, -4)).toThrow('stock negativo')
    expect(() => applyInventoryDelta(inventory, .5)).toThrow('unidades enteras')
  })
})

describe('catalog engine', () => {
  it('normalizes accents and casing for search', () => expect(normalizeSearch('  Hidratación  ')).toBe('hidratacion'))
  it('searches product, brand, category and concern', () => {
    expect(searchProducts(products, 'sérum').some((item) => item.slug === 'serum-facial-sample')).toBe(true)
    expect(searchProducts(products, 'MG Ritual').length).toBeGreaterThan(1)
    expect(searchProducts(products, 'facial').length).toBeGreaterThan(0)
    expect(searchProducts(products, 'hidratacion').length).toBeGreaterThan(0)
  })
  it('combines taxonomy, availability and promotion filters', () => {
    const result = filterProducts(products, { ...defaultCatalogFilters, category: ['facial'], promotion: true, availability: true })
    expect(result.map((item) => item.slug)).toEqual(['serum-facial-sample'])
  })
  it('filters inclusive price ranges', () => {
    expect(filterProducts(products, { ...defaultCatalogFilters, minPrice: 20, maxPrice: 25 }).every((item) => (productPrice(item) ?? Number.NEGATIVE_INFINITY) >= 20)).toBe(true)
  })
  it('sorts by price without mutating input', () => {
    const before = products.map((item) => item.id)
    const sorted = sortProducts(products, 'price-asc')
    expect(sorted[0].name).toBe('Cuidado corporal')
    expect(products.map((item) => item.id)).toEqual(before)
  })
  it('sorts featured and new products first', () => {
    expect(sortProducts(products, 'featured')[0].featured).toBe(true)
    expect(sortProducts(products, 'new')[0].isNew).toBe(true)
  })
  it('applies search, filter and sort as one pure operation', () => {
    const result = applyCatalog(products, { ...defaultCatalogFilters, concern: ['hidratacion'], sort: 'price-desc' })
    expect(result.length).toBeGreaterThan(1)
    expect(productPrice(result[0]) ?? Number.NEGATIVE_INFINITY).toBeGreaterThanOrEqual(productPrice(result[1]) ?? Number.NEGATIVE_INFINITY)
  })
})

describe('catalog query params', () => {
  it('round-trips multi-value filters and sort', () => {
    const filters = { ...defaultCatalogFilters, category: ['facial', 'cuerpo'], concern: ['hidratacion'], promotion: true, sort: 'price-asc' as const }
    expect(parseCatalogParams(toCatalogParams(filters))).toEqual(filters)
  })
  it('ignores invalid prices and sort values', () => {
    const parsed = parseCatalogParams(new URLSearchParams('precio-min=-5&orden=unknown'))
    expect(parsed.minPrice).toBeUndefined()
    expect(parsed.sort).toBe('featured')
  })
  it('counts only active filters', () => expect(activeFilterCount({ ...defaultCatalogFilters, category: ['facial'], availability: true })).toBe(2))
})

describe('related products', () => {
  it('excludes the current and unavailable products', () => {
    const current = products.find((item) => item.slug === 'serum-facial-sample')!
    const related = relatedProducts(current, products)
    expect(related.some((item) => item.id === current.id || !item.available)).toBe(false)
  })
  it('prioritizes shared concerns over incidental collection matches', () => {
    const current = products.find((item) => item.slug === 'serum-facial-sample')!
    expect(relatedProducts(current, products)[0].concernIds).toContain('hidratacion')
  })
})

describe('cart identity and totals', () => {
  const first = { productId: 'p', variantId: 'a', slug: 'p', name: 'P', unitPrice: 10.1, currency: 'USD', quantity: 1 }
  const second = { ...first, variantId: 'b', quantity: 2 }
  it('uses product and variant as line identity', () => {
    expect(sameCartLine(first, { productId: 'p', variantId: 'a' })).toBe(true)
    expect(sameCartLine(first, second)).toBe(false)
  })
  it('keeps two variants as separate cart lines', () => {
    useCartStore.setState({ items: [] })
    useCartStore.getState().add(first)
    useCartStore.getState().add(second)
    expect(useCartStore.getState().items).toHaveLength(2)
  })
  it('merges the same variant and exposes count/subtotal selectors', () => {
    useCartStore.setState({ items: [] })
    useCartStore.getState().add(first)
    useCartStore.getState().add({ ...first, quantity: 2 })
    expect(selectCartCount(useCartStore.getState())).toBe(3)
    expect(selectCartSubtotal(useCartStore.getState())).toBe(30.3)
  })
  it('updates, removes and clears lines safely', () => {
    useCartStore.getState().setQuantity('p', 'a', 2)
    expect(useCartStore.getState().items[0].quantity).toBe(2)
    useCartStore.getState().remove('p', 'a')
    expect(useCartStore.getState().items).toHaveLength(0)
    useCartStore.getState().clear()
    expect(useCartStore.getState().items).toEqual([])
  })
  it('drops malformed persisted lines without reviving unsafe values', () => {
    const migrated = migrateCartState({ items: [first, { productId: 'bad', name: 'Bad', unitPrice: -1, quantity: 0 }, null] })
    expect(migrated.items).toEqual([first])
  })
})

describe('OrderDraft', () => {
  const valid = { name: 'Persona Demo', phone: '099 000 0000', email: 'demo@example.test', address: 'Dirección SAMPLE 123', city: 'Quito', reference: '', paymentMethodId: 'sample' }
  const items = [{ productId: 'p', slug: 'p', name: 'Producto', unitPrice: 10.1, currency: 'USD', quantity: 3 }]
  it('returns accessible field errors for invalid checkout data', () => {
    const errors = validateCheckout({ ...valid, name: '', phone: '1', email: 'bad', address: '', city: '', paymentMethodId: '' })
    expect(Object.keys(errors).sort()).toEqual(['address', 'city', 'email', 'name', 'payment', 'phone'])
  })
  it('creates a sample draft without mutating cart lines', () => {
    const draft = createOrderDraft({ ...valid, items, now: new Date('2026-01-01T00:00:00.000Z') })
    expect(draft.mode).toBe('sample')
    expect(draft.subtotal).toBe(30.3)
    expect(draft.items).not.toBe(items)
  })
  it('rejects an empty cart', () => expect(() => createOrderDraft({ ...valid, items: [] })).toThrow('sin productos'))
  it('marks completion separately from draft creation', () => {
    const draft = createOrderDraft({ ...valid, items })
    expect(draft.completedAt).toBeUndefined()
    expect(completeOrderDraft(draft, new Date('2026-02-01T00:00:00.000Z')).completedAt).toBe('2026-02-01T00:00:00.000Z')
  })
})

describe('order snapshots and public projection', () => {
  it('retains historical commercial values', () => {
    const snapshot = createOrderItemSnapshot({ productId: 'p-1', productName: 'Nombre histórico', categoryId: 'c-1', unitPrice: 2_000, quantity: 2 })
    expect(snapshot.lineTotal).toBe(4_000)
    expect(snapshot.productName).toBe('Nombre histórico')
    expect(snapshot).not.toHaveProperty('unitCost')
  })
  it('excludes costs, exact inventory and private SKUs', () => {
    const projection = toPublicProduct(privateProduct, { productId: 'p-1', available: 7, reserved: 1, minimumStock: 2, updatedAt: privateProduct.updatedAt })
    expect(projection.available).toBe(true)
    expect(projection).not.toHaveProperty('cost')
    expect(projection).not.toHaveProperty('inventory')
    expect(projection.variants[0]).not.toHaveProperty('sku')
    expect(JSON.stringify(projection)).not.toContain('PRIVATE-SKU')
  })
  it('sample repository exposes exactly six safe public products asynchronously', async () => {
    const repository = new SamplePublicCatalogRepository()
    const list = await repository.list()
    expect(list).toHaveLength(6)
    expect((await repository.getBySlug('serum-facial-sample'))?.source).toBe('sample')
    expect(await repository.getBySlug('missing')).toBeNull()
  })
})

describe('StoreConfig defaults', () => {
  it('provides safe identity without invented contact data', () => {
    expect(defaultStoreConfig.identity.brandName).toBe('MG Salud y Belleza')
    expect(defaultStoreConfig.contact.email).toBe('')
    expect(defaultStoreConfig.whatsapp.enabled).toBe(false)
    expect(defaultStoreConfig.announcement.enabled).toBe(false)
  })
  it('centralizes navigation, home visibility and checkout sample mode', () => {
    expect(defaultStoreConfig.header.navigation.length).toBeGreaterThan(0)
    expect(defaultStoreConfig.home.sections.every((section) => typeof section.enabled === 'boolean')).toBe(true)
    expect(defaultStoreConfig.checkout.mode).toBe('sample')
    expect(defaultStoreConfig.checkout.paymentMethods.every((method) => method.sampleOnly)).toBe(true)
  })
})


describe('explicit currency invariants', () => {
  const usdLine = {
    productId: 'currency-product',
    slug: 'currency-product',
    name: 'Currency Product',
    unitPrice: 10,
    currency: 'USD',
    quantity: 1,
  }

  it('drops legacy persisted cart lines without currency', () => {
    const legacy = {
      productId: 'legacy',
      slug: 'legacy',
      name: 'Legacy',
      unitPrice: 10,
      quantity: 1,
    }

    expect(migrateCartState({ items: [usdLine, legacy] }).items).toEqual([usdLine])
  })

  it('rejects a second cart currency', () => {
    useCartStore.setState({ items: [] })

    useCartStore.getState().add(usdLine)
    useCartStore.getState().add({
      ...usdLine,
      productId: 'eur-product',
      slug: 'eur-product',
      currency: 'EUR',
    })

    expect(useCartStore.getState().items).toHaveLength(1)
    expect(selectCartCurrency(useCartStore.getState())).toBe('USD')
  })

  it('keeps one explicit currency in an order draft', () => {
    const draft = createOrderDraft({
      name: 'Persona Demo',
      phone: '099 000 0000',
      address: 'Direccion valida 123',
      city: 'Guayaquil',
      paymentMethodId: 'sample',
      items: [usdLine],
      now: new Date('2026-01-01T00:00:00.000Z'),
    })

    expect(draft.currency).toBe('USD')
  })

  it('rejects mixed currencies in an order draft', () => {
    expect(() => createOrderDraft({
      name: 'Persona Demo',
      phone: '099 000 0000',
      address: 'Direccion valida 123',
      city: 'Guayaquil',
      paymentMethodId: 'sample',
      items: [usdLine, { ...usdLine, productId: 'eur-product', currency: 'EUR' }],
    })).toThrow('una sola moneda')
  })

  it('requires and preserves explicit currency in domain orders', () => {
    const item = createOrderItemSnapshot({
      productId: 'p-currency',
      productName: 'Currency Product',
      unitPrice: 1000,
      quantity: 1,
    })

    const base = {
      id: 'order-currency',
      tenantId: 'tenant-mg',
      customerId: 'customer-currency',
      items: [item],
      discountTotal: 0,
      shippingTotal: 0,
      taxTotal: 0,
      attribution: {
        source: 'web' as const,
        managed: false,
        managedBy: 'human' as const,
      },
      commercialAgreement: {
        managementFeeBasisPoints: 0,
      },
      now: new Date('2026-01-01T00:00:00.000Z'),
    }

    expect(createOrder({ ...base, currency: 'USD' }).currency).toBe('USD')
    expect(() => createOrder({ ...base, currency: '   ' })).toThrow('moneda')
  })
})
