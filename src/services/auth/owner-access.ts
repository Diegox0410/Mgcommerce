import type { User } from 'firebase/auth'

export const configuredOwnerUid = (): string | null =>
  import.meta.env.VITE_OWNER_UID?.trim() || null

export const isOwner = (user: Pick<User, 'uid'> | null): boolean => {
  const ownerUid = configuredOwnerUid()
  return Boolean(user && ownerUid && user.uid === ownerUid)
}

export type AdminAccessState =
  | { status: 'unconfigured' }
  | { status: 'signed-out' }
  | { status: 'denied' }
  | { status: 'owner' }

export function resolveAdminAccess(user: Pick<User, 'uid'> | null): AdminAccessState {
  if (!configuredOwnerUid()) return { status: 'unconfigured' }
  if (!user) return { status: 'signed-out' }
  return isOwner(user) ? { status: 'owner' } : { status: 'denied' }
}
