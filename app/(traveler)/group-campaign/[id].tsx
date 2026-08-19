import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  MapPin,
  MessageCircle,
  Plus,
  TrendingUp,
  Users,
} from 'lucide-react-native';
import { GradientButton } from '../../../src/components/GradientButton';
import { GroupMemberRow } from '../../../src/components/GroupMemberRow';
import { GroupContributionRow } from '../../../src/components/GroupContributionRow';
import { GroupExpenseRow } from '../../../src/components/GroupExpenseRow';
import { AddContributionSheet } from '../../../src/components/AddContributionSheet';
import { AddExpenseSheet } from '../../../src/components/AddExpenseSheet';
import { AddGroupMemberSheet } from '../../../src/components/AddGroupMemberSheet';
import { colors, vaykaeGradient } from '../../../src/constants/colors';
import { useAuthStore } from '../../../src/stores/auth-store';
import {
  useGroupContributions,
  useGroupExpenses,
  useGroupOverview,
} from '../../../src/hooks/use-group-campaigns-queries';
import { useRemoveGroupExpense } from '../../../src/hooks/use-group-campaigns-mutations';
import { useToastStore } from '../../../src/stores/toast-store';

export default function GroupCampaignScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUserId = useAuthStore((s) => s.user?.id) ?? '';
  const showToast = useToastStore((s) => s.show);

  const overview = useGroupOverview(id);
  const contributions = useGroupContributions(id);
  const expenses = useGroupExpenses(id);
  const removeExpense = useRemoveGroupExpense(id);

  const [showAddContribution, setShowAddContribution] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const recentContributions = useMemo(
    () => (contributions.data ?? []).slice(0, 5),
    [contributions.data],
  );

  if (overview.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.vaykaePink} />
      </SafeAreaView>
    );
  }

  if (overview.isError || !overview.data) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
          Couldn&apos;t load this group trip.
        </Text>
        <Pressable onPress={() => overview.refetch()}>
          <Text style={{ color: colors.vaykaePink }} className="font-semibold">
            Try again
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const data = overview.data;
  const isAdmin = data.members.find((m) => m.userId === currentUserId)?.role === 'admin';
  const dateRange = data.tripEndDate
    ? `${new Date(data.tripStartDate).toLocaleDateString()} – ${new Date(data.tripEndDate).toLocaleDateString()}`
    : new Date(data.tripStartDate).toLocaleDateString();

  const handleOpenChat = () => {
    if (!data.groupConversationId) {
      showToast('Add a member first to start the group chat.');
      return;
    }
    router.push(`/(traveler)/chat/${data.groupConversationId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View
        className="flex-row items-center px-4 h-14"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Pressable>
        <View className="ml-3" style={{ flex: 1 }}>
          <Text className="text-lg font-bold text-foreground" numberOfLines={1}>
            {data.title}
          </Text>
          <View className="flex-row items-center gap-1">
            <Calendar size={12} color={colors.mutedForeground} />
            <Text className="text-xs" style={{ color: colors.mutedForeground }}>
              {dateRange}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <LinearGradient
          colors={vaykaeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 20, padding: 20, marginBottom: 16 }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-1">
              <Users size={14} color="#fff" />
              <Text className="text-xs font-bold text-white">{data.members.length} Members</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MapPin size={14} color="#fff" />
              <Text className="text-xs font-bold text-white">{data.destination}</Text>
            </View>
          </View>

          <Text className="text-3xl font-bold text-white">${data.totalRaised.toLocaleString()}</Text>
          <Text className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Goal: ${data.goalAmount.toLocaleString()}
          </Text>
          <View style={{ height: 8, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.3)' }}>
            <View
              style={{
                width: `${data.goalAmount > 0 ? Math.min(100, Math.round((data.totalRaised / data.goalAmount) * 100)) : 0}%`,
                height: '100%',
                borderRadius: 6,
                backgroundColor: '#fff',
              }}
            />
          </View>

          <View className="flex-row gap-3 mt-4">
            <View className="flex-1 p-3 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <Text className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Total Contributions
              </Text>
              <Text className="font-bold text-white">${data.totalRaised.toLocaleString()}</Text>
            </View>
            <View className="flex-1 p-3 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <Text className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Total Spent
              </Text>
              <Text className="font-bold text-white">${data.totalSpent.toLocaleString()}</Text>
            </View>
          </View>
        </LinearGradient>

        <View className="flex-row gap-3 mb-3">
          <View style={{ flex: 1 }}>
            <GradientButton onPress={() => setShowAddContribution(true)}>
              Add Contribution
            </GradientButton>
          </View>
          <Pressable
            onPress={() => setShowAddExpense(true)}
            className="flex-1 h-14 rounded-2xl items-center justify-center flex-row gap-2"
            style={{ borderWidth: 2, borderColor: colors.vaykaePink }}
          >
            <Plus size={18} color={colors.vaykaePink} />
            <Text className="font-bold" style={{ color: colors.vaykaePink }}>
              Add Expense
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleOpenChat}
          className="h-12 rounded-2xl items-center justify-center flex-row gap-2 mb-6"
          style={{ backgroundColor: colors.inputBackground }}
        >
          <MessageCircle size={18} color={colors.foreground} />
          <Text className="font-bold text-foreground">Open Group Chat</Text>
        </Pressable>

        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <Users size={18} color={colors.vaykaePink} />
            <Text className="font-bold text-foreground">Group Members</Text>
          </View>
          {isAdmin && (
            <Pressable onPress={() => setShowAddMember(true)}>
              <Text className="font-semibold" style={{ color: colors.vaykaePink }}>
                + Add
              </Text>
            </Pressable>
          )}
        </View>
        {data.members.map((member) => (
          <GroupMemberRow
            key={member.userId}
            member={member}
            isYou={member.userId === currentUserId}
            canRemove={isAdmin && !member.isCreator}
          />
        ))}

        <View className="flex-row items-center gap-2 mb-3 mt-4">
          <TrendingUp size={18} color={colors.vaykaePink} />
          <Text className="font-bold text-foreground">Recent Contributions</Text>
        </View>
        {contributions.isLoading ? (
          <ActivityIndicator color={colors.vaykaePink} />
        ) : recentContributions.length === 0 ? (
          <View className="items-center py-6 rounded-xl" style={{ backgroundColor: colors.inputBackground }}>
            <Text className="text-sm" style={{ color: colors.mutedForeground }}>
              No contributions yet
            </Text>
          </View>
        ) : (
          recentContributions.map((c) => <GroupContributionRow key={c.id} contribution={c} />)
        )}

        <View className="flex-row items-center gap-2 mb-3 mt-4">
          <DollarSign size={18} color={colors.vaykaePink} />
          <Text className="font-bold text-foreground">Expenses & Spending</Text>
        </View>
        {expenses.isLoading ? (
          <ActivityIndicator color={colors.vaykaePink} />
        ) : (expenses.data ?? []).length === 0 ? (
          <View className="items-center py-6 rounded-xl" style={{ backgroundColor: colors.inputBackground }}>
            <Text className="text-sm" style={{ color: colors.mutedForeground }}>
              No expenses logged yet
            </Text>
          </View>
        ) : (
          (expenses.data ?? []).map((expense) => (
            <GroupExpenseRow
              key={expense.id}
              expense={expense}
              canDelete={isAdmin}
              onDelete={() => removeExpense.mutate(expense.id)}
            />
          ))
        )}
      </ScrollView>

      <AddContributionSheet
        visible={showAddContribution}
        campaignId={id}
        onClose={() => setShowAddContribution(false)}
      />
      <AddExpenseSheet
        visible={showAddExpense}
        campaignId={id}
        members={data.members}
        currentUserId={currentUserId}
        onClose={() => setShowAddExpense(false)}
      />
      <AddGroupMemberSheet
        visible={showAddMember}
        campaignId={id}
        members={data.members}
        onClose={() => setShowAddMember(false)}
      />
    </SafeAreaView>
  );
}
