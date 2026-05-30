import type { ReactNode } from 'react'

type TabsVariant = 'underline' | 'pill'

interface Tab {
  key: string
  label: string
  icon?: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (key: string) => void
  variant?: TabsVariant
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, variant = 'underline', className = '' }: TabsProps) {
  if (variant === 'pill') {
    return (
      <div role="tablist" className={`flex gap-1 rounded-xl bg-warmGray-100 p-1 ${className}`}>
        {tabs.map((tab) => (
          <button key={tab.key} role="tab" aria-selected={tab.key === activeTab} onClick={() => onChange(tab.key)} className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${tab.key === activeTab ? 'bg-white text-slate-800 shadow-sm' : 'text-warmGray-500 hover:text-slate-700'}`}>
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div role="tablist" className={`flex border-b border-slate-200 ${className}`}>
      {tabs.map((tab) => (
        <button key={tab.key} role="tab" aria-selected={tab.key === activeTab} onClick={() => onChange(tab.key)} className={`-mb-px inline-flex items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${tab.key === activeTab ? 'border-sunrise-500 text-sunrise-700' : 'border-transparent text-warmGray-500 hover:text-slate-700'}`}>
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
