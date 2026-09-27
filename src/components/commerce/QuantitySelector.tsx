import { Minus, Plus } from 'lucide-react'
import { IconButton } from '../ui/IconButton'

export function QuantitySelector({ value, onChange, disabled = false, compact = false }: { value: number; onChange: (quantity: number) => void; disabled?: boolean; compact?: boolean }) {
  return <div className={`quantity ${compact ? 'quantity--compact' : ''}`} aria-label="Cantidad"><IconButton aria-label="Reducir cantidad" disabled={disabled || value <= 1} onClick={() => onChange(Math.max(1, value - 1))}><Minus size={15} /></IconButton><output aria-live="polite" aria-label={`${value} unidades`}>{value}</output><IconButton aria-label="Aumentar cantidad" disabled={disabled} onClick={() => onChange(value + 1)}><Plus size={15} /></IconButton></div>
}
