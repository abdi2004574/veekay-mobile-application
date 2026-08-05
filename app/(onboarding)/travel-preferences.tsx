import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { AuthScreenLayout } from '../../src/components/AuthScreenLayout';
import { OnboardingStepper } from '../../src/components/OnboardingStepper';
import { GradientButton } from '../../src/components/GradientButton';
import { DestinationTypeChips } from '../../src/components/DestinationTypeChips';
import { TravelStyleChips } from '../../src/components/TravelStyleChips';
import { colors } from '../../src/constants/colors';
import { useOnboardingWizardStore } from '../../src/stores/onboarding-wizard-store';

export default function TravelPreferencesScreen() {
  const destinationTypes = useOnboardingWizardStore((s) => s.destinationTypes);
  const travelStyles = useOnboardingWizardStore((s) => s.travelStyles);
  const toggleDestinationType = useOnboardingWizardStore((s) => s.toggleDestinationType);
  const toggleTravelStyle = useOnboardingWizardStore((s) => s.toggleTravelStyle);

  const isValid = destinationTypes.length > 0 && travelStyles.length > 0;

  return (
    <AuthScreenLayout>
      <OnboardingStepper step={2} label="Travel Preferences" />
      <Text className="text-xl font-bold text-foreground mb-1">Travel Preferences</Text>
      <Text className="text-sm mb-6" style={{ color: colors.mutedForeground }}>
        Help us personalize your experience
      </Text>

      <View style={{ gap: 24 }}>
        <View>
          <Text className="text-sm font-bold text-foreground mb-3">
            What kind of destinations do you love? *
          </Text>
          <DestinationTypeChips value={destinationTypes} onToggle={toggleDestinationType} />
        </View>

        <View>
          <Text className="text-sm font-bold text-foreground mb-3">
            What&apos;s your travel style? *
          </Text>
          <TravelStyleChips value={travelStyles} onToggle={toggleTravelStyle} />
        </View>
      </View>

      <View className="mt-8">
        <GradientButton
          onPress={() => router.push('/(onboarding)/add-trips')}
          disabled={!isValid}
        >
          Continue
        </GradientButton>
      </View>
    </AuthScreenLayout>
  );
}
