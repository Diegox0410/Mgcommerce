import { SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../../components/commerce/ProductCard'
import { Button } from '../../components/ui/Button'
import { Sheet } from '../../components/ui/Overlays'
import { EmptyState, Skeleton } from '../../components/ui/Surface'
import { activeFilterCount, parseCatalogParams, toCatalogParams } from '../../domain/catalog/catalog-query'
import { applyCatalog, defaultCatalogFilters, uniqueTaxonomy, type CatalogFilters } from '../../domain/catalog/catalog-engine'
import type { PublicProduct, PublicTaxonomyReference } from '../../domain/products/product'
import { usePageMeta } from '../../hooks/use-page-meta'
import { useCatalogStore } from '../../stores/catalog-store'

export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const products = useCatalogStore((state) => state.products)
  const status = useCatalogStore((state) => state.status)
  const error = useCatalogStore((state) => state.error)
  const filters = useMemo(() => parseCatalogParams(params), [params])
  const results = useMemo(() => applyCatalog(products, filters), [filters, products])
  const setFilters = (next: CatalogFilters) => setParams(toCatalogParams(next))
  usePageMeta('Catálogo', 'Explora el catálogo de demostración de MG Salud y Belleza.')
  return <section className="catalog-page"><header className="catalog-hero container"><span className="eyebrow">SAMPLE_DATA · Catálogo local</span><h1>Una selección para cada ritual.</h1><p>Explora por categoría, marca o necesidad. Los productos y precios de esta experiencia son únicamente demostrativos.</p></header><div className="catalog-toolbar container"><span><strong>{results.length}</strong> {results.length === 1 ? 'resultado' : 'resultados'}</span><button className="filter-trigger" onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={17} /> Filtrar {activeFilterCount(filters) > 0 && <b>{activeFilterCount(filters)}</b>}</button><label>Ordenar <select value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value as CatalogFilters['sort'] })}><option value="featured">Destacados</option><option value="new">Novedades</option><option value="price-asc">Precio: menor a mayor</option><option value="price-desc">Precio: mayor a menor</option><option value="name">Nombre</option></select></label></div><div className="catalog-layout container"><aside className="catalog-filters"><FilterForm products={products} value={filters} onChange={setFilters} /></aside><div className="catalog-results"><ActiveFilters value={filters} onChange={setFilters} products={products} />{status === 'loading' && <CatalogSkeleton />}{status === 'error' && <EmptyState title="No pudimos cargar el catálogo" description={error ?? 'Intenta nuevamente.'} />}{status === 'ready' && results.length === 0 && <div className="catalog-empty"><EmptyState title="No encontramos coincidencias" description="Ajusta los filtros o vuelve a ver todo el catálogo." /><Button variant="secondary" onClick={() => setFilters(defaultCatalogFilters)}>Limpiar filtros</Button></div>}{results.length > 0 && <div className="product-grid catalog-product-grid">{results.map((product) => <ProductCard key={product.id} product={product} />)}</div>}</div></div><MobileFilters open={filtersOpen} onClose={() => setFiltersOpen(false)} products={products} value={filters} onApply={setFilters} /></section>
}

function FilterForm({ products, value, onChange }: { products: PublicProduct[]; value: CatalogFilters; onChange: (filters: CatalogFilters) => void }) {
  const brands = [...new Map(products.map((product) => product.taxonomy.brand).filter(Boolean).map((item) => [item!.id, item!])).values()]
  return <form onSubmit={(event) => event.preventDefault()}><div className="filters-heading"><strong>Filtrar</strong>{activeFilterCount(value) > 0 && <button type="button" onClick={() => onChange(defaultCatalogFilters)}>Limpiar</button>}</div><FilterGroup title="Categoría" items={uniqueTaxonomy(products, 'categories')} selected={value.category} onChange={(category) => onChange({ ...value, category })} /><FilterGroup title="Marca" items={brands} selected={value.brand} onChange={(brand) => onChange({ ...value, brand })} /><FilterGroup title="Necesidad" items={uniqueTaxonomy(products, 'concerns')} selected={value.concern} onChange={(concern) => onChange({ ...value, concern })} /><FilterGroup title="Colección" items={uniqueTaxonomy(products, 'collections')} selected={value.collection} onChange={(collection) => onChange({ ...value, collection })} /><fieldset className="filter-group"><legend>Precio</legend><div className="price-filter"><label>Desde <input type="number" min="0" inputMode="decimal" value={value.minPrice ?? ''} onChange={(event) => onChange({ ...value, minPrice: event.target.value ? Number(event.target.value) : undefined })} /></label><label>Hasta <input type="number" min="0" inputMode="decimal" value={value.maxPrice ?? ''} onChange={(event) => onChange({ ...value, maxPrice: event.target.value ? Number(event.target.value) : undefined })} /></label></div></fieldset><fieldset className="filter-group"><legend>Otros</legend><label className="check-row"><input type="checkbox" checked={value.promotion} onChange={(event) => onChange({ ...value, promotion: event.target.checked })} /> En promoción</label><label className="check-row"><input type="checkbox" checked={value.availability} onChange={(event) => onChange({ ...value, availability: event.target.checked })} /> Disponible</label></fieldset></form>
}

