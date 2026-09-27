import type { TaxonomyEntity } from '../../domain/catalog/catalog'
import type { Inventory } from '../../domain/inventory/inventory'
import type { Product } from '../../domain/products/product'

export const SAMPLE_DATA = true as const
const createdAt = '2026-01-01T00:00:00.000Z'

const taxonomy = (id: string, name: string, sortOrder: number): TaxonomyEntity => ({
  id, slug: id, name, status: 'active', sortOrder, createdAt, updatedAt: createdAt,
})

export const sampleTaxonomy = {
  categories: [
    taxonomy('facial', 'Cuidado facial', 1), taxonomy('capilar', 'Cuidado capilar', 2),
    taxonomy('cuerpo', 'Cuerpo', 3), taxonomy('bienestar', 'Bienestar', 4),
    taxonomy('suplementos', 'Suplementos', 5),
  ],
  brands: [taxonomy('mg-lab', 'MG Lab · SAMPLE', 1), taxonomy('mg-ritual', 'MG Ritual · SAMPLE', 2)],
  concerns: [
    taxonomy('hidratacion', 'Hidratación', 1), taxonomy('rutina-facial', 'Rutina facial', 2),
    taxonomy('cuidado-capilar', 'Cuidado capilar', 3), taxonomy('bienestar-diario', 'Bienestar diario', 4),
  ],
  collections: [taxonomy('seleccion-mg', 'Selección MG', 1), taxonomy('novedades', 'Novedades', 2)],
}

const image = (id: string, alt: string, tone: 'sage' | 'sand' | 'clay' | 'mist' | 'ink' | 'lime', sortOrder: number) =>
  ({ id, url: '', alt, placeholderTone: tone, sortOrder })

const base = (value: Omit<Product, 'createdAt' | 'updatedAt' | 'cost' | 'seo' | 'status'>): Product => ({
  ...value, cost: 0, status: 'active', seo: { title: value.name, description: value.shortDescription }, createdAt, updatedAt: createdAt,
})

