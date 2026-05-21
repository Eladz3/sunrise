import { useState, useEffect } from 'react'
import type { Goal } from '@/types'
import { Icon } from '@/components/ui/Icon'

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
  const newProgress =
    newValue !== '' && goal.targetValue > 0
      ? (Number(newValue) / goal.targetValue) * 100
      : currentProgress
  const showNewProgress = newValue !== '' && Number(newValue) !== goal.currentValue

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md sm:mx-4 max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b z-10">
          <div className="flex items-center gap-2">
            <Icon name="trending-up" size={20} className="text-emerald-500" />
            <h2 className="text-lg font-semibold text-gray-900">Log Progress</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="p-4 space-y-5">
          <p className="text-base text-gray-600">{goal.title}</p>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-500">Current</span>
              <span className="font-medium">
                {goal.currentValue.toLocaleString()} / {goal.targetValue.toLocaleString()} {goal.unit}
              </span>
            </div>
            <div className="w-full bg-warmGray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-sunrise-400 to-dawn-500 transition-all duration-300"
                style={{ width: `${Math.min(100, currentProgress)}%` }}
              />
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className={`font-medium ${showNewProgress ? 'text-emerald-600' : 'text-gray-300'}`}>
                  New Progress
                </span>
                <span className={`font-medium ${showNewProgress ? 'text-emerald-600' : 'text-gray-300'}`}>
                  {showNewProgress
                    ? `${Number(newValue).toLocaleString()} / ${goal.targetValue.toLocaleString()} ${goal.unit}`
                    : `— / ${goal.targetValue.toLocaleString()} ${goal.unit}`}
                </span>
              </div>
              <div className={`w-full rounded-full h-2 ${showNewProgress ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${showNewProgress ? 'bg-emerald-500' : 'bg-gray-200'}`}
                  style={{ width: showNewProgress ? `${Math.min(100, newProgress)}%` : '0%' }}
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-2">
                New total progress
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleIncrement(-1)}
                  className="shrink-0 w-11 h-11 flex items-center justify-center border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors text-lg font-medium"
                >
                  −
                </button>
                <input
                  id="progress"
                  type="number"
                  min="0"
                  placeholder={String(goal.currentValue)}
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="flex-1 h-11 text-center text-lg font-medium border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sunrise-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => handleIncrement(1)}
                  className="shrink-0 w-11 h-11 flex items-center justify-center border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors text-lg font-medium"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-1">
                Enter your new total, not the increment
              </p>
            </div>

            <div className="flex gap-2 justify-center">
              {[1, 5, 10].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleIncrement(amount)}
                  className="px-4 py-2 text-xs border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  +{amount}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-2 pb-safe">
              <button
                type="button"
                onClick={() => { onClose(); setNewValue('') }}
                disabled={isLoading}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || newValue === ''}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isLoading ? (
                  <Icon name="spinner" size={16} className="animate-spin" />
                ) : (
                  <>
                    <Icon name="check-circle" size={16} />
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
