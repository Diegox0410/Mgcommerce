import { ChevronLeft, ChevronRight, Menu, Search } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { IconButton } from '../../components/ui/IconButton'
import { useAdminUiStore } from '../../stores/admin-ui-store'
import { adminNavigation } from './navigation'

export function AdminLayout() {
  const { sidebarCollapsed, mobileOpen, toggleSidebar, setMobileOpen } = useAdminUiStore()
  return <div className={`admin-shell ${sidebarCollapsed ? 'is-collapsed' : ''}`}><a className="skip-link" href="#admin-content">Saltar al contenido</a><aside className={`admin-sidebar ${mobileOpen ? 'is-open' : ''}`}><div className="admin-sidebar__brand"><span className="admin-brand">MG</span><span className="admin-brand__label">ADMIN</span></div><nav aria-label="Navegación administrativa">{adminNavigation.map((group) => <div className="admin-nav-group" key={group.label}><span>{group.label}</span>{group.items.map((item) => <NavLink key={item.path} end={item.path === '/admin'} to={item.path} onClick={() => setMobileOpen(false)} title={item.label}><item.icon size={18} /><b>{item.label}</b></NavLink>)}</div>)}</nav><IconButton className="admin-collapse" aria-label={sidebarCollapsed ? 'Expandir navegación' : 'Colapsar navegación'} onClick={toggleSidebar}>{sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}</IconButton></aside>{mobileOpen && <button className="admin-scrim" aria-label="Cerrar navegación" onClick={() => setMobileOpen(false)} />}<div className="admin-main"><header className="admin-topbar"><IconButton className="admin-menu" aria-label="Abrir navegación" onClick={() => setMobileOpen(true)}><Menu /></IconButton><div className="admin-search"><Search size={17} /><span>Buscar en MG Admin</span><kbd>⌘ K</kbd></div><div className="admin-owner"><span>OWNER</span><span className="avatar">MG</span></div></header><main id="admin-content" className="admin-content"><Outlet /></main></div></div>
}
