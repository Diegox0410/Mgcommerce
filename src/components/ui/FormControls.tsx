import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

interface FieldProps { label: string; error?: string; id: string }

export const Input = forwardRef<HTMLInputElement, FieldProps & InputHTMLAttributes<HTMLInputElement>>(
  ({ label, error, id, className = '', ...props }, ref) => (
    <label className="field" htmlFor={id}><span>{label}</span><input ref={ref} id={id} className={`control ${className}`} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props} />{error && <small id={`${id}-error`}>{error}</small>}</label>
  ),
)
Input.displayName = 'Input'

export function Select({ label, error, id, className = '', children, ...props }: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return <label className="field" htmlFor={id}><span>{label}</span><select id={id} className={`control ${className}`} aria-invalid={Boolean(error)} {...props}>{children}</select>{error && <small>{error}</small>}</label>
}

export function Textarea({ label, error, id, className = '', ...props }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <label className="field" htmlFor={id}><span>{label}</span><textarea id={id} className={`control ${className}`} aria-invalid={Boolean(error)} {...props} />{error && <small>{error}</small>}</label>
}
