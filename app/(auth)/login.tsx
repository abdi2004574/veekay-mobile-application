import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Building2, Lock, Mail } from 'lucide-react-native';
import { AuthScreenLayout } from '../../src/components/AuthScreenLayout';
import { AgencyAuthLayout } from '../../src/components/AgencyAuthLayout';
import { TextField } from '../../src/components/TextField';
import { GradientButton } from '../../src/components/GradientButton';
import { SocialAuthRow } from '../../src/components/SocialAuthRow';
import {
  useAgencyLogin,
  useLogin,
  useResendOtp,
} from '../../src/hooks/use-auth-mutations';
import { useToastStore } from '../../src/stores/toast-store';
import { friendlyErrorMessage } from '../../src/utils/error-message';
import { navigateAfterLogin } from '../../src/utils/post-login-navigation';
import { colors } from '../../src/constants/colors';

const AGENCY_ICON_SPACER_WIDTH = 30; // Building2 (22) + row gap (8), balances the icon on the other side.

function TravelerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const showToast = useToastStore((s) => s.show);

  const login = useLogin();

  const handleLogin = () => {
    login.mutate(
      { email, password },
      {
        onSuccess: (result) => navigateAfterLogin(result.user),
        onError: (err) => showToast(friendlyErrorMessage(err)),
      },
    );
  };

  return (
    <AuthScreenLayout>
      <Text className="text-[20px] text-foreground mb-2">Welcome Back</Text>
      <Text className="text-muted-foreground mb-8">Log in to continue your journey</Text>

      <View className="gap-4 mb-2">
        <TextField
          icon={Mail}
          placeholder="Enter your email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          icon={Lock}
          placeholder="Enter your password"
          isPassword
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View className="items-end mt-2 mb-6">
        <Link href={{ pathname: '/(auth)/forgot-password' }}>
          <Text style={{ color: colors.vaykaePink }} className="font-medium">
            Forgot Password?
          </Text>
        </Link>
      </View>

      <GradientButton
        onPress={handleLogin}
        disabled={!email || !password}
        loading={login.isPending}
      >
        Log In
      </GradientButton>

      <SocialAuthRow />

      <Text className="text-center text-muted-foreground mt-6">
        Don&apos;t have an account?{' '}
        <Link href={{ pathname: '/(auth)/register', params: { role: 'traveler' } }}>
          <Text style={{ color: colors.vaykaePink }} className="font-semibold">
            Sign Up
          </Text>
        </Link>
      </Text>
    </AuthScreenLayout>
  );
}

function AgencyLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useOtp, setUseOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const showToast = useToastStore((s) => s.show);

  const agencyLogin = useAgencyLogin();
  const resendOtp = useResendOtp();

  const handleSendOtp = () => {
    resendOtp.mutate(
      { email, type: 'login' },
      {
        onSuccess: () => setOtpSent(true),
        onError: (err) => showToast(friendlyErrorMessage(err)),
      },
    );
  };

  const handleLogin = () => {
    agencyLogin.mutate(
      useOtp ? { email, otp } : { email, password },
      {
        onSuccess: (result) => navigateAfterLogin(result.user),
        onError: (err) => showToast(friendlyErrorMessage(err)),
      },
    );
  };

  const canSubmit = useOtp ? otpSent && otp.length === 6 : Boolean(email) && Boolean(password);

  return (
    <AgencyAuthLayout
      header={
        <>
          <Image
            source={require('../../assets/images/agency-logo.png')}
            style={{ width: 160, height: 36, marginBottom: 16 }}
            resizeMode="contain"
          />
          <View className="flex-row items-center gap-2 mb-2">
            <Building2 size={22} color={colors.vaykaePink} />
            <Text className="text-2xl font-bold text-foreground">Agency Login</Text>
            <View style={{ width: AGENCY_ICON_SPACER_WIDTH }} />
          </View>
          <Text className="text-muted-foreground text-center">Welcome back to Vaykae</Text>
        </>
      }
    >
      <View className="gap-4 mb-2">
        <TextField
          icon={Mail}
          placeholder="agency@business.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {!useOtp ? (
          <TextField
            icon={Lock}
            placeholder="Enter your password"
            isPassword
            value={password}
            onChangeText={setPassword}
          />
        ) : !otpSent ? (
          <GradientButton onPress={handleSendOtp} disabled={!email} loading={resendOtp.isPending}>
            Send OTP Code
          </GradientButton>
        ) : (
          <View>
            <TextField
              icon={Lock}
              placeholder="000000"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />
            <Text className="text-xs text-muted-foreground mt-2">
              Didn&apos;t receive the code?{' '}
              <Text onPress={handleSendOtp} style={{ color: colors.vaykaePink }}>
                Resend
              </Text>
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center justify-between mb-4">
        <Text
          onPress={() => {
            setUseOtp((prev) => !prev);
            setOtpSent(false);
            setOtp('');
          }}
          style={{ color: colors.vaykaePink }}
          className="text-sm font-medium"
        >
          {useOtp ? 'Use Password' : 'Use OTP Login'}
        </Text>
        {!useOtp && (
          <Link href={{ pathname: '/(auth)/forgot-password', params: { role: 'agency' } }}>
            <Text className="text-sm text-muted-foreground">Forgot Password?</Text>
          </Link>
        )}
      </View>

      <View className="mt-2">
        <GradientButton onPress={handleLogin} disabled={!canSubmit} loading={agencyLogin.isPending}>
          Login
        </GradientButton>

        <Text className="text-center text-muted-foreground mt-4">
          Don&apos;t have an account?{' '}
          <Link href={{ pathname: '/(auth)/register', params: { role: 'agency' } }}>
            <Text style={{ color: colors.vaykaePink }} className="font-medium">
              Sign Up
            </Text>
          </Link>
        </Text>
      </View>
    </AgencyAuthLayout>
  );
}

export default function Login() {
  const { role } = useLocalSearchParams<{ role?: string }>();
  return role === 'agency' ? <AgencyLogin /> : <TravelerLogin />;
}
