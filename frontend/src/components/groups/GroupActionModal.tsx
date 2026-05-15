import { useState } from 'react'
import { useGroupStore } from '@/stores/groupStore'
import { useAuthStore } from '@/stores/authStore'

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
      await createGroup({ name: trimmed, groupOwnerId: currentUserId })
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
    if (inviteInput.trim()) {
      handleJoin()
    } else if (name.trim()) {
      handleCreate()
    } else {
      setCreateError('Group name is required')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="mb-5 pr-6 text-base font-semibold text-gray-900">Create or join a group</h2>

        {/* Create section */}
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">Create</p>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setCreateError('') }}
          onKeyDown={handleKeyDown}
          placeholder="e.g., 2025 Goals Crew"
          autoFocus
          className={`mb-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sunrise-500 ${createError ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
        />
        {createError && <p className="mb-1 text-xs text-red-500">{createError}</p>}
        <button
          onClick={handleCreate}
          disabled={createLoading || !name.trim()}
          className="mb-5 w-full rounded-xl bg-gradient-to-r from-sunrise-500 to-dawn-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-sunrise-600 hover:to-dawn-600 disabled:opacity-50"
        >
          {createLoading ? 'Creating…' : 'Create group'}
        </button>

        <div className="mb-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Join section */}
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">Join with invite</p>
        <input
          type="text"
          value={inviteInput}
          onChange={(e) => { setInviteInput(e.target.value); setJoinError('') }}
          onKeyDown={handleKeyDown}
          placeholder="Paste invite link…"
          className={`mb-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sunrise-500 ${joinError ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
        />
        {joinError && <p className="mb-1 text-xs text-red-500">{joinError}</p>}
        <button
          onClick={handleJoin}
          disabled={joinLoading || !inviteInput.trim()}
          className="w-full rounded-xl border border-sunrise-300 px-4 py-2.5 text-sm font-medium text-sunrise-600 transition-colors hover:bg-sunrise-50 disabled:opacity-50"
        >
          {joinLoading ? 'Joining…' : 'Join group'}
        </button>
      </div>
    </div>
  )
}

function extractToken(input: string): string {
  try {
    return new URL(input).searchParams.get('join') ?? input
  } catch {
    return input
  }
}
