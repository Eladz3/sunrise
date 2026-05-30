import { useState, useEffect } from 'react'

interface CreateGroupModalProps {
  onConfirm: (name: string) => Promise<void>
  onCancel: () => void
}

export function CreateGroupModal({ onConfirm, onCancel }: CreateGroupModalProps) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setName('')
    setError('')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Group name is required')
      return
    }
    setLoading(true)
    try {
      await onConfirm(trimmed)
    } catch {
      setError('Failed to create group. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-1 text-lg font-semibold text-gray-900">Create a group</h2>
        <p className="mb-5 text-sm text-gray-500">Give your group a name to get started.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            placeholder="e.g., 2025 Goals Crew"
            autoFocus
            className={`mb-1 w-full rounded-xl border px-4 py-3 text-base focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sunrise-500 ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
          />
          {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

          <div className="mt-4 flex gap-3">
            <button type="button" onClick={onCancel} disabled={loading} className="flex-1 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={loading || !name.trim()} className="flex-1 rounded-xl bg-gradient-to-r from-sunrise-500 to-dawn-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-sunrise-600 hover:to-dawn-600 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
