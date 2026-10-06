import { ArrowRight, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { searchProducts } from '../../domain/catalog/catalog-engine'
import { formatMoney, productPrice } from '../../domain/products/pricing'
import { useCatalogStore } from '../../stores/catalog-store'
import { useStorefrontUiStore } from '../../stores/storefront-ui-store'
import { IconButton } from '../ui/IconButton'
import { ProductMedia } from '../commerce/ProductMedia'

export function SearchOverlay() {
  const open = useStorefrontUiStore((state) => state.searchOpen)
  const close = useStorefrontUiStore((state) => state.closeSearch)
  const products = useCatalogStore((state) => state.products)
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { const timer = window.setTimeout(() => setQuery(input), 160); return () => window.clearTimeout(timer) }, [input])
  useEffect(() => { if (open) { setActive(0); window.setTimeout(() => inputRef.current?.focus(), 0) } }, [open])
  useEffect(() => { if (!open) return; const key = (event: KeyboardEvent) => event.key === 'Escape' && close(); document.addEventListener('keydown', key); return () => document.removeEventListener('keydown', key) }, [close, open])
  const results = useMemo(() => query ? searchProducts(products, query).slice(0, 6) : [], [products, query])
  if (!open) return null
  const navigateActive = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((value) => Math.min(value + 1, results.length - 1)) }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)) }
    if (event.key === 'Enter' && results[active]) { window.location.assign(`/producto/${results[active].slug}`) }
  }
  return <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Buscar productos"><header><span className="wordmark">MG</span><IconButton aria-label="Cerrar búsqueda" onClick={close}><X /></IconButton></header><div className="search-overlay__body"><div className="search-box"><Search aria-hidden="true" /><input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={navigateActive} placeholder="Buscar productos, categorías, necesidades…" aria-label="Buscar" aria-controls="search-results" autoComplete="off" />{input && <IconButton aria-label="Limpiar búsqueda" onClick={() => setInput('')}><X size={17} /></IconButton>}</div><div className="search-suggestions"><span>Búsquedas sugeridas</span>{['Hidratación', 'Cuidado capilar', 'Bienestar'].map((suggestion) => <button key={suggestion} onClick={() => setInput(suggestion)}>{suggestion}</button>)}</div><div id="search-results" className="search-results" role="listbox" aria-label="Resultados">{query && results.length === 0 && <div className="search-empty"><h2>Sin coincidencias</h2><p>Prueba con una categoría, necesidad o un término más breve.</p></div>}{results.map((product, index) => <Link role="option" aria-selected={index === active} className={index === active ? 'is-active' : ''} key={product.id} to={`/producto/${product.slug}`} onClick={close}><ProductMedia image={product.images[0]} /><div><small>{product.taxonomy.brand?.name}</small><strong>{product.name}</strong><span>{productPrice(product) === null || !product.currency ? 'Precio por confirmar' : formatMoney(productPrice(product)!, product.currency)}</span></div><ArrowRight /></Link>)}</div>{!query && <div className="search-intro"><span className="eyebrow">Descubrir</span><h2>¿Qué estás buscando hoy?</h2><p>Explora el catálogo por producto, marca, categoría o necesidad.</p></div>}</div></div>
}
