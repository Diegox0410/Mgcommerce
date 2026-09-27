import { ArrowRight, Boxes, Package, ShoppingBag, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Card, EmptyState } from '../../components/ui/Surface'

export function AdminDashboard() {
  return <><AdminHeader eyebrow="Resumen" title="Dashboard" description="La base operativa de MG está lista para recibir información real." /><div className="admin-grid"><Card><Package /><span>Catálogo</span><strong>Sin datos</strong><small>Productos publicados</small></Card><Card><ShoppingBag /><span>Pedidos</span><strong>Sin datos</strong><small>Actividad comercial</small></Card><Card><Boxes /><span>Inventario</span><strong>Sin datos</strong><small>Unidades disponibles</small></Card><Card><Users /><span>Clientes</span><strong>Sin datos</strong><small>Registros privados</small></Card></div><section className="admin-panel"><div><Badge>Hito 0</Badge><h2>Una base, múltiples experiencias.</h2><p>Admin, Storefront y el futuro GanoBot compartirán dominio y repositorios sin depender de componentes React.</p></div><Link to="/admin/productos">Revisar catálogo <ArrowRight size={16} /></Link></section></>
}

export function AdminModulePage({ title, group, description }: { title: string; group: string; description?: string }) {
  return <><AdminHeader eyebrow={group} title={title} description={description ?? 'Módulo preparado en la arquitectura; su implementación continúa en hitos posteriores.'} /><div className="admin-panel"><EmptyState title={`${title} está en construcción`} description="No hay datos ficticios ni automatizaciones activas en Hito 0." /></div></>
}

export function ProductEditorPage() { return <><AdminHeader eyebrow="Comercio" title="Nuevo producto" description="La ruta de edición está preparada para Hito 3." /><div className="admin-panel"><EmptyState title="Editor de producto preparado" description="El modelo admite variantes, imágenes, taxonomía, precios, estado, inventario y SEO." /></div></> }

function AdminHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) { return <header className="admin-page-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div></header> }
