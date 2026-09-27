import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../domain/cart/cart'
import { subtotal } from '../domain/products/pricing'

interface CartState {
  items: CartItem[]
  add: (item: CartItem) => void
  setQuantity: (productId: string, variantId: string | undefined, quantity: number) => void
  remove: (productId: string, variantId?: string) => void
  clear: () => void
}

const sameLine = (a: Pick<CartItem, 'productId' | 'variantId'>, b: Pick<CartItem, 'productId' | 'variantId'>) =>
  a.productId === b.productId && a.variantId === b.variantId

export const migrateCartState = (persisted: unknown): Pick<CartState, 'items'> => {
  const raw = persisted as { items?: unknown }
  const items = Array.isArray(raw?.items) ? raw.items.filter((item): item is CartItem => {
    if (!item || typeof item !== 'object') return false
    const value = item as Partial<CartItem>
    return typeof value.productId === 'string' && typeof value.name === 'string'
      && Number.isInteger(value.quantity) && Number(value.quantity) > 0
      && Number.isFinite(value.unitPrice) && Number(value.unitPrice) >= 0
  }) : []
  return { items }
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) => set((state) => {
        if (!Number.isInteger(item.quantity) || item.quantity < 1) return state
        const existing = state.items.find((line) => sameLine(line, item))
        return {
          items: existing
            ? state.items.map((line) => sameLine(line, item) ? { ...line, quantity: line.quantity + item.quantity } : line)
            : [...state.items, item],
        }
      }),
      setQuantity: (productId, variantId, quantity) => set((state) => ({
        items: quantity < 1
          ? state.items.filter((line) => !sameLine(line, { productId, variantId }))
          : state.items.map((line) => sameLine(line, { productId, variantId }) ? { ...line, quantity } : line),
      })),
      remove: (productId, variantId) => set((state) => ({
        items: state.items.filter((line) => !sameLine(line, { productId, variantId })),
      })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'mg-cart',
      version: 2,
      partialize: (state) => ({ items: state.items }),
      migrate: migrateCartState,
    },
  ),
)

export const selectCartCount = (state: CartState): number => state.items.reduce((total, item) => total + item.quantity, 0)
export const selectCartSubtotal = (state: CartState): number => subtotal(state.items)
export { sameLine as sameCartLine }
