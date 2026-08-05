import { Pressable, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import type { TravelStyle } from '../api/types';

const OPTIONS: { value: TravelStyle; label: string }[] = [
  { value: 'luxury', label: 'Luxury' },
  { value: 'budget', label: 'Budget' },
  { value: 'backpacking', label: 'Backpacking' },
  { value: 'family', label: 'Family' },
  { value: 'solo', label: 'Solo' },
  { value: 'group', label: 'Group' },
];

export function TravelStyleChips({
  value,
  onToggle,
}: {
  value: TravelStyle[];
  onToggle: (v: TravelStyle) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {OPTIONS.map(({ value: v, label }) => {
        const selected = value.includes(v);
        return (
          <Pressable
            key={v}
            onPress={() => onToggle(v)}
            style={{
              width: '47%',
              paddingVertical: 14,
              borderRadius: 16,
              alignItems: 'center',
              borderWidth: 2,
              borderColor: selected ? colors.vaykaePink : colors.border,
              backgroundColor: selected ? colors.vaykaePink : colors.inputBackground,
            }}
          >
            <Text
              className="font-medium"
              style={{ color: selected ? colors.background : colors.foreground }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
