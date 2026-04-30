/**
 * My Goals Page
 *
 * User's personal goals view with ability to add and edit goals.
 * Connected to Firestore with optimistic UI updates.
 */

import { useState } from 'react';
import { ResolutionCard, Spinner } from '@/components';
import { GoalFormModal, type GoalFormData } from '@/components/resolution/GoalFormModal';
import { useAuth } from '@/hooks/useAuth';
import { useResolutions } from '@/hooks/useResolutions';

export function MyGoalsPage() {
  const { user } = useAuth();
  const {
    resolutions,
    loading,
    error,
    addResolution,
    editResolution,
  } = useResolutions(user?.uid ?? null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResolutionId, setEditingResolutionId] = useState<string | null>(null);

  // Get the resolution being edited
  const editingResolution = editingResolutionId
    ? resolutions.find((r) => r.id === editingResolutionId)
    : null;

  // Calculate user's overall progress
  const totalTarget = resolutions.reduce((sum, r) => sum + r.target_value, 0);
  const totalCurrent = resolutions.reduce((sum, r) => sum + r.current_value, 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  const handleAddGoal = async (data: GoalFormData) => {
    if (!user) return;

    await addResolution({
      title: data.title,
      description: data.description,
      category: data.category,
      target_value: data.target_value,
      unit: data.unit,
      user_name: user.displayName || 'Anonymous',
      user_email: user.email || '',
    });
  };

  const handleEditGoal = async (data: GoalFormData) => {
    if (!editingResolutionId) return;

    await editResolution(editingResolutionId, {
      title: data.title,
      description: data.description,
      category: data.category,
      target_value: data.target_value,
      unit: data.unit,
    });
  };

  const handleSubmit = async (data: GoalFormData) => {
    if (editingResolutionId) {
      await handleEditGoal(data);
    } else {
      await handleAddGoal(data);
    }
  };

  const openAddModal = () => {
    setEditingResolutionId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (resolutionId: string) => {
    setEditingResolutionId(resolutionId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingResolutionId(null);
  };

  // Convert resolution to form data for editing
  const getInitialFormData = (): GoalFormData | undefined => {
    if (!editingResolution) return undefined;
    return {
      title: editingResolution.title,
      description: editingResolution.description,
      category: editingResolution.category,
      target_value: editingResolution.target_value,
      unit: editingResolution.unit,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-sunrise-500 via-dawn-500 to-rose-500 rounded-2xl shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">My Goals</h1>
        <p className="text-sunrise-100 text-sm mb-4">Your path to a brighter you</p>

        {/* Overall Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-sunrise-100">Overall Progress</span>
            <span className="font-semibold">{Math.round(overallProgress)}%</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, overallProgress)}%` }}
            />
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Resolutions List */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800 px-1">
          Your Resolutions ({resolutions.length})
        </h2>

        {resolutions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-sunrise-50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-sunrise-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-warmGray-700 font-medium mb-1">No resolutions yet</p>
            <p className="text-warmGray-500 text-sm">Tap the + button to add your first goal!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resolutions.map((resolution) => (
              <ResolutionCard
                key={resolution.id}
                title={resolution.title}
                current_value={resolution.current_value}
                target_value={resolution.target_value}
                unit={resolution.unit}
                category={resolution.category}
                onEdit={() => openEditModal(resolution.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Floating Action Button */}
      <button
        onClick={openAddModal}
        className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-br from-sunrise-500 to-dawn-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:from-sunrise-600 hover:to-dawn-600 transition-all"
        aria-label="Add new goal"
      >
        +
      </button>

      {/* Goal Form Modal (Add/Edit) */}
      <GoalFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initialData={getInitialFormData()}
        mode={editingResolutionId ? 'edit' : 'add'}
      />
    </div>
  );
}
