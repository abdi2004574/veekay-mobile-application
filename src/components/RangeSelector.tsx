import { Pressable, Text, View } from 'react-native';
import { colors } from '../constants/colors';

export type RangeOption = '7d' | '30d' | '90d' | 'custom';

interface RangeSelectorProps {
  value: RangeOption;
  onChange: (value: RangeOption) => void;
  className?: string;
}

export function RangeSelector({ value, onChange, className = '' }: RangeSelectorProps) {
  const options: { value: RangeOption; label: string }[] = [
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '90d', label: '90D' },
    { value: 'custom', label: 'Custom' },
  ];

  return (
    <View className={'flex-row gap-1 p-1 rounded-xl bg-muted ' + className} style={{ borderWidth: 1, borderColor: colors.border }}>
      {options.map((opt) => (
        <Pressable
          key={opt.value}
          onPress={() => onChange(opt.value)}
          className={'flex-1 py-2 px-3 rounded-lg items-center transition-colors ' +
            (value === opt.value
              ? 'bg-background shadow-sm'
              : 'text-muted-foreground')
          }
          style={{
            backgroundColor: value === opt.value ? colors.background : 'transparent',
          }}
        >
          <Text
            className='text-sm font-bold'
            style={{
              color: value === opt.value ? colors.foreground : colors.mutedForeground,
            }}
          >
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
