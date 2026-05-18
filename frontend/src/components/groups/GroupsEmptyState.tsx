import { useState } from 'react'
import { useGroupStore } from '@/stores/groupStore'
import { useAuthStore } from '@/stores/authStore'
import { CreateGroupModal } from './CreateGroupModal'

export function GroupsEmptyState() {
  const [showCreate, setShowCreate] = useState(false)
  const [inviteInput, setInviteInput] = useState('')
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState('')

  const createGroup = useGroupStore((s) => s.createGroup)
  const joinGroupByToken = useGroupStore((s) => s.joinGroupByToken)
  const currentUserId = useAuthStore((s) => s.currentUserId)

  const handleCreate = async (name: string) => {
    if (!currentUserId) return
    await createGroup({ name, groupOwnerUserId: currentUserId })
    setShowCreate(false)
  }

  const handleJoin = async () => {
    if (!inviteInput.trim() || !currentUserId) return
    setJoining(true)
    setJoinError('')
    try {
      const token = extractToken(inviteInput.trim())
      await joinGroupByToken(token, currentUserId)
      setInviteInput('')
    } catch {
      setJoinError('Invalid or expired invite link.')
    } finally {
      setJoining(false)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center px-3 py-6 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sunrise-100">
          <svg className="h-6 w-6 text-sunrise-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="mb-1 text-sm font-semibold text-gray-800">No groups yet</p>
        <p className="mb-4 text-xs text-gray-500">Create one or join with an invite link.</p>

        <button onClick={() => setShowCreate(true)} className="mb-3 w-full rounded-xl bg-gradient-to-r from-sunrise-500 to-dawn-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-sunrise-600 hover:to-dawn-600">
          Create a group
        </button>

        <div className="w-full">
          <div className="flex gap-2">
            <input
              type="text"
              value={inviteInput}
              onChange={(e) => {
                setInviteInput(e.target.value)
                setJoinError('')
              }}
              placeholder="Paste invite link…"
              className={`min-w-0 flex-1 rounded-xl border px-3 py-2 text-xs focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sunrise-500 ${joinError ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
            <button onClick={handleJoin} disabled={joining || !inviteInput.trim()} className="shrink-0 rounded-xl border border-sunrise-300 px-3 py-2 text-xs font-medium text-sunrise-600 transition-colors hover:bg-sunrise-50 disabled:opacity-40">
              {joining ? '…' : 'Join'}
            </button>
          </div>
          {joinError && <p className="mt-1.5 text-xs text-red-500">{joinError}</p>}
        </div>
      </div>

      {showCreate && <CreateGroupModal onConfirm={handleCreate} onCancel={() => setShowCreate(false)} />}
    </>
  )
}

function extractToken(input: string): string {
  try {
    const url = new URL(input)
    const token = url.searchParams.get('join')
    if (token) return token
  } catch {
    // not a valid URL — treat the whole input as a raw token
  }
  return input
}
