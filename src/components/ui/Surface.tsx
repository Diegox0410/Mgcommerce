import type { HTMLAttributes, ReactNode } from 'react'

export function Badge({ children }: { children: ReactNode }) { return <span className="badge">{children}</span> }
export function Chip({ children }: { children: ReactNode }) { return <span className="chip">{children}</span> }
export function Card({ children, className = '', ...props }: HTMLAttributes<HTMLElement> & { children: ReactNode }) { return <article className={`card ${className}`} {...props}>{children}</article> }
export function Skeleton({ label = 'Cargando contenido' }: { label?: string }) { return <span className="skeleton" role="status" aria-label={label} /> }
export function LoadingState({ message = 'Cargando…' }: { message?: string }) { return <div className="state" role="status" aria-live="polite"><span className="spinner" aria-hidden="true" />{message}</div> }
export function EmptyState({ title, description }: { title: string; description: string }) { return <div className="empty-state"><span className="eyebrow">Sin contenido</span><h2>{title}</h2><p>{description}</p></div> }
