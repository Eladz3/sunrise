interface SkeletonProps {
  width?: string
  height?: string
  rounded?: string
  className?: string
}

export function Skeleton({ width = 'w-full', height = 'h-4', rounded = 'rounded', className = '' }: SkeletonProps) {
  return <div className={`animate-pulse bg-gray-200 ${width} ${height} ${rounded} ${className}`} />
}
