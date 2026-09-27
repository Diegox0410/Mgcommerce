export type SalesSource = 'web' | 'whatsapp' | 'instagram' | 'facebook' | 'tiktok' | 'manual' | 'other'
export type ManagedBy = 'automation' | 'human' | 'mixed' | 'none'

export interface SalesAttribution {
  source: SalesSource
  managed: boolean
  managedBy: ManagedBy
  automationAgent?: string
  conversationId?: string
  campaignId?: string
}

export interface CommercialAgreementSnapshot { managementFeeBasisPoints: number }

export interface ManagedOrderAmounts {
  subtotal: number
  discountTotal: number
  shippingTotal: number
  taxTotal: number
  attribution: SalesAttribution
  commercialAgreement: CommercialAgreementSnapshot
}

export function managedRevenue(order: ManagedOrderAmounts): number {
  if (!order.attribution.managed) return 0
  return Math.max(0, order.subtotal - order.discountTotal)
}

export function managementFee(order: ManagedOrderAmounts): number {
  const rate = order.commercialAgreement.managementFeeBasisPoints
  if (!Number.isInteger(rate) || rate < 0 || rate > 10_000) throw new Error('La tarifa debe expresarse en basis points válidos.')
  // Managed base = net product revenue. Shipping and tax are pass-through values.
  return Math.round(managedRevenue(order) * rate / 10_000)
}
