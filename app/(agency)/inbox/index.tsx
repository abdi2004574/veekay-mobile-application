import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { ChatListRow } from '../../../src/components/ChatListRow';
import { AgencyBottomNav } from '../../../src/components/AgencyBottomNav';
import { colors } from '../../../src/constants/colors';
import { useConversations } from '../../../src/hooks/use-chat-queries';

export default function AgencyChatListScreen() {
  const [search, setSearch] = useState('');
  const conversations = useConversations();

  const filtered = useMemo(() => {
    const items = conversations.data ?? [];
    return items.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
  }, [conversations.data, search]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View style={{ flex: 1 }}>
        <View className="p-6" style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text className="text-2xl font-bold text-foreground mb-4">Messages</Text>
          <View style={{ position: 'relative' }}>
            <View style={{ position: 'absolute', left: 16, top: 14, zIndex: 1 }}>
              <Search size={18} color={colors.mutedForeground} />
            </View>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search conversations..."
              placeholderTextColor={colors.mutedForeground}
              className="h-12 rounded-2xl pl-12 pr-4 text-foreground"
              style={{ backgroundColor: colors.inputBackground }}
            />
          </View>
        </View>

        {conversations.isLoading ? (
          <View className="py-16 items-center">
            <ActivityIndicator color={colors.vaykaePink} />
          </View>
        ) : conversations.isError ? (
          <View className="py-16 items-center px-6">
            <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
              Couldn&apos;t load your messages.
            </Text>
            <Text
              onPress={() => conversations.refetch()}
              style={{ color: colors.vaykaePink }}
              className="font-semibold"
            >
              Try again
            </Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 96 }}
            ListEmptyComponent={
              <View className="py-16 items-center px-6">
                <Text className="text-lg font-medium mb-2 text-foreground">
                  No conversations yet
                </Text>
                <Text className="text-sm text-center" style={{ color: colors.mutedForeground }}>
                  Traveler messages will show up here once they reach out.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <ChatListRow
                conversation={item}
                onPress={() => router.push(`/(agency)/inbox/${item.id}`)}
              />
            )}
          />
        )}

        <AgencyBottomNav active="chat" />
      </View>
    </SafeAreaView>
  );
}
