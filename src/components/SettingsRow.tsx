import { Pressable, Switch, Text, View } from 'react-native';
import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { colors } from '../constants/colors';

interface SettingsRowProps {
  icon: LucideIcon;
  label: string;
  subtitle?: string;
  destructive?: boolean;
  onPress?: () => void;
  toggled?: boolean;
  onToggle?: (value: boolean) => void;
}

export function SettingsRow({
  icon: Icon,
  label,
  subtitle,
  destructive,
  onPress,
  toggled,
  onToggle,
}: SettingsRowProps) {
  const isToggle = onToggle !== undefined;
  const labelColor = destructive ? colors.destructive : colors.foreground;

  return (
    <Pressable
      onPress={isToggle ? undefined : onPress}
      className="flex-row items-center gap-3 p-4"
    >
      <View
        className="items-center justify-center rounded-xl"
        style={{
          width: 40,
          height: 40,
          backgroundColor: destructive ? colors.destructive : colors.vaykaePink,
        }}
      >
        <Icon size={18} color={colors.background} />
      </View>
      <View style={{ flex: 1 }}>
        <Text className="font-bold" style={{ color: labelColor }}>
          {label}
        </Text>
        {subtitle && (
          <Text className="text-xs mt-0.5" style={{ color: colors.mutedForeground }}>
            {subtitle}
          </Text>
        )}
      </View>
      {isToggle ? (
        <Switch value={toggled} onValueChange={onToggle} trackColor={{ true: colors.vaykaePink }} />
      ) : onPress ? (
        <ChevronRight size={18} color={colors.mutedForeground} />
      ) : null}
    </Pressable>
  );
}
