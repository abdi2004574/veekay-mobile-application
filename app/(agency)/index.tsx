import { Bell } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { GradientButton } from "../../src/components/GradientButton";
import { AgencyBottomNav } from "../../src/components/AgencyBottomNav";
import { useAuthStore } from "../../src/stores/auth-store";
import { colors } from "../../src/constants/colors";

export default function AgencyHome() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const agencyName = user?.displayName ?? "";

  const quickActions = [
    { label: "Packages", onPress: () => router.push("/(agency)/packages") },
    { label: "Requests", onPress: () => router.push("/(agency)/requests") },
    { label: "Revenue", onPress: () => router.push("/(agency)/revenue") },
    { label: "Invoices", onPress: () => router.push("/(agency)/invoices") },
    { label: "Staff", onPress: () => router.push("/(agency)/staff") },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View style={{ flex: 1 }}>
        <View className="px-4 pt-3 pb-2 flex-row items-center justify-between">
          <Text className="text-xl font-semibold text-foreground">
            Welcome{agencyName ? `, ${agencyName}` : ""}
          </Text>
          <Pressable
            hitSlop={8}
            onPress={() => router.push("/(agency)/notifications")}
          >
            <Bell size={22} color={colors.foreground} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingVertical: 24,
            gap: 16,
          }}
        >
          {quickActions.map((action) => (
            <GradientButton key={action.label} onPress={action.onPress}>
              {action.label}
            </GradientButton>
          ))}
        </ScrollView>

        <View className="px-6 pb-6">
          <GradientButton
            variant="outline"
            onPress={async () => {
              await logout();
              router.replace("/(auth)/welcome");
            }}
          >
            Log Out
          </GradientButton>
        </View>

        <AgencyBottomNav active="home" />
      </View>
    </SafeAreaView>
  );
}
