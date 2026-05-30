import type { GroupMemberSummary } from '@/types'
import { Avatar, ProgressBar, Skeleton } from '@/dls'

export function UserProgressCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg bg-gray-50 p-4">
      <div className="mb-2 flex items-center gap-3">
        <Skeleton width="w-10" height="h-10" rounded="rounded-full" />
        <Skeleton width="w-32" height="h-4" />
      </div>
      <Skeleton height="h-2" rounded="rounded-full" />
      <Skeleton width="w-20" height="h-3" className="mt-1" />
    </div>
  )
}

interface UserProgressCardProps {
  member: GroupMemberSummary
}

export function UserProgressCard({ member }: UserProgressCardProps) {
  const { displayName, profilePhoto, completionPercentage } = member
  const progress = Math.min(100, Math.max(0, completionPercentage))

  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <div className="mb-2 flex items-center gap-3">
        <Avatar displayName={displayName} profilePhoto={profilePhoto} size="md" />
        <span className="font-medium text-gray-700">{displayName}</span>
      </div>
      <ProgressBar value={progress} max={100} />
      <p className="mt-1 text-xs text-gray-500">{Math.round(progress)}% overall progress</p>
    </div>
  )
}
