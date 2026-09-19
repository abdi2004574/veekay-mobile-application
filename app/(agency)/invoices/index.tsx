import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { FileText, Filter, Search, X } from "lucide-react-native";
import { AgencyBottomNav } from "../../../src/components/AgencyBottomNav";
import { BOTTOM_NAV_HEIGHT } from "../../../src/components/BottomNavBar";
import { colors } from "../../../src/constants/colors";
import { useAgencyInvoices } from "../../../src/hooks/use-agency-invoices-queries";
import { showInDevelopmentAlert } from "../../../src/utils/in-development";
import type { AgencyInvoiceItem } from "../../../src/api/agency-invoices";

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

function statusColor(status: string) {
  switch (status) {
    case "pending":
      return colors.warning;
    case "paid":
      return colors.success;
    case "overdue":
      return colors.destructive;
    default:
      return colors.mutedForeground;
  }
}

function statusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatCurrency(currency: string, amount: number) {
  return currency + " " + amount.toLocaleString();
}

export default function InvoicesScreen() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const insets = useSafeAreaInsets();

  const invoiceQuery = useAgencyInvoices(
    statusFilter || undefined,
    undefined,
    20,
  );

  const invoices: AgencyInvoiceItem[] =
    invoiceQuery.data?.items ?? [];

  const filteredInvoices = invoices.filter((inv) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      inv.id.toLowerCase().includes(q) ||
      (!!inv.tripRequestId &&
        inv.tripRequestId.toLowerCase().includes(q)) ||
      inv.currency.toLowerCase().includes(q)
    );
  });

  const totals = filteredInvoices.reduce(
    (acc, inv) => {
      acc.amount += inv.amount;
      acc.commission += inv.commissionAmount;
      acc.net += inv.netAmount;
      return acc;
    },
    { amount: 0, commission: 0, net: 0 },
  );

  const pendingCount = invoices.filter(
    (i) => i.status === "pending",
  ).length;
  const overdueCount = invoices.filter(
    (i) => i.status === "overdue",
  ).length;

  const displayCurrency = invoices.length > 0 ? invoices[0].currency : "";

  const handleInvoicePress = () => {
    showInDevelopmentAlert(
      "Invoice detail view is not built yet.",
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View className="px-4 pt-3 pb-2 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-foreground">
            Invoices
          </Text>
          <Pressable
            onPress={() => setShowFilters((v) => !v)}
            hitSlop={8}
            className="flex-row items-center gap-2 px-3 py-2 rounded-full"
            style={{
              backgroundColor: showFilters
                ? colors.vaykaePink
                : colors.inputBackground,
            }}
          >
            <Filter
              size={16}
              color={showFilters ? colors.background : colors.foreground}
            />
            <Text
              className="text-xs font-semibold"
              style={{
                color: showFilters ? colors.background : colors.foreground,
              }}
            >
              Filter
            </Text>
          </Pressable>
        </View>

        {/* Status summary */}
        <View className="flex-row gap-2 px-4 pb-3">
          <View className="flex-1 rounded-xl p-3 border bg-card">
            <Text className="text-xl font-bold text-foreground">
              {invoices.length}
            </Text>
            <Text
              className="text-xs"
              style={{ color: colors.mutedForeground }}
            >
              Total Invoices
            </Text>
          </View>
          <View className="flex-1 rounded-xl p-3 border bg-card">
            <Text className="text-xl font-bold" style={{ color: colors.warning }}>
              {pendingCount}
            </Text>
            <Text
              className="text-xs"
              style={{ color: colors.mutedForeground }}
            >
              Pending
            </Text>
          </View>
          <View className="flex-1 rounded-xl p-3 border bg-card">
            <Text className="text-xl font-bold" style={{ color: colors.destructive }}>
              {overdueCount}
            </Text>
            <Text
              className="text-xs"
              style={{ color: colors.mutedForeground }}
            >
              Overdue
            </Text>
          </View>
        </View>

        {/* Search */}
        <View className="px-4 pb-2">
          <View
            className="flex-row items-center rounded-xl px-4 py-3 border"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.inputBackground,
            }}
          >
            <Search size={16} color={colors.mutedForeground} />
            <TextInput
              className="flex-1 ml-3 text-sm"
              placeholder="Search invoices..."
              placeholderTextColor={colors.mutedForeground}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== "" && (
              <Pressable onPress={() => setSearchQuery("")}>
                <X size={14} color={colors.mutedForeground} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Filter row */}
        {showFilters && (
          <View className="flex-row flex-wrap gap-2 px-4 pb-3">
            {STATUS_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value || "all"}
                onPress={() => setStatusFilter(opt.value)}
                className="px-4 py-2 rounded-full border"
                style={{
                  borderColor:
                    statusFilter === opt.value
                      ? colors.vaykaePink
                      : colors.border,
                  backgroundColor:
                    statusFilter === opt.value
                      ? colors.vaykaePink + "20"
                      : "transparent",
                }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{
                    color:
                      statusFilter === opt.value
                        ? colors.vaykaePink
                        : colors.mutedForeground,
                  }}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Content */}
        {invoiceQuery.isLoading &&
        filteredInvoices.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={colors.vaykaePink} />
          </View>
        ) : invoiceQuery.isError ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text
              className="text-center mb-3"
              style={{ color: colors.mutedForeground }}
            >
              Couldn&apos;t load invoices.
            </Text>
            <Pressable onPress={() => invoiceQuery.refetch()}>
              <Text
                style={{ color: colors.vaykaePink }}
                className="font-semibold"
              >
                Try again
              </Text>
            </Pressable>
          </View>
        ) : filteredInvoices.length === 0 ? (
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              padding: 16,
              paddingBottom: BOTTOM_NAV_HEIGHT + insets.bottom + 80,
            }}
          >
            <View className="flex-1 items-center justify-center py-16">
              <FileText size={48} color={colors.mutedForeground} />
              <Text className="mt-4 text-center text-foreground font-medium">
                No invoices found
              </Text>
              <Text
                className="text-sm text-center mt-1"
                style={{ color: colors.mutedForeground }}
              >
                {searchQuery
                  ? "Try adjusting your search"
                  : "Invoices will appear here"}
              </Text>
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: BOTTOM_NAV_HEIGHT + insets.bottom + 88,
            }}
          >
            {/* Column header */}
            <View
              className="flex-row py-3 px-2 border-b"
              style={{ borderColor: colors.border }}
            >
              <View className="flex-1">
                <Text
                  className="text-xs font-bold"
                  style={{ color: colors.mutedForeground }}
                >
                  Invoice
                </Text>
              </View>
              <View className="w-20 items-center">
                <Text
                  className="text-xs font-bold"
                  style={{ color: colors.mutedForeground }}
                >
                  Amount
                </Text>
              </View>
              <View className="w-20 items-center">
                <Text
                  className="text-xs font-bold"
                  style={{ color: colors.mutedForeground }}
                >
                  Net
                </Text>
              </View>
              <View className="w-16 items-center">
                <Text
                  className="text-xs font-bold"
                  style={{ color: colors.mutedForeground }}
                >
                  Status
                </Text>
              </View>
              <View className="w-20 items-end">
                <Text
                  className="text-xs font-bold"
                  style={{ color: colors.mutedForeground }}
                >
                  Due
                </Text>
              </View>
            </View>

            {filteredInvoices.map((inv, index) => (
              <Pressable
                key={inv.id}
                onPress={handleInvoicePress}
                className="flex-row items-center py-3 px-2 border-b"
                style={{
                  borderColor: colors.border,
                  backgroundColor:
                    index % 2 === 0 ? "transparent" : colors.muted + "30",
                }}
              >
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">
                    {inv.id.slice(-8)}
                  </Text>
                  <Text
                    className="text-xs"
                    style={{ color: colors.mutedForeground }}
                  >
                    {inv.tripRequestId
                      ? "Trip: " + inv.tripRequestId.slice(-6)
                      : "Agency invoice"}
                  </Text>
                </View>
                <View className="w-20 items-center">
                  <Text className="text-sm font-bold text-foreground">
                    {formatCurrency(inv.currency, inv.amount)}
                  </Text>
                </View>
                <View className="w-20 items-center">
                  <Text
                    className="text-sm font-bold"
                    style={{ color: colors.success }}
                  >
                    {formatCurrency(inv.currency, inv.netAmount)}
                  </Text>
                </View>
                <View className="w-16 items-center">
                  <View
                    className="px-2 py-1 rounded-full"
                    style={{ backgroundColor: statusColor(inv.status) + "20" }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{ color: statusColor(inv.status) }}
                    >
                      {statusLabel(inv.status)}
                    </Text>
                  </View>
                </View>
                <View className="w-20 items-end">
                  <Text
                    className="text-xs"
                    style={{ color: colors.mutedForeground }}
                  >
                    {new Date(inv.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              </Pressable>
            ))}

            {/* Totals */}
            <View
              className="bg-muted px-4 py-3 mt-2 border-t"
              style={{ borderColor: colors.border }}
            >
              <View className="flex-row items-center">
                <View className="flex-1">
                  <Text className="text-xs font-bold text-foreground">
                    Totals
                  </Text>
                </View>
                <View className="w-20 items-center">
                  <Text
                    className="text-xs font-bold"
                    style={{ color: colors.warning }}
                  >
                    {displayCurrency}{" "}
                    {totals.amount.toLocaleString()}
                  </Text>
                </View>
                <View className="w-20 items-center">
                  <Text
                    className="text-xs font-bold"
                    style={{ color: colors.destructive }}
                  >
                    {"-" + totals.commission.toLocaleString()}
                  </Text>
                </View>
                <View className="w-20 items-center">
                  <Text
                    className="text-sm font-bold"
                    style={{ color: colors.success }}
                  >
                    {displayCurrency}{" "}
                    {totals.net.toLocaleString()}
                  </Text>
                </View>
                <View className="w-20" />
              </View>
            </View>
          </ScrollView>
        )}

        <AgencyBottomNav active="revenue" />
      </View>
    </SafeAreaView>
  );
}
