import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export function RouteExperience() {
  const { pathname } = useLocation()
  const previous = useRef(pathname)
  useEffect(() => {
    if (previous.current !== pathname) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      document.getElementById('contenido')?.focus({ preventScroll: true })
      previous.current = pathname
    }
  }, [pathname])
  return null
}
