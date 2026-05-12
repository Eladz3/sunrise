import type { BaseEntity } from './common.types';
import type { GoalCategory } from '@/constants/goal-category.constants';

export type Goal = BaseEntity & {
  id: number;
  title: string;
  description: string;
  category: GoalCategory;
  targetValue: number;
  currentValue: number;
  unit: string;
  userId: number;
  completedOn?: string | null;
  year: number;
};

export type CreateGoalRequest = {
  title: string;
  description: string;
  category: GoalCategory;
  targetValue: number;
  unit: string;
  year: number;
};

export type UpdateGoalRequest = Partial<CreateGoalRequest> & {
  currentValue?: number;
};
