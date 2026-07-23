import { useRef } from 'react';
import { TextInput, View } from 'react-native';
import { colors } from '../constants/colors';

const LENGTH = 6;

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function OtpInput({ value, onChange }: OtpInputProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const digits = Array.from({ length: LENGTH }, (_, i) => value[i] ?? '');

  const handleChange = (index: number, text: string) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join(''));

    if (digit && index < LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-center gap-3">
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          value={digit}
          onChangeText={(text) => handleChange(index, text)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
          keyboardType="number-pad"
          maxLength={1}
          className="w-12 h-14 text-center text-xl font-bold rounded-2xl border-2 border-border bg-input-background text-foreground"
          style={{ borderColor: digit ? colors.vaykaePink : undefined }}
        />
      ))}
    </View>
  );
}
