import { useAuth } from '@/hooks/useAuth'
import { Icon } from '@/components/ui/Icon'
import type { Tab } from '@/types'
import { BOTTOM_NAV_HEIGHT } from '@/constants/layout.constants'

interface BottomTabNavProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function BottomTabNav({ activeTab, onTabChange }: BottomTabNavProps) {
  const { user } = useAuth()
  const tabClass = (tab: Tab) => `flex-1 flex flex-col items-center justify-center py-2 text-sm font-medium transition-colors ${activeTab === tab ? 'text-sunrise-600 border-t-2 border-sunrise-500 bg-sunrise-50' : 'text-warmGray-500 hover:text-warmGray-700 hover:bg-warmGray-50 active:bg-warmGray-100'}`

  return (
    <nav className="safe-area-pb fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white" style={{ minHeight: BOTTOM_NAV_HEIGHT }}>
      <div className="flex h-full">
        <button onClick={() => onTabChange('home')} className={tabClass('home')}>
          <Icon name="home" size={24} className="mb-1" />
          Home
        </button>

        <button onClick={() => onTabChange('goals')} className={tabClass('goals')}>
          <Icon name="clipboard-check" size={24} className="mb-1" />
          My Goals
        </button>

        <button onClick={() => onTabChange('profile')} className={tabClass('profile')}>
          {user?.photoURL ? <img src={user.photoURL} alt={user.displayName || 'Profile'} className="mb-1 h-6 w-6 rounded-full object-cover" /> : <Icon name="user" size={24} className="mb-1" />}
          Profile
        </button>
      </div>
    </nav>
  )
}
