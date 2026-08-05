import { Text, View } from 'react-native';
import { colors } from '../constants/colors';

const TOTAL_STEPS = 5;

export function OnboardingStepper({ step, label }: { step: number; label: string }) {
  return (
    <View className="mb-6">
      <View className="flex-row gap-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
          <View
            key={s}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 4,
              backgroundColor: s <= step ? colors.vaykaePink : colors.disabledBackground,
            }}
          />
        ))}
      </View>
      <Text className="text-xs mt-2" style={{ color: colors.mutedForeground }}>
        Step {step} of {TOTAL_STEPS} • {label}
      </Text>
    </View>
  );
}
