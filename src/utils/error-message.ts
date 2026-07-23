import { ApiError } from '../api/client';

export function friendlyErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.code === 'VALIDATION_ERROR') {
      return 'Please check the information you entered and try again.';
    }
    return err.message;
  }
  return 'Something went wrong. Please try again.';
}
