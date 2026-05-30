import { useState, useEffect, useCallback } from 'react'
import { getAllGoals } from '@/api/goals.api'
import type { Goal } from '@/types'

interface UseCommunityGoalsResult {
  goals: Goal[]
  loading: boolean
  error: string | null
  refreshGoals: () => void
}

export function useCommunityGoals(): UseCommunityGoalsResult {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGoals = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllGoals()
      setGoals(data)
    } catch (err) {
      console.error('Error fetching community goals:', err)
      setError('Failed to load community data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  return { goals, loading, error, refreshGoals: fetchGoals }
}

export function calculateCommunityProgress(goals: Goal[]): {
  totalCurrent: number
  totalTarget: number
  percentage: number
} {
  const totalCurrent = goals.reduce((sum, g) => sum + g.currentValue, 0)
  const totalTarget = goals.reduce((sum, g) => sum + g.targetValue, 0)
  return {
    totalCurrent,
    totalTarget,
    percentage: totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0,
  }
}
