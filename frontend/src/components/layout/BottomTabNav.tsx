type Tab = 'home' | 'goals';

interface BottomTabNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function BottomTabNav({ activeTab, onTabChange }: BottomTabNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
      <div className="flex">
        <button
          onClick={() => onTabChange('home')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[56px] py-2 text-sm font-medium transition-colors ${
            activeTab === 'home'
              ? 'text-sunrise-600 border-t-2 border-sunrise-500 bg-sunrise-50'
              : 'text-warmGray-500 hover:text-warmGray-700 hover:bg-warmGray-50 active:bg-warmGray-100'
          }`}
        >
          <svg
            className="w-6 h-6 mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Home
        </button>
        <button
          onClick={() => onTabChange('goals')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[56px] py-2 text-sm font-medium transition-colors ${
            activeTab === 'goals'
              ? 'text-sunrise-600 border-t-2 border-sunrise-500 bg-sunrise-50'
              : 'text-warmGray-500 hover:text-warmGray-700 hover:bg-warmGray-50 active:bg-warmGray-100'
          }`}
        >
          <svg
            className="w-6 h-6 mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          My Goals
        </button>
      </div>
    </nav>
  );
}
