import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, type Firestore } from 'firebase/firestore'
import type { Conversation } from '../../domain/conversations/conversation'
import type { HumanEscalation } from '../../domain/conversations/human-escalation'
import type { Customer } from '../../domain/customers/customer'
import type { OrderEvent } from '../../domain/orders/order-event'
import type { Order } from '../../domain/orders/order'
import type { PaymentProof } from '../../domain/orders/payment'
import type { Repository } from '../../repositories/repository'
import { tenantCollectionPath, tenantDocumentPath, type PrivateTenantCollection } from '../../services/firebase/firestore-paths'
import {
  conversationFirestoreMapper, customerFirestoreMapper, humanEscalationFirestoreMapper,
  orderEventFirestoreMapper, orderFirestoreMapper, paymentProofFirestoreMapper,
  type FirestoreData, type FirestoreMapper,
} from './firestore-mappers'

interface TenantEntity { id: string; tenantId: string }

class FirestoreTenantRepository<T extends TenantEntity> implements Repository<T> {
  constructor(
    private readonly db: Firestore,
    private readonly tenantId: string,
    private readonly collectionName: PrivateTenantCollection,
    private readonly mapper: FirestoreMapper<T>,
  ) {}

  async getById(id: string): Promise<T | null> {
    const snapshot = await getDoc(doc(this.db, tenantDocumentPath(this.tenantId, this.collectionName, id)))
    return snapshot.exists() ? this.restore(snapshot.id, snapshot.data() as FirestoreData) : null
  }

  async list(): Promise<T[]> {
    const snapshot = await getDocs(collection(this.db, tenantCollectionPath(this.tenantId, this.collectionName)))
    return snapshot.docs.map((item) => this.restore(item.id, item.data() as FirestoreData))
  }

  async save(entity: T): Promise<T> {
    if (entity.tenantId !== this.tenantId) throw new Error('La entidad no pertenece al tenant del repositorio.')
    await setDoc(doc(this.db, tenantDocumentPath(this.tenantId, this.collectionName, entity.id)), this.mapper.toFirestore(entity))
    return entity
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.db, tenantDocumentPath(this.tenantId, this.collectionName, id)))
  }

  private restore(id: string, data: FirestoreData): T {
    const entity = this.mapper.fromFirestore(id, data)
    if (entity.tenantId !== this.tenantId) throw new Error('El documento no coincide con el tenant del repositorio.')
    return entity
  }
}

export class FirestoreCustomerRepository extends FirestoreTenantRepository<Customer> {
  constructor(db: Firestore, tenantId: string) { super(db, tenantId, 'customers', customerFirestoreMapper) }
}
export class FirestoreOrderRepository extends FirestoreTenantRepository<Order> {
  constructor(db: Firestore, tenantId: string) { super(db, tenantId, 'orders', orderFirestoreMapper) }
}
export class FirestorePaymentProofRepository extends FirestoreTenantRepository<PaymentProof> {
  constructor(db: Firestore, tenantId: string) { super(db, tenantId, 'paymentProofs', paymentProofFirestoreMapper) }
}
export class FirestoreConversationRepository extends FirestoreTenantRepository<Conversation> {
  constructor(db: Firestore, tenantId: string) { super(db, tenantId, 'conversations', conversationFirestoreMapper) }
}
export class FirestoreHumanEscalationRepository extends FirestoreTenantRepository<HumanEscalation> {
  constructor(db: Firestore, tenantId: string) { super(db, tenantId, 'humanEscalations', humanEscalationFirestoreMapper) }
}
export class FirestoreOrderEventRepository extends FirestoreTenantRepository<OrderEvent> {
  constructor(db: Firestore, tenantId: string) { super(db, tenantId, 'orderEvents', orderEventFirestoreMapper) }
}
