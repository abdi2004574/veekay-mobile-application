import "../global.css";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { ErrorBoundary } from "../src/components/ErrorBoundary";
import { useAuthStore } from "../src/stores/auth-store";
import { ToastHost } from "../src/components/Toast";
import { AlertHost } from "../src/components/AlertHost";
import { colors } from "../src/constants/colors";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (failureCount >= 2) return false;
        if (error instanceof Error && error.name === "NetworkError")
          return false;
        return true;
      },
      staleTime: 30_000,
      gcTime: 5 * 60_000,
    },
    mutations: {
      retry: false,
    },
  },
});

export default function RootLayout() {
  const status = useAuthStore((s) => s.status);
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (status === "idle" || status === "loading") {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.vaykaePink} size="large" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <Slot />
            <ToastHost />
            <AlertHost />
          </QueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

// TODO: Push notifications (Firebase Cloud Messaging) are deferred until
// the feature is prioritized. This layout previously initialized FCM
// token registration, notification permission checks, and foreground/
// background message handlers. Re-add when the backend push notification
// service and mobile FCM integration are ready.
