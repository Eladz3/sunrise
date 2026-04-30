/**
 * useGlobalStats Hook
 *
 * Real-time subscription to global community statistics.
 * Uses Firestore onSnapshot for live updates.
 */

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { GlobalStats } from '@/types';

interface UseGlobalStatsReturn {
  stats: GlobalStats | null;
  loading: boolean;
  error: string | null;
  completionPercent: number;
}

/**
 * Hook for real-time global community stats
 *
 * @returns Global stats with live updates and computed completion percentage
 */
export function useGlobalStats(): UseGlobalStatsReturn {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const docRef = doc(db, 'globalStats', 'current');

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setStats({ id: snapshot.id, ...snapshot.data() } as GlobalStats);
        } else {
          setStats(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error listening to global stats:', err);
        setError('Failed to load community stats');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Compute completion percentage
  const completionPercent =
    stats && stats.totalGoals > 0
      ? Math.round((stats.totalGoalsCompleted / stats.totalGoals) * 100)
      : 0;

  return {
    stats,
    loading,
    error,
    completionPercent,
  };
}
