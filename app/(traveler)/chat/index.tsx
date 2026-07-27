import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, Search } from 'lucide-react-native';
import { ChatListRow } from '../../../src/components/ChatListRow';
import { TravelerBottomNav } from '../../../src/components/TravelerBottomNav';
import { BOTTOM_NAV_HEIGHT } from '../../../src/components/BottomNavBar';
import { colors } from '../../../src/constants/colors';
import { useConversations } from '../../../src/hooks/use-chat-queries';

type Tab = 'all' | 'friends' | 'agencies' | 'groups';

export default function ChatListScreen() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<Tab>('all');
  const conversations = useConversations();
  const insets = useSafeAreaInsets();

  const filtered = useMemo(() => {
    const items = conversations.data ?? [];
    return items.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        (c.lastMessage ?? '').toLowerCase().includes(search.toLowerCase());
      const matchesTab =
        tab === 'all' ||
        (tab === 'friends' && c.type === 'direct') ||
        (tab === 'agencies' && c.type === 'agency') ||
        (tab === 'groups' && c.type === 'group');
      return matchesSearch && matchesTab;
    });
  }, [conversations.data, search, tab]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View style={{ flex: 1 }}>
        <Text className="text-xl font-bold text-foreground px-4 pt-3 pb-1">Messages</Text>

        <View className="px-4 pt-2">
          <View style={{ position: 'relative' }}>
            <View style={{ position: 'absolute', left: 16, top: 14, zIndex: 1 }}>
              <Search size={18} color={colors.mutedForeground} />
            </View>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search messages..."
              placeholderTextColor={colors.mutedForeground}
              className="h-12 rounded-full pl-12 pr-4 text-foreground"
              style={{ backgroundColor: colors.inputBackground }}
            />
          </View>
        </View>

        <View className="flex-row gap-2 px-4 pt-3 pb-2">
          {(
            [
              { key: 'all', label: 'All Chats' },
              { key: 'friends', label: 'Friends' },
              { key: 'agencies', label: 'Agencies' },
              { key: 'groups', label: 'Groups' },
            ] as { key: Tab; label: string }[]
          ).map((t) => (
            <Text
              key={t.key}
              onPress={() => setTab(t.key)}
              className="px-4 py-2 rounded-full text-sm font-medium overflow-hidden"
              style={{
                backgroundColor: tab === t.key ? colors.vaykaePink : colors.inputBackground,
                color: tab === t.key ? colors.background : colors.mutedForeground,
              }}
            >
              {t.label}
            </Text>
          ))}
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
                <Text className="text-lg font-medium mb-2 text-foreground">No chats found</Text>
                <Text className="text-sm text-center" style={{ color: colors.mutedForeground }}>
                  Message a friend from their profile to start a conversation.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <ChatListRow
                conversation={item}
                onPress={() => router.push(`/(traveler)/chat/${item.id}`)}
              />
            )}
          />
        )}

        <Pressable
          onPress={() => router.push('/(traveler)/friends')}
          style={{
            position: 'absolute',
            right: 20,
            bottom: BOTTOM_NAV_HEIGHT + insets.bottom + 16,
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

        <TravelerBottomNav active="chat" />
      </View>
    </SafeAreaView>
  );
}
