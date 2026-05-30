import { useState, useEffect } from 'react'
import { useGroupStore } from '@/stores/groupStore'
import { useAuthStore } from '@/stores/authStore'
import { Button, Input, Modal, Spinner } from '@/dls'

interface InviteModalProps {
  groupId: number
  groupName: string
  onClose: () => void
}

export function InviteModal({ groupId, groupName, onClose }: InviteModalProps) {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const generateInviteToken = useGroupStore((s) => s.generateInviteToken)
  const currentUserId = useAuthStore((s) => s.currentUserId)

  useEffect(() => {
    if (!currentUserId) return
    generateInviteToken(groupId, currentUserId)
      .then((token) => {
        const url = `${window.location.origin}${window.location.pathname}?join=${token}`
        setInviteUrl(url)
      })
      .finally(() => setLoading(false))
  }, [groupId, currentUserId, generateInviteToken])

  const handleCopy = async () => {
    if (!inviteUrl) return
    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={`Invite to ${groupName}`} size="sm">
      <div className="space-y-4 p-4">
        <p className="text-sm text-gray-500">Share this link. Anyone with it can join the group.</p>

        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Spinner size="md" />
          </div>
        ) : (
          <div className="flex gap-2">
            <Input readOnly value={inviteUrl ?? ''} className="text-xs" onClick={(e) => (e.target as HTMLInputElement).select()} />
            <Button variant="primary" confirmed={copied} confirmedLabel="Copied!" onClick={handleCopy} className="shrink-0">
              Copy
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}
