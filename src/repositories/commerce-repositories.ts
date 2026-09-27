import type { Category, Brand, Collection, Concern } from '../domain/catalog/catalog'
import type { Customer } from '../domain/customers/customer'
import type { Conversation } from '../domain/conversations/conversation'
import type { HumanEscalation } from '../domain/conversations/human-escalation'
import type { Inventory, InventoryMovement } from '../domain/inventory/inventory'
import type { OrderEvent } from '../domain/orders/order-event'
import type { Order } from '../domain/orders/order'
import type { PaymentProof } from '../domain/orders/payment'
import type { Promotion } from '../domain/promotions/promotion'
import type { BusinessSettings } from '../domain/store/business-settings'
import type { StoreConfig } from '../domain/store/store-config'
import type { ReadRepository, Repository } from './repository'

export interface InventoryRepository extends ReadRepository<Inventory> {
  commit(movements: InventoryMovement[], batchId: string): Promise<Inventory[]>
}
export type OrderRepository = Repository<Order>
export type CustomerRepository = Repository<Customer>
export type PaymentProofRepository = Repository<PaymentProof>
export type ConversationRepository = Repository<Conversation>
export type HumanEscalationRepository = Repository<HumanEscalation>
export type OrderEventRepository = Repository<OrderEvent>
export type PromotionRepository = Repository<Promotion>
export type CategoryRepository = Repository<Category>
export type BrandRepository = Repository<Brand>
export type ConcernRepository = Repository<Concern>
export type CollectionRepository = Repository<Collection>
export interface StoreConfigRepository {
  get(): Promise<StoreConfig | null>
  save(config: StoreConfig): Promise<StoreConfig>
}
export interface BusinessSettingsRepository {
  get(): Promise<BusinessSettings | null>
  save(settings: BusinessSettings): Promise<BusinessSettings>
}
