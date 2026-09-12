import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Bell, ChevronLeft, Package, Inbox, TrendingUp, DollarSign } from "lucide-react-native";
import { AgencyBottomNav } from "../../../src/components/AgencyBottomNav";
import { KpiCard } from "../../../src/components/KpiCard";
import { FundingLineChart } from "../../../src/components/FundingLineChart";
import { TopDestinationsBarChart } from "../../../src/components/TopDestinationsBarChart";
import { TravelerPreferencePieChart } from "../../../src/components/TravelerPreferencePieChart";
import { RangeSelector } from "../../../src/components/RangeSelector";
import { GradientButton } from "../../../src/components/GradientButton";
import { colors } from "../../../src/constants/colors";
import { useAgencyKpis, useFundingTrends, useTopDestinations, useTravelerPreferences } from "../../../src/hooks/use-agency-dashboard-queries";
import { useState } from "react";

type DashboardRange = "7d" | "30d" | "90d";

export default function AgencyDashboard() {
  const [range, setRange] = useState<DashboardRange>("30d");

  const kpis = useAgencyKpis();
  const fundingTrends = useFundingTrends(range);
  const topDestinations = useTopDestinations();
  const travelerPreferences = useTravelerPreferences();

  const isLoading = kpis.isLoading || fundingTrends.isLoading || topDestinations.isLoading || travelerPreferences.isLoading;
  const isError = kpis.isError || fundingTrends.isError || topDestinations.isError || travelerPreferences.isError;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.vaykaePink} size="large" />
        </View>
        <AgencyBottomNav active="home" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center" style={{ color: colors.destructive }}>
            Failed to load dashboard data. Pull to refresh.
          </Text>
          <GradientButton variant="outline" onPress={() => { kpis.refetch(); fundingTrends.refetch(); topDestinations.refetch(); travelerPreferences.refetch(); }} className="mt-4">
            Retry
          </GradientButton>
        </View>
        <AgencyBottomNav active="home" />
      </SafeAreaView>
    );
  }

  const kpiData = kpis.data;
  const trendsData = fundingTrends.data;
  const destinationsData = topDestinations.data;
  const preferencesData = travelerPreferences.data;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        refreshControl={
          <Pressable onPress={() => { kpis.refetch(); fundingTrends.refetch(); topDestinations.refetch(); travelerPreferences.refetch(); }} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row items-center justify-between px-4 h-14" style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ChevronLeft size={20} color={colors.foreground} />
          </Pressable>
          <Text className="text-lg font-bold text-foreground">Dashboard</Text>
          <Pressable onPress={() => router.push("/(agency)/notifications")} hitSlop={8}>
            <Bell size={22} color={colors.foreground} />
          </Pressable>
        </View>

        <View className="p-4 space-y-6">
          <View className="flex-row gap-3">
            <KpiCard
              label="Total Requests"
              value={kpiData?.totalRequests ?? 0}
              icon={<Inbox size={20} color={colors.vaykaePink} />}
              iconColor={colors.vaykaePink}
            />
            <KpiCard
              label="Packages"
              value={kpiData?.totalPackages ?? 0}
              icon={<Package size={20} color={colors.vaykaePurple} />}
              iconColor={colors.vaykaePurple}
            />
            <KpiCard
              label="Revenue"
              value={"$" + (kpiData?.totalRevenue ?? 0).toLocaleString()}
              icon={<DollarSign size={20} color={colors.success} />}
              iconColor={colors.success}
            />
            <KpiCard
              label="Avg Response"
              value={(kpiData?.avgResponseTimeHours ?? 0).toString() + "h"}
              icon={<TrendingUp size={20} color={colors.vaykaePurple} />}
              iconColor={colors.vaykaePurple}
            />
          </View>

          <View className="bg-card border border-border rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-foreground">Funding Trends</Text>
              <RangeSelector value={range} onChange={setRange as (v: import("../../../src/components/RangeSelector").RangeOption) => void} />
            </View>
            <FundingLineChart data={trendsData?.trends ?? []} range={range} />
          </View>

          <View className="bg-card border border-border rounded-2xl p-4">
            <Text className="text-lg font-bold text-foreground mb-4">Top Destinations</Text>
            <TopDestinationsBarChart data={destinationsData?.destinations ?? []} />
            {(destinationsData?.destinations?.length ?? 0) === 0 && (
              <View className="h-40 items-center justify-center">
                <Text style={{ color: colors.mutedForeground }}>No destination data available</Text>
              </View>
            )}
          </View>

          <View className="bg-card border border-border rounded-2xl p-4">
            <Text className="text-lg font-bold text-foreground mb-4">Traveler Preferences</Text>
            <TravelerPreferencePieChart data={preferencesData?.preferences ?? []} />
            {(preferencesData?.preferences?.length ?? 0) === 0 && (
              <View className="h-40 items-center justify-center">
                <Text style={{ color: colors.mutedForeground }}>No preference data available</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <AgencyBottomNav active="home" />
    </SafeAreaView>
  );
}
