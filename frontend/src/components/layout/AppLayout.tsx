import { useState } from 'react';
import { BottomTabNav } from './BottomTabNav';
import { HomePage } from '@/pages/HomePage';
import { MyGoalsPage } from '@/pages/MyGoalsPage';
import { ProfilePage } from '@/pages/ProfilePage';

type Tab = 'home' | 'goals' | 'profile';

export function AppLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 p-4 pb-20">
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
      <BottomTabNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
