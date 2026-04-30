/**
 * Error Handling Utilities
 *
 * Custom error classes and error handling helpers.
 */

import type { FirebaseError } from '@/types';

/**
 * Custom error class for service-level errors
 */
export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

/**
 * Custom error class for validation errors
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Custom error class for not found errors
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Custom error class for permission errors
 */
export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionError';
  }
}

/**
 * Get user-friendly error message from Firebase error
 *
 * @param error - Firebase error object
 * @returns User-friendly error message
 */
export function getFirebaseErrorMessage(error: FirebaseError): string {
  const errorMessages: Record<string, string> = {
    // Auth errors
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password is too weak.',
    'auth/operation-not-allowed': 'This operation is not allowed.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed.',
    'auth/cancelled-popup-request': 'Only one popup request is allowed at a time.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/too-many-requests': 'Too many requests. Please try again later.',

    // Firestore errors
    'permission-denied': 'You do not have permission to perform this action.',
    'not-found': 'The requested resource was not found.',
    'already-exists': 'This resource already exists.',
    'resource-exhausted': 'Resource limit exceeded.',
    'failed-precondition': 'Operation failed precondition check.',
    'aborted': 'Operation was aborted.',
    'out-of-range': 'Value is out of range.',
    'unimplemented': 'This operation is not implemented.',
    'internal': 'Internal server error.',
    'unavailable': 'Service is currently unavailable.',
    'data-loss': 'Data loss or corruption.',
    'unauthenticated': 'You must be signed in to perform this action.',
  };

  return errorMessages[error.code] || error.message || 'An unexpected error occurred.';
}

/**
 * Check if error is a Firebase error
 *
 * @param error - Error object
 * @returns true if Firebase error
 */
export function isFirebaseError(error: unknown): error is FirebaseError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

/**
 * Handle async operation with error logging
 *
 * @param operation - Async operation to execute
 * @param context - Context for error logging
 * @returns Result or throws error
 */
export async function handleAsync<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(`Error in ${context}:`, error);

    if (isFirebaseError(error)) {
      throw new ServiceError(
        getFirebaseErrorMessage(error),
        error.code,
        error as Error
      );
    }

    throw error;
  }
}

/**
 * Validate required field
 *
 * @param value - Value to validate
 * @param fieldName - Field name for error message
 * @throws ValidationError if value is null/undefined/empty
 */
export function validateRequired<T>(value: T | null | undefined, fieldName: string): T {
  if (value === null || value === undefined) {
    throw new ValidationError(`${fieldName} is required`, fieldName);
  }

  if (typeof value === 'string' && value.trim() === '') {
    throw new ValidationError(`${fieldName} cannot be empty`, fieldName);
  }

  return value;
}

/**
 * Validate email format
 *
 * @param email - Email to validate
 * @throws ValidationError if email is invalid
 */
export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format', 'email');
  }
}

/**
 * Validate date is in the future
 *
 * @param date - Date to validate
 * @param fieldName - Field name for error message
 * @throws ValidationError if date is in the past
 */
export function validateFutureDate(date: Date, fieldName: string): void {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  if (checkDate.getTime() < now.getTime()) {
    throw new ValidationError(`${fieldName} must be in the future`, fieldName);
  }
}

/**
 * Validate string length
 *
 * @param value - String to validate
 * @param fieldName - Field name for error message
 * @param min - Minimum length
 * @param max - Maximum length
 * @throws ValidationError if length is invalid
 */
export function validateLength(
  value: string,
  fieldName: string,
  min: number,
  max: number
): void {
  if (value.length < min) {
    throw new ValidationError(
      `${fieldName} must be at least ${min} characters`,
      fieldName
    );
  }

  if (value.length > max) {
    throw new ValidationError(
      `${fieldName} must be no more than ${max} characters`,
      fieldName
    );
  }
}
