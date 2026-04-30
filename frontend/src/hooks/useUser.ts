/**
 * useUser Hook
 *
 * React hook for managing user profile data.
 */

import { useState, useEffect } from 'react';
import type { User } from '@/types';
import { getUserProfile } from '@/services';

interface UseUserReturn {
  profile: User | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

/**
 * Hook for accessing user profile
 *
 * @param userId - User's Firebase Auth UID
 * @returns User profile state
 */
export function useUser(userId: string | null): UseUserReturn {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userProfile = await getUserProfile(userId);
      setProfile(userProfile);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return {
    profile,
    loading,
    error,
    refreshProfile: fetchProfile,
  };
}
