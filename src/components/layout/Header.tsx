import { ChevronDown, Heart, Menu, Search, ShoppingBag, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { selectCartCount, useCartStore } from '../../stores/cart-store'
import { useStoreConfigStore } from '../../stores/store-config-store'
import { useStorefrontUiStore } from '../../stores/storefront-ui-store'
import { IconButton } from '../ui/IconButton'
import { Drawer } from '../ui/Overlays'

const megaGroups = [
  { label: 'Categorías', links: [['Cuidado facial', '/catalogo?categoria=facial'], ['Cuidado capilar', '/catalogo?categoria=capilar'], ['Cuerpo', '/catalogo?categoria=cuerpo'], ['Bienestar', '/catalogo?categoria=bienestar']] },
  { label: 'Necesidades', links: [['Hidratación', '/catalogo?necesidad=hidratacion'], ['Rutina facial', '/catalogo?necesidad=rutina-facial'], ['Bienestar diario', '/catalogo?necesidad=bienestar-diario']] },
  { label: 'Colecciones', links: [['Selección MG', '/catalogo?coleccion=seleccion-mg'], ['Novedades', '/catalogo?coleccion=novedades']] },
]

export function Header() {
  const [mega, setMega] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const config = useStoreConfigStore((state) => state.config)
  const count = useCartStore(selectCartCount)
  const { openSearch, openCart, mobileNavOpen, setMobileNavOpen } = useStorefrontUiStore()
  useEffect(() => { const update = () => setScrolled(window.scrollY > 16); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update) }, [])
  useEffect(() => {
    if (!mega) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMega(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [mega])
  return <>
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}><div className="container header__inner"><IconButton className="header__mobile" aria-label="Abrir menú" onClick={() => setMobileNavOpen(true)}><Menu /></IconButton><Link className="wordmark" to="/" aria-label="MG Salud y Belleza, inicio"><span>MG</span><small>Salud & Belleza</small></Link><nav className="header__nav" aria-label="Navegación principal">{config.header.navigation.filter((item) => item.enabled).map((item) => item.kind === 'mega' ? <button key={item.id} aria-expanded={mega} aria-controls="mega-menu" onMouseEnter={() => setMega(true)} onFocus={() => setMega(true)} onClick={() => setMega(true)}>{item.label}<ChevronDown size={13} /></button> : <NavLink key={item.id} to={item.href} onClick={() => setMega(false)}>{item.label}</NavLink>)}</nav><div className="header__actions"><IconButton aria-label="Buscar" onClick={openSearch}><Search /></IconButton><IconButton className="desktop-action" aria-label="Cuenta próximamente" title="Cuenta próximamente" disabled><UserRound /></IconButton><IconButton className="desktop-action" aria-label="Wishlist próximamente" title="Wishlist próximamente" disabled><Heart /></IconButton><button className="cart-link" onClick={openCart} aria-label={`Carrito, ${count} artículos`}><ShoppingBag /><span>{count}</span></button></div></div>{mega && <div id="mega-menu" className="mega-menu"><div className="container mega-menu__inner">{megaGroups.map((group) => <div key={group.label}><span>{group.label}</span>{group.links.map(([label, href]) => <Link key={href} to={href} onClick={() => setMega(false)}>{label}</Link>)}</div>)}<Link className="mega-menu__feature" to="/catalogo?coleccion=seleccion-mg" onClick={() => setMega(false)}><span className="eyebrow">Selección editorial</span><strong>Descubre la mirada MG.</strong><i>Explorar ahora →</i></Link></div></div>}</header>
    <Drawer open={mobileNavOpen} title="Explorar MG" onClose={() => setMobileNavOpen(false)}><div className="mobile-nav"><button className="mobile-nav__search" onClick={() => { setMobileNavOpen(false); openSearch() }}><Search /> Buscar productos</button>{megaGroups.map((group) => <section key={group.label}><h3>{group.label}</h3>{group.links.map(([label, href]) => <Link key={href} to={href} onClick={() => setMobileNavOpen(false)}>{label}<span>→</span></Link>)}</section>)}<div className="mobile-nav__future"><button disabled><UserRound /> Cuenta <small>Próximamente</small></button><button disabled><Heart /> Wishlist <small>Próximamente</small></button></div></div></Drawer>
  </>
}
