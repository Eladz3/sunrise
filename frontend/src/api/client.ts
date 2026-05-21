import { getIdToken } from '@/auth/auth';
import { addBreadcrumb, throwApiError } from '@/services/apiLogger';

export { ApiError } from '@/services/apiLogger';

const PROD_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://thesunrise-api.azurewebsites.net';
const LOCAL_URL = 'http://localhost:5000';

export const API_URLS = { prod: PROD_URL, local: LOCAL_URL };

function getBaseUrl(): string {
  if (import.meta.env.DEV && localStorage.getItem('api_env') === 'local') return LOCAL_URL;
  return PROD_URL;
}

let BASE_URL = getBaseUrl();

export function setApiEnv(env: 'prod' | 'local') {
  localStorage.setItem('api_env', env);
  BASE_URL = getBaseUrl();
}

async function getAuthHeaders(forceRefresh = false): Promise<HeadersInit> {
  const token = await getIdToken(forceRefresh);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const method = (options?.method ?? 'GET').toUpperCase();
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options?.headers ?? {}) },
  });

  if (response.status === 401) {
    // Retry once with a fresh token in case it expired between client check and server validation
    const retryHeaders = await getAuthHeaders(true);
    const retryResponse = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { ...retryHeaders, ...(options?.headers ?? {}) },
    });
    if (!retryResponse.ok) return throwApiError(retryResponse, method, path);
    addBreadcrumb(method, path, retryResponse.status);
    if (retryResponse.status === 204) return undefined as T;
    return retryResponse.json() as Promise<T>;
  }

  if (!response.ok) return throwApiError(response, method, path);

  addBreadcrumb(method, path, response.status);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const client = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
};
