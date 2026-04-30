/**
 * GoalList Component
 *
 * Displays a list of goals with filtering options.
 */

import { useState } from 'react';
import type { Goal, GoalStatus } from '@/types';
import { GoalCard } from './GoalCard';
import { filterActiveGoals, filterCompletedGoals, filterOverdueGoals } from '@/utils';

interface GoalListProps {
  goals: Goal[];
  onComplete: (goalId: string) => Promise<void>;
  onDelete: (goalId: string) => Promise<void>;
  onUpdateStatus: (goalId: string, status: GoalStatus, notes?: string) => Promise<void>;
}

type FilterType = 'all' | 'active' | 'completed' | 'overdue';

export function GoalList({ goals, onComplete, onDelete, onUpdateStatus }: GoalListProps) {
  const [filter, setFilter] = useState<FilterType>('active');

  const getFilteredGoals = (): Goal[] => {
    switch (filter) {
      case 'active':
        return filterActiveGoals(goals);
      case 'completed':
        return filterCompletedGoals(goals);
      case 'overdue':
        return filterOverdueGoals(goals);
      default:
        return goals;
    }
  };

  const filteredGoals = getFilteredGoals();

  const filterButtons: { value: FilterType; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'completed', label: 'Completed' },
    { value: 'all', label: 'All' },
  ];

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              filter === btn.value
                ? 'text-sunrise-600 border-b-2 border-sunrise-500'
                : 'text-warmGray-600 hover:text-warmGray-900'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No goals found</p>
          <p className="text-gray-400 text-sm mt-2">
            {filter === 'active' && "You don't have any active goals. Create one to get started!"}
            {filter === 'completed' && "You haven't completed any goals yet."}
            {filter === 'overdue' && "You don't have any overdue goals. Great job!"}
            {filter === 'all' && 'Create your first goal to get started!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onComplete={onComplete}
              onDelete={onDelete}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
