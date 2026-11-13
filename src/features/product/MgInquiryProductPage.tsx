import { MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { PublicProduct } from '../../domain/products/product'
import { ProductGallery } from '../../components/commerce/ProductGallery'
import { mgInquiryLink } from '../../domain/products/mg-inquiry-link'

export function MgInquiryProductPage({ product }: { product: PublicProduct }) {
  return (
    <section className="product-page container">
      <nav className="breadcrumbs" aria-label="Migas de pan">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <Link to="/catalogo">Catálogo</Link>
        <span>/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className="product-layout">
        <ProductGallery images={product.images} />

        <aside className="purchase-panel">
          {product.taxonomy.brand && (
            <span className="product-brand">
              {product.taxonomy.brand.name}
            </span>
          )}

          <h1>{product.name}</h1>

          <p className="product-short">
            {product.shortDescription}
          </p>

          

          <div className="purchase-actions">
            <a
              className="button button--primary"
              href={mgInquiryLink(product)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} />
              Consultar por WhatsApp
            </a>
          </div>

          <p className="purchase-note">
            Consulta directamente con MG Salud y Belleza
            para recibir información sobre este producto.
          </p>
        </aside>
      </div>
    </section>
  )
}

