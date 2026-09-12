import { describe, expect, it } from '@jest/globals';
import { ApiError, NetworkError } from '../api/client';
import { friendlyErrorMessage } from './error-message';

describe('friendlyErrorMessage', () => {
  it('distinguishes network failures from API errors', () => {
    expect(friendlyErrorMessage(new NetworkError('offline'))).toBe('offline');
    expect(
      friendlyErrorMessage(new ApiError('FORBIDDEN', 'hidden detail', 403)),
    ).toBe("You don't have permission to do that.");
  });
});
