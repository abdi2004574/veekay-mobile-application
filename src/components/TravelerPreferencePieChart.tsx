import { Text, View } from "react-native";
import { colors } from "../constants/colors";
import type { TravelerPreference } from "../api/agency-dashboard";

export function TravelerPreferencePieChart({ data }: { data: TravelerPreference[] }) {
  if (!data || data.length === 0) {
    return (
      <View className="h-[220px] items-center justify-center bg-card border border-border rounded-2xl">
        <Text style={{ color: colors.mutedForeground }}>No preference data available</Text>
      </View>
    );
  }

  return (
    <View className="bg-card border border-border rounded-2xl p-4 h-[220px]">
      <View className="flex-1 items-center justify-center">
        <Text style={{ color: colors.mutedForeground }}>Traveler Preference Pie Chart - {data.length} categories</Text>
      </View>
    </View>
  );
}
