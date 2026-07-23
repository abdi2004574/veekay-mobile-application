import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { vaykaeGradient, colors } from '../constants/colors';

interface GradientButtonProps {
  children: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'outline';
}

export function GradientButton({
  children,
  onPress,
  disabled,
  loading,
  variant = 'primary',
}: GradientButtonProps) {
  const isDisabled = disabled || loading;

  if (variant === 'outline') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        className="h-14 rounded-2xl border-2 items-center justify-center px-6"
        style={{
          borderColor: isDisabled ? colors.border : colors.vaykaePink,
          opacity: isDisabled ? 0.6 : 1,
        }}
      >
        <Text
          style={{ color: isDisabled ? colors.mutedForeground : colors.vaykaePink }}
          className="font-semibold"
        >
          {children}
        </Text>
      </Pressable>
    );
  }

  // A dimmed gradient still reads as "active" against this app's pastel
  // backgrounds — swap to a flat muted fill so disabled is unambiguous.
  if (isDisabled) {
    return (
      <View
        className="h-14 items-center justify-center px-6 rounded-2xl"
        style={{ backgroundColor: colors.disabledBackground }}
      >
        {loading ? (
          <ActivityIndicator color={colors.mutedForeground} />
        ) : (
          <Text
            style={{ color: colors.mutedForeground }}
            className="font-semibold text-base"
          >
            {children}
          </Text>
        )}
      </View>
    );
  }

  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={vaykaeGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        // NativeWind's `className` only styles core RN primitives and
        // components explicitly registered with its cssInterop — expo's
        // LinearGradient isn't one of them, so h-14/items-center/etc as a
        // className here are silently no-ops. Real inline `style` is the
        // only thing this component actually respects.
        style={{
          borderRadius: 16,
          height: 56,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
        }}
      >
        <Text className="text-white font-semibold text-base">{children}</Text>
      </LinearGradient>
    </Pressable>
  );
}
