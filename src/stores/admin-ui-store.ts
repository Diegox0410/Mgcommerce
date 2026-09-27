import { create } from 'zustand'

interface AdminUiState {
  sidebarCollapsed: boolean
  mobileOpen: boolean
  toggleSidebar: () => void
  setMobileOpen: (open: boolean) => void
}

export const useAdminUiStore = create<AdminUiState>((set) => ({
  sidebarCollapsed: false,
  mobileOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setMobileOpen: (mobileOpen) => set({ mobileOpen }),
}))
