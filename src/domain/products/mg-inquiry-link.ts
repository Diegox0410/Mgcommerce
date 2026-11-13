import type { PublicProduct } from './product'

export const mgInquiryLink = (product: PublicProduct): string => {
  const message = `¡Hola! 😊 Espero que estén muy bien.

Estuve viendo su catálogo de MG Salud & Belleza y me interesó el producto *${product.name}*.

¿Me podrían ayudar con información sobre su precio y disponibilidad, por favor?

¡Muchas gracias! ✨`
  return `https://wa.me/593988844851?text=${encodeURIComponent(message)}`
}