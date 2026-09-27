import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { IconButton } from './IconButton'

interface OverlayProps { open: boolean; title: string; onClose: () => void; children: ReactNode }

function Overlay({ open, title, onClose, children, mode }: OverlayProps & { mode: 'dialog' | 'drawer' | 'sheet' }) {
  const panelRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    panel?.querySelector<HTMLElement>('input, button, a, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !panel) return
      const focusable = [...panel.querySelectorAll<HTMLElement>('input, button, a, select, textarea, [tabindex]:not([tabindex="-1"])')].filter((item) => !item.hasAttribute('disabled'))
      if (!focusable.length) return
      const first = focusable[0], last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKey)
    document.body.classList.add('is-locked')
    return () => { document.removeEventListener('keydown', handleKey); document.body.classList.remove('is-locked'); previous?.focus() }
  }, [open, onClose])
  if (!open) return null
  return <div className="overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section ref={panelRef} className={`overlay__panel overlay__panel--${mode}`} role="dialog" aria-modal="true" aria-label={title}><header><h2>{title}</h2><IconButton aria-label="Cerrar" onClick={onClose}><X size={20} /></IconButton></header>{children}</section></div>
}

export const Dialog = (props: OverlayProps) => <Overlay {...props} mode="dialog" />
export const Drawer = (props: OverlayProps) => <Overlay {...props} mode="drawer" />
export const Sheet = (props: OverlayProps) => <Overlay {...props} mode="sheet" />
