import { describe, expect, it } from 'vitest'
import {
  conversationFirestoreMapper, customerFirestoreMapper, humanEscalationFirestoreMapper,
  orderEventFirestoreMapper, orderFirestoreMapper, paymentProofFirestoreMapper,
} from '../src/adapters/firebase/firestore-mappers'
import { currentTenant } from '../src/config/current-tenant'
import type { Conversation } from '../src/domain/conversations/conversation'
import type { HumanEscalation } from '../src/domain/conversations/human-escalation'
import type { Customer } from '../src/domain/customers/customer'
import type { OrderEvent } from '../src/domain/orders/order-event'
import { createOrder, createOrderItemSnapshot } from '../src/domain/orders/order'
import type { PaymentProof } from '../src/domain/orders/payment'
import { publicProductsPath, publicStoreConfigPath, tenantCollectionPath, tenantDocumentPath, tenantPath } from '../src/services/firebase/firestore-paths'

const createdAt = '2026-03-01T12:00:00.000Z'
const timestamp = (iso: string) => ({ toDate: () => new Date(iso) })

describe('tenant Firestore paths', () => {
  it('centralizes the current tenant and builds private paths', () => {
    expect(currentTenant.id).toBe('mg-salud-belleza')
    expect(tenantPath(currentTenant.id)).toBe('tenants/mg-salud-belleza')
    expect(tenantCollectionPath(currentTenant.id, 'orders')).toBe('tenants/mg-salud-belleza/orders')
    expect(tenantDocumentPath(currentTenant.id, 'orders', 'order-1')).toBe('tenants/mg-salud-belleza/orders/order-1')
  })

  it('builds physically separate public paths and rejects path injection', () => {
    expect(publicProductsPath(currentTenant.id)).toBe('publicTenants/mg-salud-belleza/products')
    expect(publicStoreConfigPath(currentTenant.id)).toBe('publicTenants/mg-salud-belleza/storeConfig/main')
    expect(() => tenantPath('tenant/other')).toThrow('segmento Firestore válido')
  })
})

describe('Firestore mappers', () => {
  it('round-trips an order preserving cents, basis points, attribution and statuses', () => {
    const item = createOrderItemSnapshot({ productId: 'product-1', productName: 'Snapshot', unitPrice: 12_345, quantity: 2 })
    const order = createOrder({
      id: 'order-1', tenantId: currentTenant.id, customerId: 'customer-1', items: [item], discountTotal: 345,
      shippingTotal: 500, taxTotal: 0,
      attribution: { source: 'whatsapp', managed: true, managedBy: 'mixed', automationAgent: 'ganobot', conversationId: 'conversation-1' },
      commercialAgreement: { managementFeeBasisPoints: 500 }, now: new Date(createdAt),
    })
    const data = orderFirestoreMapper.toFirestore(order)
    expect(data).not.toHaveProperty('id')
    expect(data.createdAt).toBeInstanceOf(Date)
    const restored = orderFirestoreMapper.fromFirestore(order.id, { ...data, createdAt: timestamp(createdAt), updatedAt: timestamp(createdAt) })
    expect(restored).toEqual(order)
    expect(restored.items[0].unitPrice).toBe(12_345)
    expect(restored.commercialAgreement.managementFeeBasisPoints).toBe(500)
  })

  it('round-trips a tenant customer without adding PII fields', () => {
    const customer: Customer = { id: 'customer-1', tenantId: currentTenant.id, name: 'Persona', phone: '+593000000', source: 'web', createdAt, updatedAt: createdAt }
    const restored = customerFirestoreMapper.fromFirestore(customer.id, customerFirestoreMapper.toFirestore(customer))
    expect(restored).toEqual(customer)
    expect(Object.keys(restored).sort()).toEqual(['createdAt', 'id', 'name', 'phone', 'source', 'tenantId', 'updatedAt'])
  })

  it('preserves payment proof tenant, status and Timestamp conversion', () => {
    const proof: PaymentProof = { id: 'proof-1', tenantId: currentTenant.id, orderId: 'order-1', submittedAt: createdAt, status: 'under_review', externalReference: 'reference-1' }
    const data = paymentProofFirestoreMapper.toFirestore(proof)
    const restored = paymentProofFirestoreMapper.fromFirestore(proof.id, { ...data, submittedAt: timestamp(createdAt) })
    expect(restored).toEqual(proof)
  })

  it('maps conversation and escalation timestamps without Firebase types in domain', () => {
    const conversation: Conversation = { id: 'conversation-1', tenantId: currentTenant.id, customerId: 'customer-1', channel: 'whatsapp', status: 'human_required', assignedMode: 'human', createdAt, updatedAt: createdAt }
    const escalation: HumanEscalation = { id: 'escalation-1', tenantId: currentTenant.id, conversationId: conversation.id, reason: 'payment_issue', priority: 'high', status: 'resolved', createdAt, resolvedAt: createdAt }
    expect(conversationFirestoreMapper.fromFirestore(conversation.id, conversationFirestoreMapper.toFirestore(conversation))).toEqual(conversation)
    expect(humanEscalationFirestoreMapper.fromFirestore(escalation.id, humanEscalationFirestoreMapper.toFirestore(escalation))).toEqual(escalation)
  })

  it('maps order audit events with actor and tenant intact', () => {
    const event: OrderEvent = { id: 'event-1', tenantId: currentTenant.id, orderId: 'order-1', type: 'payment_approved', timestamp: createdAt, actor: { type: 'owner', id: 'owner-1' } }
    expect(orderEventFirestoreMapper.fromFirestore(event.id, orderEventFirestoreMapper.toFirestore(event))).toEqual(event)
  })
})
