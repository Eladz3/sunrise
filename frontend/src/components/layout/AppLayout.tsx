import { useState } from 'react';
import { BottomTabNav } from './BottomTabNav';
import { HomePage } from '@/pages/HomePage';
import { MyGoalsPage } from '@/pages/MyGoalsPage';

type Tab = 'home' | 'goals';

export function AppLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 p-4 pb-20">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'goals' && <MyGoalsPage />}
      </main>
      <BottomTabNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
