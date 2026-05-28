import { useState } from 'react'
import { GoalCard, Spinner } from '@/components'
import { GoalFormModal, type GoalFormData } from '@/components/goal/GoalFormModal'
import { ProgressUpdateModal } from '@/components/goal/ProgressUpdateModal'
import { useGoals } from '@/hooks/useGoals'
import { useUserMetrics } from '@/hooks/useUserMetrics'
import { useAuthStore } from '@/stores/authStore'

export function MyGoalsPage() {
  const { goals, loading, error, addGoal, editGoal } = useGoals()
  const currentUserId = useAuthStore((state) => state.currentUserId)
  const userMetrics = useUserMetrics(currentUserId)

  const overallProgress = (userMetrics?.progressPercentage ?? 0) * 100

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null)
  const [progressGoalId, setProgressGoalId] = useState<number | null>(null)

  const editingGoal = editingGoalId !== null ? goals.find((g) => g.id === editingGoalId) : null
  const progressGoal = progressGoalId !== null ? (goals.find((g) => g.id === progressGoalId) ?? null) : null

  const handleAddGoal = async (data: GoalFormData) => {
    await addGoal({
      title: data.title,
      description: data.description,
      category: data.category,
      targetValue: data.targetValue,
      unit: data.unit,
    })
  }

  const handleEditGoal = async (data: GoalFormData) => {
    if (editingGoalId === null) return
    await editGoal(editingGoalId, {
      title: data.title,
      description: data.description,
      category: data.category,
      targetValue: data.targetValue,
      unit: data.unit,
    })
  }

  const handleSubmit = async (data: GoalFormData) => {
    if (editingGoalId !== null) {
      await handleEditGoal(data)
    } else {
      await handleAddGoal(data)
    }
  }

  const handleSaveProgress = async (goalId: number, newValue: number) => {
    await editGoal(goalId, { currentValue: newValue })
  }

  const getInitialFormData = (): GoalFormData | undefined => {
    if (!editingGoal) return undefined
    return {
      title: editingGoal.title,
      description: editingGoal.description,
      category: editingGoal.category,
      targetValue: editingGoal.targetValue,
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
      <header className="rounded-2xl bg-gradient-to-br from-sunrise-500 via-dawn-500 to-rose-500 p-6 text-white shadow-lg">
        <h1 className="mb-1 text-2xl font-bold">My Goals</h1>
        <p className="mb-4 text-sm text-sunrise-100">Your path to a brighter you</p>

        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-sunrise-100">Overall Progress</span>
            <span className="font-semibold">{Math.round(overallProgress)}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-white/30">
            <div className="h-3 rounded-full bg-white transition-all duration-500" style={{ width: `${Math.min(100, overallProgress)}%` }} />
          </div>
        </div>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <section className="space-y-3">
        <h2 className="px-1 text-lg font-semibold text-gray-800">Your Goals ({goals.length})</h2>

        {goals.length === 0 ? (
          <button
            onClick={() => {
              setEditingGoalId(null)
              setIsModalOpen(true)
            }}
            className="w-full rounded-xl bg-white p-8 text-center shadow-sm transition-all hover:bg-sunrise-50 hover:shadow-md active:scale-95"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sunrise-50">
              <svg className="h-8 w-8 text-sunrise-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="mb-1 font-medium text-warmGray-700">No goals yet</p>
            <p className="text-sm text-warmGray-500">Tap here to add your first goal!</p>
          </button>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                title={goal.title}
                currentValue={goal.currentValue}
                targetValue={goal.targetValue}
                unit={goal.unit}
                category={goal.category}
                onEdit={() => {
                  setEditingGoalId(goal.id)
                  setIsModalOpen(true)
                }}
                onLogProgress={() => setProgressGoalId(goal.id)}
              />
            ))}
          </div>
        )}
      </section>

      <button
        onClick={() => {
          setEditingGoalId(null)
          setIsModalOpen(true)
        }}
        className="fixed bottom-20 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sunrise-500 to-dawn-500 text-2xl text-white shadow-lg transition-all hover:from-sunrise-600 hover:to-dawn-600"
        aria-label="Add new goal"
      >
        +
      </button>

      <GoalFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingGoalId(null)
        }}
        onSubmit={handleSubmit}
        initialData={getInitialFormData()}
        mode={editingGoalId !== null ? 'edit' : 'add'}
      />

      <ProgressUpdateModal goal={progressGoal} isOpen={progressGoalId !== null} onClose={() => setProgressGoalId(null)} onSave={handleSaveProgress} />
    </div>
  )
}
