import { useEffect } from 'react'
import { GroupsSidebar } from './GroupsSidebar'

interface MobileGroupsDrawerProps {
  open: boolean
  onClose: () => void
}

export function MobileGroupsDrawer({ open, onClose }: MobileGroupsDrawerProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div>
      {/* Backdrop */}
      <div className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`} onClick={onClose} />

      {/* Drawer panel */}
      <div className={`duration-250 fixed bottom-0 left-0 top-0 z-50 flex w-72 flex-col bg-white shadow-xl transition-transform ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Drawer header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
          <span className="font-semibold text-gray-800">Your Groups</span>
          <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600" aria-label="Close groups drawer">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar content fills the rest */}
        <div className="min-h-0 flex-1">
          <GroupsSidebar />
        </div>
      </div>
    </div>
  )
}
