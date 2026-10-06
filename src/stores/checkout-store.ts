import { create } from 'zustand'

export interface CheckoutReceipt {
  customer: {
    name: string
    phone: string
    email: string | null
  }
  shipping: {
    city: string
    address: string
    reference: string
  }
  paymentMethod: string
}

export interface CheckoutConfirmation {
  tenantId: string
  order: Record<string, unknown>
  receipt: CheckoutReceipt
}

interface CheckoutState {
  confirmation: CheckoutConfirmation | null
  complete: (confirmation: CheckoutConfirmation) => void
  consume: () => void
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  confirmation: null,
  complete: (confirmation) => set({ confirmation }),
  consume: () => set({ confirmation: null }),
}))