import { Text, View } from 'react-native';
import { colors } from '../constants/colors';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor: string;
  trend?: { value: number; label: string };
}

export function KpiCard({ label, value, icon, iconColor, trend }: KpiCardProps) {
  return (
    <View className='p-5 rounded-2xl bg-card border border-border flex-1 min-w-[140px]'>
      <View className='flex-row items-start justify-between mb-2'>
        <View
          className='items-center justify-center rounded-xl'
          style={{ width: 40, height: 40, backgroundColor: iconColor + '20' }}
        >
          {icon}
        </View>
        {trend && (
          <View
            className='flex-row items-center gap-1 px-2 py-1 rounded-full'
            style={{
              backgroundColor: trend.value >= 0 ? colors.success + '20' : colors.destructive + '20',
            }}
          >
            <Text
              className='text-xs font-bold'
              style={{ color: trend.value >= 0 ? colors.success : colors.destructive }}
            >
              {trend.value >= 0 ? '+' : ''}{trend.value}%
            </Text>
            <Text className='text-xs' style={{ color: colors.mutedForeground }}>
              {trend.label}
            </Text>
          </View>
        )}
      </View>
      <Text className='text-2xl font-bold text-foreground'>{value}</Text>
      <Text className='text-xs mt-1' style={{ color: colors.mutedForeground }}>
        {label}
      </Text>
    </View>
  );
}
