import type { ReactNode } from 'react';

type TabsVariant = 'underline' | 'pill';

interface Tab {
  key: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (key: string) => void;
  variant?: TabsVariant;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, variant = 'underline', className = '' }: TabsProps) {
  if (variant === 'pill') {
    return (
      <div role="tablist" className={`flex bg-warmGray-100 rounded-xl p-1 gap-1 ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={tab.key === activeTab}
            onClick={() => onChange(tab.key)}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              tab.key === activeTab
                ? 'bg-white shadow-sm text-slate-800'
                : 'text-warmGray-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div role="tablist" className={`flex border-b border-slate-200 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={tab.key === activeTab}
          onClick={() => onChange(tab.key)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors -mb-px border-b-2 ${
            tab.key === activeTab
              ? 'border-sunrise-500 text-sunrise-700'
              : 'border-transparent text-warmGray-500 hover:text-slate-700'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
