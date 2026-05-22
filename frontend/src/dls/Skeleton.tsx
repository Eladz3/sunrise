interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
}

export function Skeleton({
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded',
  className = '',
}: SkeletonProps) {
  return <div className={`bg-gray-200 animate-pulse ${width} ${height} ${rounded} ${className}`} />;
}
