import { useState } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'
import { getIconNames } from '@/components/ui/icons'

export function IconLibrary() {
  const [search, setSearch] = useState('')
  const [iconColor, setIconColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#f8f8f8')
  const [copied, setCopied] = useState<string | null>(null)

  const allNames = getIconNames()
  const normalizedSearch = search.trim().toLowerCase().replace(/\s+/g, '-')
  const filtered = normalizedSearch ? allNames.filter((n) => n.toLowerCase().includes(normalizedSearch)) : allNames

  function copyName(name: string) {
    navigator.clipboard
      .writeText(name)
      .then(() => {
        setCopied(name)
        setTimeout(() => setCopied(null), 1500)
      })
      .catch(() => {})
  }

  return (
    <div className="space-y-3 px-4 py-3">
      <input type="text" placeholder="Search icons…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunrise-300" />

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <label className="flex cursor-pointer items-center gap-1.5">
          Icon
          <input type="color" value={iconColor} onChange={(e) => setIconColor(e.target.value)} className="h-6 w-6 cursor-pointer rounded border border-gray-200 bg-white p-0.5" />
        </label>
        <label className="flex cursor-pointer items-center gap-1.5">
          Background
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-6 w-6 cursor-pointer rounded border border-gray-200 bg-white p-0.5" />
        </label>
        <span className="ml-auto font-mono text-gray-400">
          {filtered.length} icon{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-5 gap-4">
          {filtered.map((name) => (
            <button key={name} onClick={() => copyName(name)} title={`Click to copy "${name}"`} className="flex flex-col items-center overflow-hidden rounded-xl border border-gray-100 transition-all hover:border-sunrise-300 hover:shadow-sm active:scale-95">
              <div className="flex w-full items-center justify-center py-8" style={{ backgroundColor: bgColor }}>
                <Icon name={name as IconName} size={28} color={iconColor} />
              </div>
              <span className={`w-full truncate px-1 py-1.5 text-center font-mono text-[9px] leading-tight transition-colors ${copied === name ? 'text-green-600' : 'text-gray-400'}`}>{copied === name ? '✓ copied' : name}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-gray-400">No icons match &ldquo;{search}&rdquo;</p>
      )}
    </div>
  )
}
