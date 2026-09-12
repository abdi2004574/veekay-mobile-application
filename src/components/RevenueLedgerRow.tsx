import { Text, View } from 'react-native';
import { colors } from '../constants/colors';
import type { RevenueLedgerItem } from '../api/agency-revenue';

interface RevenueLedgerRowProps {
  item: RevenueLedgerItem;
  index: number;
}

export function RevenueLedgerRow({ item, index }: RevenueLedgerRowProps) {
  const isEven = index % 2 === 0;

  return (
    <View
      className='flex-row items-center py-3 px-4'
      style={{
        backgroundColor: isEven ? 'transparent' : colors.muted + '50',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View className='w-24 flex-1'>
        <Text className='text-xs font-bold text-foreground'>{item.packageTitle}</Text>
        <Text className='text-xs' style={{ color: colors.mutedForeground }}>{item.bookingId.slice(0, 12)}...</Text>
      </View>
      <View className='w-20 flex-1 items-center'>
        <Text className='text-xs font-bold text-success'>{'+' + item.amount.toLocaleString()}</Text>
        <Text className='text-xs' style={{ color: colors.mutedForeground }}>Amount</Text>
      </View>
      <View className='w-20 flex-1 items-center'>
        <Text className='text-xs font-bold' style={{ color: colors.destructive }}>{'-' + item.commission.toLocaleString()}</Text>
        <Text className='text-xs' style={{ color: colors.mutedForeground }}>Commission</Text>
      </View>
      <View className='w-20 flex-1 items-center'>
        <Text className='text-xs font-bold text-foreground'>{item.netPayout.toLocaleString()}</Text>
        <Text className='text-xs' style={{ color: colors.mutedForeground }}>Net</Text>
      </View>
      <View className='w-24 flex-1 items-center'>
        <Text className='text-xs' style={{ color: colors.mutedForeground }}>
          {new Date(item.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </Text>
      </View>
    </View>
  );
}

export function RevenueLedgerHeader() {
  return (
    <View className='flex-row items-center py-2 px-4 bg-muted border-b' style={{ borderColor: colors.border }}>
      <View className='w-24 flex-1'>
        <Text className='text-xs font-bold' style={{ color: colors.mutedForeground }}>Package</Text>
      </View>
      <View className='w-20 flex-1 items-center'>
        <Text className='text-xs font-bold' style={{ color: colors.mutedForeground }}>Traveler</Text>
      </View>
      <View className='w-20 flex-1 items-center'>
        <Text className='text-xs font-bold' style={{ color: colors.mutedForeground }}>Amount</Text>
      </View>
      <View className='w-20 flex-1 items-center'>
        <Text className='text-xs font-bold' style={{ color: colors.mutedForeground }}>Commission</Text>
      </View>
      <View className='w-20 flex-1 items-center'>
        <Text className='text-xs font-bold' style={{ color: colors.mutedForeground }}>Net Payout</Text>
      </View>
      <View className='w-24 flex-1 items-center'>
        <Text className='text-xs font-bold' style={{ color: colors.mutedForeground }}>Date</Text>
      </View>
    </View>
  );
}
