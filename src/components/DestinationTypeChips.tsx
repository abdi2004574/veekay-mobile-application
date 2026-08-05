import { Pressable, Text, View } from 'react-native';
import { Building2, Compass, Mountain, Ship, Waves } from 'lucide-react-native';
import { colors } from '../constants/colors';
import type { DestinationType } from '../api/types';

const OPTIONS: { value: DestinationType; label: string; icon: typeof Waves }[] = [
  { value: 'beach', label: 'Beach', icon: Waves },
  { value: 'mountain', label: 'Mountain', icon: Mountain },
  { value: 'city', label: 'City', icon: Building2 },
  { value: 'adventure', label: 'Adventure', icon: Compass },
  { value: 'cruise', label: 'Cruise', icon: Ship },
];

export function DestinationTypeChips({
  value,
  onToggle,
}: {
  value: DestinationType[];
  onToggle: (v: DestinationType) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {OPTIONS.map(({ value: v, label, icon: Icon }) => {
        const selected = value.includes(v);
        return (
          <Pressable
            key={v}
            onPress={() => onToggle(v)}
            style={{
              width: '47%',
              padding: 16,
              borderRadius: 16,
              alignItems: 'center',
              gap: 8,
              borderWidth: 2,
              borderColor: selected ? colors.vaykaePink : colors.border,
              backgroundColor: selected ? colors.vaykaePink : colors.inputBackground,
            }}
          >
            <Icon size={22} color={selected ? colors.background : colors.mutedForeground} />
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
