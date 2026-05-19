/**
 * entityWriter — single entry point for writing confirmed server data into stores.
 *
 * Each write method:
 *   1. Routes to the correct store's upsert method
 *   2. That upsert maintains both the entity map AND all index lists,
 *      so every subscriber (including index-based hooks) re-renders correctly.
 *
 * Use this for external write-through (auth bootstrap, hooks making direct API
 * calls, etc.). Store-internal mutations call upsert* directly to avoid a
 * circular import.
 */

import { useGoalStore } from '@/stores/goalStore'
import { useGroupStore } from '@/stores/groupStore'
import { useUserStore } from '@/stores/userStore'
import type { Goal, GroupSummary, User } from '@/types'

export const entityWriter = {
  /**
   * Write a confirmed goal into the store.
   * Pass `replacingId` when swapping out an optimistic temp entry (negative ID).
   */
  writeGoal(goal: Goal, opts?: { replacingId?: number }): void {
    useGoalStore.getState().upsertGoal(goal, opts)
  },

  /**
   * Write a confirmed group into the store.
   * Pass `userId` to also register the group in that user's group-ID index.
   */
  writeGroup(group: GroupSummary, opts?: { userId?: number }): void {
    useGroupStore.getState().upsertGroup(group, opts)
  },

  /**
   * Write a confirmed user into the store.
   * Automatically updates the firebaseUid → userId index and the fetch timestamp.
   */
  writeUser(user: User): void {
    useUserStore.getState().upsertUser(user)
  },
}
