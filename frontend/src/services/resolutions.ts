import { api } from '@/services/api';
import type { ResolutionCategory } from '@/components';

export interface ResolutionDocument {
  title: string;
  description: string;
  category: ResolutionCategory;
  target_value: number;
  current_value: number;
  unit: string;
  user_id: string;
  user_name: string;
  user_email: string;
}

export interface Resolution extends ResolutionDocument {
  id: string;
}

// Shape returned by the backend GoalResponse DTO
interface ApiGoal {
  id: number;
  title: string;
  description: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  userId: number;
  userName: string;
  year: number;
}

function mapApiGoal(g: ApiGoal): Resolution {
  return {
    id: String(g.id),
    title: g.title,
    description: g.description,
    category: g.category as ResolutionCategory,
    target_value: g.targetValue,
    current_value: g.currentValue,
    unit: g.unit,
    user_id: String(g.userId),
    user_name: g.userName,
    user_email: '',
  };
}

export async function getUserResolutions(firebaseUid: string): Promise<Resolution[]> {
  const goals = await api.get<ApiGoal[]>(`/goals/by-firebase-uid/${encodeURIComponent(firebaseUid)}`);
  return goals.map(mapApiGoal);
}

export async function getAllResolutions(): Promise<Resolution[]> {
  const goals = await api.get<ApiGoal[]>('/goals');
  return goals.map(mapApiGoal);
}

export async function createResolution(
  data: Omit<ResolutionDocument, 'current_value'> & { current_value?: number }
): Promise<string> {
  const body = {
    title: data.title,
    description: data.description,
    category: data.category,
    targetValue: data.target_value,
    currentValue: data.current_value ?? 0,
    unit: data.unit,
    year: new Date().getFullYear(),
    // user_id is a Firebase UID string; the backend resolves via FirebaseUid on User
    firebaseUid: data.user_id,
  };
  const created = await api.post<ApiGoal>('/goals', body);
  return String(created.id);
}

export async function updateResolution(
  resolutionId: string,
  data: Partial<ResolutionDocument>
): Promise<void> {
  const body: Record<string, unknown> = {};
  if (data.title !== undefined) body.title = data.title;
  if (data.description !== undefined) body.description = data.description;
  if (data.category !== undefined) body.category = data.category;
  if (data.target_value !== undefined) body.targetValue = data.target_value;
  if (data.current_value !== undefined) body.currentValue = data.current_value;
  if (data.unit !== undefined) body.unit = data.unit;
  await api.put(`/goals/${resolutionId}`, body);
}
