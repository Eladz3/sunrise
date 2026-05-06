/**
 * Home Page
 *
 * Community progress view with tabs for By User and By Goal.
 * Connected to Firestore with live updates.
 */

import { useState } from 'react'
import { GoalCard, Spinner } from '@/components'
import {
  useCommunityGoals,
  groupGoalsByUser,
  calculateCommunityProgress,
} from '@/hooks/useCommunityGoals'

type HomeTab = 'byUser' | 'byGoal'

export function HomePage() {
  const [activeTab, setActiveTab] = useState<HomeTab>('byUser')
  const { goals, loading, error } = useCommunityGoals()

  const goalsByUser = groupGoalsByUser(goals)
  const communityProgress = calculateCommunityProgress(goals)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="rounded-2xl bg-gradient-to-br from-sunrise-500 via-dawn-500 to-rose-500 p-6 text-white shadow-lg">
        <h1 className="mb-1 text-center text-2xl font-bold">
          Community Progress
        </h1>
        <p className="mb-4 text-center text-sm text-sunrise-100">
          Rising together towards our goals
        </p>
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

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Tab Section */}
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

        {/* Empty State */}
        {goals.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="font-medium text-gray-600">No goals yet</p>
            <p className="mt-1 text-sm text-gray-400">
              Be the first to add a goal!
            </p>
          </div>
        )}

        {/* Tab Content - By User */}
        {activeTab === 'byUser' && goals.length > 0 && (
          <div className="space-y-6">
            {Object.entries(goalsByUser).map(([userName, userGoals]) => {
              const totalTarget = userGoals.reduce(
                (sum, r) => sum + r.target_value,
                0
              )
              const totalCurrent = userGoals.reduce(
                (sum, r) => sum + r.current_value,
                0
              )
              const userProgress =
                totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0

              return (
                <div key={userName} className="space-y-3">
                  {/* User Header */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 font-medium text-gray-600">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-700">
                        {userName}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-green-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, userProgress)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {Math.round(userProgress)}% overall progress
                    </p>
                  </div>

                  {/* User's Goals */}
                  <div className="space-y-2 pl-4">
                    {userGoals.map((goal) => (
                      <GoalCard
                        key={goal.id}
                        title={goal.title}
                        current_value={goal.current_value}
                        target_value={goal.target_value}
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

        {/* Tab Content - By Goal */}
        {activeTab === 'byGoal' && goals.length > 0 && (
          <div className="space-y-3">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                title={goal.title}
                user_name={goal.user_name}
                current_value={goal.current_value}
                target_value={goal.target_value}
                unit={goal.unit}
                category={goal.category}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
