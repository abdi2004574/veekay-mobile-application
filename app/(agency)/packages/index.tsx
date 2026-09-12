import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { AgencyBottomNav } from '../../../src/components/AgencyBottomNav';
import { BOTTOM_NAV_HEIGHT } from '../../../src/components/BottomNavBar';
import { colors } from '../../../src/constants/colors';
import { useMyPackages } from '../../../src/hooks/use-packages-queries';
import { PackageCard } from '../../../src/components/PackageCard';
import type { PackageStatus } from '../../../src/api/types';

type Filter = 'all' | PackageStatus;

export default function PackagesScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const packages = useMyPackages();
  const insets = useSafeAreaInsets();

  const items = useMemo(() => packages.data ?? [], [packages.data]);

  const counts = useMemo(() => {
    const c = { all: items.length, active: 0, inactive: 0, archived: 0 };
    for (const p of items) {
      if (p.status in c) c[p.status as PackageStatus]++;
    }
    return c;
  }, [items]);

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((p) => p.status === filter)),
    [items, filter],
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View style={{ flex: 1 }}>
        <View className="px-4 pt-3 pb-2">
          <Text className="text-2xl font-bold text-foreground">My Packages</Text>
          <Text className="text-sm mt-1" style={{ color: colors.mutedForeground }}>
            {counts.all} package{counts.all !== 1 ? 's' : ''} total
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}>
          {(
            [
              { key: 'all', label: 'All' },
              { key: 'active', label: 'Active' },
              { key: 'inactive', label: 'Inactive' },
              { key: 'archived', label: 'Archived' },
            ] as { key: Filter; label: string }[]
          ).map((f) => {
            const isActive = filter === f.key;
            const count = counts[f.key];
            return (
              <Pressable key={f.key} onPress={() => setFilter(f.key)}>
                <View
                  className="flex-row items-center gap-1.5 px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: isActive ? colors.vaykaePink : colors.inputBackground,
                    borderWidth: isActive ? 0 : 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text
                    className="text-sm font-medium"
                    style={{ color: isActive ? colors.background : colors.foreground }}
                  >
                    {f.label}
                  </Text>
                  <View
                    className="px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : colors.disabledBackground,
                    }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{ color: isActive ? colors.background : colors.mutedForeground }}
                    >
                      {count}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {packages.isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={colors.vaykaePink} />
          </View>
        ) : packages.isError ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
              Couldn&apos;t load your packages.
            </Text>
            <Pressable onPress={() => packages.refetch()}>
              <Text style={{ color: colors.vaykaePink }} className="font-semibold">
                Try again
              </Text>
            </Pressable>
          </View>
        ) : filtered.length === 0 ? (
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: BOTTOM_NAV_HEIGHT + insets.bottom + 80 }}>
            <View className="flex-1 items-center justify-center py-16">
              <Text className="text-center mt-3 mb-1 text-foreground font-medium">No packages yet</Text>
              <Text className="text-sm text-center" style={{ color: colors.mutedForeground }}>
                Tap the + button to create your first package
              </Text>
            </View>
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: BOTTOM_NAV_HEIGHT + insets.bottom + 88, gap: 16 }}>
            {filtered.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onPress={() => router.push('/(agency)/packages/' + pkg.id)}
                onEdit={() =>
                  router.push({ pathname: '/(agency)/packages/edit', params: { packageId: pkg.id } })
                }
              />
            ))}
          </ScrollView>
        )}

        <Pressable
          onPress={() => router.push('/(agency)/packages/create')}
          style={{
            position: 'absolute',
            right: 20,
            bottom: BOTTOM_NAV_HEIGHT + insets.bottom + 24,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.vaykaePink,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
        >
          <Plus size={26} color={colors.background} />
        </Pressable>

        <AgencyBottomNav active="packages" />
      </View>
    </SafeAreaView>
  );
}
