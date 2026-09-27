import { ArrowRight, Asterisk, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/commerce/ProductCard'
import { ProductMedia } from '../../components/commerce/ProductMedia'
import { usePageMeta } from '../../hooks/use-page-meta'
import { useCatalogStore } from '../../stores/catalog-store'
import { useStoreConfigStore } from '../../stores/store-config-store'

const concerns = [
  { name: 'Hidratación', slug: 'hidratacion', number: '01', tone: 'sage' },
  { name: 'Cuidado capilar', slug: 'cuidado-capilar', number: '02', tone: 'clay' },
  { name: 'Rutina facial', slug: 'rutina-facial', number: '03', tone: 'mist' },
  { name: 'Bienestar diario', slug: 'bienestar-diario', number: '04', tone: 'ink' },
]
const categories = [
  { name: 'Facial', slug: 'facial', tone: 'mist' }, { name: 'Capilar', slug: 'capilar', tone: 'clay' },
  { name: 'Cuerpo', slug: 'cuerpo', tone: 'sand' }, { name: 'Bienestar', slug: 'bienestar', tone: 'sage' },
  { name: 'Suplementos', slug: 'suplementos', tone: 'ink' },
]

export function HomePage() {
  const config = useStoreConfigStore((state) => state.config)
  const products = useCatalogStore((state) => state.products)
  const featured = products.filter((product) => product.featured).slice(0, 4)
  const news = products.filter((product) => product.isNew).slice(0, 4)
  usePageMeta()
  const section = (id: typeof config.home.sections[number]['id']) => config.home.sections.find((item) => item.id === id)?.enabled
  return <>
    <section className="hero"><div className="container hero__grid"><div className="hero__copy"><span className="eyebrow">{config.hero.eyebrow}</span><h1>{config.hero.title.split('. ').map((line, index) => <span key={line}>{line}{index === 0 ? '.' : ''}</span>)}</h1><p>{config.hero.description}</p><div className="hero__actions"><Link className="button button--primary" to={config.hero.primaryHref}>{config.hero.primaryLabel}<ArrowRight size={18} /></Link><Link className="text-link" to={config.hero.secondaryHref}>{config.hero.secondaryLabel}<ArrowRight size={15} /></Link></div><small className="sample-label">SAMPLE_DATA · Experiencia local de demostración</small></div><div className="hero__art" aria-label="Placeholder editorial preparado para fotografía"><div className="hero__shape hero__shape--one" /><div className="hero__shape hero__shape--two" /><span className="hero__vertical">MG / CARE / WELLNESS</span><div className="hero__note"><Leaf aria-hidden="true" /><span>Cuidado elegido<br />con intención</span></div></div></div></section>
    {section('concerns') && <section className="home-section concerns-section"><div className="container"><div className="editorial-heading"><span className="eyebrow">Navegar por necesidad</span><h2>{config.home.concernsTitle}</h2><p>Cuatro puntos de partida para explorar el catálogo de demostración.</p></div><div className="concern-composition">{concerns.map((item) => <Link className={`concern-tile tone-${item.tone}`} key={item.slug} to={`/catalogo?necesidad=${item.slug}`}><span>{item.number}</span><Asterisk /><strong>{item.name}</strong><i>Explorar →</i></Link>)}</div></div></section>}
    {section('featured') && <section className="home-section product-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Curaduría de muestra</span><h2>{config.home.featuredTitle}</h2></div><Link className="text-link" to="/catalogo">Ver todo <ArrowRight size={15} /></Link></div><div className="product-grid">{featured.map((product) => <ProductCard product={product} key={product.id} />)}</div></div></section>}
    {section('story') && <section className="editorial-story"><div className="editorial-story__media"><ProductMedia image={{ id: 'story', url: '', alt: 'Placeholder para historia editorial MG', sortOrder: 0, placeholderTone: 'ink' }} /></div><div className="editorial-story__copy"><span className="eyebrow">{config.home.story.eyebrow}</span><h2>{config.home.story.title.split('. ').map((line) => <span key={line}>{line}{line.endsWith('.') ? '' : '.'}</span>)}</h2><p>{config.home.story.description}</p><Link className="button button--secondary" to={config.home.story.ctaHref}>{config.home.story.ctaLabel}</Link></div></section>}
    {section('categories') && <section className="home-section category-section" id="categorias"><div className="container"><div className="editorial-heading"><span className="eyebrow">Explora por categoría</span><h2>Distintas formas de cuidarte.</h2></div><div className="category-composition">{categories.map((item, index) => <Link key={item.slug} className={`category-tile category-tile--${index + 1} tone-${item.tone}`} to={`/catalogo?categoria=${item.slug}`}><span>0{index + 1}</span><strong>{item.name}</strong><i>Descubrir <ArrowRight /></i></Link>)}</div></div></section>}
    {section('new') && <section className="home-section new-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Recién incorporado</span><h2>{config.home.newTitle}</h2></div><Link className="text-link" to="/catalogo?orden=nuevo">Explorar novedades <ArrowRight size={15} /></Link></div><div className="new-scroll">{news.map((product) => <ProductCard product={product} key={product.id} />)}</div></div></section>}
  </>
}
