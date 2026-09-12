import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft, CreditCard, RefreshCw, Shield } from "lucide-react-native";
import { AgencyBottomNav } from "../../src/components/AgencyBottomNav";
import { GradientButton } from "../../src/components/GradientButton";
import { SettingsRow } from "../../src/components/SettingsRow";
import { BOTTOM_NAV_HEIGHT } from "../../src/components/BottomNavBar";
import { colors } from "../../src/constants/colors";
import { useAgencySubscription } from "../../src/hooks/use-agency-subscription";
import { mapPackageToTier } from "../../src/services/revenue-cat";

const TIER_LABELS: Record<string, { title: string; description: string }> = {
  basic: {
    title: "Basic",
    description: "Core package listing and booking requests.",
  },
  premium: {
    title: "Premium",
    description: "Enhanced visibility and advanced analytics.",
  },
  featured: {
    title: "Featured",
    description: "Top placement in search and explore, plus priority support.",
  },
};

const TIER_ORDER: Record<string, number> = {
  basic: 0,
  premium: 1,
  featured: 2,
};

const TIER_COLORS: Record<string, string> = {
  basic: colors.foreground,
  premium: colors.vaykaePink,
  featured: colors.vaykaePurple,
};

export default function SubscriptionScreen() {
  const {
    isAvailable,
    isLoading,
    isConfiguring,
    isPurchasing,
    isRestoring,
    offerings,
    customerInfo,
    currentTier,
    backendTier,
    error,
    purchase,
    restore,
    refetch,
  } = useAgencySubscription();

  const insets = useSafeAreaInsets();

  if (!isAvailable) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="flex-row items-center px-4 h-14" style={{ borderWidth: 1, borderBottomColor: colors.border }}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ChevronLeft size={20} color={colors.foreground} />
          </Pressable>
          <Text className="text-lg font-bold text-foreground ml-3">Billing & Subscription</Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Shield size={48} color={colors.mutedForeground} />
          <Text className="text-lg font-bold text-foreground mt-4 mb-2 text-center">
            Subscriptions Not Available
          </Text>
          <Text className="text-sm text-center mb-6" style={{ color: colors.mutedForeground }}>
            In-app subscriptions are only available on iOS and Android. Please open Veakay
            on a mobile device to manage your agency subscription.
          </Text>
          <Pressable onPress={() => router.replace("/(agency)/settings")} hitSlop={8}>
            <Text style={{ color: colors.vaykaePink }} className="font-semibold">
              Back to Settings
            </Text>
          </Pressable>
        </View>
        <AgencyBottomNav active="revenue" />
      </SafeAreaView>
    );
  }

  const knownPackages = (offerings?.packages ?? []).filter(
    (pkg) => mapPackageToTier(pkg) !== undefined,
  );
  const hasPackages = knownPackages.length > 0;
  const hasError = !!error;
  const hasCustomerInfo = !!customerInfo;

  if (isLoading || isConfiguring) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="flex-row items-center px-4 h-14" style={{ borderWidth: 1, borderBottomColor: colors.border }}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ChevronLeft size={20} color={colors.foreground} />
          </Pressable>
          <Text className="text-lg font-bold text-foreground ml-3">Billing & Subscription</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.vaykaePink} size="large" />
        </View>
        <AgencyBottomNav active="revenue" />
      </SafeAreaView>
    );
  }

  if (hasError) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="flex-row items-center px-4 h-14" style={{ borderWidth: 1, borderBottomColor: colors.border }}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ChevronLeft size={20} color={colors.foreground} />
          </Pressable>
          <Text className="text-lg font-bold text-foreground ml-3">Billing & Subscription</Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
            {error}
          </Text>
          <GradientButton onPress={refetch} variant="outline">
            Try Again
          </GradientButton>
        </View>
        <AgencyBottomNav active="revenue" />
      </SafeAreaView>
    );
  }

  const activeEntitlement = customerInfo?.activeEntitlements[0];
  const isCurrentlySubscribed = hasCustomerInfo && activeEntitlement?.isActive;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center px-4 h-14" style={{ borderWidth: 1, borderBottomColor: colors.border }}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={20} color={colors.foreground} />
        </Pressable>
        <Text className="text-lg font-bold text-foreground ml-3">Billing & Subscription</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: BOTTOM_NAV_HEIGHT + insets.bottom + 88 }}>
        <View className="px-4 pt-4 pb-6">
          <View
            className="rounded-2xl p-4 mb-6"
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.muted,
            }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-medium" style={{ color: colors.mutedForeground }}>
                Current Plan
              </Text>
              <View
                className="px-2 py-1 rounded-full"
                style={{
                  backgroundColor:
                    currentTier === "premium"
                      ? colors.vaykaePink
                      : currentTier === "featured"
                        ? colors.vaykaePurple
                        : colors.mutedForeground,
                }}
              >
                <Text className="text-xs font-bold text-white uppercase">
                  {currentTier}
                </Text>
              </View>
            </View>
            <Text className="text-2xl font-bold text-foreground">
              {TIER_LABELS[currentTier]?.title ?? currentTier}
            </Text>
            <Text className="text-sm mt-1" style={{ color: colors.mutedForeground }}>
              {TIER_LABELS[currentTier]?.description ?? ""}
            </Text>
            {isCurrentlySubscribed && customerInfo?.managementURL ? (
              <Pressable
                onPress={() => {
                  if (typeof window !== "undefined") {
                    window.open(customerInfo?.managementURL ?? "", "_blank");
                  }
                }}
                className="mt-3"
              >
                <Text style={{ color: colors.vaykaePink }} className="text-sm font-medium">
                  Manage in App Store / Play Store
                </Text>
              </Pressable>
            ) : null}
          </View>

          <Text className="text-lg font-bold text-foreground mb-4">Available Plans</Text>

          {!hasPackages ? (
            <View className="items-center py-12">
              <CreditCard size={40} color={colors.mutedForeground} />
              <Text className="text-lg font-medium text-foreground mt-3 mb-1">
                No plans available
              </Text>
              <Text className="text-sm text-center" style={{ color: colors.mutedForeground }}>
                There are no subscription plans currently available for purchase.
                Check back later or refresh.
              </Text>
              <Pressable onPress={refetch} className="mt-4">
                <Text style={{ color: colors.vaykaePink }} className="font-semibold">
                  Refresh
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="gap-3">
              {knownPackages
                .sort((a, b) => {
                  const tierA = mapPackageToTier(a)!;
                  const tierB = mapPackageToTier(b)!;
                  return (TIER_ORDER[tierA] ?? 0) - (TIER_ORDER[tierB] ?? 0);
                })
                .map((pkg) => {
                  const tier = mapPackageToTier(pkg)!;
                  const isCurrent = tier === currentTier;
                  const tierColor = TIER_COLORS[tier] ?? colors.foreground;

                  return (
                    <View
                      key={pkg.identifier}
                      className="rounded-2xl p-4"
                      style={{
                        borderWidth: 1,
                        borderColor: isCurrent ? colors.vaykaePink : colors.border,
                        backgroundColor: colors.background,
                      }}
                    >
                      <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-xl font-bold" style={{ color: tierColor }}>
                          {TIER_LABELS[tier]?.title ?? tier}
                        </Text>
                        {isCurrent ? (
                          <View
                            className="px-2 py-1 rounded-full"
                            style={{ backgroundColor: colors.vaykaePink }}
                          >
                            <Text className="text-xs font-bold text-white">Current</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text className="text-sm mb-3" style={{ color: colors.mutedForeground }}>
                        {TIER_LABELS[tier]?.description ?? pkg.description}
                      </Text>
                      <Text className="text-2xl font-bold text-foreground mb-3">
                        {pkg.priceString}
                        {pkg.subscriptionPeriod ? (
                          <Text className="text-sm font-normal" style={{ color: colors.mutedForeground }}>
                            {" "}
                            / {formatPeriod(pkg.subscriptionPeriod)}
                          </Text>
                        ) : null}
                      </Text>
                      <GradientButton
                        onPress={() => purchase(pkg)}
                        disabled={isPurchasing || isCurrent}
                        loading={isPurchasing}
                        className="w-full"
                      >
                        {isCurrent ? "Current Plan" : "Subscribe"}
                      </GradientButton>
                    </View>
                  );
                })}
            </View>
          )}

          <View className="mt-8">
            <Pressable
              onPress={restore}
              disabled={isRestoring}
              className="flex-row items-center justify-center gap-2 py-3"
            >
              {isRestoring ? (
                <ActivityIndicator color={colors.vaykaePink} />
              ) : (
                <RefreshCw size={18} color={colors.vaykaePink} />
              )}
              <Text className="font-semibold" style={{ color: colors.vaykaePink }}>
                {isRestoring ? "Restoring..." : "Restore Purchases"}
              </Text>
            </Pressable>
          </View>

          <View className="mt-6 pt-4" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
            <SettingsRow
              icon={Shield}
              label="Subscription Status"
              subtitle={
                backendTier
                  ? `Backend tier: ${backendTier}`
                  : isCurrentlySubscribed
                    ? "Active in App Store / Play Store"
                    : "Not subscribed"
              }
              onPress={() => {}}
            />
          </View>
        </View>
      </ScrollView>

      <AgencyBottomNav active="revenue" />
    </SafeAreaView>
  );
}

function formatPeriod(isoPeriod: string): string {
  if (!isoPeriod) return "";
  const match = isoPeriod.match(/P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return isoPeriod;
  const years = parseInt(match[1] ?? "0", 10);
  const months = parseInt(match[2] ?? "0", 10);
  const weeks = parseInt(match[3] ?? "0", 10);
  const days = parseInt(match[4] ?? "0", 10);
  if (years > 0) return years === 1 ? "yearly" : `${years} years`;
  if (months > 0) return months === 1 ? "monthly" : `${months} months`;
  if (weeks > 0) return weeks === 1 ? "weekly" : `${weeks} weeks`;
  if (days > 0) return days === 1 ? "daily" : `${days} days`;
  return isoPeriod;
}
