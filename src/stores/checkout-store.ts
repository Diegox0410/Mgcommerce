import { create } from 'zustand'
import type { OrderDraft } from '../domain/orders/order-draft'

interface CheckoutState {
  completedDraft: OrderDraft | null
  complete: (draft: OrderDraft) => void
  consume: () => void
}

// Session memory only: customer information is never persisted in sample mode.
export const useCheckoutStore = create<CheckoutState>((set) => ({
  completedDraft: null,
  complete: (completedDraft) => set({ completedDraft }),
  consume: () => set({ completedDraft: null }),
}))
