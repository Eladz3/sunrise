/**
 * useResolutions Hook
 *
 * Manages resolution state with Firestore sync and optimistic updates.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getUserResolutions,
  createResolution,
  updateResolution,
  type Resolution,
  type ResolutionDocument,
} from '@/services/resolutions';

interface UseResolutionsResult {
  resolutions: Resolution[];
  loading: boolean;
  error: string | null;
  addResolution: (data: Omit<ResolutionDocument, 'current_value' | 'user_id'>) => Promise<void>;
  editResolution: (id: string, data: Partial<ResolutionDocument>) => Promise<void>;
  refreshResolutions: () => Promise<void>;
}

export function useResolutions(userId: string | null): UseResolutionsResult {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResolutions = useCallback(async () => {
    if (!userId) {
      setResolutions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getUserResolutions(userId);
      setResolutions(data);
    } catch (err) {
      setError('Failed to fetch resolutions');
      console.error('Error fetching resolutions:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchResolutions();
  }, [fetchResolutions]);

  const addResolution = useCallback(
    async (data: Omit<ResolutionDocument, 'current_value' | 'user_id'>) => {
      if (!userId) return;

      // Optimistic update: add to local state immediately
      const optimisticResolution: Resolution = {
        id: `temp-${Date.now()}`,
        ...data,
        user_id: userId,
        current_value: 0,
      };
      setResolutions((prev) => [...prev, optimisticResolution]);

      try {
        // Create in Firestore
        const newId = await createResolution({
          ...data,
          user_id: userId,
        });

        // Update local state with real ID
        setResolutions((prev) =>
          prev.map((r) =>
            r.id === optimisticResolution.id ? { ...r, id: newId } : r
          )
        );
      } catch (err) {
        // Rollback on error
        setResolutions((prev) =>
          prev.filter((r) => r.id !== optimisticResolution.id)
        );
        setError('Failed to create resolution');
        console.error('Error creating resolution:', err);
      }
    },
    [userId]
  );

  const editResolution = useCallback(
    async (id: string, data: Partial<ResolutionDocument>) => {
      // Store original for rollback
      const originalResolution = resolutions.find((r) => r.id === id);
      if (!originalResolution) return;

      // Optimistic update
      setResolutions((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...data } : r))
      );

      try {
        await updateResolution(id, data);
      } catch (err) {
        // Rollback on error
        setResolutions((prev) =>
          prev.map((r) => (r.id === id ? originalResolution : r))
        );
        setError('Failed to update resolution');
        console.error('Error updating resolution:', err);
      }
    },
    [resolutions]
  );

  return {
    resolutions,
    loading,
    error,
    addResolution,
    editResolution,
    refreshResolutions: fetchResolutions,
  };
}
