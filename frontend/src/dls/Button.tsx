import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  confirmed?: boolean
  confirmedLabel?: string
  confirmedIcon?: ReactNode
  children: ReactNode
}

const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-sunrise-500 to-dawn-500 text-white hover:from-sunrise-600 hover:to-dawn-600 focus:ring-sunrise-500 shadow-sm',
  secondary: 'bg-warmGray-600 text-white hover:bg-warmGray-700 focus:ring-warmGray-500',
  outline: 'border-2 border-sunrise-300 text-sunrise-700 hover:bg-sunrise-50 focus:ring-sunrise-500',
  ghost: 'text-warmGray-700 hover:bg-sunrise-50 focus:ring-sunrise-500',
}

const confirmedStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 focus:ring-emerald-500 shadow-sm',
  secondary: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
  outline: 'border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 focus:ring-emerald-500',
  ghost: 'text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

function DefaultCheckIcon() {
  return (
    <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className="-ml-1 mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}

export function Button({ variant = 'primary', size = 'md', loading = false, confirmed = false, confirmedLabel, confirmedIcon, disabled, className = '', children, ...props }: ButtonProps) {
  const isConfirmed = confirmed && !loading
  const activeVariant = isConfirmed ? confirmedStyles[variant] : variantStyles[variant]

  return (
    <button className={`${base} ${activeVariant} ${sizeStyles[size]} ${className}`} disabled={disabled || loading} {...props}>
      {loading ? (
        <>
          <SpinnerIcon />
          Loading...
        </>
      ) : isConfirmed ? (
        <>
          {confirmedIcon !== undefined ? confirmedIcon : <DefaultCheckIcon />}
          {confirmedLabel ?? children}
        </>
      ) : (
        children
      )}
    </button>
  )
}
