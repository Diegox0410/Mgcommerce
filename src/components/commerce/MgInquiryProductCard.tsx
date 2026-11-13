import { mgInquiryLink } from '../../domain/products/mg-inquiry-link'
import '../../styles/mg-inquiry-cards.css'
import { MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { PublicProduct } from '../../domain/products/product'
import { ProductMedia } from './ProductMedia'



export function MgInquiryProductCard({ product }: { product: PublicProduct }) {
  return (
    <article className="product-card mg-inquiry-card">
      <div className="product-card__visual">
        <Link to={`/producto/${product.slug}`} aria-label={`Ver ${product.name}`}>
          <ProductMedia image={product.images[0]} />
        </Link>
      </div>

      <div className="product-card__content">
        {product.taxonomy.brand && (
          <span>{product.taxonomy.brand.name}</span>
        )}

        <h3>
          <Link to={`/producto/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        <p>{product.shortDescription}</p>
        

        <a
          className="button button--primary mg-inquiry-card__button"
          href={mgInquiryLink(product)}
          target="_blank"
          rel="noopener noreferrer"
          
        >
          <MessageCircle size={17} />
          Consultar por WhatsApp
        </a>
      </div>
    </article>
  )
}


