import { useState } from 'react'
import { BottomTabNav } from './BottomTabNav'
import { HomePage } from '@/pages/HomePage'
import { MyGoalsPage } from '@/pages/MyGoalsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { useInviteJoin } from '@/hooks/useInviteJoin'
import type { Tab } from '@/types'

export function AppLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  useInviteJoin()

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="min-w-0 flex-1 overflow-y-auto pb-24 lg:pb-6">
        <div className="container mx-auto py-4">
          <div className={activeTab !== 'home' ? 'hidden' : ''}>
            <HomePage />
          </div>
          <div className={activeTab !== 'goals' ? 'hidden' : ''}>
            <MyGoalsPage />
          </div>
          <div className={activeTab !== 'profile' ? 'hidden' : ''}>
            <ProfilePage />
          </div>
        </div>
      </main>
      <BottomTabNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
