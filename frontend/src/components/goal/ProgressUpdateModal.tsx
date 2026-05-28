import { useState, useEffect } from 'react'
import type { Goal } from '@/types'

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

  if (!isOpen || !goal) return null

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

  const currentProgress = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0
  const newProgress = newValue !== '' && goal.targetValue > 0 ? (Number(newValue) / goal.targetValue) * 100 : currentProgress
  const showNewProgress = newValue !== '' && Number(newValue) !== goal.currentValue

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="animate-slide-up relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:mx-4 sm:max-w-md sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900">Log Progress</h2>
          </div>
          <button onClick={onClose} className="-mr-2 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600" aria-label="Close">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5 p-4">
          <p className="text-base text-gray-600">{goal.title}</p>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-500">Current</span>
              <span className="font-medium">
                {goal.currentValue.toLocaleString()} / {goal.targetValue.toLocaleString()} {goal.unit}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-warmGray-200">
              <div className="h-2 rounded-full bg-gradient-to-r from-sunrise-400 to-dawn-500 transition-all duration-300" style={{ width: `${Math.min(100, currentProgress)}%` }} />
            </div>

            <div className="mt-3">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className={`font-medium ${showNewProgress ? 'text-emerald-600' : 'text-gray-300'}`}>New Progress</span>
                <span className={`font-medium ${showNewProgress ? 'text-emerald-600' : 'text-gray-300'}`}>{showNewProgress ? `${Number(newValue).toLocaleString()} / ${goal.targetValue.toLocaleString()} ${goal.unit}` : `— / ${goal.targetValue.toLocaleString()} ${goal.unit}`}</span>
              </div>
              <div className={`h-2 w-full rounded-full ${showNewProgress ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                <div className={`h-2 rounded-full transition-all duration-300 ${showNewProgress ? 'bg-emerald-500' : 'bg-gray-200'}`} style={{ width: showNewProgress ? `${Math.min(100, newProgress)}%` : '0%' }} />
              </div>
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
                <button key={amount} type="button" onClick={() => handleIncrement(amount)} className="rounded-lg border border-gray-300 px-4 py-2 text-xs text-gray-600 transition-colors hover:bg-gray-50 active:bg-gray-100">
                  +{amount}
                </button>
              ))}
            </div>

            <div className="pb-safe flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose()
                  setNewValue('')
                }}
                disabled={isLoading}
                className="flex-1 rounded-xl bg-gray-100 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button type="submit" disabled={isLoading || newValue === ''} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 font-medium text-white shadow-sm transition-all hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50">
                {isLoading ? (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
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
      </div>
    </div>
  )
}
