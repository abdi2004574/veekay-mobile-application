import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Eye,
  History,
  Lock,
  Smartphone,
} from 'lucide-react-native';
import { SettingsRow } from '../../src/components/SettingsRow';
import { colors } from '../../src/constants/colors';
import { usePrivacySettings } from '../../src/hooks/use-users-queries';
import { useUpdatePrivacySettings } from '../../src/hooks/use-users-mutations';
import { showInDevelopmentAlert } from '../../src/utils/in-development';
import type { ProfileVisibility } from '../../src/api/types';

const VISIBILITY_OPTIONS: { value: ProfileVisibility; label: string; hint: string }[] = [
  { value: 'public', label: 'Everyone', hint: 'Anyone can view your profile' },
  { value: 'friends', label: 'Friends Only', hint: 'Only your friends can view your profile' },
  { value: 'private', label: 'Private', hint: 'Only you can view your profile' },
];

export default function PrivacySecurityScreen() {
  const privacySettings = usePrivacySettings();
  const updatePrivacySettings = useUpdatePrivacySettings();

  const settings = privacySettings.data;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View
        className="flex-row items-center px-4 h-14"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Pressable>
        <Text className="text-lg font-bold text-foreground ml-3">Privacy & Security</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <SectionLabel>Security</SectionLabel>
        <SectionCard>
          <SettingsRow
            icon={Lock}
            label="Change Password"
            onPress={() => router.push('/(traveler)/change-password')}
          />
          <Divider />
          <SettingsRow
            icon={Smartphone}
            label="Two-Factor Authentication"
            subtitle="Not available yet"
            onPress={() => showInDevelopmentAlert('Two-factor authentication isn’t available yet.')}
          />
        </SectionCard>

        <SectionLabel>Privacy</SectionLabel>
        {privacySettings.isLoading ? (
          <View className="py-6 items-center">
            <ActivityIndicator color={colors.vaykaePink} />
          </View>
        ) : (
          <>
            <View className="mb-4">
              <Text className="text-sm font-bold text-foreground mb-1">Profile Visibility</Text>
              <Text className="text-xs mb-3" style={{ color: colors.mutedForeground }}>
                Who can view your profile
              </Text>
              <View style={{ gap: 8 }}>
                {VISIBILITY_OPTIONS.map((opt) => {
                  const selected = (settings?.profileVisibility ?? 'public') === opt.value;
                  return (
                    <Pressable
                      key={opt.value}
                      onPress={() => updatePrivacySettings.mutate({ profileVisibility: opt.value })}
                      className="flex-row items-center justify-between p-4 rounded-2xl"
                      style={{
                        borderWidth: 2,
                        borderColor: selected ? colors.vaykaePink : colors.border,
                        backgroundColor: colors.inputBackground,
                      }}
                    >
                      <View>
                        <Text className="font-bold text-foreground">{opt.label}</Text>
                        <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                          {opt.hint}
                        </Text>
                      </View>
                      {selected && <CheckCircle2 size={20} color={colors.vaykaePink} />}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <SectionCard>
              <SettingsRow
                icon={Eye}
                label="Activity Status"
                subtitle="Show when you're active"
                toggled={settings?.activityStatusVisible ?? true}
                onToggle={(value) => updatePrivacySettings.mutate({ activityStatusVisible: value })}
              />
              <Divider />
              <SettingsRow
                icon={CheckCircle2}
                label="Read Receipts"
                subtitle="Let others see when you've read their messages"
                toggled={settings?.readReceiptsEnabled ?? true}
                onToggle={(value) => updatePrivacySettings.mutate({ readReceiptsEnabled: value })}
              />
            </SectionCard>
          </>
        )}

        <SectionLabel>Data & History</SectionLabel>
        <SectionCard>
          <SettingsRow
            icon={Download}
            label="Download My Data"
            onPress={() => showInDevelopmentAlert('Data export isn’t available yet.')}
          />
          <Divider />
          <SettingsRow
            icon={History}
            label="Clear Search History"
            onPress={() => showInDevelopmentAlert('This isn’t available yet.')}
          />
        </SectionCard>

        <View
          className="p-4 rounded-2xl mt-2"
          style={{ backgroundColor: colors.inputBackground }}
        >
          <Text className="text-xs text-center" style={{ color: colors.mutedForeground }}>
            🔒 Your privacy matters to us. These settings control what other travelers and
            agencies can see about your activity on Vaykae.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Text className="text-xs font-bold mb-3 mt-2" style={{ color: colors.mutedForeground }}>
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
