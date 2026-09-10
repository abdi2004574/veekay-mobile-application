import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, Plus, Wallet } from 'lucide-react-native';
import { TravelerBottomNav } from '../../../../src/components/TravelerBottomNav';
import { colors } from '../../../../src/constants/colors';
import { useMyWithdrawals } from '../../../../src/hooks/use-wallet-queries';

export default function WithdrawalsScreen() {
  const [cursor, setCursor] = useState<string | undefined>();
  const withdrawals = useMyWithdrawals(cursor, 20);

  const items = useMemo(() => withdrawals.data?.items ?? [], [withdrawals.data]);
  const hasMore = withdrawals.data?.nextCursor != null;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View
        className="flex-row items-center px-4 h-14"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Pressable>
        <Text className="text-lg font-bold text-foreground ml-3">Withdrawals</Text>
        <Pressable
          onPress={() => router.push("/(traveler)/wallet/withdrawals/new")}
          className="ml-auto p-2 rounded-full"
          style={{ backgroundColor: colors.vaykaePink }}
        >
          <Plus size={18} color={colors.background} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 96 }}>
        {withdrawals.isLoading ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator color={colors.vaykaePink} />
          </View>
        ) : items.length === 0 ? (
          <View className="items-center py-12">
            <Wallet size={40} color={colors.mutedForeground} />
            <Text className="mt-3 text-center" style={{ color: colors.mutedForeground }}>
              No withdrawal requests yet.
            </Text>
            <Pressable
              onPress={() => router.push("/(traveler)/wallet/withdrawals/new")}
              className="mt-4 px-6 py-3 rounded-full"
              style={{ backgroundColor: colors.vaykaePink }}
            >
              <Text className="font-bold text-white">Request Withdrawal</Text>
            </Pressable>
          </View>
        ) : (
          <View
            className="rounded-2xl overflow-hidden"
            style={{ borderWidth: 1, borderColor: colors.border }}
          >
            {items.map((w, index) => (
              <WithdrawalRow
                key={w.id}
                withdrawal={w}
                isLast={index === items.length - 1 && !hasMore}
              />
            ))}
          </View>
        )}

        {hasMore && (
          <Pressable
            onPress={() => setCursor(withdrawals.data!.nextCursor!)}
            className="mt-4 p-4 rounded-2xl items-center"
            style={{ borderWidth: 1, borderColor: colors.border }}
          >
            <Text className="font-semibold" style={{ color: colors.vaykaePink }}>
              Load more
            </Text>
          </Pressable>
        )}
      </ScrollView>

      <TravelerBottomNav active="profile" />
    </SafeAreaView>
  );
}

function WithdrawalRow({ withdrawal, isLast }: { withdrawal: any; isLast: boolean }) {
  const statusColor = getStatusColor(withdrawal.status);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: withdrawal.currency,
  }).format(withdrawal.amount);

  return (
    <Pressable
      onPress={() => router.push(`/(traveler)/wallet/withdrawals/${withdrawal.id}`)}
      style={isLast ? {} : { borderBottomWidth: 1, borderBottomColor: colors.border }}
    >
      <View className="flex-row items-center justify-between p-4">
        <View className="flex-1">
          <Text className="font-semibold text-foreground text-sm">
            Withdrawal Request
          </Text>
          <Text className="text-xs mt-0.5" style={{ color: colors.mutedForeground }}>
            {new Date(withdrawal.createdAt).toLocaleDateString()} - {formatted}
          </Text>
        </View>
        <View className="items-end gap-2">
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: statusColor + "20" }}
          >
            <Text className="text-xs font-bold" style={{ color: statusColor }}>
              {capitalize(withdrawal.status)}
            </Text>
          </View>
          <ChevronRight size={16} color={colors.mutedForeground} />
        </View>
      </View>
    </Pressable>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case "requested":
      return colors.vaykaePink;
    case "approved":
      return "#2563eb";
    case "paid":
      return colors.success;
    case "rejected":
      return colors.destructive;
    default:
      return colors.mutedForeground;
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
