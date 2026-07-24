import { create } from 'zustand';
import { refresh as refreshTokens } from '../api/auth';
import { getMe } from '../api/users';
import type { AuthResponse, AuthUser } from '../api/types';
import { secureStorage } from './secure-storage';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  accessToken: string | null;
  setSession: (session: AuthResponse) => Promise<void>;
  updateUser: (user: AuthUser) => void;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'idle',
  user: null,
  accessToken: null,

  setSession: async ({ user, accessToken, refreshToken }) => {
    await secureStorage.setRefreshToken(refreshToken);
    set({ user, accessToken, status: 'authenticated' });
  },

  updateUser: (user) => set({ user }),

  hydrate: async () => {
    set({ status: 'loading' });
    const storedRefreshToken = await secureStorage.getRefreshToken();

    if (!storedRefreshToken) {
      set({ status: 'unauthenticated' });
      return;
    }

    try {
      const tokens = await refreshTokens(storedRefreshToken);
      await secureStorage.setRefreshToken(tokens.refreshToken);
      set({ accessToken: tokens.accessToken, status: 'authenticated' });

      // The access/refresh token pair alone doesn't carry the user's profile —
      // fetch it explicitly so `user` isn't left null after a relaunch/reload.
      try {
        const me = await getMe(tokens.accessToken);
        set({
          user: {
            id: me.id,
            email: me.email,
            displayName: me.displayName,
            role: me.role,
            isEmailVerified: me.isEmailVerified,
            onboardingComplete: me.onboardingComplete,
          },
        });
      } catch {
        // Session is still valid even if this particular fetch fails (e.g. a
        // transient network blip) — don't fail hydration over it.
      }
    } catch {
      await secureStorage.clearRefreshToken();
      set({ status: 'unauthenticated', accessToken: null, user: null });
    }
  },

  logout: async () => {
    await secureStorage.clearRefreshToken();
    set({ status: 'unauthenticated', accessToken: null, user: null });
  },
}));
