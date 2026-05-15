import { useState } from 'react';
import { BottomTabNav } from './BottomTabNav';
import { HomePage } from '@/pages/HomePage';
import { MyGoalsPage } from '@/pages/MyGoalsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { useInviteJoin } from '@/hooks/useInviteJoin';
import type { Tab } from '@/types';

export function AppLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  useInviteJoin();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 min-w-0 pb-24 lg:pb-6 overflow-y-auto">
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
  );
}
