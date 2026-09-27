import { BarChart3, Boxes, Building2, ChartNoAxesCombined, CircleDollarSign, FileText, FolderTree, Gauge, Heart, Megaphone, Navigation, Package, Palette, Percent, Search, Settings, ShoppingBag, Tags, Truck, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface AdminNavigationGroup { label: string; items: Array<{ label: string; path: string; icon: LucideIcon }> }

export const adminNavigation: AdminNavigationGroup[] = [
  { label: 'Resumen', items: [{ label: 'Dashboard', path: '/admin', icon: Gauge }] },
  { label: 'Comercio', items: [
    { label: 'Productos', path: '/admin/productos', icon: Package },
    { label: 'Categorías', path: '/admin/categorias', icon: FolderTree },
    { label: 'Marcas', path: '/admin/marcas', icon: Building2 },
    { label: 'Necesidades', path: '/admin/necesidades', icon: Heart },
    { label: 'Inventario', path: '/admin/inventario', icon: Boxes },
  ] },
  { label: 'Ventas', items: [{ label: 'Pedidos', path: '/admin/pedidos', icon: ShoppingBag }, { label: 'Clientes', path: '/admin/clientes', icon: Users }] },
  { label: 'Crecimiento', items: [{ label: 'Promociones', path: '/admin/promociones', icon: Percent }, { label: 'Contenido', path: '/admin/contenido', icon: FileText }, { label: 'Marketing', path: '/admin/marketing', icon: Megaphone }] },
  { label: 'Inteligencia', items: [{ label: 'Finanzas', path: '/admin/finanzas', icon: CircleDollarSign }, { label: 'Proyección', path: '/admin/proyeccion', icon: ChartNoAxesCombined }, { label: 'Analítica', path: '/admin/analitica', icon: BarChart3 }] },
  { label: 'Tienda', items: [{ label: 'Apariencia', path: '/admin/tienda', icon: Palette }, { label: 'Navegación', path: '/admin/navegacion', icon: Navigation }, { label: 'Redes', path: '/admin/redes', icon: Tags }, { label: 'SEO', path: '/admin/seo', icon: Search }] },
  { label: 'Sistema', items: [{ label: 'Configuración', path: '/admin/configuracion', icon: Settings }] },
]

export const logisticsReservedIcon = Truck
