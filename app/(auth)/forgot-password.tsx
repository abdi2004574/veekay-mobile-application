import { useState } from 'react';
import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, Lock, Mail, Shield } from 'lucide-react-native';
import { AuthScreenLayout } from '../../src/components/AuthScreenLayout';
import { AgencyAuthLayout } from '../../src/components/AgencyAuthLayout';
import { TextField } from '../../src/components/TextField';
import { OtpInput } from '../../src/components/OtpInput';
import { GradientButton } from '../../src/components/GradientButton';
import { IconCircle } from '../../src/components/IconCircle';
import {
  useForgotPassword,
  useResetPassword,
} from '../../src/hooks/use-auth-mutations';
import { useToastStore } from '../../src/stores/toast-store';
import { friendlyErrorMessage } from '../../src/utils/error-message';
import { colors } from '../../src/constants/colors';

type Step = 'email' | 'otp' | 'newPassword' | 'success';

function TravelerForgotPassword() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const showToast = useToastStore((s) => s.show);

  const forgotPassword = useForgotPassword();
  const resetPassword = useResetPassword();

  const handleSendCode = () => {
    forgotPassword.mutate(email, {
      onSuccess: () => setStep('otp'),
      onError: (err) => showToast(friendlyErrorMessage(err)),
    });
  };

  const handleResetPassword = () => {
    resetPassword.mutate(
      { email, otp, newPassword },
      {
        onSuccess: () => setStep('success'),
        onError: (err) => showToast(friendlyErrorMessage(err)),
      },
    );
  };

  return (
    <AuthScreenLayout>
      {step === 'email' && (
        <>
          <Text className="text-[20px] text-foreground mb-2">Forgot Password</Text>
          <Text className="text-muted-foreground mb-8">
            Enter your email to receive a reset code
          </Text>
          <View className="mb-6">
            <TextField
              icon={Mail}
              placeholder="Enter your email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <GradientButton
            onPress={handleSendCode}
            disabled={!email}
            loading={forgotPassword.isPending}
          >
            Send Reset Code
          </GradientButton>
        </>
      )}

      {step === 'otp' && (
        <>
          <Text className="text-[20px] text-foreground mb-2">Enter Code</Text>
          <Text className="text-muted-foreground mb-8">We sent a code to {email}</Text>
          <View className="mb-8">
            <OtpInput value={otp} onChange={setOtp} />
          </View>
          <GradientButton onPress={() => setStep('newPassword')} disabled={otp.length !== 6}>
            Continue
          </GradientButton>
        </>
      )}

      {step === 'newPassword' && (
        <>
          <Text className="text-[20px] text-foreground mb-2">Create New Password</Text>
          <Text className="text-muted-foreground mb-8">
            Your password must be at least 8 characters
          </Text>
          <View className="gap-4 mb-2">
            <TextField
              icon={Lock}
              placeholder="Enter new password"
              isPassword
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextField
              icon={Lock}
              placeholder="Confirm new password"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          {Boolean(confirmPassword) && newPassword !== confirmPassword && (
            <Text style={{ color: colors.destructive }} className="mb-2">
              Passwords do not match
            </Text>
          )}
          <View className="mt-4">
            <GradientButton
              onPress={handleResetPassword}
              disabled={
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword ||
                newPassword.length < 8
              }
              loading={resetPassword.isPending}
            >
              Reset Password
            </GradientButton>
          </View>
        </>
      )}

      {step === 'success' && (
        <View className="items-center">
          <Text className="text-2xl text-center mb-4 text-foreground font-semibold">
            Password Reset Successfully
          </Text>
          <Text className="text-muted-foreground text-center mb-12">
            Your password has been updated. You can now log in with your new password.
          </Text>
          <GradientButton onPress={() => router.replace('/(auth)/login')}>
            Back to Login
          </GradientButton>
        </View>
      )}
    </AuthScreenLayout>
  );
}

