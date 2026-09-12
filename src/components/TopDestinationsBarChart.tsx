import { Text, View } from "react-native";
import { colors } from "../constants/colors";
import type { TopDestination } from "../api/agency-dashboard";

export function TopDestinationsBarChart({ data }: { data: TopDestination[] }) {
  if (!data || data.length === 0) {
    return (
      <View className="h-[220px] items-center justify-center bg-card border border-border rounded-2xl">
        <Text style={{ color: colors.mutedForeground }}>No destination data available</Text>
      </View>
    );
  }

  return (
    <View className="bg-card border border-border rounded-2xl p-4 h-[220px]">
      <View className="flex-1 items-center justify-center">
        <Text style={{ color: colors.mutedForeground }}>Top Destinations Bar Chart - {data.length} destinations</Text>
      </View>
    </View>
  );
}
