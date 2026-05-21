import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';

export const useCurrentUser = () => {
  const currentUserId = useAuthStore((state) => state.currentUserId);
  return useUserStore((state) =>
    currentUserId !== null ? (state.usersById[currentUserId] ?? null) : null
  );
};
