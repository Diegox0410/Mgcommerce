import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { ProductCard } from '../../components/commerce/ProductCard'
import { normalizeSearch } from '../../domain/catalog/catalog-engine'
import { usePageMeta } from '../../hooks/use-page-meta'
import { useCatalogStore } from '../../stores/catalog-store'
import '../../styles/mg-catalog.css'

const PAGE_SIZE = 24

export function MgCatalogPage() {
  const products = useCatalogStore(state => state.products)
  const status = useCatalogStore(state => state.status)
  const error = useCatalogStore(state => state.error)
  const [params, setParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const query = params.get('q') ?? ''
  const categories = params.getAll('categoria')
  const brands = params.getAll('marca')
  const sort = params.get('orden') ?? 'featured'
  const filterKey = params.toString()

  usePageMeta(
    'Catálogo MG',
    'Explora nuestros productos de salud, belleza y bienestar.'
  )

  useEffect(() => {
    setPage(1)
  }, [filterKey])

  const categoryOptions = useMemo(() => {
    const items = new Map<string, string>()
    products.forEach(product => {
      product.taxonomy.categories.forEach(category => {
        items.set(category.slug, category.name)
      })
    })
    return [...items.entries()].sort((a, b) =>
      a[1].localeCompare(b[1], 'es')
    )
  }, [products])

  const brandOptions = useMemo(() => {
    const items = new Map<string, string>()
    products.forEach(product => {
      const brand = product.taxonomy.brand
      if (brand) items.set(brand.slug, brand.name)
    })
    return [...items.entries()].sort((a, b) =>
      a[1].localeCompare(b[1], 'es')
    )
  }, [products])

  const results = useMemo(() => {
    const needle = normalizeSearch(query)

    const filtered = products.filter(product => {
      const searchable = normalizeSearch([
        product.id,
        product.name,
        product.shortDescription,
        product.taxonomy.brand?.name,
        ...product.taxonomy.categories.map(item => item.name),
      ].filter(Boolean).join(' '))

      const matchesQuery = !needle || searchable.includes(needle)

      const matchesCategory =
        categories.length === 0 ||
        product.taxonomy.categories.some(item =>
          categories.includes(item.slug)
        )

      const matchesBrand =
        brands.length === 0 ||
        (product.taxonomy.brand !== undefined &&
          brands.includes(product.taxonomy.brand.slug))

      return matchesQuery && matchesCategory && matchesBrand
    })

    if (sort === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name, 'es'))
    } else if (sort === 'name-desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name, 'es'))
    } else if (sort === 'code') {
      filtered.sort((a, b) => a.id.localeCompare(b.id))
    } else {
      filtered.sort((a, b) =>
        Number(b.featured) - Number(a.featured)
      )
    }

    return filtered
  }, [products, query, sort, brands, categories])

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const visible = results.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  const toggleFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    const selected = next.getAll(key)
    next.delete(key)
    const updated = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value]
    updated.forEach(item => next.append(key, item))
    setParams(next)
  }

  const clearFilters = () => setParams(new URLSearchParams())

  return (
    <section className="catalog-page mg-catalog">
      <header className="catalog-hero container">
        <span className="eyebrow">Catálogo MG</span>
        <h1>Una selección para cada ritual.</h1>
        <p>Explora nuestra colección de salud, belleza y bienestar.</p>
      </header>

      <div className="catalog-toolbar container">
        <span><strong>{results.length}</strong> productos</span>

        <button
          type="button"
          className="filter-trigger"
          onClick={() => setFiltersOpen(!filtersOpen)}
          aria-expanded={filtersOpen}
        >
          <SlidersHorizontal size={17} />
          Filtrar
        </button>

        <label>
          Ordenar
          <select
            value={sort}
            onChange={event => updateParam('orden', event.target.value)}
          >
            <option value="featured">Destacados</option>
            <option value="code">Código MG</option>
            <option value="name">Nombre A-Z</option>
            <option value="name-desc">Nombre Z-A</option>
          </select>
        </label>
      </div>

      <div className="catalog-layout container">
        <aside
          className={`catalog-filters mg-catalog__filters ${
            filtersOpen ? 'mg-catalog__filters--open' : ''
          }`}
        >
          <h3>Filtrar</h3>

          <label className="mg-catalog__search-label">
            Buscar productos
            <input
              type="search"
              value={query}
              placeholder="Nombre o código MG"
              onChange={event => updateParam('q', event.target.value)}
            />
          </label>

          <fieldset className="filter-group">
            <legend>Categoría</legend>
            {categoryOptions.map(([slug, name]) => (
              <label className="check-row" key={slug}>
                <input
                  type="checkbox"
                  checked={categories.includes(slug)}
                  onChange={() => toggleFilter('categoria', slug)}
                />
                {name}
              </label>
            ))}
          </fieldset>

          <fieldset className="filter-group">
            <legend>Marca</legend>
            {brandOptions.map(([slug, name]) => (
              <label className="check-row" key={slug}>
                <input
                  type="checkbox"
                  checked={brands.includes(slug)}
                  onChange={() => toggleFilter('marca', slug)}
                />
                {name}
              </label>
            ))}
          </fieldset>

          <button
            className="mg-catalog__clear"
            type="button"
            onClick={clearFilters}
          >
            Limpiar filtros
          </button>
        </aside>

        <div className="catalog-results">
          {status === 'loading' && <p>Cargando catálogo...</p>}

          {status === 'error' && (
            <p role="alert">{error ?? 'No se pudo cargar el catálogo.'}</p>
          )}

          {status === 'ready' && results.length === 0 && (
            <div className="catalog-empty">
              <h2>No encontramos productos</h2>
              <p>Prueba otra búsqueda o categoría.</p>
              <button type="button" onClick={clearFilters}>
                Ver todos los productos
              </button>
            </div>
          )}

          {results.length > 0 && (
            <>
              <div className="product-grid catalog-product-grid">
                {visible.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <nav className="mg-catalog__pagination" aria-label="Paginación">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Anterior
                </button>

                <span>
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  Siguiente
                </button>
              </nav>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
