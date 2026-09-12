import { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Wallet, ArrowDownRight, ArrowUpRight } from 'lucide-react-native';
import { TravelerBottomNav } from '../../../src/components/TravelerBottomNav';
import { colors } from '../../../src/constants/colors';
import { useMyWallet, useWalletTransactions } from '../../../src/hooks/use-wallet-queries';
import type { WalletTransaction } from '../../../src/api/types';

export default function WalletScreen() {
  const wallet = useMyWallet();
  const transactions = useWalletTransactions({ limit: 10 });

  const recent = transactions.data?.items ?? [];

  const formattedBalance = useMemo(() => {
    if (!wallet.data) return '\.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: wallet.data.currency,
    }).format(wallet.data.balance);
  }, [wallet.data]);

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top']}>
      <View
        className='flex-row items-center px-4 h-14'
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Pressable>
        <Text className='text-lg font-bold text-foreground ml-3'>Wallet</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 96 }}>
        {wallet.isLoading ? (
          <View className='items-center justify-center py-12'>
            <ActivityIndicator color={colors.vaykaePink} />
          </View>
        ) : wallet.isError ? (
          <View className='items-center py-12'>
            <Text style={{ color: colors.mutedForeground }} className='mb-3'>
              Couldn&apos;t load your wallet.
            </Text>
            <Pressable onPress={() => wallet.refetch()}>
              <Text style={{ color: colors.vaykaePink }} className='font-semibold'>
                Try again
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View
              className='rounded-2xl p-6 mb-6'
              style={{ backgroundColor: colors.vaykaePink }}
            >
              <Text className='text-sm font-medium text-white/80 mb-1'>Available Balance</Text>
              <Text className='text-3xl font-bold text-white'>{formattedBalance}</Text>
              <Text className='text-xs text-white/60 mt-1'>{wallet.data?.currency}</Text>
            </View>

            <View className='flex-row gap-3 mb-6'>
              <Pressable
                onPress={() => router.push('/(traveler)/wallet/withdrawals/new')}
                className='flex-1 rounded-2xl p-4 items-center'
                style={{ borderWidth: 1, borderColor: colors.border }}
              >
                <ArrowUpRight size={20} color={colors.vaykaePink} />
                <Text className='font-bold text-foreground mt-2'>Withdraw</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push('/(traveler)/wallet/withdrawals')}
                className='flex-1 rounded-2xl p-4 items-center'
                style={{ borderWidth: 1, borderColor: colors.border }}
              >
                <ArrowDownRight size={20} color={colors.vaykaePink} />
                <Text className='font-bold text-foreground mt-2'>History</Text>
              </Pressable>
            </View>

            <View className='flex-row items-center justify-between mb-3'>
              <Text className='text-sm font-bold text-foreground'>Recent Transactions</Text>
              <Pressable onPress={() => router.push('/(traveler)/wallet/transactions')}>
                <Text className='text-xs font-semibold' style={{ color: colors.vaykaePink }}>
                  View all
                </Text>
              </Pressable>
            </View>

            {transactions.isLoading ? (
              <ActivityIndicator color={colors.vaykaePink} className='py-6' />
            ) : recent.length === 0 ? (
              <View className='items-center py-8'>
                <Wallet size={32} color={colors.mutedForeground} />
                <Text className='mt-3 text-center' style={{ color: colors.mutedForeground }}>
                  No transactions yet.
                </Text>
              </View>
            ) : (
              <View
                className='rounded-2xl overflow-hidden'
                style={{ borderWidth: 1, borderColor: colors.border }}
              >
                {recent.map((tx, index) => (
                  <TransactionRow key={tx.id} transaction={tx} isLast={index === recent.length - 1} />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <TravelerBottomNav active='wallet' />
    </SafeAreaView>
  );
}

function TransactionRow({ transaction, isLast }: { transaction: WalletTransaction; isLast: boolean }) {
  const isCredit = transaction.direction === 'credit';
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: transaction.currency,
  }).format(transaction.amount);

  return (
    <Pressable
      onPress={() => router.push('/(traveler)/wallet/transactions')}
      className='flex-row items-center justify-between p-4'
    >
      <View className='flex-row items-center gap-3'>
        <View
          className='rounded-full p-2'
          style={{ backgroundColor: isCredit ? 'rgba(22,163,74,0.1)' : 'rgba(215,1,168,0.1)' }}
        >
          {isCredit ? (
            <ArrowDownRight size={16} color={colors.success} />
          ) : (
            <ArrowUpRight size={16} color={colors.vaykaePink} />
          )}
        </View>
        <View>
          <Text className='font-semibold text-foreground text-sm'>
            {formatTransactionType(transaction.type)}
          </Text>
          {transaction.description && (
            <Text className='text-xs mt-0.5' style={{ color: colors.mutedForeground }}>
              {transaction.description}
            </Text>
          )}
        </View>
      </View>
      <Text
        className='font-bold text-sm'
        style={{ color: isCredit ? colors.success : colors.foreground }}
      >
        {isCredit ? '+' : '-'}{formatted}
      </Text>
    </Pressable>
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
