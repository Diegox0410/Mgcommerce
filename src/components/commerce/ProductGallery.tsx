import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { ProductImage } from '../../domain/products/product'
import { IconButton } from '../ui/IconButton'
import { ProductMedia } from './ProductMedia'

export function ProductGallery({ images, selectedImageId, onImageChange }: { images: ProductImage[]; selectedImageId?: string; onImageChange?: (id: string) => void }) {
  const initial = Math.max(0, images.findIndex((image) => image.id === selectedImageId))
  const [index, setIndex] = useState(initial)
  const select = (next: number) => { const safe = (next + images.length) % images.length; setIndex(safe); if (images[safe]) onImageChange?.(images[safe].id) }
  if (!images.length) return <ProductMedia className="gallery__main" />
  return <div className="gallery" onKeyDown={(event) => { if (event.key === 'ArrowLeft') select(index - 1); if (event.key === 'ArrowRight') select(index + 1) }} tabIndex={0} aria-label="Galería de producto"><div className="gallery__stage"><ProductMedia image={images[index]} className="gallery__main" priority /><div className="gallery__controls"><IconButton aria-label="Imagen anterior" onClick={() => select(index - 1)}><ChevronLeft /></IconButton><span>{index + 1} / {images.length}</span><IconButton aria-label="Imagen siguiente" onClick={() => select(index + 1)}><ChevronRight /></IconButton></div></div>{images.length > 1 && <div className="gallery__thumbs" aria-label="Miniaturas">{images.map((image, imageIndex) => <button key={image.id} aria-label={`Mostrar imagen ${imageIndex + 1}`} aria-current={index === imageIndex} onClick={() => select(imageIndex)}><ProductMedia image={image} /></button>)}</div>}</div>
}
