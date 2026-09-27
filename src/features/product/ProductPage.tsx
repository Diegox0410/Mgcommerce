import { ArrowRight, Check, Heart, Minus } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '../../components/commerce/ProductCard'
import { ProductGallery } from '../../components/commerce/ProductGallery'
import { QuantitySelector } from '../../components/commerce/QuantitySelector'
import { VariantSelector } from '../../components/commerce/VariantSelector'
import { Button } from '../../components/ui/Button'
import { IconButton } from '../../components/ui/IconButton'
import { EmptyState, Skeleton } from '../../components/ui/Surface'
import { relatedProducts } from '../../domain/catalog/catalog-engine'
import { discountPercent, formatMoney, productPrice } from '../../domain/products/pricing'
import type { PublicProduct } from '../../domain/products/product'
import { usePageMeta } from '../../hooks/use-page-meta'
import { useCartStore } from '../../stores/cart-store'
import { useCatalogStore } from '../../stores/catalog-store'
import { useStorefrontUiStore } from '../../stores/storefront-ui-store'

export function ProductPage() {
  const { slug } = useParams()
  const products = useCatalogStore((state) => state.products)
  const status = useCatalogStore((state) => state.status)
  const product = products.find((item) => item.slug === slug)
  const [selectedId, setSelectedId] = useState<string>()
  const [quantity, setQuantity] = useState(1)
  const add = useCartStore((state) => state.add)
  const openCart = useStorefrontUiStore((state) => state.openCart)
  const variant = product?.variants.find((item) => item.id === selectedId) ?? product?.variants.find((item) => item.active)
  const price = variant ? (variant.promotionalPrice ?? variant.regularPrice) : product ? productPrice(product) : 0
  const regularPrice = variant?.regularPrice ?? product?.regularPrice ?? 0
  const related = product ? relatedProducts(product, products) : []
  usePageMeta(product?.seo.title ?? product?.name, product?.seo.description ?? product?.shortDescription)
  if (status === 'loading' || status === 'idle') return <section className="product-page container"><div className="product-loading"><Skeleton /><div><Skeleton /><Skeleton /><Skeleton /></div></div></section>
  if (!product) return <section className="page container"><EmptyState title="Producto no disponible" description="Este enlace no corresponde a un producto publicado. Puedes volver al catálogo SAMPLE." /><Link className="button button--primary empty-action" to="/catalogo">Volver al catálogo</Link></section>
  const addToCart = () => {
    add({ productId: product.id, variantId: variant?.id, variantName: variant?.name, slug: product.slug, name: product.name, imageUrl: product.images.find((image) => image.id === variant?.imageId)?.url || product.images[0]?.url, imageTone: product.images.find((image) => image.id === variant?.imageId)?.placeholderTone || product.images[0]?.placeholderTone, unitPrice: price, quantity })
    openCart()
  }
  return <>
    <section className="product-page container"><nav className="breadcrumbs" aria-label="Migas de pan"><Link to="/">Inicio</Link><span>/</span><Link to="/catalogo">Catálogo</Link><span>/</span><span aria-current="page">{product.name}</span></nav><div className="product-layout"><ProductGallery images={product.images} selectedImageId={variant?.imageId} /><aside className="purchase-panel"><span className="sample-label">SAMPLE_DATA · Producto demostrativo</span>{product.taxonomy.brand && <span className="product-brand">{product.taxonomy.brand.name}</span>}<h1>{product.name}</h1><p className="product-short">{product.shortDescription}</p><div className="product-price"><strong>{formatMoney(price)}</strong>{price < regularPrice && <><del>{formatMoney(regularPrice)}</del><span>−{discountPercent(regularPrice, price)}%</span></>}</div><div className={`availability ${product.available ? 'is-available' : ''}`}>{product.available ? <><Check size={15} /> Disponible</> : <><Minus size={15} /> No disponible</>}</div><VariantSelector variants={product.variants} selectedId={variant?.id} onSelect={(id) => { setSelectedId(id); setQuantity(1) }} /><div className="purchase-actions"><QuantitySelector value={quantity} onChange={setQuantity} disabled={!product.available} /><Button className="purchase-add" disabled={!product.available || (product.variants.length > 0 && !variant)} onClick={addToCart}>{product.available ? 'Añadir al carrito' : 'No disponible'}<ArrowRight size={17} /></Button><IconButton className="purchase-wishlist" aria-label="Wishlist próximamente" title="Wishlist próximamente" disabled><Heart /></IconButton></div><p className="purchase-note">Precio y disponibilidad de demostración. No se procesa ninguna venta real.</p></aside></div><ProductInformation product={product} /></section>{related.length > 0 && <section className="related-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">También puede interesarte</span><h2>Completa tu rutina</h2></div><Link className="text-link" to="/catalogo">Ver catálogo <ArrowRight size={15} /></Link></div><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></div></section>}
  </>
}

function ProductInformation({ product }: { product: PublicProduct }) {
  const sections = [
    { title: 'Descripción', content: product.description },
    { title: 'Beneficios', content: product.information?.benefits?.join(' · ') },
    { title: 'Modo de uso', content: product.information?.usage },
    { title: 'Ingredientes', content: product.information?.ingredients },
    { title: 'Información adicional', content: product.information?.additional },
  ].filter((item) => item.content)
  if (!sections.length) return null
  return <div className="product-information">{sections.map((section, index) => <details key={section.title} open={index === 0}><summary>{section.title}<span>+</span></summary><p>{section.content}</p></details>)}</div>
}
