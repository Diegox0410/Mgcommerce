import type { PublicProduct } from '../../domain/products/product'

export function VariantSelector({ variants, selectedId, onSelect }: { variants: PublicProduct['variants']; selectedId?: string; onSelect: (id: string) => void }) {
  if (!variants.length) return null
  return <fieldset className="variant-selector"><legend>Presentación</legend><div>{variants.map((variant) => { const detail = variant.attributes[Object.keys(variant.attributes)[0]]; return <button type="button" key={variant.id} className={selectedId === variant.id ? 'is-selected' : ''} aria-pressed={selectedId === variant.id} disabled={!variant.active} onClick={() => onSelect(variant.id)}><span>{variant.name}</span>{detail && detail !== variant.name && <small>{detail}</small>}</button> })}</div></fieldset>
}
