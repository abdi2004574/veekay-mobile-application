import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { TravelerBottomNav } from '../../../../src/components/TravelerBottomNav';
import { colors } from '../../../../src/constants/colors';
import { useMyWallet } from '../../../../src/hooks/use-wallet-queries';
import { useCreateWithdrawal } from '../../../../src/hooks/use-wallet-mutations';

export default function NewWithdrawalScreen() {
  const wallet = useMyWallet();
  const createWithdrawal = useCreateWithdrawal();

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [campaignId, setCampaignId] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const balance = wallet.data?.balance ?? 0;
  const walletCurrency = wallet.data?.currency ?? 'USD';

  const handleSubmit = () => {
    setLocalError(null);

    const parsed = parseFloat(amount);
    if (!amount || Number.isNaN(parsed) || parsed <= 0) {
      setLocalError('Please enter a valid amount greater than 0.');
      return;
    }
    if (parsed > balance) {
      const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: walletCurrency }).format(balance);
      setLocalError('Insufficient balance. You have ' + formatted + ' available.');
      return;
    }

    createWithdrawal.mutate(
      { amount: parsed, currency, campaignId: campaignId || undefined },
      {
        onSuccess: () => {
          router.replace('/(traveler)/wallet/withdrawals');
        },
      },
    );
  };

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top']}>
      <View
        className='flex-row items-center px-4 h-14'
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Pressable>
        <Text className='text-lg font-bold text-foreground ml-3'>Request Withdrawal</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 96 }}>
        <View
          className='rounded-2xl p-4 mb-6'
          style={{ borderWidth: 1, borderColor: colors.border }}
        >
          <Text className='text-sm' style={{ color: colors.mutedForeground }}>Available Balance</Text>
          <Text className='text-2xl font-bold text-foreground mt-1'>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: walletCurrency }).format(balance)}
          </Text>
          <Text className='text-xs mt-1' style={{ color: colors.mutedForeground }}>{walletCurrency}</Text>
        </View>

        {localError && (
          <View
            className='rounded-xl p-3 mb-4'
            style={{ backgroundColor: 'rgba(212,24,61,0.1)' }}
          >
            <Text className='text-sm' style={{ color: colors.destructive }}>{localError}</Text>
          </View>
        )}

        <Text className='text-sm font-bold text-foreground mb-2'>Amount</Text>
        <View
          className='rounded-2xl p-4 mb-4'
          style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.inputBackground }}
        >
          <TextInput
            placeholder='0.00'
            placeholderTextColor={colors.mutedForeground}
            value={amount}
            onChangeText={setAmount}
            keyboardType='decimal-pad'
            autoFocus
            className='text-base text-foreground'
          />
        </View>

        <Text className='text-sm font-bold text-foreground mb-2'>Currency</Text>
        <View
          className='rounded-2xl p-4 mb-4'
          style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.inputBackground }}
        >
          <TextInput
            placeholder='USD'
            placeholderTextColor={colors.mutedForeground}
            value={currency}
            onChangeText={setCurrency}
            autoCapitalize='characters'
            className='text-base text-foreground'
          />
        </View>

        <Text className='text-sm font-bold text-foreground mb-2'>Campaign ID (optional)</Text>
        <View
          className='rounded-2xl p-4 mb-6'
          style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.inputBackground }}
        >
          <TextInput
            placeholder='uuid'
            placeholderTextColor={colors.mutedForeground}
            value={campaignId}
            onChangeText={setCampaignId}
            className='text-base text-foreground'
          />
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={createWithdrawal.isPending}
          className='rounded-full p-4 items-center'
          style={{ backgroundColor: colors.vaykaePink }}
        >
          {createWithdrawal.isPending ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text className='font-bold text-white'>Submit Withdrawal Request</Text>
          )}
        </Pressable>

        {createWithdrawal.isError && (
          <Text className='text-center mt-4 text-sm' style={{ color: colors.destructive }}>
            {createWithdrawal.error instanceof Error ? createWithdrawal.error.message : 'Something went wrong.'}
          </Text>
        )}
      </ScrollView>

      <TravelerBottomNav active='wallet' />
    </SafeAreaView>
  );
}
