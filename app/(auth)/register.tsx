import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Building2, Lock, Mail, User } from 'lucide-react-native';
import { AuthScreenLayout } from '../../src/components/AuthScreenLayout';
import { AgencyAuthLayout } from '../../src/components/AgencyAuthLayout';
import { TextField } from '../../src/components/TextField';
import { GradientButton } from '../../src/components/GradientButton';
import { Checkbox } from '../../src/components/Checkbox';
import { SocialAuthRow } from '../../src/components/SocialAuthRow';
import {
  useRegisterAgency,
  useRegisterTraveler,
} from '../../src/hooks/use-auth-mutations';
import { useToastStore } from '../../src/stores/toast-store';
import { friendlyErrorMessage } from '../../src/utils/error-message';
import { colors } from '../../src/constants/colors';

const AGENCY_ICON_SPACER_WIDTH = 30; // Building2 (22) + row gap (8), balances the icon on the other side.

function TravelerRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const showToast = useToastStore((s) => s.show);

  const registerTraveler = useRegisterTraveler();
  const isValid = Boolean(name) && Boolean(email) && password.length >= 8 && agreedToTerms;

  const handleSubmit = () => {
    registerTraveler.mutate(
      { email, password, displayName: name },
      {
        onSuccess: (result) => {
          router.push({
            pathname: '/(auth)/verify-otp',
            params: { userId: result.userId, email, role: 'traveler' },
          });
        },
        onError: (err) => showToast(friendlyErrorMessage(err)),
      },
    );
  };

  return (
    <AuthScreenLayout>
      <Text className="text-[20px] text-foreground mb-2">Create Account</Text>
      <Text className="text-muted-foreground mb-8">Sign up to start your journey</Text>

      <View className="gap-4 mb-2">
        <TextField icon={User} placeholder="Your name" value={name} onChangeText={setName} />
        <TextField
          icon={Mail}
          placeholder="Enter your email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <View>
          <TextField
            icon={Lock}
            placeholder="Create a password"
            isPassword
            value={password}
            onChangeText={setPassword}
          />
          <Text className="text-xs text-muted-foreground mt-2">
            Must be at least 8 characters
          </Text>
        </View>
      </View>

      <View className="flex-row items-start gap-2 my-4">
        <Checkbox checked={agreedToTerms} onChange={setAgreedToTerms} />
        <Text className="flex-1 text-sm text-muted-foreground">
          I agree to the{' '}
          <Text style={{ color: colors.vaykaePink }} className="font-medium">
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text style={{ color: colors.vaykaePink }} className="font-medium">
            Privacy Policy
          </Text>
        </Text>
      </View>

      <GradientButton onPress={handleSubmit} disabled={!isValid} loading={registerTraveler.isPending}>
        Sign Up
      </GradientButton>

      <SocialAuthRow />

      <Text className="text-center text-muted-foreground mt-6">
        Already have an account?{' '}
        <Link href={{ pathname: '/(auth)/login', params: { role: 'traveler' } }}>
          <Text style={{ color: colors.vaykaePink }} className="font-semibold">
            Log In
          </Text>
        </Link>
      </Text>
    </AuthScreenLayout>
  );
}

function AgencyRegister() {
  const [agencyName, setAgencyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const showToast = useToastStore((s) => s.show);

  const registerAgency = useRegisterAgency();
  const passwordsMatch = password === confirmPassword;
  const isValid =
    Boolean(agencyName) &&
    Boolean(email) &&
    Boolean(confirmPassword) &&
    passwordsMatch &&
    password.length >= 8 &&
    agreedToTerms;

  const handleSubmit = () => {
    registerAgency.mutate(
      { email, password, agencyName },
      {
        onSuccess: (result) => {
          router.push({
            pathname: '/(auth)/verify-otp',
            params: { userId: result.userId, email, role: 'agency' },
          });
        },
        onError: (err) => showToast(friendlyErrorMessage(err)),
      },
    );
  };

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
            <Text className="text-2xl font-bold text-foreground">Travel Agency Sign Up</Text>
            <View style={{ width: AGENCY_ICON_SPACER_WIDTH }} />
          </View>
          <Text className="text-muted-foreground text-center">
            Join Vaykae as a verified travel agency
          </Text>
        </>
      }
    >
      <View className="gap-4 mb-2">
        <TextField
          icon={Building2}
          placeholder="Agency name"
          value={agencyName}
          onChangeText={setAgencyName}
        />
        <TextField
          icon={Mail}
          placeholder="agency@business.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <View>
          <TextField
            icon={Lock}
            placeholder="Create a password"
            isPassword
            value={password}
            onChangeText={setPassword}
          />
          <Text className="text-xs text-muted-foreground mt-2">
            Must be at least 8 characters
          </Text>
        </View>
        <View>
          <TextField
            icon={Lock}
            placeholder="Confirm password"
            isPassword
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {Boolean(confirmPassword) && !passwordsMatch && (
            <Text style={{ color: colors.destructive }} className="text-xs mt-2">
              Passwords do not match
            </Text>
          )}
        </View>
      </View>

      <View
        className="flex-row items-start gap-3 p-4 rounded-2xl border my-2"
        style={{ borderColor: colors.border, backgroundColor: colors.inputBackground }}
      >
        <Checkbox checked={agreedToTerms} onChange={setAgreedToTerms} />
        <Text className="flex-1 text-sm text-muted-foreground">
          I agree to the{' '}
          <Text style={{ color: colors.vaykaePink }} className="font-medium">
            Terms & Conditions
          </Text>{' '}
          and{' '}
          <Text style={{ color: colors.vaykaePink }} className="font-medium">
            Privacy Policy
          </Text>
        </Text>
      </View>

      <View className="mt-4">
        <GradientButton onPress={handleSubmit} disabled={!isValid} loading={registerAgency.isPending}>
          Continue
        </GradientButton>

        <Text className="text-center text-muted-foreground mt-4">
          Already have an account?{' '}
          <Link href={{ pathname: '/(auth)/login', params: { role: 'agency' } }}>
            <Text style={{ color: colors.vaykaePink }} className="font-medium">
              Login
            </Text>
          </Link>
        </Text>
      </View>
    </AgencyAuthLayout>
  );
}

export default function Register() {
  const { role } = useLocalSearchParams<{ role?: string }>();
  return role === 'agency' ? <AgencyRegister /> : <TravelerRegister />;
}
