import { useState } from 'react';
import { BottomTabNav } from './BottomTabNav';
import { GroupsSidebar, MobileGroupsDrawer } from '@/components/groups';
import { HomePage } from '@/pages/HomePage';
import { MyGoalsPage } from '@/pages/MyGoalsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { useInviteJoin } from '@/hooks/useInviteJoin';
import type { Tab } from '@/types';

export function AppLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  useInviteJoin();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1 min-h-0">

        {/* Desktop sidebar — hidden on mobile */}
        <div className="hidden lg:flex lg:flex-col lg:w-56 xl:w-64 shrink-0 bg-white border-r border-gray-100 min-h-screen">
          <GroupsSidebar />
        </div>

        {/* Main content area */}
        <main className="flex-1 min-w-0 p-4 pb-24 lg:pb-6 overflow-y-auto">

          {/* Mobile hamburger — only shows on home tab and mobile */}
          {activeTab === 'home' && (
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 shadow-sm text-sm font-medium text-gray-700 hover:border-sunrise-300 transition-colors"
                aria-label="Open groups"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Groups
              </button>
            </div>
          )}

          <div className={activeTab !== 'home' ? 'hidden' : ''}>
            <HomePage />
          </div>
          <div className={activeTab !== 'goals' ? 'hidden' : ''}>
            <MyGoalsPage />
          </div>
          <div className={activeTab !== 'profile' ? 'hidden' : ''}>
            <ProfilePage />
          </div>
        </main>
      </div>

      {/* Mobile groups drawer */}
      <MobileGroupsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <BottomTabNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
