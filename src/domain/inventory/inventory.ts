import type { EntityId, ISODateString } from '../shared/types'

export interface Inventory {
  productId: EntityId
  variantId?: EntityId
  available: number
  reserved: number
  minimumStock: number
  updatedAt: ISODateString
}

export type InventoryMovementType = 'receipt' | 'sale' | 'return' | 'adjustment'

export interface InventoryMovement {
  id: EntityId
  productId: EntityId
  variantId?: EntityId
  type: InventoryMovementType
  quantityDelta: number
  previousAvailable: number
  nextAvailable: number
  reason: string
  batchId?: EntityId
  createdAt: ISODateString
  actorId: EntityId
}

export interface InventoryBatch {
  id: EntityId
  movementIds: EntityId[]
  createdAt: ISODateString
  actorId: EntityId
}

export function applyInventoryDelta(current: Inventory, delta: number): Inventory {
  if (!Number.isInteger(delta)) throw new Error('El movimiento debe usar unidades enteras.')
  const next = current.available + delta
  if (next < 0) throw new Error('La operación no puede dejar stock negativo.')
  return { ...current, available: next, updatedAt: new Date().toISOString() }
}
