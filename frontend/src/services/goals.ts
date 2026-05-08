import { api } from '@/services/api';
import type { GoalCategory } from '@/components';

export interface GoalDocument {
  title: string;
  description: string;
  category: GoalCategory;
  target_value: number;
  current_value: number;
  unit: string;
  user_id: string;
  user_name: string;
  user_email: string;
}

export interface Goal extends GoalDocument {
  id: string;
}

// Shape returned by the backend Goal entity
interface ApiGoal {
  id: number;
  title: string;
  description: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  userId: number;
  year: number;
}

function mapApiGoal(g: ApiGoal): Goal {
  return {
    id: String(g.id),
    title: g.title,
    description: g.description,
    category: g.category as GoalCategory,
    target_value: g.targetValue,
    current_value: g.currentValue,
    unit: g.unit,
    user_id: String(g.userId),
    user_name: '',
    user_email: '',
  };
}

export async function getUserGoals(sqlUserId: number): Promise<Goal[]> {
  const goals = await api.get<ApiGoal[]>(`/goals-by-user-id/${sqlUserId}`);
  return goals.map(mapApiGoal);
}

export async function getAllGoals(): Promise<Goal[]> {
  const goals = await api.get<ApiGoal[]>('/goals');
  return goals.map(mapApiGoal);
}

export async function createGoal(
  data: Omit<GoalDocument, 'current_value'> & { current_value?: number }
): Promise<string> {
  const body = {
    title: data.title,
    description: data.description,
    category: data.category,
    targetValue: data.target_value,
    currentValue: data.current_value ?? 0,
    unit: data.unit,
    year: new Date().getFullYear(),
    userId: Number(data.user_id),
  };
  const created = await api.post<ApiGoal>('/goals', body);
  return String(created.id);
}

export async function updateGoal(
  goalId: string,
  data: Partial<GoalDocument>
): Promise<void> {
  const body: Record<string, unknown> = {};
  if (data.title !== undefined) body.title = data.title;
  if (data.description !== undefined) body.description = data.description;
  if (data.category !== undefined) body.category = data.category;
  if (data.target_value !== undefined) body.targetValue = data.target_value;
  if (data.current_value !== undefined) body.currentValue = data.current_value;
  if (data.unit !== undefined) body.unit = data.unit;
  await api.put(`/goals/${goalId}`, body);
}

export async function deleteGoal(goalId: string): Promise<void> {
  await api.delete(`/goals/${goalId}`);
}
