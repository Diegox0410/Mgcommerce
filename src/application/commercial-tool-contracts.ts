import type { ConversationChannel } from '../domain/conversations/conversation'
import type { EscalationPriority, EscalationReason, HumanEscalation } from '../domain/conversations/human-escalation'
import type { Customer } from '../domain/customers/customer'
import type { OrderDraft } from '../domain/orders/order-draft'
import type { Order } from '../domain/orders/order'
import type { PaymentProof } from '../domain/orders/payment'
import type { PublicProduct } from '../domain/products/product'

export interface CommercialToolContext { tenantId: string; actorId?: string }
export interface ProductAvailability { productId: string; variantId?: string; available: boolean }

export interface CatalogCommercialTools {
  searchProducts(context: CommercialToolContext, query: string): Promise<PublicProduct[]>
  getProduct(context: CommercialToolContext, productId: string): Promise<PublicProduct | null>
  getAvailability(context: CommercialToolContext, productId: string, variantId?: string): Promise<ProductAvailability>
}

export interface CustomerCommercialTools {
  getCustomer(context: CommercialToolContext, customerId: string): Promise<Customer | null>
  createCustomer(context: CommercialToolContext, customer: Omit<Customer, 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<Customer>
}

export interface OrderCommercialTools {
  createOrderDraft(context: CommercialToolContext, input: unknown): Promise<OrderDraft>
  createOrder(context: CommercialToolContext, draft: OrderDraft): Promise<Order>
  getOrder(context: CommercialToolContext, orderId: string): Promise<Order | null>
  submitPaymentProof(context: CommercialToolContext, orderId: string, reference: string): Promise<PaymentProof>
}

export interface EscalationCommercialTools {
  requestHumanEscalation(context: CommercialToolContext, input: { conversationId: string; channel: ConversationChannel; reason: EscalationReason; priority: EscalationPriority }): Promise<HumanEscalation>
}

export interface CommercialToolContracts extends CatalogCommercialTools, CustomerCommercialTools, OrderCommercialTools, EscalationCommercialTools {}
