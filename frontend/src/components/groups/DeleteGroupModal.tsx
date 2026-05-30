import { useState } from 'react'
import { Button, Modal } from '@/dls'

interface DeleteGroupModalProps {
  groupName: string
  onConfirm: () => Promise<void>
  onCancel: () => void
}

export function DeleteGroupModal({ groupName, onConfirm, onCancel }: DeleteGroupModalProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={true} onClose={onCancel} size="sm">
      <div className="p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Delete group?</h2>
        <p className="mb-6 text-sm text-gray-500">
          <span className="font-medium text-gray-700">"{groupName}"</span> will be permanently deleted. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button type="button" variant="ghost" className="flex-1" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <button onClick={handleConfirm} disabled={loading} className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 active:bg-red-700 disabled:opacity-50">
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
