import { useState } from 'react'
import { useGroupStore } from '@/stores/groupStore'
import { useAuthStore } from '@/stores/authStore'
import { GroupCard } from './GroupCard'
import { GroupsEmptyState } from './GroupsEmptyState'
import { GroupActionModal } from './GroupActionModal'
import { DeleteGroupModal } from './DeleteGroupModal'
import { InviteModal } from './InviteModal'

export function GroupsSidebar({ compact = false }: { compact?: boolean }) {
  const [showGroupAction, setShowGroupAction] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null)
  const [inviteTarget, setInviteTarget] = useState<{ id: number; name: string } | null>(null)

  const [joinInput, setJoinInput] = useState('')
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState('')

  const currentUserId = useAuthStore((s) => s.currentUserId)
  const groupIdsByUserId = useGroupStore((s) => s.groupIdsByUserId)
  const groupsById = useGroupStore((s) => s.groupsById)
  const selectedGroupId = useGroupStore((s) => s.selectedGroupId)
  const deleteGroup = useGroupStore((s) => s.deleteGroup)
  const joinGroupByToken = useGroupStore((s) => s.joinGroupByToken)

  const groupIds = currentUserId ? (groupIdsByUserId[currentUserId] ?? []) : []
  const groups = groupIds.map((id) => groupsById[id]).filter(Boolean)

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || !currentUserId) return
    await deleteGroup(deleteTarget.id, currentUserId)
    setDeleteTarget(null)
  }

  const handleInlineJoin = async () => {
    if (!joinInput.trim() || !currentUserId) return
    setJoining(true)
    setJoinError('')
    try {
      const token = extractToken(joinInput.trim())
      await joinGroupByToken(token, currentUserId)
      setJoinInput('')
    } catch {
      setJoinError('Invalid or expired invite link.')
    } finally {
      setJoining(false)
    }
  }

  return (
    <>
      <aside className={`flex flex-col ${compact ? '' : 'h-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-3 py-3">
          <h2 className="text-sm font-semibold text-gray-700">Groups</h2>
          <button onClick={() => setShowGroupAction(true)} className="rounded-full p-1.5 text-sunrise-600 transition-colors hover:bg-sunrise-50" title="Create group" aria-label="Create new group">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* List or empty state */}
        <div className={`${compact ? 'max-h-96 overflow-y-auto' : 'flex-1 overflow-y-auto'} space-y-2 px-2 py-2`}>{groups.length === 0 ? <GroupsEmptyState /> : groups.map((group) => <GroupCard key={group.id} group={group} isSelected={selectedGroupId === group.id} onDelete={(id) => setDeleteTarget({ id, name: group.name })} onInvite={(id) => setInviteTarget({ id, name: group.name })} />)}</div>

        {/* Inline join pinned to bottom when list has items */}
        {groups.length > 0 && (
          <div className="border-t border-gray-100 px-2 pb-3 pt-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={joinInput}
                onChange={(e) => {
                  setJoinInput(e.target.value)
                  setJoinError('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleInlineJoin()}
                placeholder="Paste invite link…"
                className={`min-w-0 flex-1 rounded-xl border px-3 py-2 text-xs focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sunrise-500 ${joinError ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              />
              <button onClick={handleInlineJoin} disabled={joining || !joinInput.trim()} className="shrink-0 rounded-xl border border-sunrise-300 px-3 py-2 text-xs font-medium text-sunrise-600 transition-colors hover:bg-sunrise-50 disabled:opacity-40">
                {joining ? '…' : 'Join'}
              </button>
            </div>
            {joinError && <p className="mt-1.5 text-xs text-red-500">{joinError}</p>}
          </div>
        )}
      </aside>

      {showGroupAction && <GroupActionModal onClose={() => setShowGroupAction(false)} />}

      {deleteTarget && <DeleteGroupModal groupName={deleteTarget.name} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />}

      {inviteTarget && <InviteModal groupId={inviteTarget.id} groupName={inviteTarget.name} onClose={() => setInviteTarget(null)} />}
    </>
  )
}

function extractToken(input: string): string {
  try {
    return new URL(input).searchParams.get('join') ?? input
  } catch {
    return input
  }
}
