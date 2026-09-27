import type { ProductImage } from '../../domain/products/product'

export function ProductMedia({ image, secondary, className = '', priority = false }: { image?: ProductImage; secondary?: ProductImage; className?: string; priority?: boolean }) {
  return <div className={`product-media tone-${image?.placeholderTone ?? 'sage'} ${className}`}>
    {image?.url ? <img src={image.url} alt={image.alt} loading={priority ? 'eager' : 'lazy'} width="900" height="1125" /> : <div className="product-media__placeholder" role="img" aria-label={image?.alt || 'Imagen pendiente'}><span>MG</span><i /></div>}
    {secondary?.url && <img className="product-media__secondary" src={secondary.url} alt="" loading="lazy" width="900" height="1125" />}
  </div>
}
