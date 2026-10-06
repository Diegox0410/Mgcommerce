import { ArrowRight, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductMedia } from '../../components/commerce/ProductMedia'
import { QuantitySelector } from '../../components/commerce/QuantitySelector'
import { IconButton } from '../../components/ui/IconButton'
import { EmptyState } from '../../components/ui/Surface'
import { formatMoney, lineTotal } from '../../domain/products/pricing'
import { usePageMeta } from '../../hooks/use-page-meta'
import { selectCartCount, selectCartSubtotal, useCartStore } from '../../stores/cart-store'

export function CartPage() {
  const items = useCartStore((state) => state.items)
  const count = useCartStore(selectCartCount)
  const total = useCartStore(selectCartSubtotal)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const remove = useCartStore((state) => state.remove)
  const clear = useCartStore((state) => state.clear)
  usePageMeta('Carrito')
  return <section className="cart-page container"><header className="cart-page__header"><div><span className="eyebrow">Tu selección · {count}</span><h1>Carrito</h1></div>{items.length > 0 && <button onClick={clear}>Vaciar carrito</button>}</header>{items.length === 0 ? <><EmptyState title="Tu carrito está vacío" description="Explora el catálogo para añadir productos a tu selección." /><Link className="button button--primary empty-action" to="/catalogo">Descubrir productos</Link></> : <div className="cart-page__layout"><div className="cart-page__lines">{items.map((item) => <article className="cart-page-line" key={`${item.productId}-${item.variantId ?? ''}`}><Link to={`/producto/${item.slug}`}><ProductMedia image={{ id: 'cart-page', url: item.imageUrl ?? '', alt: item.name, sortOrder: 0, placeholderTone: item.imageTone }} /></Link><div><Link to={`/producto/${item.slug}`}><h2>{item.name}</h2></Link>{item.variantName && <p>{item.variantName}</p>}<span>{formatMoney(item.unitPrice)} por unidad</span><div className="cart-page-line__controls"><QuantitySelector value={item.quantity} onChange={(quantity) => setQuantity(item.productId, item.variantId, quantity)} /><IconButton aria-label={`Eliminar ${item.name}`} onClick={() => remove(item.productId, item.variantId)}><Trash2 size={17} /></IconButton></div></div><strong>{formatMoney(lineTotal(item.unitPrice, item.quantity))}</strong></article>)}</div><aside className="cart-summary"><span className="eyebrow">Resumen</span><div><span>Subtotal</span><strong>{formatMoney(total)}</strong></div><p>No se calculan envío, impuestos ni descuentos comerciales en este modo de demostración.</p><Link className="button button--primary" to="/checkout">Continuar al checkout <ArrowRight size={17} /></Link><Link className="text-link" to="/catalogo">Seguir explorando</Link></aside></div>}</section>
}
