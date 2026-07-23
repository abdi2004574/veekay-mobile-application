import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { GradientButton } from '../../src/components/GradientButton';
import { useAuthStore } from '../../src/stores/auth-store';

export default function AgencyHome() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6 gap-4">
        <Text className="text-xl font-semibold text-foreground">
          Welcome{user?.displayName ? `, ${user.displayName}` : ''}
        </Text>
        <Text className="text-muted-foreground text-center">
          You&apos;re signed in as an agency. Packages, requests, and chat
          aren&apos;t built yet.
        </Text>
        <GradientButton
          variant="outline"
          onPress={async () => {
            await logout();
            router.replace('/(auth)/welcome');
          }}
        >
          Log Out
        </GradientButton>
      </View>
    </SafeAreaView>
  );
}
