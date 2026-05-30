import React, { type FC } from 'react'
import { type IconName, getIcon, registerIcon, registerIcons } from './icons'

export type { IconName }
export { registerIcon, registerIcons }

export type IconProps = {
  name: IconName
  size?: number
  color?: string
  className?: string
  style?: React.CSSProperties
  'aria-label'?: string
}

const DEFAULT_SIZE = 16

export const Icon: FC<IconProps> = ({ name, size = DEFAULT_SIZE, color, className, style, 'aria-label': ariaLabel }) => {
  const element = getIcon(name)

  const sharedProps: React.SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    style: color ? { color, ...style } : style,
    className,
    'aria-label': ariaLabel,
    'aria-hidden': ariaLabel ? undefined : true,
    role: ariaLabel ? 'img' : undefined,
  }

  if (!element) {
    return (
      <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" {...sharedProps}>
        <path d="M8 1L15 15H1L8 1Z" fill="currentColor" fillRule="evenodd" />
      </svg>
    )
  }

  return React.cloneElement(element, sharedProps)
}
