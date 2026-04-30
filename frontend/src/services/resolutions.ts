/**
 * Resolutions Service
 *
 * Firestore operations for resolution documents.
 */

import {
  createDocument,
  getDocuments,
  updateDocument,
  where,
} from '@/services/firebase/firestore';
import type { ResolutionCategory } from '@/components';

const COLLECTION_NAME = 'resolutions';

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

/**
 * Get all resolutions for a specific user
 */
export async function getUserResolutions(userId: string): Promise<Resolution[]> {
  const docs = await getDocuments<ResolutionDocument>(
    COLLECTION_NAME,
    where('user_id', '==', userId)
  );
  return docs as Resolution[];
}

/**
 * Get all resolutions (for community view)
 */
export async function getAllResolutions(): Promise<Resolution[]> {
  const docs = await getDocuments<ResolutionDocument>(COLLECTION_NAME);
  return docs as Resolution[];
}

/**
 * Create a new resolution
 */
export async function createResolution(
  data: Omit<ResolutionDocument, 'current_value'> & { current_value?: number }
): Promise<string> {
  const docData: ResolutionDocument = {
    ...data,
    current_value: data.current_value ?? 0,
  };
  return createDocument<ResolutionDocument>(COLLECTION_NAME, docData);
}

/**
 * Update an existing resolution
 */
export async function updateResolution(
  resolutionId: string,
  data: Partial<ResolutionDocument>
): Promise<void> {
  await updateDocument<ResolutionDocument>(COLLECTION_NAME, resolutionId, data);
}
