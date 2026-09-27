import { create } from 'zustand'

interface StorefrontUiState {
  cartOpen: boolean
  searchOpen: boolean
  mobileNavOpen: boolean
  openCart: () => void
  closeCart: () => void
  openSearch: () => void
  closeSearch: () => void
  setMobileNavOpen: (open: boolean) => void
}

export const useStorefrontUiStore = create<StorefrontUiState>((set) => ({
  cartOpen: false,
  searchOpen: false,
  mobileNavOpen: false,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  openSearch: () => set({ searchOpen: true, mobileNavOpen: false }),
  closeSearch: () => set({ searchOpen: false }),
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
}))
