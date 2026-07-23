import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AuthScreenLayout } from '../../src/components/AuthScreenLayout';
import { OtpInput } from '../../src/components/OtpInput';
import { GradientButton } from '../../src/components/GradientButton';
import { useResendOtp, useVerifyEmail } from '../../src/hooks/use-auth-mutations';
import { useToastStore } from '../../src/stores/toast-store';
import { friendlyErrorMessage } from '../../src/utils/error-message';
import { colors } from '../../src/constants/colors';

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyOtp() {
  const { userId, email } = useLocalSearchParams<{ userId: string; email: string }>();
  const [otp, setOtp] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);
  const showToast = useToastStore((s) => s.show);

  const verifyEmail = useVerifyEmail();
  const resendOtp = useResendOtp();

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const handleVerify = () => {
    verifyEmail.mutate(
      { userId, otp },
      {
        onSuccess: () => router.replace('/'),
        onError: (err) => showToast(friendlyErrorMessage(err)),
      },
    );
  };

  const handleResend = () => {
    setOtp('');
    resendOtp.mutate(
      { email, type: 'email_verify' },
      { onSuccess: () => setSecondsLeft(RESEND_COOLDOWN_SECONDS) },
    );
  };

  return (
    <AuthScreenLayout>
      <Text className="text-[20px] text-foreground mb-2">Verify Your Email</Text>
      <Text className="text-muted-foreground mb-8">
        We sent a verification code to{' '}
        <Text className="font-medium text-foreground">{email}</Text>
      </Text>

      <View className="mb-6">
        <OtpInput value={otp} onChange={setOtp} />
      </View>

      <View className="items-center mb-8">
        {secondsLeft > 0 ? (
          <Text className="text-muted-foreground">
            Resend code in{' '}
            <Text className="font-medium text-foreground">
              0:{secondsLeft.toString().padStart(2, '0')}
            </Text>
          </Text>
        ) : (
          <Text
            onPress={handleResend}
            style={{ color: colors.vaykaePink }}
            className="font-medium"
          >
            Resend Code
          </Text>
        )}
      </View>

      <GradientButton
        onPress={handleVerify}
        disabled={otp.length !== 6}
        loading={verifyEmail.isPending}
      >
        Verify & Continue
      </GradientButton>
    </AuthScreenLayout>
  );
}
