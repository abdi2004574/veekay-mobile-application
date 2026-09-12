import { Text, View } from "react-native";
import { colors } from "../constants/colors";
import type { FundingTrendPoint } from "../api/agency-dashboard";

export function FundingLineChart({ data, range }: { data: FundingTrendPoint[]; range: "7d" | "30d" | "90d" }) {
  if (!data || data.length === 0) {
    return (
      <View className="h-[220px] items-center justify-center bg-card border border-border rounded-2xl">
        <Text style={{ color: colors.mutedForeground }}>No funding data for this period</Text>
      </View>
    );
  }

  // Placeholder for Victory Native 42 chart implementation
  return (
    <View className="bg-card border border-border rounded-2xl p-4 h-[220px]">
      <View className="flex-1 items-center justify-center">
        <Text style={{ color: colors.mutedForeground }}>Funding Line Chart - {data.length} data points ({range})</Text>
      </View>
    </View>
  );
}
