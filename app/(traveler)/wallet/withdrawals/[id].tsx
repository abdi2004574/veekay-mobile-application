import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { TravelerBottomNav } from '../../../../src/components/TravelerBottomNav';
import { colors } from '../../../../src/constants/colors';
import { useWithdrawalDetail } from '../../../../src/hooks/use-wallet-queries';

export default function WithdrawalDetailScreen({ id }: { id: string }) {
  const withdrawal = useWithdrawalDetail(id);

  if (withdrawal.isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-background items-center justify-center'>
        <ActivityIndicator color={colors.vaykaePink} />
      </SafeAreaView>
    );
  }

  if (withdrawal.isError || !withdrawal.data) {
    return (
      <SafeAreaView className='flex-1 bg-background items-center justify-center px-6'>
        <Text className='text-center mb-3' style={{ color: colors.mutedForeground }}>
          Couldn&apos;t load this withdrawal request.
        </Text>
        <Pressable onPress={() => withdrawal.refetch()}>
          <Text style={{ color: colors.vaykaePink }} className='font-semibold'>
            Try again
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const w = withdrawal.data;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: w.currency,
  }).format(w.amount);

  const statusColor = getStatusColor(w.status);

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top']}>
      <View
        className='flex-row items-center px-4 h-14'
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Pressable>
        <Text className='text-lg font-bold text-foreground ml-3'>Withdrawal Detail</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 96 }}>
        <View
          className='rounded-2xl p-6 mb-6 items-center'
          style={{ borderWidth: 1, borderColor: colors.border }}
        >
          <Text className='text-sm mb-2' style={{ color: colors.mutedForeground }}>Amount</Text>
          <Text className='text-3xl font-bold text-foreground'>{formatted}</Text>
          <View
            className='mt-3 px-4 py-1 rounded-full'
            style={{ backgroundColor: statusColor + '20' }}
          >
            <Text className='text-sm font-bold' style={{ color: statusColor }}>
              {capitalize(w.status)}
            </Text>
          </View>
        </View>

        <View
          className='rounded-2xl overflow-hidden mb-6'
          style={{ borderWidth: 1, borderColor: colors.border }}
        >
          <DetailRow label='Withdrawal ID' value={w.id} />
          <DetailRow label='Currency' value={w.currency} />
          <DetailRow label='Requested' value={new Date(w.createdAt).toLocaleString()} />
          {w.campaignId && <DetailRow label='Campaign ID' value={w.campaignId} />}
          {w.rejectionReason && (
            <View className='p-4' style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Text className='text-sm font-bold text-foreground mb-1'>Rejection Reason</Text>
              <Text className='text-sm' style={{ color: colors.mutedForeground }}>{w.rejectionReason}</Text>
            </View>
          )}
          {w.refundNote && (
            <View className='p-4'>
              <Text className='text-sm font-bold text-foreground mb-1'>Refund Note</Text>
              <Text className='text-sm' style={{ color: colors.mutedForeground }}>{w.refundNote}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TravelerBottomNav active='wallet' />
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      className='flex-row justify-between p-4'
      style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
    >
      <Text className='text-sm' style={{ color: colors.mutedForeground }}>{label}</Text>
      <Text className='text-sm font-semibold text-foreground text-right'>{value}</Text>
    </View>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'requested':
      return colors.vaykaePink;
    case 'approved':
      return '#2563eb';
    case 'paid':
      return colors.success;
    case 'rejected':
      return colors.destructive;
    default:
      return colors.mutedForeground;
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}