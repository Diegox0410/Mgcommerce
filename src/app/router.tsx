
import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense, type ReactNode } from 'react'
import { StorefrontLayout } from '../components/layout/StorefrontLayout'
import { HomePage } from '../features/home/HomePage'
import { NotFoundPage } from '../features/not-found/NotFoundPage'
import { AdminAccessGate } from '../features/admin/AdminAccessGate'
import { LoadingState } from '../components/ui/Surface'

const AppointmentPage = lazy(() =>
  import('../features/appointments/AppointmentPage').then(
    (m) => ({ default: m.AppointmentPage }),
  ),
)

const CatalogPage = lazy(() =>
  import('../features/catalog/CatalogPage').then(
    (m) => ({ default: m.CatalogPage }),
  ),
)

const ProductPage = lazy(() =>
  import('../features/product/ProductPage').then(
    (m) => ({ default: m.ProductPage }),
  ),
)

const CartPage = lazy(() =>
  import('../features/cart/CartPage').then(
    (m) => ({ default: m.CartPage }),
  ),
)

const CheckoutPage = lazy(() =>
  import('../features/checkout/CheckoutPages').then(
    (m) => ({ default: m.CheckoutPage }),
  ),
)

const SuccessPage = lazy(() =>
  import('../features/checkout/CheckoutPages').then(
    (m) => ({ default: m.SuccessPage }),
  ),
)

const AdminLayout = lazy(() =>
  import('../features/admin/AdminLayout').then(
    (m) => ({ default: m.AdminLayout }),
  ),
)

const AdminDashboard = lazy(() =>
  import('../features/admin/AdminPages').then(
    (m) => ({ default: m.AdminDashboard }),
  ),
)

const AdminModulePage = lazy(() =>
  import('../features/admin/AdminPages').then(
    (m) => ({ default: m.AdminModulePage }),
  ),
)

const ProductEditorPage = lazy(() =>
  import('../features/admin/AdminPages').then(
    (m) => ({ default: m.ProductEditorPage }),
  ),
)

const pending = (content: ReactNode) => (
  <Suspense
    fallback={
      <div className="route-loading">
        <LoadingState message="Cargando vista…" />
      </div>
    }
  >
    {content}
  </Suspense>
)

const module = (title: string, group: string) =>
  pending(<AdminModulePage title={title} group={group} />)

export const router = createBrowserRouter([
  {
    element: <StorefrontLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/citas', element: pending(<AppointmentPage />) },
      { path: '/catalogo', element: pending(<CatalogPage />) },
      { path: '/producto/:slug', element: pending(<ProductPage />) },
      { path: '/carrito', element: pending(<CartPage />) },
      { path: '/checkout', element: pending(<CheckoutPage />) },
      { path: '/exito', element: pending(<SuccessPage />) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminAccessGate>
        {pending(<AdminLayout />)}
      </AdminAccessGate>
    ),
    children: [
      { index: true, element: pending(<AdminDashboard />) },
      { path: 'productos', element: module('Productos', 'Comercio') },
      { path: 'productos/nuevo', element: pending(<ProductEditorPage />) },
      { path: 'productos/:id', element: pending(<ProductEditorPage />) },
      { path: 'categorias', element: module('Categorías', 'Comercio') },
      { path: 'marcas', element: module('Marcas', 'Comercio') },
      { path: 'necesidades', element: module('Necesidades', 'Comercio') },
      { path: 'inventario', element: module('Inventario', 'Comercio') },
      { path: 'pedidos', element: module('Pedidos', 'Ventas') },
      { path: 'clientes', element: module('Clientes', 'Ventas') },
      { path: 'promociones', element: module('Promociones', 'Crecimiento') },
      { path: 'contenido', element: module('Contenido', 'Crecimiento') },
      { path: 'marketing', element: module('Marketing', 'Crecimiento') },
      { path: 'finanzas', element: module('Finanzas', 'Inteligencia') },
      { path: 'proyeccion', element: module('Proyección', 'Inteligencia') },
      { path: 'analitica', element: module('Analítica', 'Inteligencia') },
      { path: 'tienda', element: module('Apariencia', 'Tienda') },
      { path: 'navegacion', element: module('Navegación', 'Tienda') },
      { path: 'redes', element: module('Redes', 'Tienda') },
      { path: 'seo', element: module('SEO', 'Tienda') },
      { path: 'configuracion', element: module('Configuración', 'Sistema') },
    ],
  },
])
