import { useState, useEffect } from 'react';
import { getUserMetrics } from '@/services/metricsApi';

export function useUserMetrics(sqlUserId: number | null) {
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    if (!sqlUserId) {
      setProgressPercentage(0);
      return;
    }

    getUserMetrics(sqlUserId)
      .then((m) => setProgressPercentage(m.progressPercentage * 100))
      .catch(() => setProgressPercentage(0));
  }, [sqlUserId]);

  return { progressPercentage };
}
