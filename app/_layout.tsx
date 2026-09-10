import '../global.css';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { useAuthStore } from '../src/stores/auth-store';
import { useNotificationStore } from '../src/stores/notification-store';
import { ToastHost } from '../src/components/Toast';
import { AlertHost } from '../src/components/AlertHost';
import { colors } from '../src/constants/colors';
import {
  checkNotificationPermissions,
  getFcmToken,
  registerFcmToken,
  requestNotificationPermissions,
  setupBackgroundHandlers,
  setupForegroundHandler,
  setupTokenRefreshListener,
} from '../src/services/firebase-messaging';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2 },
    mutations: { retry: false },
  },
});

export default function RootLayout() {
  const status = useAuthStore((s) => s.status);
  const hydrate = useAuthStore((s) => s.hydrate);
  const setPermissionStatus = useNotificationStore((s) => s.setPermissionStatus);
  const setToken = useNotificationStore((s) => s.setToken);
  const setRegistered = useNotificationStore((s) => s.setRegistered);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    let tokenUnsubscribe: (() => void) | null = null;

    async function initMessaging() {
      const hasPermission = await checkNotificationPermissions();
      if (!hasPermission) {
        const granted = await requestNotificationPermissions();
        setPermissionStatus(granted ? 'authorized' : 'denied');
      } else {
        setPermissionStatus('authorized');
      }

      const token = await getFcmToken();
      if (token) {
        setToken(token);
        await registerFcmToken();
        setRegistered(true);
      }

      tokenUnsubscribe = setupTokenRefreshListener(async (newToken) => {
        setToken(newToken);
        await registerFcmToken();
      });

      setupForegroundHandler((message) => {
        console.log('Foreground message:', message);
      });

      setupBackgroundHandlers((message) => {
        console.log('Notification opened:', message);
      });
    }

    initMessaging();

    return () => {
      if (tokenUnsubscribe) {
        tokenUnsubscribe();
      }
      setRegistered(false);
    };
  }, [status, setPermissionStatus, setToken, setRegistered]);

  if (status === 'idle' || status === 'loading') {
    return (
      <View className='flex-1 items-center justify-center bg-background'>
        <ActivityIndicator color={colors.vaykaePink} size='large' />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Slot />
          <ToastHost />
          <AlertHost />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

