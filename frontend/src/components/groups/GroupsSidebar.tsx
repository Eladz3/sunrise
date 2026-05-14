import { useState } from 'react'
import { useGroupStore } from '@/stores/groupStore'
import { useAuthStore } from '@/stores/authStore'
import { GroupCard } from './GroupCard'
import { GroupsEmptyState } from './GroupsEmptyState'
import { CreateGroupModal } from './CreateGroupModal'
import { DeleteGroupModal } from './DeleteGroupModal'
import { InviteModal } from './InviteModal'

export function GroupsSidebar() {
  const [showCreate, setShowCreate] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null)
  const [inviteTarget, setInviteTarget] = useState<{ id: number; name: string } | null>(null)

  const currentUserId = useAuthStore((s) => s.currentUserId)
  const groupIdsByUserId = useGroupStore((s) => s.groupIdsByUserId)
  const groupsById = useGroupStore((s) => s.groupsById)
  const selectedGroupId = useGroupStore((s) => s.selectedGroupId)
  const createGroup = useGroupStore((s) => s.createGroup)
  const deleteGroup = useGroupStore((s) => s.deleteGroup)

  const groupIds = currentUserId ? (groupIdsByUserId[currentUserId] ?? []) : []
  const groups = groupIds.map((id) => groupsById[id]).filter(Boolean)

  const handleCreate = async (name: string) => {
    if (!currentUserId) return
    await createGroup({ name, groupOwnerId: currentUserId })
    setShowCreate(false)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || !currentUserId) return
    await deleteGroup(deleteTarget.id, currentUserId)
    setDeleteTarget(null)
  }

  return (
    <>
      <aside className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Groups</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="p-1.5 rounded-full text-sunrise-600 hover:bg-sunrise-50 transition-colors"
            title="Create group"
            aria-label="Create new group"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* List or empty state */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
          {groups.length === 0 ? (
            <GroupsEmptyState />
          ) : (
            groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                isSelected={selectedGroupId === group.id}
                onDelete={(id) => setDeleteTarget({ id, name: group.name })}
                onInvite={(id) => setInviteTarget({ id, name: group.name })}
              />
            ))
          )}
        </div>

        {/* Create button pinned to bottom when list has items */}
        {groups.length > 0 && (
          <div className="px-2 pb-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => setShowCreate(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-sunrise-600 border border-dashed border-sunrise-300 hover:bg-sunrise-50 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New group
            </button>
          </div>
        )}
      </aside>

      {showCreate && (
        <CreateGroupModal onConfirm={handleCreate} onCancel={() => setShowCreate(false)} />
      )}

      {deleteTarget && (
        <DeleteGroupModal
          groupName={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {inviteTarget && (
        <InviteModal
          groupId={inviteTarget.id}
          groupName={inviteTarget.name}
          onClose={() => setInviteTarget(null)}
        />
      )}
    </>
  )
}
