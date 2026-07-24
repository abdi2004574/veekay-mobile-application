import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Search, UserCheck, UserPlus } from 'lucide-react-native';
import { Avatar } from '../../src/components/Avatar';
import { colors } from '../../src/constants/colors';
import { useSearchTravelers } from '../../src/hooks/use-users-queries';
import { useSendFriendRequest } from '../../src/hooks/use-friend-mutations';
import type { TravelerSearchResult } from '../../src/api/types';

function ResultAction({ result }: { result: TravelerSearchResult }) {
  const sendRequest = useSendFriendRequest();

  if (result.isFriend) {
    return (
      <View
        className="flex-row items-center gap-1.5 px-3 py-2 rounded-full"
        style={{ backgroundColor: colors.inputBackground }}
      >
        <UserCheck size={14} color={colors.mutedForeground} />
        <Text className="text-xs font-medium" style={{ color: colors.mutedForeground }}>
          Friends
        </Text>
      </View>
    );
  }

  if (result.requestSent) {
    return (
      <View
        className="px-3 py-2 rounded-full"
        style={{ backgroundColor: colors.inputBackground }}
      >
        <Text className="text-xs font-medium" style={{ color: colors.mutedForeground }}>
          Sent
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => sendRequest.mutate(result.id)}
      disabled={sendRequest.isPending}
      className="flex-row items-center gap-1.5 px-3 py-2 rounded-full"
      style={{ backgroundColor: colors.vaykaePink }}
    >
      {sendRequest.isPending ? (
        <ActivityIndicator size="small" color={colors.background} />
      ) : (
        <>
          <UserPlus size={14} color={colors.background} />
          <Text className="text-xs font-medium" style={{ color: colors.background }}>
            Add
          </Text>
        </>
      )}
    </Pressable>
  );
}

export default function AddFriendScreen() {
  const [query, setQuery] = useState('');
  const search = useSearchTravelers(query);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View
        className="flex-row items-center gap-3 px-4 h-14"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Pressable>
        <Text className="text-lg font-bold text-foreground">Find Friends</Text>
      </View>

      <View className="px-4 pt-4">
        <View
          className="flex-row items-center gap-2 rounded-2xl px-4 h-12"
          style={{ backgroundColor: colors.inputBackground }}
        >
          <Search size={18} color={colors.mutedForeground} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name or username..."
            placeholderTextColor={colors.mutedForeground}
            className="flex-1 text-foreground"
            autoFocus
          />
        </View>
      </View>

      {query.trim().length === 0 ? (
        <View className="py-16 items-center px-6">
          <Text className="text-center" style={{ color: colors.mutedForeground }}>
            Search for other travelers to add as friends.
          </Text>
        </View>
      ) : search.isLoading ? (
        <View className="py-16 items-center">
          <ActivityIndicator color={colors.vaykaePink} />
        </View>
      ) : search.isError ? (
        <View className="py-16 items-center px-6">
          <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
            Search failed.
          </Text>
          <Pressable onPress={() => search.refetch()}>
            <Text style={{ color: colors.vaykaePink }} className="font-semibold">
              Try again
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={search.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View className="py-16 items-center px-6">
              <Text className="text-center" style={{ color: colors.mutedForeground }}>
                No travelers found for &quot;{query}&quot;.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const name = item.displayName ?? `@${item.username}`;
            return (
              <View
                className="flex-row items-center gap-3 rounded-2xl px-4 py-3 mb-3"
                style={{ borderWidth: 1, borderColor: colors.border }}
              >
                <Avatar name={name} size={44} />
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">{name}</Text>
                  <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                    @{item.username}
                  </Text>
                </View>
                <ResultAction result={item} />
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
