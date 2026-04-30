/**
 * Mock Resolution Data
 *
 * 3 users with 2 resolutions each, matching the schema.
 */

import type { ResolutionCategory } from '@/components';

export interface Resolution {
  id: string;
  title: string;
  description: string;
  category: ResolutionCategory;
  target_value: number;
  current_value: number;
  unit: string;
  user_name: string;
  user_email: string;
}

export const mockResolutions: Resolution[] = [
  // User 1: Alice
  {
    id: '1',
    title: 'Run 100 miles',
    description: 'Complete 100 miles of running this year',
    category: 'fitness',
    target_value: 100,
    current_value: 35,
    unit: 'miles',
    user_name: 'Alice',
    user_email: 'alice@example.com',
  },
  {
    id: '2',
    title: 'Save $5000',
    description: 'Build emergency fund',
    category: 'finance',
    target_value: 5000,
    current_value: 2000,
    unit: 'dollars',
    user_name: 'Alice',
    user_email: 'alice@example.com',
  },

  // User 2: Bob
  {
    id: '3',
    title: 'Read 24 books',
    description: 'Read 2 books per month',
    category: 'learning',
    target_value: 24,
    current_value: 12,
    unit: 'books',
    user_name: 'Bob',
    user_email: 'bob@example.com',
  },
  {
    id: '4',
    title: 'Meditate 365 times',
    description: 'Daily meditation practice',
    category: 'mindfulness',
    target_value: 365,
    current_value: 100,
    unit: 'sessions',
    user_name: 'Bob',
    user_email: 'bob@example.com',
  },

  // User 3: Carol
  {
    id: '5',
    title: 'Learn 500 new words',
    description: 'Expand vocabulary in Spanish',
    category: 'learning',
    target_value: 500,
    current_value: 150,
    unit: 'words',
    user_name: 'Carol',
    user_email: 'carol@example.com',
  },
  {
    id: '6',
    title: 'Cook 100 new recipes',
    description: 'Try new healthy recipes',
    category: 'health',
    target_value: 100,
    current_value: 40,
    unit: 'recipes',
    user_name: 'Carol',
    user_email: 'carol@example.com',
  },
];

/**
 * Group resolutions by user
 */
export function getResolutionsByUser(): Record<string, Resolution[]> {
  return mockResolutions.reduce(
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

/**
 * Get all resolutions as a flat list
 */
export function getAllResolutions(): Resolution[] {
  return mockResolutions;
}

/**
 * Calculate community progress stats
 */
export function getCommunityProgress(): {
  totalCurrent: number;
  totalTarget: number;
  percentage: number;
} {
  const totalCurrent = mockResolutions.reduce((sum, r) => sum + r.current_value, 0);
  const totalTarget = mockResolutions.reduce((sum, r) => sum + r.target_value, 0);
  const percentage = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  return {
    totalCurrent,
    totalTarget,
    percentage: Math.round(percentage),
  };
}
