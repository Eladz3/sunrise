import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import type { GoalCategory } from '@/constants/goal-category.constants'

type UiStore = {
  selectedGroupId: number | null
  sidebarOpen: boolean
  activeGoalCategory: GoalCategory | null

  setSelectedGroupId: (groupId: number | null) => void
  toggleSidebar: () => void
  setActiveGoalCategory: (category: GoalCategory | null) => void
}

export const useUiStore = create<UiStore>()(
  devtools(
    persist(
      (set) => ({
        selectedGroupId: null,
        sidebarOpen: false,
        activeGoalCategory: null,

        setSelectedGroupId: (groupId) => set({ selectedGroupId: groupId }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setActiveGoalCategory: (category) => set({ activeGoalCategory: category }),
      }),
      {
        name: 'ui-store',
        storage: createJSONStorage(() => localStorage),
      }
    ),
    { name: 'UiStore' }
  )
)
