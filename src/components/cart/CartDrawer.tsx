import { ArrowRight, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatMoney, lineTotal } from '../../domain/products/pricing'
import { selectCartCount, selectCartSubtotal, useCartStore } from '../../stores/cart-store'
import { useStorefrontUiStore } from '../../stores/storefront-ui-store'
import { Drawer } from '../ui/Overlays'
import { IconButton } from '../ui/IconButton'
import { ProductMedia } from '../commerce/ProductMedia'
import { QuantitySelector } from '../commerce/QuantitySelector'

export function CartDrawer() {
  const open = useStorefrontUiStore((state) => state.cartOpen)
  const close = useStorefrontUiStore((state) => state.closeCart)
  const items = useCartStore((state) => state.items)
  const count = useCartStore(selectCartCount)
  const total = useCartStore(selectCartSubtotal)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const remove = useCartStore((state) => state.remove)
  return <Drawer open={open} onClose={close} title={`Tu carrito · ${count}`}><div className="cart-drawer">{items.length === 0 ? <div className="cart-drawer__empty"><h3>Tu selección empieza aquí.</h3><p>Explora el catálogo SAMPLE y añade un producto.</p><Link className="button button--primary" to="/catalogo" onClick={close}>Descubrir productos</Link></div> : <><div className="cart-lines">{items.map((item) => <article className="cart-line" key={`${item.productId}-${item.variantId ?? ''}`}><Link to={`/producto/${item.slug}`} onClick={close}><ProductMedia image={{ id: 'cart', url: item.imageUrl ?? '', alt: item.name, sortOrder: 0, placeholderTone: item.imageTone }} /></Link><div className="cart-line__info"><Link to={`/producto/${item.slug}`} onClick={close}><strong>{item.name}</strong></Link>{item.variantName && <span>{item.variantName}</span>}<span>{formatMoney(item.unitPrice)}</span><QuantitySelector compact value={item.quantity} onChange={(quantity) => setQuantity(item.productId, item.variantId, quantity)} /></div><div className="cart-line__end"><IconButton aria-label={`Eliminar ${item.name}`} onClick={() => remove(item.productId, item.variantId)}><Trash2 size={16} /></IconButton><strong>{formatMoney(lineTotal(item.unitPrice, item.quantity))}</strong></div></article>)}</div><footer className="cart-drawer__footer"><div><span>Subtotal</span><strong>{formatMoney(total)}</strong></div><small>Envío e impuestos se definirán cuando exista configuración comercial real.</small><Link className="button button--primary" to="/checkout" onClick={close}>Finalizar compra <ArrowRight size={17} /></Link><Link className="button button--secondary" to="/carrito" onClick={close}>Ver carrito</Link></footer></>}</div></Drawer>
}
