import { useEffect } from 'react'
import { useStoreConfigStore } from '../stores/store-config-store'

export function usePageMeta(title?: string, description?: string): void {
  const site = useStoreConfigStore((state) => state.config.seo)
  useEffect(() => {
    document.title = title ? `${title} · MG` : site.title
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (meta) meta.content = description || site.description
    return () => { document.title = site.title; if (meta) meta.content = site.description }
  }, [description, site.description, site.title, title])
}
