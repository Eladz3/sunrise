import type { GroupMemberSummary } from '@/types'

interface UserProgressCardProps {
  member: GroupMemberSummary
}

export function UserProgressCard({ member }: UserProgressCardProps) {
  const { displayName, profilePhoto, completionPercentage } = member
  const progress = Math.min(100, Math.max(0, completionPercentage))

  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sunrise-400 to-dawn-500 overflow-hidden">
          {profilePhoto ? (
            <img src={profilePhoto} alt={displayName} className="h-full w-full object-cover" />
          ) : (
            <span className="font-medium text-white">{displayName.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <span className="font-medium text-gray-700">{displayName}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-sunrise-400 to-dawn-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">{Math.round(progress)}% overall progress</p>
    </div>
  )
}
