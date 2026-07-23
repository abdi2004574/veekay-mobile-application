import { useState } from 'react';
import { TextInput, TextInputProps, View, Pressable } from 'react-native';
import { Eye, EyeOff, LucideIcon } from 'lucide-react-native';
import { colors } from '../constants/colors';

interface TextFieldProps extends TextInputProps {
  icon: LucideIcon;
  isPassword?: boolean;
}

export function TextField({ icon: Icon, isPassword, ...props }: TextFieldProps) {
  const [hidden, setHidden] = useState(isPassword);

  return (
    <View className="relative justify-center">
      <View className="absolute left-4 z-10">
        <Icon size={20} color={colors.mutedForeground} />
      </View>
      <TextInput
        placeholderTextColor={colors.mutedForeground}
        secureTextEntry={hidden}
        className="h-14 rounded-2xl bg-input-background pl-12 pr-12 text-base text-foreground"
        {...props}
      />
      {isPassword && (
        <Pressable
          className="absolute right-4 z-10"
          onPress={() => setHidden((prev) => !prev)}
          hitSlop={8}
        >
          {hidden ? (
            <Eye size={20} color={colors.mutedForeground} />
          ) : (
            <EyeOff size={20} color={colors.mutedForeground} />
          )}
        </Pressable>
      )}
    </View>
  );
}
