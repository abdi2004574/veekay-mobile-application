import type { ApiErrorBody, ApiErrorCode, ApiSuccessBody } from './types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export class ApiError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  accessToken?: string;
}

export async function apiFetch<T>(
  path: string,
  { method = 'GET', body, accessToken }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      'INTERNAL_ERROR',
      'Could not reach the server. Check your connection and try again.',
      0,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const json = (await response.json()) as ApiSuccessBody<T> | ApiErrorBody;

  if (!json.success) {
    throw new ApiError(json.error.code, json.error.message, response.status);
  }

  return json.data;
}
