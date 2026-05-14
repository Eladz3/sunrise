import { useState, useEffect } from 'react'
import { GoalCard, Spinner } from '@/components'
import { GroupsSidebar, MobileGroupsDrawer, UserProgressCard } from '@/components/groups'
import { useGroupStore } from '@/stores/groupStore'
import { useGoalStore } from '@/stores/goalStore'
import { calculateCommunityProgress } from '@/hooks/useCommunityGoals'
import type { Goal } from '@/types'

type HomeTab = 'group' | 'goals'

export function HomePage() {
  const [activeTab, setActiveTab] = useState<HomeTab>('group')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const selectedGroupId = useGroupStore((s) => s.selectedGroupId)
  const groupsById = useGroupStore((s) => s.groupsById)
  const membersByGroupId = useGroupStore((s) => s.membersByGroupId)
  const fetchGroupMembersAsync = useGroupStore((s) => s.fetchGroupMembersAsync)
  const selectedGroup = selectedGroupId != null ? groupsById[selectedGroupId] : null

  const fetchGoalsByGroupId = useGoalStore((s) => s.fetchGoalsByGroupId)
  const goalIdsByGroupId = useGoalStore((s) => s.goalIdsByGroupId)
  const goalsById = useGoalStore((s) => s.goalsById)
  const loading = useGoalStore((s) => s.loading)
  const error = useGoalStore((s) => s.error)

  useEffect(() => {
    if (selectedGroupId != null) {
      fetchGoalsByGroupId(selectedGroupId)
      fetchGroupMembersAsync(selectedGroupId)
    }
  }, [selectedGroupId, fetchGoalsByGroupId, fetchGroupMembersAsync])

  const goalIds = selectedGroupId != null ? (goalIdsByGroupId[selectedGroupId] ?? []) : []
  const goals: Goal[] = goalIds.map((id) => goalsById[id]).filter((g): g is Goal => g !== undefined)
  const members = selectedGroupId != null ? (membersByGroupId[selectedGroupId] ?? []) : []

  const communityProgress = calculateCommunityProgress(goals)

  return (
    <div className="space-y-4">
      {/* Metrics banner — full width */}
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

      {/* Below banner: groups panel + content */}
      <div className="flex gap-4 items-start">

        {/* Desktop groups panel */}
        <div className="hidden lg:block w-56 xl:w-64 shrink-0 rounded-2xl bg-white shadow-sm overflow-hidden">
          <GroupsSidebar compact />
        </div>

        {/* Content column */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Mobile hamburger */}
          <div className="lg:hidden">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 shadow-sm text-sm font-medium text-gray-700 hover:border-sunrise-300 transition-colors"
              aria-label="Open groups"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Groups
            </button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {loading && goals.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" />
            </div>
          )}

          {!loading && selectedGroupId == null && (
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
                  onClick={() => setActiveTab('group')}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                    activeTab === 'group'
                      ? 'bg-white text-sunrise-600 shadow-sm'
                      : 'text-warmGray-500 hover:text-warmGray-700'
                  }`}
                >
                  Group
                </button>
                <button
                  onClick={() => setActiveTab('goals')}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                    activeTab === 'goals'
                      ? 'bg-white text-sunrise-600 shadow-sm'
                      : 'text-warmGray-500 hover:text-warmGray-700'
                  }`}
                >
                  Goals
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

              {activeTab === 'group' && members.length > 0 && (
                <div className="space-y-3">
                  {members.map((member) => (
                    <UserProgressCard key={member.userId} member={member} />
                  ))}
                </div>
              )}

              {activeTab === 'goals' && goals.length > 0 && (
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
      </div>

      <MobileGroupsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
