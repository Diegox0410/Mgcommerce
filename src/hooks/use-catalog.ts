import { useEffect } from 'react'
import { publicCatalogRepository } from '../repositories/chopify-public-catalog-repository'
import { useCatalogStore } from '../stores/catalog-store'

export function useCatalogBootstrap(): void {
  const status = useCatalogStore((state) => state.status)
  const load = useCatalogStore((state) => state.load)
  useEffect(() => {
    if (status === 'idle') void load(() => publicCatalogRepository.list())
  }, [load, status])
}
