import { useState } from 'react'
import { useGroupStore } from '@/stores/groupStore'
import { useAuthStore } from '@/stores/authStore'
import { Button, IconButton, Input } from '@/dls'
import { GroupCard } from './GroupCard'
import { GroupsEmptyState } from './GroupsEmptyState'
import { GroupActionModal } from './GroupActionModal'
import { DeleteGroupModal } from './DeleteGroupModal'
import { InviteModal } from './InviteModal'

function IconPlus() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}

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
        <div className="flex items-center justify-between border-b border-gray-100 px-3 py-3">
          <h2 className="text-sm font-semibold text-gray-700">Groups</h2>
          <IconButton icon={<IconPlus />} label="Create new group" onClick={() => setShowGroupAction(true)} shape="circle" size="sm" className="text-sunrise-600 hover:bg-sunrise-50" />
        </div>

        <div className={`${compact ? 'max-h-96 overflow-y-auto' : 'flex-1 overflow-y-auto'} space-y-2 px-2 py-2`}>{groups.length === 0 ? <GroupsEmptyState /> : groups.map((group) => <GroupCard key={group.id} group={group} isSelected={selectedGroupId === group.id} onDelete={(id) => setDeleteTarget({ id, name: group.name })} onInvite={(id) => setInviteTarget({ id, name: group.name })} />)}</div>

        {groups.length > 0 && (
          <div className="border-t border-gray-100 px-2 pb-3 pt-2">
            <div className="flex gap-2">
              <Input
                type="text"
                value={joinInput}
                onChange={(e) => {
                  setJoinInput(e.target.value)
                  setJoinError('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleInlineJoin()}
                placeholder="Paste invite link…"
                error={joinError || undefined}
                className="text-xs"
              />
              <Button type="button" variant="outline" onClick={handleInlineJoin} disabled={joining || !joinInput.trim()}>
                {joining ? '…' : 'Join'}
              </Button>
            </div>
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
