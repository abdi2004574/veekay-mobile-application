import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { vaykaeGradient, colors } from "../constants/colors";

interface GradientButtonProps {
  children: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "outline";
  className?: string;
}

export function GradientButton({
  children,
  onPress,
  disabled,
  loading,
  variant = "primary",
  className = "",
}: GradientButtonProps) {
  const isDisabled = disabled || loading;

  if (variant === "outline") {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        className={"h-14 rounded-2xl border-2 items-center justify-center px-6 " + className}
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

  if (isDisabled) {
    return (
      <View
        className={"h-14 items-center justify-center px-6 rounded-2xl " + className}
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
    <Pressable onPress={onPress} className={className}>
      <LinearGradient
        colors={vaykaeGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 16,
          height: 56,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
      >
        <Text className="text-white font-semibold text-base">{children}</Text>
      </LinearGradient>
    </Pressable>
  );
}
