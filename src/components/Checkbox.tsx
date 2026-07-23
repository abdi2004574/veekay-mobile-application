import { Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors } from '../constants/colors';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      hitSlop={8}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel="Agree to terms"
      className="w-5 h-5 rounded border items-center justify-center mt-0.5"
      style={{
        borderColor: checked ? colors.foreground : colors.mutedForeground,
        backgroundColor: checked ? colors.foreground : 'transparent',
      }}
    >
      <View style={{ opacity: checked ? 1 : 0 }}>
        <Check size={14} color="#ffffff" strokeWidth={3} />
      </View>
    </Pressable>
  );
}