function FilterGroup({ title, items, selected, onChange }: { title: string; items: PublicTaxonomyReference[]; selected: string[]; onChange: (selected: string[]) => void }) {
  if (!items.length) return null
  return <fieldset className="filter-group"><legend>{title}</legend>{items.map((item) => <label className="check-row" key={item.id}><input type="checkbox" checked={selected.includes(item.slug)} onChange={(event) => onChange(event.target.checked ? [...selected, item.slug] : selected.filter((value) => value !== item.slug))} /> {item.name}</label>)}</fieldset>
}

function ActiveFilters({ value, onChange, products }: { value: CatalogFilters; onChange: (filters: CatalogFilters) => void; products: PublicProduct[] }) {
  const refs = [...uniqueTaxonomy(products, 'categories'), ...uniqueTaxonomy(products, 'concerns'), ...uniqueTaxonomy(products, 'collections'), ...products.map((product) => product.taxonomy.brand).filter(Boolean) as PublicTaxonomyReference[]]
  const entries: Array<{ label: string; clear: () => void }> = []
  const add = (values: string[], key: 'category' | 'brand' | 'concern' | 'collection') => values.forEach((slug) => entries.push({ label: refs.find((item) => item.slug === slug)?.name ?? slug, clear: () => onChange({ ...value, [key]: value[key].filter((item) => item !== slug) }) }))
  add(value.category, 'category'); add(value.brand, 'brand'); add(value.concern, 'concern'); add(value.collection, 'collection')
  if (value.promotion) entries.push({ label: 'En promoción', clear: () => onChange({ ...value, promotion: false }) })
  if (value.availability) entries.push({ label: 'Disponible', clear: () => onChange({ ...value, availability: false }) })
  if (value.minPrice !== undefined || value.maxPrice !== undefined) entries.push({ label: `Precio ${value.minPrice ?? 0}–${value.maxPrice ?? '∞'}`, clear: () => onChange({ ...value, minPrice: undefined, maxPrice: undefined }) })
  if (!entries.length) return null
  return <div className="active-filters" aria-label="Filtros activos">{entries.map((entry, index) => <button key={`${entry.label}-${index}`} onClick={entry.clear}>{entry.label}<X size={13} /></button>)}<button className="clear-all" onClick={() => onChange(defaultCatalogFilters)}>Limpiar todo</button></div>
}

function MobileFilters({ open, onClose, products, value, onApply }: { open: boolean; onClose: () => void; products: PublicProduct[]; value: CatalogFilters; onApply: (filters: CatalogFilters) => void }) {
  const [draft, setDraft] = useState(value)
  return <Sheet open={open} onClose={onClose} title="Filtrar productos"><div className="mobile-filters"><FilterForm products={products} value={draft} onChange={setDraft as Dispatch<SetStateAction<CatalogFilters>>} /><div className="mobile-filters__actions"><Button variant="secondary" onClick={() => setDraft(defaultCatalogFilters)}>Limpiar</Button><Button onClick={() => { onApply(draft); onClose() }}>Ver resultados</Button></div></div></Sheet>
}

function CatalogSkeleton() { return <div className="product-grid catalog-product-grid" aria-label="Cargando productos">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="product-skeleton"><Skeleton /><Skeleton /><Skeleton /></div>)}</div> }
