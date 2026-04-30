/**
 * GoalCard Component
 *
 * Displays a single goal with actions.
 */

import { useState } from 'react';
import type { Goal, GoalStatus } from '@/types';
import {
  formatDueDate,
  getStatusColor,
  getPriorityColor,
  getStatusLabel,
  getPriorityLabel,
} from '@/utils';
import { Button } from '@/components';

interface GoalCardProps {
  goal: Goal;
  onComplete: (goalId: string) => Promise<void>;
  onDelete: (goalId: string) => Promise<void>;
  onUpdateStatus: (goalId: string, status: GoalStatus, notes?: string) => Promise<void>;
}

export function GoalCard({ goal, onComplete, onDelete, onUpdateStatus }: GoalCardProps) {
  const [loading, setLoading] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(goal.notes);

  const handleComplete = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await onComplete(goal.id);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (loading) return;
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      setLoading(true);
      await onDelete(goal.id);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: GoalStatus) => {
    if (loading) return;
    try {
      setLoading(true);
      await onUpdateStatus(goal.id, status, notes);
      setShowNotes(false);
    } finally {
      setLoading(false);
    }
  };

  const isActive = goal.status === 'todo' || goal.status === 'in_progress';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
        </div>
        <div className="flex gap-2 ml-4">
          <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(goal.priority)} bg-gray-100`}>
            {getPriorityLabel(goal.priority)}
          </span>
        </div>
      </div>

      {/* Tags */}
      {goal.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {goal.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Meta Info */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <span className={getStatusColor(goal.status)}>{getStatusLabel(goal.status)}</span>
        <span>•</span>
        <span className={goal.isOverdue ? 'text-red-600 font-medium' : ''}>
          {formatDueDate(goal.dueDate.toDate())}
        </span>
        <span>•</span>
        <span className="capitalize">{goal.category}</span>
      </div>

      {/* Notes Section */}
      {showNotes && (
        <div className="mb-3">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add progress notes..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sunrise-500"
            rows={2}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {isActive && (
          <>
            {goal.status === 'todo' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpdateStatus('in_progress')}
                disabled={loading}
              >
                Start
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleComplete}
              loading={loading}
              disabled={loading}
            >
              Complete
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowNotes(!showNotes)}
              disabled={loading}
            >
              {showNotes ? 'Cancel' : 'Add Note'}
            </Button>
          </>
        )}

        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          disabled={loading}
          className="text-red-600 hover:bg-red-50"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
