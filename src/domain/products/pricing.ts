import type { Product, PublicProduct } from './product'

export const validPrice = (value: number): boolean =>
  Number.isFinite(value) && value >= 0

export const effectivePrice = (
  regularPrice: number,
  promotionalPrice?: number,
): number => {
  if (!validPrice(regularPrice)) throw new Error('El precio regular no es válido.')
  if (promotionalPrice === undefined) return regularPrice
  if (!validPrice(promotionalPrice) || promotionalPrice > regularPrice) {
    throw new Error('El precio promocional debe ser válido y no superar el regular.')
  }
  return promotionalPrice
}

export const productPrice = (product: Product | PublicProduct): number | null => {
  if (product.regularPrice === null) return null
  return effectivePrice(product.regularPrice, product.promotionalPrice ?? undefined)
}

const cents = (amount: number): number => {
  if (!validPrice(amount)) throw new Error('El monto no es válido.')
  return Math.round((amount + Number.EPSILON) * 100)
}

export const fromCents = (value: number): number => value / 100

export const lineTotal = (unitPrice: number, quantity: number): number => {
  if (!Number.isInteger(quantity) || quantity < 0) throw new Error('La cantidad no es válida.')
  return fromCents(cents(unitPrice) * quantity)
}

export const subtotal = (lines: Array<{ unitPrice: number; quantity: number }>): number =>
  fromCents(lines.reduce((total, line) => total + cents(line.unitPrice) * line.quantity, 0))

export const discountAmount = (regularPrice: number, promotionalPrice?: number): number =>
  fromCents(cents(regularPrice) - cents(effectivePrice(regularPrice, promotionalPrice)))

export const discountPercent = (regularPrice: number, promotionalPrice?: number): number => {
  if (regularPrice === 0) return 0
  return Math.round((discountAmount(regularPrice, promotionalPrice) / regularPrice) * 100)
}

export const formatMoney = (amount: number): string =>
  new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(amount)
