import { describe, expect, it } from 'vitest'
import type { CommercialToolContracts } from '../src/application/commercial-tool-contracts'
import type { Conversation } from '../src/domain/conversations/conversation'
import { requestHumanEscalation, resolveHumanEscalation } from '../src/domain/conversations/human-escalation'
import type { Customer } from '../src/domain/customers/customer'
import { createOrder, createOrderItemSnapshot, type Order } from '../src/domain/orders/order'
import { canTransitionOrder, transitionOrder } from '../src/domain/orders/order-lifecycle'
import { approvePayment, markPaymentProofUnderReview, rejectPaymentProof, submitPaymentProof } from '../src/domain/orders/payment'
import { managedRevenue, managementFee, type SalesAttribution } from '../src/domain/orders/sales-attribution'

const attribution: SalesAttribution = { source: 'web', managed: true, managedBy: 'automation', automationAgent: 'ganobot', conversationId: 'conversation-1' }
const item = createOrderItemSnapshot({ productId: 'product-1', variantId: 'variant-1', productName: 'Snapshot histórico', variantLabel: '30 ml', unitPrice: 10_000, quantity: 1, categoryId: 'facial', brandId: 'brand-1' })

function orderFixture(): Order {
  return createOrder({
    id: 'order-1', tenantId: 'tenant-1', customerId: 'customer-1', items: [item], currency: 'USD', discountTotal: 0,
    shippingTotal: 1_500, taxTotal: 0, attribution, commercialAgreement: { managementFeeBasisPoints: 500 },
    now: new Date('2026-01-01T00:00:00.000Z'),
  })
}

describe('commercial order lifecycle', () => {
  it('allows the complete operational path and synchronizes fulfillment', () => {
    let order = transitionOrder(orderFixture(), 'pending_payment')
    const submitted = submitPaymentProof(order, { id: 'proof-1' })
    order = approvePayment(submitted.order, submitted.proof).order
    for (const status of ['preparing', 'ready', 'dispatched', 'delivered'] as const) order = transitionOrder(order, status)
    expect(order.status).toBe('delivered')
    expect(order.paymentStatus).toBe('paid')
    expect(order.fulfillmentStatus).toBe('delivered')
  })

  it('rejects arbitrary or terminal transitions', () => {
    expect(canTransitionOrder('new', 'delivered')).toBe(false)
    expect(() => transitionOrder(orderFixture(), 'delivered')).toThrow('Transición de pedido inválida')
    const cancelled = transitionOrder(orderFixture(), 'cancelled')
    expect(() => transitionOrder(cancelled, 'new')).toThrow()
  })

  it('preserves item history independently and requires tenant identity', () => {
    const order = orderFixture()
    expect(order.tenantId).toBe('tenant-1')
    expect(order.items[0]).toEqual(item)
    expect(order.items[0]).not.toBe(item)
    expect(order.items[0]).not.toHaveProperty('unitCost')
  })
})

describe('payment verification', () => {
  it('treats proof reception as review, never as confirmed payment', () => {
    const waiting = transitionOrder(orderFixture(), 'pending_payment')
    const result = submitPaymentProof(waiting, { id: 'proof-1', externalReference: 'ref-1', now: new Date('2026-01-02T00:00:00.000Z') })
    expect(result.proof.status).toBe('received')
    expect(result.order.status).toBe('payment_review')
    expect(result.order.paymentStatus).toBe('proof_received')
    expect(result.order.paymentStatus).not.toBe('paid')
  })

  it('requires an explicit approval after review', () => {
    const submitted = submitPaymentProof(transitionOrder(orderFixture(), 'pending_payment'), { id: 'proof-1' })
    const reviewing = markPaymentProofUnderReview(submitted.order, submitted.proof)
    const approved = approvePayment(reviewing.order, reviewing.proof)
    expect(approved.proof.status).toBe('approved')
    expect(approved.order.status).toBe('paid')
    expect(approved.order.paymentStatus).toBe('paid')
  })

  it('returns a rejected proof to pending payment', () => {
    const submitted = submitPaymentProof(transitionOrder(orderFixture(), 'pending_payment'), { id: 'proof-1' })
    const rejected = rejectPaymentProof(submitted.order, submitted.proof)
    expect(rejected.proof.status).toBe('rejected')
    expect(rejected.order.status).toBe('pending_payment')
    expect(rejected.order.paymentStatus).toBe('rejected')
  })
})

describe('managed revenue and fee', () => {
  const amounts = (rate: number, managed = true) => ({ ...orderFixture(), attribution: { ...attribution, managed }, commercialAgreement: { managementFeeBasisPoints: rate } })
  it('calculates a 5% managed fee in integer cents', () => expect(managementFee(amounts(500))).toBe(500))
  it('calculates a 10% managed fee in integer cents', () => expect(managementFee(amounts(1_000))).toBe(1_000))
  it('returns zero revenue and fee for an unmanaged sale', () => {
    expect(managedRevenue(amounts(500, false))).toBe(0)
    expect(managementFee(amounts(500, false))).toBe(0)
  })
  it('excludes shipping and tax from the managed base', () => {
    const order = { ...amounts(500), shippingTotal: 50_000, taxTotal: 20_000 }
    expect(managementFee(order)).toBe(500)
  })
  it('deducts attributable discounts from the managed base', () => {
    const order = { ...amounts(500), discountTotal: 2_000 }
    expect(managedRevenue(order)).toBe(8_000)
    expect(managementFee(order)).toBe(400)
  })
})

describe('tenant CRM, escalation and future tool ports', () => {
  it('keeps minimal customer and conversation models tenant-scoped', () => {
    const customer: Customer = { id: 'customer-1', tenantId: 'tenant-1', name: 'Persona', phone: '+593000000', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' }
    const conversation: Conversation = { id: 'conversation-1', tenantId: customer.tenantId, customerId: customer.id, channel: 'whatsapp', status: 'automated', assignedMode: 'automation', automationAgent: 'ganobot', createdAt: customer.createdAt, updatedAt: customer.updatedAt }
    expect(conversation.tenantId).toBe(customer.tenantId)
  })

  it('opens and resolves a measurable human escalation', () => {
    const escalation = requestHumanEscalation({ id: 'escalation-1', tenantId: 'tenant-1', conversationId: 'conversation-1', reason: 'payment_issue', priority: 'high', now: new Date('2026-01-01T00:00:00.000Z') })
    expect(escalation.status).toBe('open')
    expect(resolveHumanEscalation(escalation, new Date('2026-01-02T00:00:00.000Z')).status).toBe('resolved')
  })

  it('keeps future GanoBot operations behind compile-time application contracts', () => {
    const methods: Array<keyof CommercialToolContracts> = [
      'searchProducts', 'getProduct', 'getAvailability', 'getCustomer', 'createCustomer',
      'createOrderDraft', 'createOrder', 'getOrder', 'submitPaymentProof', 'requestHumanEscalation',
    ]
    expect(methods).toHaveLength(10)
  })
})
