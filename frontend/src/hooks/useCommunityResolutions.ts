import { useState, useEffect, useCallback } from 'react';
import { getAllResolutions, type Resolution } from '@/services/resolutions';

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

  const fetchResolutions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllResolutions();
      setResolutions(data);
    } catch (err) {
      console.error('Error fetching community resolutions:', err);
      setError('Failed to load community data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResolutions();
  }, [fetchResolutions]);

  return {
    resolutions,
    loading,
    error,
    refreshResolutions: fetchResolutions,
  };
}

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
