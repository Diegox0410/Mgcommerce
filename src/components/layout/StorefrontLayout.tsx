import { Outlet } from 'react-router-dom'
import { AnnouncementBar } from './AnnouncementBar'
import { Footer } from './Footer'
import { Header } from './Header'
import { CartDrawer } from '../cart/CartDrawer'
import { SearchOverlay } from '../search/SearchOverlay'
import { useCatalogBootstrap } from '../../hooks/use-catalog'
import { RouteExperience } from './RouteExperience'

export function StorefrontLayout() {
  useCatalogBootstrap()
  return <div className="storefront"><a className="skip-link" href="#contenido">Saltar al contenido</a><RouteExperience /><AnnouncementBar /><Header /><main id="contenido" tabIndex={-1}><Outlet /></main><Footer /><SearchOverlay /><CartDrawer /></div>
}
