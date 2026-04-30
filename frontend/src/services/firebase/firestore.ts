/**
 * Firestore Service
 *
 * Generic CRUD operations for Firestore collections.
 * Provides type-safe methods for database operations.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type QueryConstraint,
  type DocumentData,
  type WithFieldValue,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { FirestoreTimestamp } from '@/types/firebase';

/**
 * Generic document type with Firestore metadata
 */
export interface FirestoreDoc {
  id: string;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

/**
 * Get a single document by ID
 *
 * @param collectionName - Name of the collection
 * @param documentId - Document ID
 * @returns Document data with ID or null if not found
 */
export async function getDocument<T extends DocumentData>(
  collectionName: string,
  documentId: string
): Promise<(T & { id: string }) | null> {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
    }

    return null;
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Get all documents from a collection
 *
 * @param collectionName - Name of the collection
 * @param constraints - Optional query constraints (where, orderBy, limit)
 * @returns Array of documents with IDs
 */
export async function getDocuments<T extends DocumentData>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<(T & { id: string })[]> {
  try {
    const collectionRef = collection(db, collectionName);
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (T & { id: string })[];
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Create a new document with auto-generated ID
 *
 * @param collectionName - Name of the collection
 * @param data - Document data (without id, createdAt, updatedAt)
 * @returns Document ID
 */
export async function createDocument<T extends DocumentData>(
  collectionName: string,
  data: WithFieldValue<T>
): Promise<string> {
  try {
    const collectionRef = collection(db, collectionName);

    const docData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collectionRef, docData);
    return docRef.id;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Create or overwrite a document with specific ID
 *
 * @param collectionName - Name of the collection
 * @param documentId - Document ID
 * @param data - Document data
 */
export async function setDocument<T extends DocumentData>(
  collectionName: string,
  documentId: string,
  data: WithFieldValue<T>
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, documentId);

    const docData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, docData);
  } catch (error) {
    console.error(`Error setting document in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Update an existing document
 *
 * @param collectionName - Name of the collection
 * @param documentId - Document ID
 * @param data - Partial document data to update
 */
export async function updateDocument<T extends DocumentData>(
  collectionName: string,
  documentId: string,
  data: Partial<T>
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, documentId);

    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Delete a document
 *
 * @param collectionName - Name of the collection
 * @param documentId - Document ID
 */
export async function deleteDocument(
  collectionName: string,
  documentId: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
}

// Re-export Firestore query utilities for convenience
export { where, orderBy, limit, query };
export type { QueryConstraint };
