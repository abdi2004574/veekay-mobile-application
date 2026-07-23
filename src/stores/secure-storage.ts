import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'veakay_refresh_token';

// expo-secure-store has no web implementation (no Keychain/Keystore there).
// localStorage is fine for local web-based dev/QA; iOS/Android — the real
// targets — always go through SecureStore.
const webStorage = {
  getRefreshToken: async () =>
    typeof localStorage === 'undefined'
      ? null
      : localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: async (token: string) =>
    localStorage.setItem(REFRESH_TOKEN_KEY, token),
  clearRefreshToken: async () => localStorage.removeItem(REFRESH_TOKEN_KEY),
};

const nativeStorage = {
  getRefreshToken: () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) =>
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token),
  clearRefreshToken: () => SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
};

export const secureStorage = Platform.OS === 'web' ? webStorage : nativeStorage;
