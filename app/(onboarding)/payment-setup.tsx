import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Banknote, CreditCard, Wallet } from 'lucide-react-native';
import { AuthScreenLayout } from '../../src/components/AuthScreenLayout';
import { OnboardingStepper } from '../../src/components/OnboardingStepper';
import { GradientButton } from '../../src/components/GradientButton';
import { colors } from '../../src/constants/colors';
import { useOnboardingWizardStore } from '../../src/stores/onboarding-wizard-store';
import { useCompleteProfileSetup } from '../../src/hooks/use-onboarding-mutations';
import { showInDevelopmentAlert } from '../../src/utils/in-development';

const PAYMENT_METHODS = [
  { icon: Wallet, name: 'PayPal', description: 'Fast, secure payouts to your PayPal account' },
  { icon: CreditCard, name: 'Stripe', description: 'Direct payouts to your bank via Stripe' },
  { icon: Banknote, name: 'Bank Account', description: 'Traditional bank transfer' },
];

export default function PaymentSetupScreen() {
  const wizard = useOnboardingWizardStore();
  const completeProfileSetup = useCompleteProfileSetup();

  const handleFinish = () => {
    completeProfileSetup.mutate(
      {
        photoMediaId: wizard.photoMediaId,
        destinationTypes: wizard.destinationTypes,
        travelStyles: wizard.travelStyles,
        gender: wizard.gender,
        dateOfBirth: wizard.dateOfBirth,
        bio: wizard.bio,
        previousTrips: wizard.previousTrips.map((trip) => ({
          mediaId: trip.mediaId,
          name: trip.name,
          location: trip.location,
          startDate: trip.startDate,
          endDate: trip.endDate,
          travelerCount: trip.travelerCount,
          description: trip.description,
        })),
      },
      { onSuccess: () => router.replace('/(onboarding)/profile-complete') },
    );
  };

  return (
    <AuthScreenLayout>
      <OnboardingStepper step={4} label="Payment Setup" />
      <Text className="text-xl font-bold text-foreground mb-1">Payment Setup</Text>
      <Text className="text-sm mb-6" style={{ color: colors.mutedForeground }}>
        Choose how you&apos;ll receive and send funds
      </Text>

      <Pressable
        onPress={() => showInDevelopmentAlert('Adding a card isn’t available yet.')}
        className="p-5 rounded-2xl mb-4"
        style={{ borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed' }}
      >
        <View className="items-center gap-2">
          <CreditCard size={24} color={colors.mutedForeground} />
          <Text className="font-bold text-foreground">Add a Card</Text>
          <Text className="text-xs text-center" style={{ color: colors.mutedForeground }}>
            Card number, holder name, expiry, and CVV
          </Text>
        </View>
      </Pressable>

      <Text className="text-sm font-bold text-foreground mb-3">Other Payment Methods</Text>
      <View style={{ gap: 10 }}>
        {PAYMENT_METHODS.map(({ icon: Icon, name, description }) => (
          <Pressable
            key={name}
            onPress={() => showInDevelopmentAlert(`Connecting ${name} isn’t available yet.`)}
            className="flex-row items-center gap-3 p-4 rounded-2xl"
            style={{ backgroundColor: colors.inputBackground }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.disabledBackground,
              }}
            >
              <Icon size={18} color={colors.foreground} />
            </View>
            <View style={{ flex: 1 }}>
              <Text className="font-bold text-foreground">{name}</Text>
              <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                {description}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View className="mt-8" style={{ gap: 12 }}>
        <GradientButton onPress={handleFinish} loading={completeProfileSetup.isPending}>
          Skip for Now
        </GradientButton>
      </View>
    </AuthScreenLayout>
  );
}
