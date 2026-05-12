import { useState, useEffect, useCallback } from 'react'
import { getUserGoals, createGoal, updateGoal } from '@/services/resolutions'
import type { Resolution, GoalDocument } from '@/services/resolutions'

interface UseResolutionsResult {
  goals: Resolution[]
  loading: boolean
  error: string | null
  addGoal: (data: Omit<GoalDocument, 'current_value' | 'user_id'>) => Promise<void>
  editGoal: (id: string, data: Partial<GoalDocument>) => Promise<void>
  refreshGoals: () => Promise<void>
}

export function useResolutions(userId: string | null): UseResolutionsResult {
  const [goals, setGoals] = useState<Resolution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGoals = useCallback(async () => {
    if (!userId) {
      setGoals([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await getUserGoals(userId)
      setGoals(data)
    } catch (err) {
      setError('Failed to fetch goals')
      console.error('Error fetching goals:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const addGoal = useCallback(
    async (data: Omit<GoalDocument, 'current_value' | 'user_id'>) => {
      if (!userId) return

      const optimisticGoal: Resolution = {
        id: `temp-${Date.now()}`,
        ...data,
        user_id: userId,
        current_value: 0,
      }
      setGoals((prev) => [...prev, optimisticGoal])

      try {
        const newId = await createGoal({ ...data, user_id: userId })
        setGoals((prev) =>
          prev.map((r) => (r.id === optimisticGoal.id ? { ...r, id: newId } : r))
        )
      } catch (err) {
        setGoals((prev) => prev.filter((r) => r.id !== optimisticGoal.id))
        setError('Failed to create goal')
        console.error('Error creating goal:', err)
      }
    },
    [userId]
  )

  const editGoal = useCallback(
    async (id: string, data: Partial<GoalDocument>) => {
      const originalGoal = goals.find((r) => r.id === id)
      if (!originalGoal) return

      setGoals((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)))

      try {
        await updateGoal(id, data)
      } catch (err) {
        setGoals((prev) => prev.map((r) => (r.id === id ? originalGoal : r)))
        setError('Failed to update goal')
        console.error('Error updating goal:', err)
      }
    },
    [goals]
  )

  return {
    goals,
    loading,
    error,
    addGoal,
    editGoal,
    refreshGoals: fetchGoals,
  }
}
