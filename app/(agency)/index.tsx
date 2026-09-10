import { Bell } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { GradientButton } from '../../src/components/GradientButton';
import { AgencyBottomNav } from '../../src/components/AgencyBottomNav';
import { useAuthStore } from '../../src/stores/auth-store';

export default function AgencyHome() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <View className="flex-row items-center gap-2">
            <Text className="text-xl font-semibold text-foreground">
              Welcome{user?.displayName ? `, ${user.displayName}` : ''}
            </Text>
            <Pressable
              hitSlop={8}
              onPress={() => router.push('/(agency)/notifications')}
            >
              <Bell size={22} color="#000" />
            </Pressable>
          </View>
          <Text className="text-muted-foreground text-center">
            You&apos;re signed in as an agency. Packages, requests, and your
            profile aren&apos;t built yet — Chat is ready though.
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
        <AgencyBottomNav active="home" />
      </View>
    </SafeAreaView>
  );
}
