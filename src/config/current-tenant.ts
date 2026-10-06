export const currentTenant = {
  id: 'tenant-mg',
} as const

export type CurrentTenantId = typeof currentTenant.id
