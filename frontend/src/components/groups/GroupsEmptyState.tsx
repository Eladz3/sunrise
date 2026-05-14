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
    await createGroup({ name, groupOwnerId: currentUserId })
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
      <div className="flex flex-col items-center text-center px-3 py-6">
        <div className="w-12 h-12 rounded-full bg-sunrise-100 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-sunrise-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-800 mb-1">No groups yet</p>
        <p className="text-xs text-gray-500 mb-4">Create one or join with an invite link.</p>

        <button
          onClick={() => setShowCreate(true)}
          className="w-full px-4 py-2.5 text-white bg-gradient-to-r from-sunrise-500 to-dawn-500 rounded-xl hover:from-sunrise-600 hover:to-dawn-600 transition-all font-medium text-sm shadow-sm mb-3"
        >
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
              className={`flex-1 min-w-0 px-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-sunrise-500 focus:border-transparent ${
                joinError ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
            <button
              onClick={handleJoin}
              disabled={joining || !inviteInput.trim()}
              className="shrink-0 px-3 py-2 text-sunrise-600 border border-sunrise-300 rounded-xl hover:bg-sunrise-50 transition-colors text-xs font-medium disabled:opacity-40"
            >
              {joining ? '…' : 'Join'}
            </button>
          </div>
          {joinError && <p className="text-xs text-red-500 mt-1.5">{joinError}</p>}
        </div>
      </div>

      {showCreate && (
        <CreateGroupModal onConfirm={handleCreate} onCancel={() => setShowCreate(false)} />
      )}
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
