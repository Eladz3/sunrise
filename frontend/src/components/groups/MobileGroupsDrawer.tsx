import { Drawer, IconButton } from '@/dls'
import { GroupsSidebar } from './GroupsSidebar'

interface MobileGroupsDrawerProps {
  open: boolean
  onClose: () => void
}

function IconX() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export function MobileGroupsDrawer({ open, onClose }: MobileGroupsDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} side="left" width="w-72">
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
          <span className="font-semibold text-gray-800">Your Groups</span>
          <IconButton icon={<IconX />} label="Close groups drawer" onClick={onClose} shape="circle" size="sm" />
        </div>
        <div className="min-h-0 flex-1">
          <GroupsSidebar />
        </div>
      </div>
    </Drawer>
  )
}
