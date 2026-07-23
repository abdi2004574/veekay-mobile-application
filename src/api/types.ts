export type UserRole = 'traveler' | 'agency' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  onboardingComplete: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'BUSINESS_RULE'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

export interface ApiErrorBody {
  success: false;
  error: { code: ApiErrorCode; message: string };
}

export interface ApiSuccessBody<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}