function AgencyForgotPassword() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const showToast = useToastStore((s) => s.show);

  const forgotPassword = useForgotPassword();
  const resetPassword = useResetPassword();

  const handleSendCode = () => {
    forgotPassword.mutate(email, {
      onSuccess: () => setStep('otp'),
      onError: (err) => showToast(friendlyErrorMessage(err)),
    });
  };

  const handleResetPassword = () => {
    resetPassword.mutate(
      { email, otp, newPassword },
      {
        onSuccess: () => setStep('success'),
        onError: (err) => showToast(friendlyErrorMessage(err)),
      },
    );
  };

  return (
    <AgencyAuthLayout
      showBack={step !== 'success'}
      header={
        step === 'email' ? (
          <>
            <IconCircle icon={Mail} />
            <Text className="text-2xl font-bold text-foreground mt-4 mb-2">
              Forgot Password?
            </Text>
            <Text className="text-muted-foreground text-center">
              Enter your business email to receive a verification code
            </Text>
          </>
        ) : step === 'otp' ? (
          <>
            <IconCircle icon={Shield} />
            <Text className="text-2xl font-bold text-foreground mt-4 mb-2">Verify Code</Text>
            <Text className="text-muted-foreground text-center">
              We sent a 6-digit code to{'\n'}
              <Text className="text-foreground font-medium">{email}</Text>
            </Text>
          </>
        ) : step === 'newPassword' ? (
          <>
            <IconCircle icon={Lock} />
            <Text className="text-2xl font-bold text-foreground mt-4 mb-2">
              Create New Password
            </Text>
            <Text className="text-muted-foreground text-center">
              Your new password must be different from previously used passwords
            </Text>
          </>
        ) : (
          <IconCircle icon={CheckCircle2} size={96} />
        )
      }
    >
      {step === 'email' && (
        <>
          <View className="mb-6">
            <TextField
              icon={Mail}
              placeholder="agency@business.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <GradientButton
            onPress={handleSendCode}
            disabled={!email}
            loading={forgotPassword.isPending}
          >
            Send Verification Code
          </GradientButton>
          <Text className="text-center text-muted-foreground mt-4">
            Remember your password?{' '}
            <Text
              onPress={() => router.replace('/(auth)/login?role=agency')}
              style={{ color: colors.vaykaePink }}
            >
              Login
            </Text>
          </Text>
        </>
      )}

      {step === 'otp' && (
        <>
          <View className="mb-6">
            <OtpInput value={otp} onChange={setOtp} />
          </View>
          <GradientButton onPress={() => setStep('newPassword')} disabled={otp.length !== 6}>
            Verify Code
          </GradientButton>
        </>
      )}

      {step === 'newPassword' && (
        <>
          <View className="gap-4 mb-2">
            <View>
              <TextField
                icon={Lock}
                placeholder="Enter new password"
                isPassword
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <Text className="text-xs text-muted-foreground mt-2">
                Must be at least 8 characters with letters and numbers
              </Text>
            </View>
            <TextField
              icon={Lock}
              placeholder="Confirm new password"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          {Boolean(confirmPassword) && newPassword !== confirmPassword && (
            <Text style={{ color: colors.destructive }} className="mb-2">
              Passwords do not match
            </Text>
          )}
          <View className="mt-4">
            <GradientButton
              onPress={handleResetPassword}
              disabled={
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword ||
                newPassword.length < 8
              }
              loading={resetPassword.isPending}
            >
              Reset Password
            </GradientButton>
          </View>
        </>
      )}

      {step === 'success' && (
        <View className="items-center mt-6">
          <Text className="text-2xl text-center mb-3 text-foreground font-semibold">
            Password Reset Successfully!
          </Text>
          <Text className="text-muted-foreground text-center mb-10">
            Your password has been changed successfully. You can now login with your new
            password.
          </Text>
          <GradientButton onPress={() => router.replace('/(auth)/login?role=agency')}>
            Go to Login
          </GradientButton>
        </View>
      )}
    </AgencyAuthLayout>
  );
}

export default function ForgotPassword() {
  const { role } = useLocalSearchParams<{ role?: string }>();
  return role === 'agency' ? <AgencyForgotPassword /> : <TravelerForgotPassword />;
}
