export const privateTenantCollections = ['products', 'customers', 'orders', 'paymentProofs', 'conversations', 'humanEscalations', 'orderEvents', 'inventory', 'inventoryMovements', 'inventoryBatches', 'businessSettings'] as const
export type PrivateTenantCollection = typeof privateTenantCollections[number]

const segment = (value: string, label: string): string => {
  const normalized = value.trim()
  if (!normalized || normalized.includes('/')) throw new Error(`${label} no es un segmento Firestore válido.`)
  return normalized
}

export const tenantPath = (tenantId: string): string => `tenants/${segment(tenantId, 'tenantId')}`
export const tenantCollectionPath = (tenantId: string, collection: PrivateTenantCollection): string => `${tenantPath(tenantId)}/${collection}`
export const tenantDocumentPath = (tenantId: string, collection: PrivateTenantCollection, documentId: string): string => `${tenantCollectionPath(tenantId, collection)}/${segment(documentId, 'documentId')}`
export const publicProductsPath = (tenantId: string): string => `publicTenants/${segment(tenantId, 'tenantId')}/products`
export const publicStoreConfigPath = (tenantId: string): string => `publicTenants/${segment(tenantId, 'tenantId')}/storeConfig/main`
