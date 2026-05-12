import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { getGroupsByUserId, createGroup as apiCreateGroup } from '@/api/groups.api';
import { isCacheStale } from '@/utils/cache';
import { normalizeById, extractIds } from '@/utils/normalize';
import type { Group, CreateGroupRequest } from '@/types/group.types';

type GroupStore = {
  groupsById: Record<number, Group>;
  groupIdsByUserId: Record<number, number[]>;
  userIdsByGroupId: Record<number, number[]>;

  loading: boolean;
  error: string | null;

  lastFetchedByUserId: Record<number, number>;

  fetchGroupsByUserId: (userId: number) => Promise<void>;
  createGroup: (request: CreateGroupRequest) => Promise<void>;
  upsertGroup: (group: Group) => void;
};

export const useGroupStore = create<GroupStore>()(
  devtools(
    subscribeWithSelector(
      (set, get) => ({
        groupsById: {},
        groupIdsByUserId: {},
        userIdsByGroupId: {},
        loading: false,
        error: null,
        lastFetchedByUserId: {},

        fetchGroupsByUserId: async (userId: number) => {
          const lastFetched = get().lastFetchedByUserId[userId];
          if (!isCacheStale(lastFetched, 'groups')) return;

          set({ loading: true, error: null });
          try {
            const groups = await getGroupsByUserId(userId);
            set((state) => ({
              groupsById: { ...state.groupsById, ...normalizeById(groups) },
              groupIdsByUserId: { ...state.groupIdsByUserId, [userId]: extractIds(groups) },
              lastFetchedByUserId: { ...state.lastFetchedByUserId, [userId]: Date.now() },
              loading: false,
            }));
          } catch (err) {
            set({ loading: false, error: (err as Error).message });
          }
        },

        createGroup: async (request: CreateGroupRequest) => {
          const group = await apiCreateGroup(request);
          get().upsertGroup(group);
        },

        upsertGroup: (group: Group) =>
          set((state) => ({
            groupsById: { ...state.groupsById, [group.id]: group },
          })),
      })
    ),
    { name: 'GroupStore' }
  )
);
