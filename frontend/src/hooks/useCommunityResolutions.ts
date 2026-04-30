/**
 * useCommunityResolutions Hook
 *
 * Fetches all resolutions for community view with live updates.
 */

import { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Resolution } from '@/services/resolutions';

interface UseCommunityResolutionsResult {
  resolutions: Resolution[];
  loading: boolean;
  error: string | null;
  refreshResolutions: () => void;
}

export function useCommunityResolutions(): UseCommunityResolutionsResult {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const q = query(collection(db, 'resolutions'));

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Resolution[];

        setResolutions(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching community resolutions:', err);
        setError('Failed to load community data');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const refreshResolutions = useCallback(() => {
    // The onSnapshot listener handles real-time updates automatically
    // This is a no-op but kept for API consistency
  }, []);

  return {
    resolutions,
    loading,
    error,
    refreshResolutions,
  };
}

/**
 * Group resolutions by user
 */
export function groupResolutionsByUser(
  resolutions: Resolution[]
): Record<string, Resolution[]> {
  return resolutions.reduce(
    (acc, resolution) => {
      const userName = resolution.user_name;
      if (!acc[userName]) {
        acc[userName] = [];
      }
      acc[userName].push(resolution);
      return acc;
    },
    {} as Record<string, Resolution[]>
  );
}

/**
 * Calculate community progress
 */
export function calculateCommunityProgress(resolutions: Resolution[]): {
  totalCurrent: number;
  totalTarget: number;
  percentage: number;
} {
  const totalCurrent = resolutions.reduce((sum, r) => sum + r.current_value, 0);
  const totalTarget = resolutions.reduce((sum, r) => sum + r.target_value, 0);
  const percentage = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  return {
    totalCurrent,
    totalTarget,
    percentage: Math.round(percentage),
  };
}
