import { useState } from 'react'
import { useGroupStore } from '@/stores/groupStore'
import { useAuthStore } from '@/stores/authStore'
import { Button, EmptyState, Input } from '@/dls'
import { CreateGroupModal } from './CreateGroupModal'

function IconGroup() {
  return (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

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
      <EmptyState
        icon={<IconGroup />}
        title="No groups yet"
        description="Create one or join with an invite link."
        className="py-6"
        action={
          <div className="w-full space-y-2">
            <Button variant="primary" className="w-full" onClick={() => setShowCreate(true)}>
              Create a group
            </Button>
            <div className="flex gap-2">
              <Input
                type="text"
                value={inviteInput}
                onChange={(e) => {
                  setInviteInput(e.target.value)
                  setJoinError('')
                }}
                placeholder="Paste invite link…"
                error={joinError || undefined}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                className="text-xs"
              />
              <Button type="button" variant="outline" onClick={handleJoin} disabled={joining || !inviteInput.trim()}>
                {joining ? '…' : 'Join'}
              </Button>
            </div>
          </div>
        }
      />

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
