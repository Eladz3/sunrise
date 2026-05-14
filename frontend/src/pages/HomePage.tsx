import { useState, useEffect } from 'react'
import { GoalCard, Spinner } from '@/components'
import { useGroupStore } from '@/stores/groupStore'
import { useGoalStore } from '@/stores/goalStore'
import { groupGoalsByUser, calculateCommunityProgress } from '@/hooks/useCommunityGoals'
import type { Goal } from '@/types'

type HomeTab = 'byUser' | 'byGoal'

export function HomePage() {
  const [activeTab, setActiveTab] = useState<HomeTab>('byUser')

  const selectedGroupId = useGroupStore((s) => s.selectedGroupId)
  const groupsById = useGroupStore((s) => s.groupsById)
  const selectedGroup = selectedGroupId != null ? groupsById[selectedGroupId] : null

  const fetchGoalsByGroupId = useGoalStore((s) => s.fetchGoalsByGroupId)
  const goalIdsByGroupId = useGoalStore((s) => s.goalIdsByGroupId)
  const goalsById = useGoalStore((s) => s.goalsById)
  const loading = useGoalStore((s) => s.loading)
  const error = useGoalStore((s) => s.error)

  useEffect(() => {
    if (selectedGroupId != null) {
      fetchGoalsByGroupId(selectedGroupId)
    }
  }, [selectedGroupId, fetchGoalsByGroupId])

  const goalIds = selectedGroupId != null ? (goalIdsByGroupId[selectedGroupId] ?? []) : []
  const goals: Goal[] = goalIds.map((id) => goalsById[id]).filter((g): g is Goal => g !== undefined)

  const goalsByUser = groupGoalsByUser(goals)
  const communityProgress = calculateCommunityProgress(goals)

  if (loading && goals.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Group progress header */}
      <section className="rounded-2xl bg-gradient-to-br from-sunrise-500 via-dawn-500 to-rose-500 p-6 text-white shadow-lg">
        <h1 className="mb-1 text-center text-2xl font-bold">
          {selectedGroup ? selectedGroup.name : 'Community Progress'}
        </h1>
        <p className="mb-4 text-center text-sm text-sunrise-100">Rising together towards our goals</p>
        <div className="h-4 w-full rounded-full bg-white/30">
          <div
            className="h-4 rounded-full bg-white transition-all duration-500"
            style={{ width: `${communityProgress.percentage}%` }}
          />
        </div>
        <p className="mt-3 text-center text-lg font-semibold text-sunrise-100">
          {communityProgress.percentage}% complete
        </p>
      </section>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* No group selected state */}
      {selectedGroupId == null && (
        <div className="rounded-2xl bg-white p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sunrise-50">
            <svg className="h-8 w-8 text-sunrise-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">Select or create a group</p>
          <p className="mt-1 text-sm text-gray-400">Open the groups panel to get started.</p>
        </div>
      )}

      {selectedGroupId != null && (
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-4 flex rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab('byUser')}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                activeTab === 'byUser'
                  ? 'bg-white text-sunrise-600 shadow-sm'
                  : 'text-warmGray-500 hover:text-warmGray-700'
              }`}
            >
              By User
            </button>
            <button
              onClick={() => setActiveTab('byGoal')}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                activeTab === 'byGoal'
                  ? 'bg-white text-sunrise-600 shadow-sm'
                  : 'text-warmGray-500 hover:text-warmGray-700'
              }`}
            >
              By Goal
            </button>
          </div>

          {goals.length === 0 && (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p className="font-medium text-gray-600">No goals yet in this group</p>
              <p className="mt-1 text-sm text-gray-400">Members' goals will appear here.</p>
            </div>
          )}

          {activeTab === 'byUser' && goals.length > 0 && (
            <div className="space-y-6">
              {Object.entries(goalsByUser).map(([userName, userGoals]) => {
                const totalTarget = userGoals.reduce((sum, g) => sum + g.targetValue, 0)
                const totalCurrent = userGoals.reduce((sum, g) => sum + g.currentValue, 0)
                const userProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0

                return (
                  <div key={userName} className="space-y-3">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sunrise-400 to-dawn-500 font-medium text-white">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-700">{userName}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-sunrise-400 to-dawn-500 transition-all duration-300"
                          style={{ width: `${Math.min(100, userProgress)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{Math.round(userProgress)}% overall progress</p>
                    </div>

                    <div className="space-y-2 pl-4">
                      {userGoals.map((goal) => (
                        <GoalCard
                          key={goal.id}
                          title={goal.title}
                          currentValue={goal.currentValue}
                          targetValue={goal.targetValue}
                          unit={goal.unit}
                          category={goal.category}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'byGoal' && goals.length > 0 && (
            <div className="space-y-3">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  title={goal.title}
                  userName={goal.userName}
                  currentValue={goal.currentValue}
                  targetValue={goal.targetValue}
                  unit={goal.unit}
                  category={goal.category}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
