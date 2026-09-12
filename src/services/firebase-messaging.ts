// Dev stub for managed Expo environment — no native Firebase modules available.
// Replace with the real @react-native-firebase/messaging integration once
// native iOS/Android projects are set up.

export enum AuthorizationStatus {
  NOT_DETERMINED = 'NOT_DETERMINED',
  DENIED = 'DENIED',
  AUTHORIZED = 'AUTHORIZED',
  PROVISIONAL = 'PROVISIONAL',
}

export function messaging() {
  return {
    requestPermission: async () => AuthorizationStatus.NOT_DETERMINED,
    getToken: async () => null,
    hasPermission: async () => AuthorizationStatus.NOT_DETERMINED,
    onMessage: (_handler: (msg: unknown) => void) => () => {},
    onNotificationOpenedApp: (_handler: (msg: unknown) => void) => () => {},
    getInitialNotification: async () => null,
    onTokenRefresh: (_handler: (token: string) => void) => () => {},
  };
}

export async function requestNotificationPermissions(): Promise<boolean> {
  return false;
}

export async function getFcmToken(): Promise<string | null> {
  return null;
}

export async function registerFcmToken(): Promise<void> {
  // no-op in dev stub
}

export async function unregisterFcmToken(_token: string): Promise<void> {
  // no-op in dev stub
}

export function setupForegroundHandler(_handler: (message: unknown) => void): void {
  // no-op in dev stub
}

export function setupBackgroundHandlers(_handler: (message: unknown) => void): void {
  // no-op in dev stub
}

export function setupTokenRefreshListener(_handler: (token: string) => void): () => void {
  return () => {};
}

export async function checkNotificationPermissions(): Promise<boolean> {
  return false;
}
