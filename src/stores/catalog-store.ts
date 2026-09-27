import { create } from 'zustand'
import type { PublicProduct } from '../domain/products/product'

interface CatalogState {
  products: PublicProduct[]
  status: 'idle' | 'loading' | 'ready' | 'error'
  error: string | null
  load: (loader: () => Promise<PublicProduct[]>) => Promise<void>
  reset: () => void
}

export const useCatalogStore = create<CatalogState>((set) => ({
  products: [],
  status: 'idle',
  error: null,
  load: async (loader) => {
    set({ status: 'loading', error: null })
    try {
      set({ products: await loader(), status: 'ready' })
    } catch (error) {
      set({ status: 'error', error: error instanceof Error ? error.message : 'No se pudo cargar el catálogo.' })
    }
  },
  reset: () => set({ products: [], status: 'idle', error: null }),
}))
