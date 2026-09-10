import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  CreditCard,
  LogOut,
  MessageCircle,
  Package,
  Shield,
  UserPlus,
  TrendingUp,
} from 'lucide-react-native';
import { SettingsRow } from '../../src/components/SettingsRow';
import { colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/stores/auth-store';
import { useNotificationPreferences } from '../../src/hooks/use-notifications-queries';
import { useUpdateNotificationPreference } from '../../src/hooks/use-notifications-mutations';
import { showAlert } from '../../src/utils/show-alert';

export default function SettingsScreen() {
  const logout = useAuthStore((s) => s.logout);
  const notificationPrefs = useNotificationPreferences();
  const updateNotificationPreference = useUpdateNotificationPreference();

  const handleLogout = () => {
    showAlert('Log Out?', 'You can log back in any time.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  const prefs = notificationPrefs.data;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View
        className="flex-row items-center px-4 h-14"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Pressable>
        <Text className="text-lg font-bold text-foreground ml-3">Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <SectionLabel>Account</SectionLabel>
        <SectionCard>
          <SettingsRow icon={UserPlus} label="Business Profile" onPress={() => {}} />
          <Divider />
          <SettingsRow icon={Shield} label="Verification Status" onPress={() => {}} />
          <Divider />
          <SettingsRow icon={CreditCard} label="Billing & Subscription" onPress={() => {}} />
        </SectionCard>

        <SectionLabel>Business</SectionLabel>
        <SectionCard>
          <SettingsRow icon={Package} label="Packages" onPress={() => router.replace('/(agency)/packages')} />
          <Divider />
          <SettingsRow icon={MessageCircle} label="Inbox" onPress={() => router.replace('/(agency)/inbox')} />
          <Divider />
          <SettingsRow icon={TrendingUp} label="Performance" onPress={() => {}} />
        </SectionCard>

        <SectionLabel>Notifications</SectionLabel>
        <SectionCard>
          {notificationPrefs.isLoading ? (
            <View className="p-6 items-center">
              <ActivityIndicator color={colors.vaykaePink} />
            </View>
          ) : (
            <>
              <SettingsRow
                icon={Bell}
                label="New Requests"
                toggled={prefs?.find((p) => p.type === 'new_request')?.pushEnabled ?? true}
                onToggle={(value) =>
                  updateNotificationPreference.mutate({ type: 'new_request', pushEnabled: value })
                }
              />
              <Divider />
              <SettingsRow
                icon={Bell}
                label="Messages"
                toggled={prefs?.find((p) => p.type === 'chat_message')?.pushEnabled ?? true}
                onToggle={(value) =>
                  updateNotificationPreference.mutate({ type: 'chat_message', pushEnabled: value })
                }
              />
              <Divider />
              <SettingsRow
                icon={Bell}
                label="Payment Alerts"
                toggled={prefs?.find((p) => p.type === 'payment_received')?.pushEnabled ?? true}
                onToggle={(value) =>
                  updateNotificationPreference.mutate({ type: 'payment_received', pushEnabled: value })
                }
              />
              <Divider />
              <SettingsRow
                icon={Bell}
                label="Marketing"
                toggled={prefs?.find((p) => p.type === 'admin_broadcast')?.pushEnabled ?? false}
                onToggle={(value) =>
                  updateNotificationPreference.mutate({ type: 'admin_broadcast', pushEnabled: value })
                }
              />
            </>
          )}
        </SectionCard>

        <SectionLabel>Support</SectionLabel>
        <SectionCard>
          <SettingsRow icon={Shield} label="Help & Support" onPress={() => {}} />
          <Divider />
          <SettingsRow icon={CreditCard} label="Report an Issue" onPress={() => {}} />
        </SectionCard>

        <SectionLabel destructive>Danger Zone</SectionLabel>
        <SectionCard>
          <SettingsRow icon={LogOut} label="Log Out" destructive onPress={handleLogout} />
        </SectionCard>

        <View className="flex-row items-center justify-center gap-4 mt-2">
          <Pressable onPress={() => router.push('/terms')}>
            <Text className="text-xs" style={{ color: colors.mutedForeground }}>
              Terms & Conditions
            </Text>
          </Pressable>
          <Text className="text-xs" style={{ color: colors.mutedForeground }}>
            {' '}
          </Text>
          <Pressable onPress={() => router.push('/privacy-policy')}>
            <Text className="text-xs" style={{ color: colors.mutedForeground }}>
              Privacy Policy
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({ children, destructive }: { children: ReactNode; destructive?: boolean }) {
  return (
    <Text
      className="text-xs font-bold mb-3 mt-2"
      style={{ color: destructive ? colors.destructive : colors.mutedForeground }}
    >
      {children}
    </Text>
  );
}

function SectionCard({ children }: { children: ReactNode }) {
  return (
    <View
      className="rounded-2xl mb-6"
      style={{ borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}
    >
      {children}
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: colors.border }} />;
}
