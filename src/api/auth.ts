import { apiFetch } from './client';
import type { AuthResponse } from './types';

export function registerTraveler(input: {
  email: string;
  password: string;
  displayName: string;
}) {
  return apiFetch<{ userId: string; message: string }>('/auth/register/email', {
    method: 'POST',
    body: input,
  });
}

export function registerAgency(input: {
  email: string;
  password: string;
  agencyName: string;
}) {
  return apiFetch<{ userId: string; message: string }>('/auth/agency/register', {
    method: 'POST',
    body: input,
  });
}

export function verifyEmail(input: { userId: string; otp: string }) {
  return apiFetch<AuthResponse>('/auth/verify-email', {
    method: 'POST',
    body: input,
  });
}

export function resendOtp(input: {
  email: string;
  type: 'email_verify' | 'password_reset' | 'login';
}) {
  return apiFetch<{ message: string }>('/auth/resend-otp', {
    method: 'POST',
    body: input,
  });
}

export type LoginInput =
  | { email: string; password: string; otp?: undefined }
  | { email: string; otp: string; password?: undefined };

export function login(input: LoginInput) {
  return apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: input });
}

export function agencyLogin(input: LoginInput) {
  return apiFetch<AuthResponse>('/auth/agency/login', {
    method: 'POST',
    body: input,
  });
}

export function refresh(refreshToken: string) {
  return apiFetch<{ accessToken: string; refreshToken: string }>(
    '/auth/refresh',
    { method: 'POST', body: { refreshToken } },
  );
}

export function logout(input: { accessToken: string; refreshToken: string }) {
  return apiFetch<void>('/auth/logout', {
    method: 'POST',
    accessToken: input.accessToken,
    body: { refreshToken: input.refreshToken },
  });
}

export function forgotPassword(email: string) {
  return apiFetch<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });
}

export function resetPassword(input: {
  email: string;
  otp: string;
  newPassword: string;
}) {
  return apiFetch<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: input,
  });
}

export function changePassword(
  input: { currentPassword: string; newPassword: string },
  accessToken: string,
) {
  return apiFetch<{ message: string }>('/auth/change-password', {
    method: 'POST',
    body: input,
    accessToken,
  });
}

export function logoutAll(accessToken: string) {
  return apiFetch<void>('/auth/logout-all', { method: 'POST', accessToken });
}
