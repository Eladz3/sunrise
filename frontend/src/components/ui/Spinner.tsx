import { Icon } from '@/components/ui/Icon'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizes = { sm: 16, md: 32, lg: 48 }
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Icon name="spinner" size={sizes[size]} className="animate-spin text-sunrise-500" />
    </div>
  )
}
