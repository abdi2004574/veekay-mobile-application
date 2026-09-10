import messaging, {
  AuthorizationStatus,
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import * as notificationsApi from '../api/notifications';
import { useAuthStore } from '../stores/auth-store';
import { requireAccessToken } from '../utils/require-access-token';

let isRegistered = false;

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (!enabled && Platform.OS === 'ios') {
      console.log('Notification permissions declined by user');
    }

    return enabled;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

export async function getFcmToken(): Promise<string | null> {
  try {
    const token = await messaging().getToken();
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

export async function registerFcmToken(): Promise<void> {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken || isRegistered) return;

  const token = await getFcmToken();
  if (!token) return;

  try {
    const platform: 'ios' | 'android' = Platform.OS === 'ios' ? 'ios' : 'android';
    await notificationsApi.registerDevice(accessToken, token, platform);
    isRegistered = true;
    console.log('FCM token registered with backend');
  } catch (error) {
    console.error('Failed to register FCM token:', error);
  }
}

export async function unregisterFcmToken(token: string): Promise<void> {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) return;

  try {
    await notificationsApi.unregisterDevice(accessToken, token);
    isRegistered = false;
  } catch (error) {
    console.error('Failed to unregister FCM token:', error);
  }
}

export function setupForegroundHandler(
  onMessage: (message: FirebaseMessagingTypes.RemoteMessage) => void,
): void {
  messaging().onMessage(async (remoteMessage) => {
    onMessage(remoteMessage);
  });
}

export function setupBackgroundHandlers(
  onNotificationOpen: (message: FirebaseMessagingTypes.RemoteMessage) => void,
): void {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    onNotificationOpen(remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        onNotificationOpen(remoteMessage);
      }
    });
}

export function setupTokenRefreshListener(
  onTokenRefreshed: (token: string) => void,
): () => void {
  const unsubscribe = messaging().onTokenRefresh((token) => {
    onTokenRefreshed(token);
  });

  return unsubscribe;
}

export async function checkNotificationPermissions(): Promise<boolean> {
  const authStatus = await messaging().hasPermission();
  return (
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL
  );
}