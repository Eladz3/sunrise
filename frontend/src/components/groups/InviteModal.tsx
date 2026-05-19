import { useState, useEffect } from 'react'
import { useGroupStore } from '@/stores/groupStore'
import { useAuthStore } from '@/stores/authStore'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-lg font-semibold text-gray-900 mb-1">Invite to {groupName}</h2>
        <p className="text-sm text-gray-500 mb-5">
          Share this link. Anyone with it can join the group.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="w-5 h-5 border-2 border-sunrise-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              readOnly
              value={inviteUrl ?? ''}
              className="flex-1 min-w-0 px-3 py-2.5 text-xs border border-gray-300 rounded-xl bg-gray-50 text-gray-600 focus:outline-none select-all"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              onClick={handleCopy}
              className={`shrink-0 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-sunrise-500 to-dawn-500 text-white hover:from-sunrise-600 hover:to-dawn-600'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
