import { useState } from 'react'
import { useGroupStore } from '@/stores/groupStore'
import { useAuthStore } from '@/stores/authStore'
import { Button, Input, Modal } from '@/dls'

interface GroupActionModalProps {
  onClose: () => void
}

export function GroupActionModal({ onClose }: GroupActionModalProps) {
  const [name, setName] = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState('')

  const [inviteInput, setInviteInput] = useState('')
  const [joinLoading, setJoinLoading] = useState(false)
  const [joinError, setJoinError] = useState('')

  const currentUserId = useAuthStore((s) => s.currentUserId)
  const createGroup = useGroupStore((s) => s.createGroup)
  const joinGroupByToken = useGroupStore((s) => s.joinGroupByToken)

  const handleCreate = async () => {
    const trimmed = name.trim()
    if (!trimmed || !currentUserId) {
      setCreateError('Group name is required')
      return
    }
    setCreateLoading(true)
    try {
      await createGroup({ name: trimmed, groupOwnerUserId: currentUserId })
      onClose()
    } catch {
      setCreateError('Failed to create group. Please try again.')
      setCreateLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!inviteInput.trim() || !currentUserId) return
    setJoinLoading(true)
    setJoinError('')
    try {
      const token = extractToken(inviteInput.trim())
      await joinGroupByToken(token, currentUserId)
      onClose()
    } catch {
      setJoinError('Invalid or expired invite link.')
      setJoinLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return
    if (inviteInput.trim()) handleJoin()
    else if (name.trim()) handleCreate()
    else setCreateError('Group name is required')
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Create or join a group" size="sm">
      <div className="space-y-4 p-4">
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">Create</p>
          <Input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setCreateError('')
            }}
            onKeyDown={handleKeyDown}
            placeholder="e.g., 2025 Goals Crew"
            error={createError || undefined}
            autoFocus
          />
        </div>
        <Button variant="primary" className="w-full" onClick={handleCreate} disabled={createLoading || !name.trim()} loading={createLoading}>
          Create group
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">Join with invite</p>
          <Input
            type="text"
            value={inviteInput}
            onChange={(e) => {
              setInviteInput(e.target.value)
              setJoinError('')
            }}
            onKeyDown={handleKeyDown}
            placeholder="Paste invite link…"
            error={joinError || undefined}
          />
        </div>
        <Button variant="outline" className="w-full" onClick={handleJoin} disabled={joinLoading || !inviteInput.trim()} loading={joinLoading}>
          Join group
        </Button>
      </div>
    </Modal>
  )
}

function extractToken(input: string): string {
  try {
    return new URL(input).searchParams.get('join') ?? input
  } catch {
    return input
  }
}
