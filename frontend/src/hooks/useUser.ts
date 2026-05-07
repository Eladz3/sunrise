/**
 * useUser Hook
 *
 * React hook for fetching the authenticated user's SQL record via the REST API.
 */

import { useState, useEffect } from 'react';
import { getUserByFirebaseUid, type ApiUser } from '@/services/users';

interface UseUserReturn {
  profile: ApiUser | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

export function useUser(userId: string | null): UseUserReturn {
  const [profile, setProfile] = useState<ApiUser | null>(null);
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
      const userProfile = await getUserByFirebaseUid(userId);
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
