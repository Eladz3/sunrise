import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type IconButtonVariant = 'ghost' | 'outline' | 'danger'
type IconButtonSize = 'sm' | 'md' | 'lg'
type IconButtonShape = 'square' | 'circle'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
  variant?: IconButtonVariant
  size?: IconButtonSize
  shape?: IconButtonShape
}

const variantStyles: Record<IconButtonVariant, string> = {
  ghost: 'text-warmGray-500 hover:text-slate-700 hover:bg-slate-100 focus:ring-sunrise-500',
  outline: 'border border-slate-200 text-slate-600 hover:bg-slate-50 focus:ring-sunrise-500',
  danger: 'text-red-500 hover:text-red-700 hover:bg-red-50 focus:ring-red-500',
}

const sizeStyles: Record<IconButtonSize, string> = {
  sm: 'h-7 w-7 p-1',
  md: 'h-9 w-9 p-2',
  lg: 'h-10 w-10 p-2.5',
}

const shapeStyles: Record<IconButtonShape, string> = {
  square: 'rounded-lg',
  circle: 'rounded-full',
}

export function IconButton({ icon, label, variant = 'ghost', size = 'md', shape = 'square', className = '', ...props }: IconButtonProps) {
  return (
    <button aria-label={label} className={`inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${shapeStyles[shape]} ${className}`} {...props}>
      {icon}
    </button>
  )
}
