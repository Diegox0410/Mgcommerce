
import {
  CalendarDays,
  Menu,
  Search,
  ShoppingBag,
} from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import {
  selectCartCount,
  useCartStore,
} from '../../stores/cart-store'
import { useStorefrontUiStore } from '../../stores/storefront-ui-store'
import { Drawer } from '../ui/Overlays'
import { MGLogo } from '../branding/MGLogo'

export function Header() {
  const cartCount = useCartStore(selectCartCount)

  const {
    openSearch,
    openCart,
    mobileNavOpen,
    setMobileNavOpen,
  } = useStorefrontUiStore()

  const closeMenu = () => setMobileNavOpen(false)

  return (
    <>
      <header className="site-header mg-header">
        <div className="container mg-header__inner">

          <button
            type="button"
            className="mg-header__menu"
            aria-label="Abrir menú"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu size={25} />
          </button>

        <Link
  to="/"
  className="mg-header__brand mg-header__brand--vector"
  aria-label="MG Salud y Belleza, inicio"
>
  <MGLogo className="mg-header__vector-logo" size={92} />
</Link>
          <nav
            className="mg-header__nav"
            aria-label="Navegación principal"
          >
            <NavLink to="/" end>
              Inicio
            </NavLink>

            <a href="/#servicios">
              Servicios
            </a>

            <NavLink to="/catalogo">
              Catálogo
            </NavLink>

            <a href="/#nosotros">
              Sobre MG
            </a>
          </nav>

          <div className="mg-header__actions">
            <button
              type="button"
              className="mg-header__icon"
              aria-label="Buscar productos"
              onClick={openSearch}
            >
              <Search size={23} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              className="mg-header__icon mg-header__cart"
              aria-label={`Abrir carrito, ${cartCount} artículos`}
              onClick={openCart}
            >
              <ShoppingBag size={23} strokeWidth={1.8} />

              {cartCount > 0 && (
                <span>{cartCount}</span>
              )}
            </button>

            <Link
              className="mg-header__contact"
              to="/citas"
            >
              <CalendarDays size={18} />
              Agendar cita
            </Link>
          </div>
        </div>
      </header>

      {/* NAVEGACIÓN MÓVIL */}
      <Drawer
        open={mobileNavOpen}
        title="Explorar MG"
        onClose={closeMenu}
      >
        <nav
          className="mg-mobile-nav"
          aria-label="Navegación móvil"
        >
          <Link to="/" onClick={closeMenu}>
            Inicio
          </Link>

          <a href="/#servicios" onClick={closeMenu}>
            Servicios
          </a>

          <Link to="/catalogo" onClick={closeMenu}>
            Catálogo
          </Link>

          <a href="/#nosotros" onClick={closeMenu}>
            Sobre MG
          </a>

          <Link to="/citas" onClick={closeMenu}>
            <CalendarDays size={20} />
            Agendar cita
          </Link>

          <button
            type="button"
            onClick={() => {
              closeMenu()
              openSearch()
            }}
          >
            <Search size={20} />
            Buscar productos
          </button>

          <button
            type="button"
            onClick={() => {
              closeMenu()
              openCart()
            }}
          >
            <ShoppingBag size={20} />
            Ver carrito ({cartCount})
          </button>
        </nav>
      </Drawer>
    </>
  )
}
