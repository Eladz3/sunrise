import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react'

const baseClasses = 'w-full rounded-lg border px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 transition-colors'

const defaultClasses = 'border-slate-300 bg-white focus:border-sunrise-400 focus:ring-sunrise-500/20'
const errorClasses = 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-500/20'

interface InputBaseProps {
  label?: string
  error?: string
  hint?: string
  wrapperClass?: string
}

export type InputProps = InputBaseProps & InputHTMLAttributes<HTMLInputElement>
export type TextareaInputProps = InputBaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>

function deriveId(id: string | undefined, label: string | undefined) {
  return id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
}

function FieldMeta({ error, hint }: { error?: string; hint?: string }) {
  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (hint) return <p className="text-sm text-slate-500">{hint}</p>
  return null
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, error, hint, wrapperClass = '', className = '', id, ...props }, ref) {
  const inputId = deriveId(id, label)
  return (
    <div className={`flex flex-col gap-1 ${wrapperClass}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input ref={ref} id={inputId} className={`${baseClasses} ${error ? errorClasses : defaultClasses} ${className}`} {...props} />
      <FieldMeta error={error} hint={hint} />
    </div>
  )
})

export const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(function TextareaInput({ label, error, hint, wrapperClass = '', className = '', id, rows = 3, ...props }, ref) {
  const inputId = deriveId(id, label)
  return (
    <div className={`flex flex-col gap-1 ${wrapperClass}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <textarea ref={ref} id={inputId} rows={rows} className={`${baseClasses} resize-vertical ${error ? errorClasses : defaultClasses} ${className}`} {...props} />
      <FieldMeta error={error} hint={hint} />
    </div>
  )
})
