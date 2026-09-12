import { ApiError, NetworkError } from '../api/client';

export function friendlyErrorMessage(err: unknown): string {
  if (err instanceof NetworkError) {
    return err.message;
  }

  if (err instanceof ApiError) {
    switch (err.code) {
      case 'UNAUTHORIZED':
        return 'Your session has expired. Please sign in again.';
      case 'FORBIDDEN':
        return 'You don\'t have permission to do that.';
      case 'NOT_FOUND':
        return 'The requested item could not be found.';
      case 'CONFLICT':
        return 'This action conflicts with an existing record.';
      case 'VALIDATION_ERROR':
        return 'Please check the information you entered and try again.';
      case 'BUSINESS_RULE':
        return err.message;
      case 'RATE_LIMITED':
        return 'Too many requests. Please wait a moment and try again.';
      case 'INTERNAL_ERROR':
        if (err.isServerError) {
          return 'Something went wrong on our end. Please try again later.';
        }
        return err.message;
      default:
        return err.message;
    }
  }

  return 'Something went wrong. Please try again.';
}
