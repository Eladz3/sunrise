/**
 * useGoals Hook
 *
 * Manages goal state with Firestore sync and optimistic updates.
 */

import { useState, useEffect, useCallback } from 'react'
import {
  getUserGoals,
  createGoal,
  updateGoal,
  type Goal,
  type GoalDocument,
} from '@/services/goals'

interface UseGoalsResult {
  goals: Goal[]
  loading: boolean
  error: string | null
  addGoal: (
    data: Omit<GoalDocument, 'current_value' | 'user_id'>
  ) => Promise<void>
  editGoal: (id: string, data: Partial<GoalDocument>) => Promise<void>
  refreshGoals: () => Promise<void>
}

export function useGoals(userId: string | null): UseGoalsResult {
  const [goals, setGoals] = useState<Goal[]>([])
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

      // Optimistic update: add to local state immediately
      const optimisticGoal: Goal = {
        id: `temp-${Date.now()}`,
        ...data,
        user_id: userId,
        current_value: 0,
      }
      setGoals((prev) => [...prev, optimisticGoal])

      try {
        // Create in Firestore
        const newId = await createGoal({
          ...data,
          user_id: userId,
        })

        // Update local state with real ID
        setGoals((prev) =>
          prev.map((r) =>
            r.id === optimisticGoal.id ? { ...r, id: newId } : r
          )
        )
      } catch (err) {
        // Rollback on error
        setGoals((prev) => prev.filter((r) => r.id !== optimisticGoal.id))
        setError('Failed to create goal')
        console.error('Error creating goal:', err)
      }
    },
    [userId]
  )

  const editGoal = useCallback(
    async (id: string, data: Partial<GoalDocument>) => {
      // Store original for rollback
      const originalGoal = goals.find((r) => r.id === id)
      if (!originalGoal) return

      // Optimistic update
      setGoals((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)))

      try {
        await updateGoal(id, data)
      } catch (err) {
        // Rollback on error
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
