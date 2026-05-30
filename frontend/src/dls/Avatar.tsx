type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface SizeConfig {
  container: string
  text: string
}

const sizeMap: Record<AvatarSize, SizeConfig> = {
  xs: { container: 'w-6 h-6', text: 'text-[9px] font-bold' },
  sm: { container: 'w-8 h-8', text: 'text-xs font-bold' },
  md: { container: 'w-10 h-10', text: 'text-sm font-medium' },
  lg: { container: 'w-12 h-12', text: 'text-base font-medium' },
  xl: { container: 'w-16 h-16', text: 'text-xl font-medium' },
}

interface AvatarProps {
  displayName: string
  profilePhoto?: string | null
  size?: AvatarSize
  title?: string
  className?: string
}

export function Avatar({ displayName, profilePhoto, size = 'md', title, className = '' }: AvatarProps) {
  const { container, text } = sizeMap[size]
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div aria-label={displayName} title={title} className={`${container} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sunrise-400 to-dawn-500 ${className}`}>
      {profilePhoto ? <img src={profilePhoto} alt={displayName} className="h-full w-full object-cover" /> : <span className={`${text} text-white`}>{initial}</span>}
    </div>
  )
}
