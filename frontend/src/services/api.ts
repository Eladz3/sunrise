import { getIdToken } from '@/auth/auth';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

async function getAuthHeaders(forceRefresh = false): Promise<HeadersInit> {
  const token = await getIdToken(forceRefresh);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options?.headers ?? {}) },
  });

  if (response.status === 401) {
    // Token may have expired between client check and server validation; retry once with a fresh token
    const retryHeaders = await getAuthHeaders(true);
    const retryResponse = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { ...retryHeaders, ...(options?.headers ?? {}) },
    });
    if (!retryResponse.ok) {
      const text = await retryResponse.text().catch(() => retryResponse.statusText);
      throw new Error(`API ${retryResponse.status}: ${text}`);
    }
    if (retryResponse.status === 204) return undefined as T;
    return retryResponse.json() as Promise<T>;
  }

  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(`API ${response.status}: ${text}`);
  }

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
};
