import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { GroupSummary } from '@/types'
import { useGroupStore } from '@/stores/groupStore'

interface GroupCardProps {
  group: GroupSummary
  isSelected: boolean
  onDelete: (groupId: number) => void
  onInvite: (groupId: number) => void
}

export function GroupCard({ group, isSelected, onDelete, onInvite }: GroupCardProps) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [popoverPos, setPopoverPos] = useState({ top: 0, right: 0 })
  const popoverRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const setSelectedGroup = useGroupStore((s) => s.setSelectedGroup)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (
        popoverRef.current && !popoverRef.current.contains(target) &&
        buttonRef.current && !buttonRef.current.contains(target)
      ) {
        setPopoverOpen(false)
      }
    }
    if (popoverOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [popoverOpen])

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation()
    if (!popoverOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPopoverPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    }
    setPopoverOpen((v) => !v)
  }

  const progress = Math.min(100, Math.max(0, group.aggregateProgress))

  return (
    <div
      className={`relative overflow-hidden rounded-xl border cursor-pointer transition-all ${
        isSelected
          ? 'border-sunrise-400 bg-sunrise-50 shadow-sm'
          : 'border-warmGray-200 bg-white hover:border-sunrise-200 hover:shadow-sm'
      }`}
      onClick={() => setSelectedGroup(group.id)}
    >
      {/* Card body */}
      <div className="px-3 pt-3 pb-4">
        {/* Header row: name + triple-dot */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">{group.name}</p>

          {/* Triple-dot button — popover portaled to body to escape overflow:hidden */}
          <button
            ref={buttonRef}
            onClick={handleToggle}
            className="shrink-0 p-1 -mr-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Group options"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>

        {/* Bottom row: avatars + member count */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex -space-x-2">
            {group.topMembers.map((member) => (
              <div
                key={member.userId}
                className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-gradient-to-br from-sunrise-400 to-dawn-500 flex items-center justify-center shrink-0"
                title={member.displayName}
              >
                {member.profilePhoto ? (
                  <img src={member.profilePhoto} alt={member.displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-[9px] font-bold">
                    {member.displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            ))}
          </div>
          <span className="text-xs text-gray-400">
            {group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}
          </span>
        </div>
      </div>

      {/* Integrated progress bar — bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-sunrise-400 to-dawn-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Popover — rendered in document.body via portal, positioned with fixed coords */}
      {popoverOpen && createPortal(
        <div
          ref={popoverRef}
          style={{ position: 'fixed', top: popoverPos.top, right: popoverPos.right }}
          className="w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-[9999] py-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => { setPopoverOpen(false); onInvite(group.id) }}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Invite members
          </button>
          {group.isOwner && (
            <button
              onClick={() => { setPopoverOpen(false); onDelete(group.id) }}
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete group
            </button>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}
