import { ArrowUpRight, Heart, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { discountPercent, formatMoney, productPrice } from '../../domain/products/pricing'
import type { PublicProduct } from '../../domain/products/product'
import { useCartStore } from '../../stores/cart-store'
import { useStorefrontUiStore } from '../../stores/storefront-ui-store'
import { IconButton } from '../ui/IconButton'
import { ProductMedia } from './ProductMedia'

export function ProductCard({ product }: { product: PublicProduct }) {
  const add = useCartStore((state) => state.add)
  const openCart = useStorefrontUiStore((state) => state.openCart)
  const variant = product.variants.length === 1 ? product.variants[0] : undefined
  const price = variant
    ? (variant.promotionalPrice ?? variant.regularPrice)
    : productPrice(product)
  const regularPrice = variant?.regularPrice ?? product.regularPrice
  const hasPrice = price !== null
  const purchaseReady =
    product.available &&
    hasPrice &&
    product.currency !== null &&
    product.pricingStatus === 'READY'
  const canQuickAdd =
    purchaseReady &&
    product.variants.length <= 1

  const quickAdd = () => {
    if (price === null || !product.currency || product.pricingStatus !== 'READY') return

    add({
      productId: product.id,
      variantId: variant?.id,
      variantName: variant?.name,
      slug: product.slug,
      name: product.name,
      imageUrl: product.images[0]?.url,
      imageTone: product.images[0]?.placeholderTone,
      unitPrice: price,
      currency: product.currency,
      quantity: 1,
    })
    openCart()
  }

  const hasDiscount =
    price !== null &&
    regularPrice !== null &&
    price < regularPrice

  return <article className="product-card">
    <div className="product-card__visual">
      <Link to={`/producto/${product.slug}`} aria-label={`Ver ${product.name}`}>
        <ProductMedia image={product.images[0]} secondary={product.images[1]} />
      </Link>
      <div className="product-card__badges">
        {product.isNew && <span>Nuevo</span>}
        {hasDiscount && <span>−{discountPercent(regularPrice, price)}%</span>}
        {!product.available && <span>Agotado</span>}
        {product.pricingStatus === 'PENDING' && <span>Precio pendiente</span>}
      </div>
      <IconButton className="product-card__wishlist" aria-label="Wishlist próximamente" title="Wishlist próximamente" disabled>
        <Heart size={18} />
      </IconButton>
      {canQuickAdd
        ? <button className="product-card__quick" onClick={quickAdd}><Plus size={16} /> Añadir</button>
        : product.available && <Link className="product-card__quick" to={`/producto/${product.slug}`}>Ver detalles <ArrowUpRight size={15} /></Link>}
    </div>
    <div className="product-card__content">
      {product.taxonomy.brand && <span>{product.taxonomy.brand.name}</span>}
      <h3><Link to={`/producto/${product.slug}`}>{product.name}</Link></h3>
      <div className="product-card__price">
        <strong>{price === null || !product.currency ? 'Precio por confirmar' : formatMoney(price, product.currency)}</strong>
        {hasDiscount && product.currency && <del>{formatMoney(regularPrice, product.currency)}</del>}
      </div>
      {product.variants.length > 1 && <small>{product.variants.length} opciones</small>}
    </div>
  </article>
}
