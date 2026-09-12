import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Wallet } from 'lucide-react-native';
import { TravelerBottomNav } from '../../../src/components/TravelerBottomNav';
import { colors } from '../../../src/constants/colors';
import { useWalletTransactions } from '../../../src/hooks/use-wallet-queries';

type TxTypeFilter = 'all' | 'donation_received' | 'donation_fee' | 'withdrawal' | 'refund' | 'commission' | 'booking_payment';

const FILTERS: { key: TxTypeFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'donation_received', label: 'Donations' },
  { key: 'withdrawal', label: 'Withdrawals' },
  { key: 'commission', label: 'Commission' },
];

export default function TransactionsScreen() {
  const [filter, setFilter] = useState<TxTypeFilter>('all');
  const [cursor, setCursor] = useState<string | undefined>();
  const transactions = useWalletTransactions({
    type: filter === 'all' ? undefined : filter,
    cursor,
    limit: 20,
  });

  const items = useMemo(() => transactions.data?.items ?? [], [transactions.data]);
  const hasMore = transactions.data?.nextCursor != null;

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top']}>
      <View
        className='flex-row items-center px-4 h-14'
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Pressable>
        <Text className='text-lg font-bold text-foreground ml-3'>Transactions</Text>
      </View>

      <ScrollView horizontal className='py-3 px-4' showsHorizontalScrollIndicator={false}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => {
              setFilter(f.key);
              setCursor(undefined);
            }}
            className='px-4 py-2 rounded-full mr-2'
            style={{
              backgroundColor: filter === f.key ? colors.vaykaePink : colors.inputBackground,
            }}
          >
            <Text
              className='text-sm font-semibold'
              style={{ color: filter === f.key ? colors.background : colors.foreground }}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 96 }}>
        {transactions.isLoading ? (
          <View className='items-center justify-center py-12'>
            <ActivityIndicator color={colors.vaykaePink} />
          </View>
        ) : items.length === 0 ? (
          <View className='items-center py-12'>
            <Wallet size={40} color={colors.mutedForeground} />
            <Text className='mt-3 text-center' style={{ color: colors.mutedForeground }}>
              No transactions found.
            </Text>
          </View>
        ) : (
          <View
            className='rounded-2xl overflow-hidden'
            style={{ borderWidth: 1, borderColor: colors.border }}
          >
            {items.map((tx, index) => (
              <TransactionRow key={tx.id} transaction={tx} isLast={index === items.length - 1 && !hasMore} />
            ))}
          </View>
        )}

        {hasMore && (
          <Pressable
            onPress={() => setCursor(transactions.data!.nextCursor!)}
            className='mt-4 p-4 rounded-2xl items-center'
            style={{ borderWidth: 1, borderColor: colors.border }}
          >
            <Text className='font-semibold' style={{ color: colors.vaykaePink }}>
              Load more
            </Text>
          </Pressable>
        )}
      </ScrollView>

      <TravelerBottomNav active='wallet' />
    </SafeAreaView>
  );
}

function TransactionRow({ transaction, isLast }: { transaction: any; isLast: boolean }) {
  const isCredit = transaction.direction === 'credit';
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: transaction.currency,
  }).format(transaction.amount);

  return (
    <View style={isLast ? {} : { borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <View className='flex-row items-center justify-between p-4'>
        <View>
          <Text className='font-semibold text-foreground text-sm'>
            {formatTransactionType(transaction.type)}
          </Text>
          {transaction.description && (
            <Text className='text-xs mt-0.5' style={{ color: colors.mutedForeground }}>
              {transaction.description}
            </Text>
          )}
          <Text className='text-xs mt-1' style={{ color: colors.mutedForeground }}>
            {new Date(transaction.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <Text
          className='font-bold text-sm'
          style={{ color: isCredit ? colors.success : colors.foreground }}
        >
          {isCredit ? '+' : '-'}{formatted}
        </Text>
      </View>
    </View>
  );
}

function formatTransactionType(type: string): string {
  const map: Record<string, string> = {
    donation_received: 'Donation Received',
    donation_fee: 'Platform Fee',
    withdrawal: 'Withdrawal',
    refund: 'Refund',
    commission: 'Commission',
    booking_payment: 'Booking Payment',
  };
  return map[type] ?? type;
}
