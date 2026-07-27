import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Building2, Compass, Search, Sparkles, Star } from 'lucide-react-native';
import { Avatar } from '../../../src/components/Avatar';
import { TravelerBottomNav } from '../../../src/components/TravelerBottomNav';
import { BOTTOM_NAV_HEIGHT } from '../../../src/components/BottomNavBar';
import { colors } from '../../../src/constants/colors';
import { useAgencyDirectory } from '../../../src/hooks/use-agencies-queries';

export default function ExploreScreen() {
  const [search, setSearch] = useState('');
  const agencies = useAgencyDirectory(search);
  const insets = useSafeAreaInsets();

  const items = useMemo(
    () => agencies.data?.pages.flatMap((p) => p.items) ?? [],
    [agencies.data],
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View style={{ flex: 1 }}>
        <Text className="text-xl font-bold text-foreground px-4 pt-3 pb-1">Explore</Text>

        <View className="px-4 pt-2 pb-3">
          <View style={{ position: 'relative' }}>
            <View style={{ position: 'absolute', left: 16, top: 14, zIndex: 1 }}>
              <Search size={18} color={colors.mutedForeground} />
            </View>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search agencies..."
              placeholderTextColor={colors.mutedForeground}
              className="h-12 rounded-2xl pl-12 pr-4 text-foreground"
              style={{ backgroundColor: colors.inputBackground }}
            />
          </View>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: BOTTOM_NAV_HEIGHT + insets.bottom + 16,
          }}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (agencies.hasNextPage && !agencies.isFetchingNextPage) agencies.fetchNextPage();
          }}
          ListHeaderComponent={
            <View
              className="p-4 rounded-2xl mb-4 flex-row items-center gap-3"
              style={{ backgroundColor: colors.inputBackground }}
            >
              <Compass size={20} color={colors.vaykaePink} />
              <Text className="flex-1 text-sm" style={{ color: colors.mutedForeground }}>
                Campaigns and trip packages are launching soon — for now, browse and message
                agencies below.
              </Text>
            </View>
          }
          ListFooterComponent={
            agencies.isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator color={colors.vaykaePink} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            agencies.isLoading ? (
              <View className="py-16 items-center">
                <ActivityIndicator color={colors.vaykaePink} />
              </View>
            ) : agencies.isError ? (
              <View className="py-16 items-center px-6">
                <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
                  Couldn&apos;t load agencies.
                </Text>
                <Pressable onPress={() => agencies.refetch()}>
                  <Text style={{ color: colors.vaykaePink }} className="font-semibold">
                    Try again
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View className="py-16 items-center px-6">
                <Building2 size={40} color={colors.mutedForeground} />
                <Text className="text-center mt-3" style={{ color: colors.mutedForeground }}>
                  No agencies found.
                </Text>
              </View>
            )
          }
          renderItem={({ item, index }) => (
            <View>
              {index === 0 && (
                <View className="flex-row items-center gap-2 mb-3">
                  <Sparkles size={18} color={colors.vaykaePink} />
                  <Text className="font-bold text-foreground">Featured Agencies</Text>
                </View>
              )}
              <Pressable
                onPress={() => router.push(`/(traveler)/agency/${item.id}`)}
                className="p-4 rounded-2xl mb-3"
                style={{ borderWidth: 1, borderColor: colors.border }}
              >
                <View className="flex-row items-center gap-3">
                  <Avatar name={item.agencyName} size={48} />
                  <View className="flex-1">
                    <Text className="font-bold text-foreground" numberOfLines={1}>
                      {item.agencyName}
                    </Text>
                    <View className="flex-row items-center gap-1 mt-1">
                      {item.reputationScore !== null ? (
                        <>
                          <Star size={12} color={colors.starGold} fill={colors.starGold} />
                          <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                            {item.reputationScore.toFixed(1)} • {item.reviewCount} review
                            {item.reviewCount === 1 ? '' : 's'}
                          </Text>
                        </>
                      ) : (
                        <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                          No ratings yet
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>
          )}
        />

        <TravelerBottomNav active="explore" />
      </View>
    </SafeAreaView>
  );
}
