import { randomUUID } from 'expo-crypto';

export function generateIdempotencyKey(): string {
  const uuid = randomUUID();
  const timestamp = Date.now().toString(36);
  return `mob-${timestamp}-${uuid}`;
}