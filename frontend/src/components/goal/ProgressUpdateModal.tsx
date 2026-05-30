import { useState, useEffect } from 'react'
import type { Goal } from '@/types'
import { Button, Modal, ProgressBar, Spinner } from '@/dls'

interface ProgressUpdateModalProps {
  goal: Goal | null
  isOpen: boolean
  onClose: () => void
  onSave: (goalId: number, newValue: number) => Promise<void>
}

export function ProgressUpdateModal({ goal, isOpen, onClose, onSave }: ProgressUpdateModalProps) {
  const [newValue, setNewValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setNewValue('')
      setIsLoading(false)
    }
  }, [isOpen])

  if (!goal) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newValue === '' || isNaN(Number(newValue))) return
    setIsLoading(true)
    try {
      await onSave(goal.id, Number(newValue))
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const handleIncrement = (amount: number) => {
    const current = newValue === '' ? goal.currentValue : Number(newValue)
    setNewValue(String(Math.max(0, current + amount)))
  }

  const showNewProgress = newValue !== '' && Number(newValue) !== goal.currentValue

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Progress">
      <div className="space-y-5 p-4">
        <p className="text-base text-gray-600">{goal.title}</p>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-500">Current</span>
            <span className="font-medium">
              {goal.currentValue.toLocaleString()} / {goal.targetValue.toLocaleString()} {goal.unit}
            </span>
          </div>
          <ProgressBar value={goal.currentValue} max={goal.targetValue} />

          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className={`font-medium ${showNewProgress ? 'text-emerald-600' : 'text-gray-300'}`}>New Progress</span>
              <span className={`font-medium ${showNewProgress ? 'text-emerald-600' : 'text-gray-300'}`}>{showNewProgress ? `${Number(newValue).toLocaleString()} / ${goal.targetValue.toLocaleString()} ${goal.unit}` : `— / ${goal.targetValue.toLocaleString()} ${goal.unit}`}</span>
            </div>
            <ProgressBar value={showNewProgress ? Number(newValue) : 0} max={goal.targetValue} variant="emerald" className={showNewProgress ? '' : 'opacity-30'} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="progress" className="mb-2 block text-sm font-medium text-gray-700">
              New total progress
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={() => handleIncrement(-1)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-300 text-lg font-medium text-gray-600 transition-colors hover:bg-gray-50 active:bg-gray-100">
                −
              </button>
              <input id="progress" type="number" min="0" placeholder={String(goal.currentValue)} value={newValue} onChange={(e) => setNewValue(e.target.value)} className="h-11 flex-1 rounded-xl border border-gray-300 text-center text-lg font-medium focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sunrise-500" />
              <button type="button" onClick={() => handleIncrement(1)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-300 text-lg font-medium text-gray-600 transition-colors hover:bg-gray-50 active:bg-gray-100">
                +
              </button>
            </div>
            <p className="mt-1 text-center text-xs text-gray-500">Enter your new total, not the increment</p>
          </div>

          <div className="flex justify-center gap-2">
            {[1, 5, 10].map((amount) => (
              <Button key={amount} type="button" variant="outline" size="sm" onClick={() => handleIncrement(amount)}>
                +{amount}
              </Button>
            ))}
          </div>

          <div className="pb-safe flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <button type="submit" disabled={isLoading || newValue === ''} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 font-medium text-white shadow-sm transition-all hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50">
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Update
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
