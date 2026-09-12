import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Download, Calendar, ChevronDown } from "lucide-react-native";
import { RevenueLedgerRow, RevenueLedgerHeader } from "../../../src/components/RevenueLedgerRow";
import { RangeSelector } from "../../../src/components/RangeSelector";
import { AgencyBottomNav } from "../../../src/components/AgencyBottomNav";
import { BOTTOM_NAV_HEIGHT } from "../../../src/components/BottomNavBar";
import { colors } from "../../../src/constants/colors";
import { useInfiniteRevenueLedger, useExportRevenueCsv } from "../../../src/hooks/use-agency-revenue-queries";
import { showAlert } from "../../../src/utils/show-alert";
import { showToast } from "../../../src/stores/toast-store";
import type { RevenueLedgerItem } from "../../../src/api/agency-revenue";

type DateRange = "7d" | "30d" | "90d" | "custom";

export default function RevenueScreen() {
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [customStart, setCustomStart] = useState<Date | null>(null);
  const [customEnd, setCustomEnd] = useState<Date | null>(null);
  const insets = useSafeAreaInsets();

  const ledgerQuery = useInfiniteRevenueLedger(20);
  const exportQuery = useExportRevenueCsv();

  const allItems: RevenueLedgerItem[] = useMemo(
    () => ledgerQuery.data?.pages.flatMap((p) => p.items) ?? [],
    [ledgerQuery.data],
  );

  const now = new Date();
  const getFilterStart = () => {
    if (dateRange === "custom" && customStart) return customStart;
    const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d;
  };

  const filterStart = getFilterStart();
  const filterEnd = dateRange === "custom" && customEnd ? customEnd : now;

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const itemDate = new Date(item.completedAt);
      if (itemDate < filterStart) return false;
      if (itemDate > filterEnd) return false;
      return true;
    });
  }, [allItems, filterStart, filterEnd]);

  const totals = useMemo(() => {
    return filteredItems.reduce(
      (acc, item) => {
        acc.amount += item.amount;
        acc.commission += item.commission;
        acc.netPayout += item.netPayout;
        return acc;
      },
      { amount: 0, commission: 0, netPayout: 0 },
    );
  }, [filteredItems]);

  const handleExport = async () => {
    try {
      const blob = await exportQuery.refetch();
      if (blob.data) {
        const url = URL.createObjectURL(blob.data);
        const a = document.createElement("a");
        a.href = url;
        const dateStr = new Date().toISOString().split("T")[0];
        a.download = "revenue-export-" + dateStr + ".csv";
        a.click();
        URL.revokeObjectURL(url);
        showToast("CSV exported successfully");
      }
    } catch {
      showAlert("Export Failed", "Could not export revenue data. Please try again.");
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Select date";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const isCustomRange = dateRange === "custom";
  const hasActiveFilters = isCustomRange && (customStart !== null || customEnd !== null);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View style={{ flex: 1 }}>
        <View className="px-4 pt-3 pb-2 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-foreground">Revenue</Text>
          <Pressable
            onPress={handleExport}
            disabled={exportQuery.isPending}
            className="flex-row items-center gap-2 px-4 py-2 rounded-full"
            style={{ backgroundColor: colors.vaykaePink }}
          >
            <Download size={18} color={colors.background} />
            <Text className="font-semibold" style={{ color: colors.background }}>
              {exportQuery.isPending ? "Exporting..." : "Export CSV"}
            </Text>
          </Pressable>
        </View>

        <View className="px-4 pb-4">
          <View className="flex-row gap-3 mb-3">
            <RangeSelector value={dateRange} onChange={setDateRange} className="flex-1" />
            {isCustomRange && (
              <>
                <Pressable
                  className="flex-1 flex-row items-center justify-between px-4 py-3 rounded-xl border"
                  style={{ borderColor: colors.border, backgroundColor: colors.inputBackground }}
                >
                  <View className="flex-row items-center gap-2">
                    <Calendar size={18} color={colors.mutedForeground} />
                    <Text style={{ color: customStart ? colors.foreground : colors.mutedForeground }}>
                      {formatDate(customStart)}
                    </Text>
                  </View>
                  <ChevronDown size={16} color={colors.mutedForeground} />
                </Pressable>
                <Pressable
                  className="flex-1 flex-row items-center justify-between px-4 py-3 rounded-xl border"
                  style={{ borderColor: colors.border, backgroundColor: colors.inputBackground }}
                >
                  <View className="flex-row items-center gap-2">
                    <Calendar size={18} color={colors.mutedForeground} />
                    <Text style={{ color: customEnd ? colors.foreground : colors.mutedForeground }}>
                      {formatDate(customEnd)}
                    </Text>
                  </View>
                  <ChevronDown size={16} color={colors.mutedForeground} />
                </Pressable>
              </>
            )}
          </View>
          {hasActiveFilters && (
            <Pressable
              onPress={() => {
                setCustomStart(null);
                setCustomEnd(null);
              }}
              className="text-sm font-medium"
            >
              <Text style={{ color: colors.vaykaePink }}>Clear custom range</Text>
            </Pressable>
          )}
        </View>

        {ledgerQuery.isLoading && filteredItems.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={colors.vaykaePink} />
          </View>
        ) : ledgerQuery.isError ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
              Couldn&apos;t load revenue data.
            </Text>
            <Pressable onPress={() => ledgerQuery.refetch()}>
              <Text style={{ color: colors.vaykaePink }} className="font-semibold">
                Try again
              </Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: BOTTOM_NAV_HEIGHT + insets.bottom + 88 }}>
            <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 16, overflow: "hidden", marginHorizontal: 16 }}>
              <RevenueLedgerHeader />
              {filteredItems.length === 0 ? (
                <View className="py-16 items-center px-6">
                  <Text className="text-lg font-medium mb-2 text-foreground">
                    {hasActiveFilters ? "No revenue entries match your filters" : "No revenue data yet"}
                  </Text>
                  <Text className="text-sm text-center" style={{ color: colors.mutedForeground }}>
                    {hasActiveFilters ? "Try adjusting your date range" : "Completed bookings will appear here"}
                  </Text>
                </View>
              ) : (
                <>
                  {filteredItems.map((item, index) => (
                    <RevenueLedgerRow key={item.bookingId} item={item} index={index} />
                  ))}
                  <View className="bg-muted px-4 py-3 border-t" style={{ borderColor: colors.border }}>
                    <View className="flex-row items-center">
                      <View className="w-24 flex-1">
                        <Text className="text-xs font-bold text-foreground">Totals</Text>
                      </View>
                      <View className="w-20 flex-1 items-center">
                        <Text className="text-xs font-bold text-success">{"+" + totals.amount.toLocaleString()}</Text>
                      </View>
                      <View className="w-20 flex-1 items-center">
                        <Text className="text-xs font-bold" style={{ color: colors.destructive }}>{"-" + totals.commission.toLocaleString()}</Text>
                      </View>
                      <View className="w-20 flex-1 items-center">
                        <Text className="text-xs font-bold text-foreground">{totals.netPayout.toLocaleString()}</Text>
                      </View>
                      <View className="w-24 flex-1" />
                    </View>
                  </View>
                </>
              )}
            </View>

            {ledgerQuery.hasNextPage && (
              <Pressable
                onPress={() => ledgerQuery.fetchNextPage()}
                disabled={ledgerQuery.isFetchingNextPage}
                className="mx-16 mt-4 py-3 rounded-xl items-center border"
                style={{ borderColor: colors.border }}
              >
                {ledgerQuery.isFetchingNextPage ? (
                  <ActivityIndicator color={colors.vaykaePink} size="small" />
                ) : (
                  <Text className="font-medium text-foreground">Load More</Text>
                )}
              </Pressable>
            )}
          </ScrollView>
        )}

        <AgencyBottomNav active="revenue" />
      </View>
    </SafeAreaView>
  );
}
