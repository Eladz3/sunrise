/**
 * My Goals Page
 *
 * User's personal goals view with ability to add and edit goals.
 * Connected to Firestore with optimistic UI updates.
 */

import { useState } from 'react'
import { GoalCard, Spinner } from '@/components'
import {
  GoalFormModal,
  type GoalFormData,
} from '@/components/goal/GoalFormModal'
import { useAuth } from '@/hooks/useAuth'
import { useGoals } from '@/hooks/useGoals'

export function MyGoalsPage() {
  const { user } = useAuth()
  const { goals, loading, error, addGoal, editGoal } = useGoals(
    user?.uid ?? null
  )

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null)

  // Get the goal being edited
  const editingGoal = editingGoalId
    ? goals.find((r) => r.id === editingGoalId)
    : null

  // Calculate user's overall progress
  const totalTarget = goals.reduce((sum, r) => sum + r.target_value, 0)
  const totalCurrent = goals.reduce((sum, r) => sum + r.current_value, 0)
  const overallProgress =
    totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0

  const handleAddGoal = async (data: GoalFormData) => {
    if (!user) return

    await addGoal({
      title: data.title,
      description: data.description,
      category: data.category,
      target_value: data.target_value,
      unit: data.unit,
      user_name: user.displayName || 'Anonymous',
      user_email: user.email || '',
    })
  }

  const handleEditGoal = async (data: GoalFormData) => {
    if (!editingGoalId) return

    await editGoal(editingGoalId, {
      title: data.title,
      description: data.description,
      category: data.category,
      target_value: data.target_value,
      unit: data.unit,
    })
  }

  const handleSubmit = async (data: GoalFormData) => {
    if (editingGoalId) {
      await handleEditGoal(data)
    } else {
      await handleAddGoal(data)
    }
  }

  const openAddModal = () => {
    setEditingGoalId(null)
    setIsModalOpen(true)
  }

  const openEditModal = (goalId: string) => {
    setEditingGoalId(goalId)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingGoalId(null)
  }

  // Convert goal to form data for editing
  const getInitialFormData = (): GoalFormData | undefined => {
    if (!editingGoal) return undefined
    return {
      title: editingGoal.title,
      description: editingGoal.description,
      category: editingGoal.category,
      target_value: editingGoal.target_value,
      unit: editingGoal.unit,
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <header className="rounded-2xl bg-gradient-to-br from-sunrise-500 via-dawn-500 to-rose-500 p-6 text-white shadow-lg">
        <h1 className="mb-1 text-2xl font-bold">My Goals</h1>
        <p className="mb-4 text-sm text-sunrise-100">
          Your path to a brighter you
        </p>

        {/* Overall Progress Bar */}
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-sunrise-100">Overall Progress</span>
            <span className="font-semibold">
              {Math.round(overallProgress)}%
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-white/30">
            <div
              className="h-3 rounded-full bg-white transition-all duration-500"
              style={{ width: `${Math.min(100, overallProgress)}%` }}
            />
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Goals List */}
      <section className="space-y-3">
        <h2 className="px-1 text-lg font-semibold text-gray-800">
          Your Goals ({goals.length})
        </h2>

        {goals.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sunrise-50">
              <svg
                className="h-8 w-8 text-sunrise-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p className="mb-1 font-medium text-warmGray-700">No goals yet</p>
            <p className="text-sm text-warmGray-500">
              Tap the + button to add your first goal!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                title={goal.title}
                current_value={goal.current_value}
                target_value={goal.target_value}
                unit={goal.unit}
                category={goal.category}
                onEdit={() => openEditModal(goal.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Floating Action Button */}
      <button
        onClick={openAddModal}
        className="fixed bottom-20 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sunrise-500 to-dawn-500 text-2xl text-white shadow-lg transition-all hover:from-sunrise-600 hover:to-dawn-600"
        aria-label="Add new goal"
      >
        +
      </button>

      {/* Goal Form Modal (Add/Edit) */}
      <GoalFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initialData={getInitialFormData()}
        mode={editingGoalId ? 'edit' : 'add'}
      />
    </div>
  )
}
