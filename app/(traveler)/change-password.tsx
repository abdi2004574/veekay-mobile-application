import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle2, Lock, ShieldCheck } from 'lucide-react-native';
import { TextField } from '../../src/components/TextField';
import { GradientButton } from '../../src/components/GradientButton';
import { colors } from '../../src/constants/colors';
import { useChangePassword } from '../../src/hooks/use-auth-mutations';
import { useToastStore } from '../../src/stores/toast-store';
import { friendlyErrorMessage } from '../../src/utils/error-message';

const RULES = [
  '8+ characters',
  'At least one uppercase and one lowercase letter',
  'At least one number',
];

function isRuleCompliant(password: string) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
}

export default function ChangePasswordScreen() {
  const showToast = useToastStore((s) => s.show);
  const changePassword = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordsMatch = newPassword === confirmPassword;
  const isValid =
    !!currentPassword && isRuleCompliant(newPassword) && passwordsMatch;

  const handleSubmit = () => {
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => setSuccess(true),
        onError: (err) => showToast(friendlyErrorMessage(err)),
      },
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View
        className="flex-row items-center px-4 h-14"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Pressable>
        <Text className="text-lg font-bold text-foreground ml-3">Change Password</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View
          className="flex-row items-start gap-3 p-4 rounded-2xl mb-6"
          style={{ backgroundColor: colors.inputBackground }}
        >
          <ShieldCheck size={20} color={colors.vaykaePink} />
          <View style={{ flex: 1 }}>
            <Text className="font-bold text-foreground mb-1">Password Requirements</Text>
            {RULES.map((rule) => (
              <Text key={rule} className="text-xs" style={{ color: colors.mutedForeground }}>
                • {rule}
              </Text>
            ))}
          </View>
        </View>

        <View style={{ gap: 16 }}>
          <TextField
            icon={Lock}
            placeholder="Current Password"
            isPassword
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextField
            icon={Lock}
            placeholder="New Password"
            isPassword
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <View>
            <TextField
              icon={Lock}
              placeholder="Confirm New Password"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {!!confirmPassword && !passwordsMatch && (
              <Text style={{ color: colors.destructive }} className="text-xs mt-2">
                Passwords do not match
              </Text>
            )}
          </View>
        </View>

        <View className="mt-8">
          <GradientButton
            onPress={handleSubmit}
            disabled={!isValid || success}
            loading={changePassword.isPending}
          >
            {success ? 'Password Changed!' : 'Update Password'}
          </GradientButton>
          {success && (
            <View className="flex-row items-center justify-center gap-2 mt-4">
              <CheckCircle2 size={16} color={colors.vaykaePink} />
              <Text style={{ color: colors.mutedForeground }} className="text-sm">
                Your password has been updated.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
