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
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Create a group</h2>
        <p className="text-sm text-gray-500 mb-5">Give your group a name to get started.</p>

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
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sunrise-500 focus:border-transparent text-base mb-1 ${
              error ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 px-4 py-2.5 text-white bg-gradient-to-r from-sunrise-500 to-dawn-500 rounded-xl hover:from-sunrise-600 hover:to-dawn-600 transition-all font-medium text-sm disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
