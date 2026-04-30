/**
 * Goal Form Modal
 *
 * Modal for adding or editing a goal/resolution.
 */

import { useState, useEffect } from 'react';
import type { ResolutionCategory } from './ResolutionCard';

export interface GoalFormData {
  title: string;
  description: string;
  category: ResolutionCategory;
  target_value: number;
  unit: string;
}

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
  initialData?: GoalFormData;
  mode?: 'add' | 'edit';
}

const categories: { value: ResolutionCategory; label: string }[] = [
  { value: 'health', label: 'Health' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'finance', label: 'Finance' },
  { value: 'learning', label: 'Learning' },
  { value: 'career', label: 'Career' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'creativity', label: 'Creativity' },
  { value: 'mindfulness', label: 'Mindfulness' },
  { value: 'other', label: 'Other' },
];

const defaultFormData: GoalFormData = {
  title: '',
  description: '',
  category: 'other',
  target_value: 0,
  unit: '',
};

export function GoalFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'add',
}: GoalFormModalProps) {
  const [formData, setFormData] = useState<GoalFormData>(
    initialData || defaultFormData
  );
  const [errors, setErrors] = useState<Partial<Record<keyof GoalFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || defaultFormData);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GoalFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.target_value <= 0) {
      newErrors.target_value = 'Target value must be greater than 0';
    }

    if (!formData.unit.trim()) {
      newErrors.unit = 'Unit is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    field: keyof GoalFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is changed
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md sm:mx-4 max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b z-10">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'add' ? 'Add New Goal' : 'Edit Goal'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sunrise-500 focus:border-transparent text-base ${
                errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="e.g., Run 100 miles"
              autoFocus
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sunrise-500 focus:border-transparent text-base resize-none"
              placeholder="Describe your goal..."
              rows={3}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value as ResolutionCategory)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sunrise-500 focus:border-transparent text-base bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Target Value and Unit in a row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Target Value */}
            <div>
              <label htmlFor="target_value" className="block text-sm font-medium text-gray-700 mb-2">
                Target <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="target_value"
                value={formData.target_value || ''}
                onChange={(e) => handleChange('target_value', Number(e.target.value))}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sunrise-500 focus:border-transparent text-base ${
                  errors.target_value ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="100"
                min="1"
                inputMode="numeric"
              />
              {errors.target_value && (
                <p className="mt-2 text-sm text-red-500">{errors.target_value}</p>
              )}
            </div>

            {/* Unit */}
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
                Unit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="unit"
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sunrise-500 focus:border-transparent text-base ${
                  errors.unit ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="miles"
              />
              {errors.unit && (
                <p className="mt-2 text-sm text-red-500">{errors.unit}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 pb-safe">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-sunrise-500 to-dawn-500 rounded-xl hover:from-sunrise-600 hover:to-dawn-600 active:from-sunrise-700 active:to-dawn-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add Goal' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
