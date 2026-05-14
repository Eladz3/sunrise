import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useGroupStore } from '@/stores/groupStore'

const PENDING_INVITE_KEY = 'sunrise_pending_invite'

export function useInviteJoin() {
  const currentUserId = useAuthStore((s) => s.currentUserId)
  const joinGroupByToken = useGroupStore((s) => s.joinGroupByToken)

  // On mount: if URL has ?join=TOKEN, stash it and strip from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('join')
    if (!token) return

    localStorage.setItem(PENDING_INVITE_KEY, token)

    // Remove the query param without a page reload
    params.delete('join')
    const newSearch = params.toString()
    const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '')
    window.history.replaceState({}, '', newUrl)
  }, [])

  // Once authenticated, complete any pending join
  useEffect(() => {
    if (!currentUserId) return
    const token = localStorage.getItem(PENDING_INVITE_KEY)
    if (!token) return

    localStorage.removeItem(PENDING_INVITE_KEY)
    joinGroupByToken(token, currentUserId).catch((err) => {
      console.error('[Invite] Failed to join group:', err)
    })
  }, [currentUserId, joinGroupByToken])
}
