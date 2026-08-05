import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  CreditCard,
  Lock,
  LogOut,
  Shield,
  Trash2,
  User,
} from 'lucide-react-native';
import { SettingsRow } from '../../src/components/SettingsRow';
import { colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/stores/auth-store';
import { useMe, useNotificationPreferences } from '../../src/hooks/use-users-queries';
import {
  useDeactivateAccount,
  useUpdateNotificationPreferences,
} from '../../src/hooks/use-users-mutations';
import { showInDevelopmentAlert } from '../../src/utils/in-development';
import { showAlert } from '../../src/utils/show-alert';

export default function SettingsScreen() {
  const logout = useAuthStore((s) => s.logout);
  const me = useMe();
  const notificationPrefs = useNotificationPreferences();
  const updateNotificationPrefs = useUpdateNotificationPreferences();
  const deactivateAccount = useDeactivateAccount();

  const handleEditProfile = () => {
    const p = me.data;
    router.push({
      pathname: '/(traveler)/edit-profile',
      params: {
        email: p?.email ?? '',
        displayName: p?.displayName ?? '',
        username: p?.username ?? '',
        bio: p?.bio ?? '',
        location: p?.location ?? '',
        phone: p?.phone ?? '',
        gender: p?.gender ?? '',
        dateOfBirth: p?.dateOfBirth ? p.dateOfBirth.slice(0, 10) : '',
        destinationTypes: (p?.destinationTypes ?? []).join(','),
        travelStyles: (p?.travelStyles ?? []).join(','),
      },
    });
  };

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

  const handleDeleteAccount = () => {
    showAlert(
      'Delete Account?',
      'This deactivates your account. This cannot be undone from the app — contact support to reactivate.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deactivateAccount.mutate(undefined, {
              onSuccess: async () => {
                await logout();
                router.replace('/(auth)/welcome');
              },
            });
          },
        },
      ],
    );
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
          <SettingsRow icon={User} label="Edit Profile" onPress={handleEditProfile} />
          <Divider />
          <SettingsRow
            icon={Lock}
            label="Change Password"
            onPress={() => router.push('/(traveler)/change-password')}
          />
          <Divider />
          <SettingsRow
            icon={Shield}
            label="Privacy & Security"
            onPress={() => router.push('/(traveler)/privacy-security')}
          />
          <Divider />
          <SettingsRow
            icon={CreditCard}
            label="Payment Methods"
            onPress={() => showInDevelopmentAlert('Payment methods aren’t available yet.')}
          />
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
                label="Donation Alerts"
                toggled={prefs?.donationAlerts ?? true}
                onToggle={(value) => updateNotificationPrefs.mutate({ donationAlerts: value })}
              />
              <Divider />
              <SettingsRow
                icon={Bell}
                label="Campaign Updates"
                toggled={prefs?.campaignUpdates ?? true}
                onToggle={(value) => updateNotificationPrefs.mutate({ campaignUpdates: value })}
              />
              <Divider />
              <SettingsRow
                icon={Bell}
                label="Messages"
                toggled={prefs?.agencyMessages ?? true}
                onToggle={(value) => updateNotificationPrefs.mutate({ agencyMessages: value })}
              />
            </>
          )}
        </SectionCard>

        <SectionLabel destructive>Danger Zone</SectionLabel>
        <SectionCard>
          <SettingsRow icon={LogOut} label="Log Out" destructive onPress={handleLogout} />
          <Divider />
          <SettingsRow
            icon={Trash2}
            label="Delete Account"
            destructive
            onPress={handleDeleteAccount}
          />
        </SectionCard>

        <View className="flex-row items-center justify-center gap-4 mt-2">
          <Link href="/terms">
            <Text className="text-xs" style={{ color: colors.mutedForeground }}>
              Terms & Conditions
            </Text>
          </Link>
          <Text className="text-xs" style={{ color: colors.mutedForeground }}>
            •
          </Text>
          <Link href="/privacy-policy">
            <Text className="text-xs" style={{ color: colors.mutedForeground }}>
              Privacy Policy
            </Text>
          </Link>
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
