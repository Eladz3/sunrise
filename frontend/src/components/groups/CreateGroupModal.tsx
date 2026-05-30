import { useState, useEffect } from 'react'
import { Button, Input, Modal } from '@/dls'

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
    <Modal isOpen={true} onClose={onCancel} title="Create a group" size="sm">
      <div className="p-4">
        <p className="mb-4 text-sm text-gray-500">Give your group a name to get started.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            placeholder="e.g., 2025 Goals Crew"
            error={error || undefined}
            autoFocus
          />
          <div className="flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1" loading={loading} disabled={!name.trim()}>
              Create
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
