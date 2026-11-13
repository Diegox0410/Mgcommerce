import { useEffect } from 'react'
import { MgLocalCatalogRepository } from '../repositories/mg-local-catalog-repository'
import { useCatalogStore } from '../stores/catalog-store'

export function useCatalogBootstrap(): void {
  const status = useCatalogStore((state) => state.status)
  const load = useCatalogStore((state) => state.load)
  useEffect(() => {
    if (status === 'idle') void load(() => new MgLocalCatalogRepository().list())
  }, [load, status])
}
