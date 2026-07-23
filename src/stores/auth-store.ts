import { create } from 'zustand';
import { refresh as refreshTokens } from '../api/auth';
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
