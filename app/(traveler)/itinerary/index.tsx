import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Package, Search, SlidersHorizontal, X } from 'lucide-react-native';
import { PackageSummaryCard } from '../../../src/components/PackageSummaryCard';
import { colors } from '../../../src/constants/colors';
import { usePackageDirectory } from '../../../src/hooks/use-packages-queries';
import type { DestinationType, Package as PackageType } from '../../../src/api/types';

const DESTINATION_OPTIONS: { key: DestinationType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'beach', label: 'Beach' },
  { key: 'mountain', label: 'Mountain' },
  { key: 'city', label: 'City' },
  { key: 'adventure', label: 'Adventure' },
  { key: 'cruise', label: 'Cruise' },
];

export default function ItineraryScreen() {
  const [search, setSearch] = useState('');
  const [destinationType, setDestinationType] = useState<DestinationType | undefined>(undefined);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const packages = usePackageDirectory({ destinationType });

  const items = useMemo(
    () => packages.data?.pages.flatMap((p) => p.items) ?? [],
    [packages.data],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p: PackageType) => {
      const title = p.title?.toLowerCase() ?? '';
      const agency = p.agency?.agencyName?.toLowerCase() ?? '';
      return title.includes(q) || agency.includes(q);
    });
  }, [items, search]);

  const hasActiveFilter = !!destinationType;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View style={{ flex: 1 }}>
        <View
          className="flex-row items-center px-4 h-14"
          style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
        >
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ArrowLeft size={20} color={colors.foreground} />
          </Pressable>
          <Text className="text-lg font-bold text-foreground ml-3">Browse Packages</Text>
        </View>

        <View className="px-4 py-3">
          <View style={{ position: 'relative' }}>
            <View style={{ position: 'absolute', left: 16, top: 14, zIndex: 1 }}>
              <Search size={18} color={colors.mutedForeground} />
            </View>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search packages..."
              placeholderTextColor={colors.mutedForeground}
              className="h-12 rounded-2xl pl-12 pr-12 text-foreground"
              style={{ backgroundColor: colors.inputBackground }}
            />
            <Pressable
              onPress={() => setFiltersOpen((v) => !v)}
              hitSlop={8}
              style={{ position: 'absolute', right: 16, top: 14 }}
            >
              <SlidersHorizontal
                size={18}
                color={filtersOpen || hasActiveFilter ? colors.vaykaePink : colors.mutedForeground}
              />
            </Pressable>
          </View>
        </View>

        {filtersOpen && (
          <View className="px-4 pb-3">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs font-semibold" style={{ color: colors.mutedForeground }}>
                Destination Type
              </Text>
              {hasActiveFilter && (
                <Pressable
                  onPress={() => setDestinationType(undefined)}
                  hitSlop={6}
                  className="flex-row items-center"
                >
                  <X size={12} color={colors.mutedForeground} />
                  <Text className="text-xs ml-1" style={{ color: colors.mutedForeground }}>
                    Clear
                  </Text>
                </Pressable>
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {DESTINATION_OPTIONS.map((opt) => {
                  const selected =
                    opt.key === 'all' ? !destinationType : destinationType === opt.key;
                  return (
                    <Pressable
                      key={opt.key}
                      onPress={() =>
                        setDestinationType(
                          opt.key === 'all' ? undefined : (opt.key as DestinationType),
                        )
                      }
                      className="px-3 py-2 rounded-full"
                      style={{
                        backgroundColor: selected ? colors.vaykaePink : colors.inputBackground,
                      }}
                    >
                      <Text
                        className="text-sm font-semibold"
                        style={{ color: selected ? colors.background : colors.foreground }}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (packages.hasNextPage && !packages.isFetchingNextPage) packages.fetchNextPage();
          }}
          ListFooterComponent={
            packages.isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator color={colors.vaykaePink} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            packages.isLoading ? (
              <View className="py-16 items-center">
                <ActivityIndicator color={colors.vaykaePink} />
              </View>
            ) : packages.isError ? (
              <View className="py-16 items-center px-6">
                <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
                  Couldn&apos;t load packages.
                </Text>
                <Pressable onPress={() => packages.refetch()}>
                  <Text style={{ color: colors.vaykaePink }} className="font-semibold">
                    Try again
                  </Text>
                </Pressable>
              </View>
            ) : search || hasActiveFilter ? (
              <View className="py-16 items-center px-6">
                <Package size={40} color={colors.mutedForeground} />
                <Text className="text-center mt-3 mb-1 text-foreground font-medium">
                  No packages match your search.
                </Text>
              </View>
            ) : (
              <View className="py-16 items-center px-6">
                <Package size={40} color={colors.mutedForeground} />
                <Text className="text-center mt-3 mb-1 text-foreground font-medium">
                  No packages available yet
                </Text>
                <Text className="text-sm text-center" style={{ color: colors.mutedForeground }}>
                  Agencies will publish bookable trip packages here.
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <View className="mb-3" style={{ alignSelf: 'stretch' }}>
              <PackageSummaryCard
                pkg={item}
                onPress={() => router.push(`/(traveler)/package/${item.id}`)}
              />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}





