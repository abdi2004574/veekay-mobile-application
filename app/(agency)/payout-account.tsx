import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Banknote, CreditCard, Edit2, Shield, AlertCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { AgencyBottomNav } from '../../src/components/AgencyBottomNav';
import { BOTTOM_NAV_HEIGHT } from '../../src/components/BottomNavBar';
import { colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/stores/auth-store';
import { showInDevelopmentAlert } from '../../src/utils/in-development';
import * as agencyApi from '../../src/api/agencies';

interface PayoutAccount {
  bankName: string;
  accountHolderName: string;
  maskedAccount: string;
  accountType: string;
  routingNumber: string;
  lastUpdated: string;
  status: 'verified' | 'pending' | 'unverified';
}

async function fetchPayoutAccount(accessToken: string): Promise<PayoutAccount | null> {
  const agency = await agencyApi.getMyAgency(accessToken);
  if (!agency?.payoutAccount) return null;
  return agency.payoutAccount;
}

export default function PayoutAccountScreen() {
  const insets = useSafeAreaInsets();
  const { accessToken } = useAuthStore();

  const { data: payoutAccount, isLoading, isError, refetch } = useQuery({
    queryKey: ['payoutAccount'],
    queryFn: () => fetchPayoutAccount(accessToken!),
    enabled: !!accessToken,
  });

  const hasAccount = !!payoutAccount;

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top']}>
      <View style={{ flex: 1 }}>
        <View
          className='flex-row items-center px-4 h-14'
          style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
        >
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ArrowLeft size={20} color={colors.foreground} />
          </Pressable>
          <Text className='text-lg font-bold text-foreground ml-3'>Payout Account</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: BOTTOM_NAV_HEIGHT + insets.bottom + 32 }}>
          {isLoading ? (
            <View className='flex-1 items-center justify-center py-16'>
              <ActivityIndicator color={colors.vaykaePink} size='large' />
            </View>
          ) : isError ? (
            <View className='flex-1 items-center justify-center px-6 py-16'>
              <Text className='text-center mb-3' style={{ color: colors.mutedForeground }}>
                Couldn&apos;t load payout account.
              </Text>
              <Pressable onPress={() => refetch()}>
                <Text style={{ color: colors.vaykaePink }} className='font-semibold'>
                  Try again
                </Text>
              </Pressable>
            </View>
          ) : !hasAccount ? (
            <View className='flex-1 items-center justify-center py-16 px-6'>
              <View className='w-20 h-20 rounded-full items-center justify-center mb-4' style={{ backgroundColor: colors.vaykaePink + '15' }}>
                <Banknote size={28} color={colors.vaykaePink} />
              </View>
              <Text className='text-lg font-medium mb-2 text-foreground text-center'>
                No Payout Account Set Up
              </Text>
              <Text className='text-sm text-center mb-6' style={{ color: colors.mutedForeground }}>
                Add a bank account to receive payouts from completed bookings.
              </Text>
              <Pressable
                onPress={() => showInDevelopmentAlert('The funding rail for payout account updates is still being finalized. Once confirmed, this will open the Stripe Connect onboarding flow.')}
                className='flex-row items-center gap-2 px-6 py-3 rounded-xl'
                style={{ backgroundColor: colors.vaykaePink }}
              >
                <Text className='font-semibold' style={{ color: colors.background }}>
                  Add Payout Account
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View className='mb-6'>
                <View className='flex-row items-center gap-3 mb-4'>
                  <View className='w-10 h-10 rounded-xl items-center justify-center' style={{ backgroundColor: colors.vaykaePink + '15' }}>
                    <Banknote size={20} color={colors.vaykaePink} />
                  </View>
                  <Text className='text-lg font-bold text-foreground'>Bank Account</Text>
                </View>

                <View className='rounded-2xl p-5' style={{ borderWidth: 1, borderColor: colors.border }}>
                  <View className='flex-row items-center justify-between mb-4'>
                    <View className='flex-row items-center gap-2'>
                      <View
                        className='w-2 h-2 rounded-full'
                        style={{ backgroundColor: payoutAccount.status === 'verified' ? colors.success : colors.warning }}
                      />
                      <Text className='text-xs font-bold uppercase' style={{ color: payoutAccount.status === 'verified' ? colors.success : colors.warning }}>
                        {payoutAccount.status}
                      </Text>
                    </View>
                    {payoutAccount.status === 'verified' && (
                      <View className='flex-row items-center gap-1'>
                        <Shield size={12} />
                        <Text className='text-xs font-medium' style={{ color: colors.success }}>Verified</Text>
                      </View>
                    )}
                  </View>

                  <View className='space-y-3'>
                    <AccountDetailRow label='Account Holder' value={payoutAccount.accountHolderName} />
                    <Divider />
                    <AccountDetailRow label='Bank Name' value={payoutAccount.bankName} />
                    <Divider />
                    <AccountDetailRow label='Account Number' value={payoutAccount.maskedAccount} />
                    <Divider />
                    <AccountDetailRow label='Account Type' value={payoutAccount.accountType} />
                    <Divider />
                    <AccountDetailRow label='Routing Number' value={payoutAccount.routingNumber} />
                    <Divider />
                    <AccountDetailRow label='Last Updated' value={payoutAccount.lastUpdated} />
                  </View>
                </View>
              </View>

              <View className='mb-6'>
                <Text className='text-sm font-bold mb-3' style={{ color: colors.mutedForeground }}>About Payouts</Text>
                <View className='rounded-2xl p-5' style={{ borderWidth: 1, borderColor: colors.border }}>
                  <View className='flex-row items-start gap-3 mb-3'>
                    <View className='w-8 h-8 rounded-lg items-center justify-center mt-0.5' style={{ backgroundColor: colors.vaykaePink + '15' }}>
                      <CreditCard size={16} color={colors.vaykaePink} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text className='font-medium text-foreground mb-1'>Stripe Connect</Text>
                      <Text className='text-sm' style={{ color: colors.mutedForeground }}>
                        Your payouts are processed through Stripe Connect. Funds from completed bookings are automatically
                        transferred to this bank account on a rolling basis (typically 2-7 business days after booking completion).
                      </Text>
                    </View>
                  </View>
                  <View className='flex-row items-start gap-3'>
                    <View className='w-8 h-8 rounded-lg items-center justify-center mt-0.5' style={{ backgroundColor: colors.vaykaePink + '15' }}>
                      <Shield size={16} color={colors.vaykaePink} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text className='font-medium text-foreground mb-1'>Security</Text>
                      <Text className='text-sm' style={{ color: colors.mutedForeground }}>
                        Bank details are encrypted and stored securely by Stripe. We never store your full account or routing numbers.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <Pressable
                onPress={() => showInDevelopmentAlert('The funding rail for payout account updates is still being finalized. Once confirmed, this will open the Stripe Connect onboarding flow.')}
                className='flex-row items-center gap-3 px-4 py-3 rounded-xl border'
                style={{ borderColor: colors.vaykaePink, backgroundColor: colors.vaykaePink + '10' }}
              >
                <View className='w-10 h-10 rounded-xl items-center justify-center' style={{ backgroundColor: colors.vaykaePink + '15' }}>
                  <Edit2 size={20} color={colors.vaykaePink} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text className='font-semibold text-foreground'>Update Payout Account</Text>
                  <Text className='text-xs mt-0.5' style={{ color: colors.mutedForeground }}>
                    Change bank account details (in development)
                  </Text>
                </View>
                <AlertCircle size={18} color={colors.warning} />
              </Pressable>
            </>
          )}
        </ScrollView>

        <AgencyBottomNav active='profile' />
      </View>
    </SafeAreaView>
  );
}

function AccountDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className='flex-row items-center justify-between'>
      <Text className='text-sm' style={{ color: colors.mutedForeground }}>{label}</Text>
      <Text className='font-medium text-foreground text-right max-w-[60%]'>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: colors.border }} />;
}
