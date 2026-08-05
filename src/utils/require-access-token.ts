import { useAuthStore } from '../stores/auth-store';

// Reads the token fresh at call time (inside a mutationFn), not at render
// time. A hook-level `useAuthStore((s) => s.accessToken)` re-evaluates on
// every render, including the transient one where a still-mounted screen
// (e.g. ProfileScreen, which also calls useLikePost) re-renders the instant
// logout clears accessToken but before router.replace() unmounts it — that
// used to throw synchronously during render and crash the app. Reading it
// lazily, only when a mutation actually fires, avoids that entirely.
export function requireAccessToken(): string {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) {
    throw new Error('Not authenticated');
  }
  return accessToken;
}
