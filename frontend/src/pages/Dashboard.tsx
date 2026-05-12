/**
 * Dashboard Page
 *
 * Main authenticated view for users.
 * Protected by ProtectedRoute - only accessible when logged in.
 */

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGoals } from '@/hooks/useGoals';
import { useUser } from '@/hooks/useUser';
import { Button, Spinner } from '@/components';
import { UserStats } from '@/components/dashboard/UserStats';
import { GoalList } from '@/components/dashboard/GoalList';
import { GoalModal } from '@/components/dashboard/GoalModal';

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const { profile, loading: profileLoading } = useUser(authUser?.uid || null);
  const {
    goals,
    loading: goalsLoading,
    error,
    createGoal,
    updateGoalStatus,
    markComplete,
    deleteGoal,
    refreshGoals,
  } = useGoals(authUser?.uid || null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateGoal = async (goalData: any) => {
    await createGoal(goalData);
    await refreshGoals();
  };

  const handleComplete = async (goalId: string) => {
    if (!authUser) return;
    const newStreak = await markComplete(goalId, authUser.uid);
    await refreshGoals();
    alert(`Goal completed! Your streak is now ${newStreak} days! 🎉`);
  };

  const handleDelete = async (goalId: string) => {
    if (!authUser) return;
    await deleteGoal(goalId, authUser.uid);
    await refreshGoals();
  };

  const handleUpdateStatus = async (goalId: string, status: any, notes?: string) => {
    await updateGoalStatus(goalId, status, notes);
    await refreshGoals();
  };

  if (profileLoading || goalsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Unable to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {authUser?.photoURL && (
                <img
                  src={authUser.photoURL}
                  alt={authUser.displayName || 'User'}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {authUser?.displayName || 'User'}!
                </h1>
                <p className="text-gray-600 mt-1">{authUser?.email}</p>
              </div>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              + New Goal
            </Button>
          </div>
        </div>

        {/* User Stats */}
        <div className="mb-8">
          <UserStats />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Goals Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Goals</h2>
            <p className="text-sm text-gray-500">
              {goals.length} {goals.length === 1 ? 'goal' : 'goals'}
            </p>
          </div>

          <GoalList
            goals={goals}
            onComplete={handleComplete}
            onDelete={handleDelete}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      </div>

      {/* Create Goal Modal */}
      {authUser && (
        <GoalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateGoal}
          userId={authUser.uid}
        />
      )}
    </div>
  );
}