export const sampleProducts: Product[] = [
  base({
    id: 'sample-serum', slug: 'serum-facial-sample', name: 'Sérum facial',
    shortDescription: 'Textura ligera para acompañar una rutina facial sencilla.',
    description: 'Una fórmula de demostración presentada para validar la experiencia de compra y el contenido editorial de MG.',
    brandId: 'mg-lab', categoryIds: ['facial'], concernIds: ['hidratacion', 'rutina-facial'], collectionIds: ['seleccion-mg', 'novedades'],
    images: [image('serum-front', 'Placeholder frontal del sérum facial', 'sage', 0), image('serum-detail', 'Placeholder de detalle del sérum facial', 'mist', 1)],
    variants: [{ id: 'serum-30', sku: 'SAMPLE-SERUM-30', name: '30 ml', attributes: { Presentación: '30 ml' }, regularPrice: 24.9, promotionalPrice: 21.9, active: true, imageId: 'serum-front' }],
    regularPrice: 24.9, promotionalPrice: 21.9, featured: true, isNew: true,
    information: { additional: 'Contenido de demostración. La información definitiva será incorporada con el catálogo real.' },
  }),
  base({
    id: 'sample-hair', slug: 'tratamiento-capilar-sample', name: 'Tratamiento capilar',
    shortDescription: 'Un paso de cuidado para integrar a la rutina capilar.',
    description: 'Producto de muestra sin afirmaciones funcionales ni ingredientes comerciales definitivos.',
    brandId: 'mg-ritual', categoryIds: ['capilar'], concernIds: ['cuidado-capilar'], collectionIds: ['seleccion-mg'],
    images: [image('hair-front', 'Placeholder del tratamiento capilar', 'clay', 0), image('hair-detail', 'Placeholder de textura del tratamiento capilar', 'sand', 1)],
    variants: [
      { id: 'hair-120', sku: 'SAMPLE-HAIR-120', name: '120 ml', attributes: { Presentación: '120 ml' }, regularPrice: 18.5, active: true, imageId: 'hair-front' },
      { id: 'hair-240', sku: 'SAMPLE-HAIR-240', name: '240 ml', attributes: { Presentación: '240 ml' }, regularPrice: 27.5, active: true, imageId: 'hair-detail' },
    ],
    regularPrice: 18.5, featured: true,
  }),
  base({
    id: 'sample-body', slug: 'cuidado-corporal-sample', name: 'Cuidado corporal',
    shortDescription: 'Una pausa cotidiana en una presentación esencial.',
    description: 'Referencia SAMPLE_DATA creada exclusivamente para probar catálogo, producto y carrito.',
    brandId: 'mg-ritual', categoryIds: ['cuerpo'], concernIds: ['hidratacion'], collectionIds: ['novedades'],
    images: [image('body-front', 'Placeholder del cuidado corporal', 'sand', 0), image('body-detail', 'Placeholder secundario del cuidado corporal', 'sage', 1)],
    variants: [], regularPrice: 16, featured: false, isNew: true,
  }),
  base({
    id: 'sample-wellness', slug: 'complemento-wellness-sample', name: 'Complemento wellness',
    shortDescription: 'Formato de muestra para explorar la categoría bienestar.',
    description: 'Este artículo no representa una fórmula, indicación o beneficio médico real.',
    brandId: 'mg-lab', categoryIds: ['bienestar', 'suplementos'], concernIds: ['bienestar-diario'], collectionIds: ['seleccion-mg'],
    images: [image('wellness-front', 'Placeholder de complemento wellness', 'ink', 0), image('wellness-detail', 'Placeholder secundario de complemento wellness', 'lime', 1)],
    variants: [{ id: 'wellness-30', sku: 'SAMPLE-WELLNESS-30', name: '30 unidades', attributes: { Presentación: '30 unidades' }, regularPrice: 29, active: true }],
    regularPrice: 29, featured: true,
  }),
  base({
    id: 'sample-routine', slug: 'rutina-hidratacion-sample', name: 'Rutina de hidratación',
    shortDescription: 'Una selección visual para probar productos con varias presentaciones.',
    description: 'Conjunto conceptual de demostración. No describe resultados ni contiene productos definitivos.',
    brandId: 'mg-ritual', categoryIds: ['facial', 'cuerpo'], concernIds: ['hidratacion'], collectionIds: ['seleccion-mg', 'novedades'],
    images: [image('routine-front', 'Placeholder de rutina de hidratación', 'mist', 0), image('routine-detail', 'Placeholder secundario de rutina', 'clay', 1)],
    variants: [
      { id: 'routine-essential', sku: 'SAMPLE-ROUTINE-E', name: 'Esencial', attributes: { Selección: 'Esencial' }, regularPrice: 34, active: true },
      { id: 'routine-complete', sku: 'SAMPLE-ROUTINE-C', name: 'Completa', attributes: { Selección: 'Completa' }, regularPrice: 48, promotionalPrice: 42, active: true },
    ],
    regularPrice: 34, featured: true, isNew: true,
  }),
  base({
    id: 'sample-selection', slug: 'seleccion-mg-sample', name: 'Selección MG',
    shortDescription: 'Edición conceptual para validar estados sin disponibilidad.',
    description: 'Producto SAMPLE_DATA no disponible. Permite verificar estados y acciones deshabilitadas.',
    categoryIds: ['bienestar'], concernIds: ['bienestar-diario'], collectionIds: ['novedades'],
    images: [image('selection-front', 'Placeholder de Selección MG', 'sage', 0)], variants: [], regularPrice: 22, featured: false, isNew: true,
  }),
]

export const sampleInventory: Inventory[] = sampleProducts.map((product) => ({
  productId: product.id,
  available: product.id === 'sample-selection' ? 0 : 12,
  reserved: 0,
  minimumStock: 0,
  updatedAt: createdAt,
}))
