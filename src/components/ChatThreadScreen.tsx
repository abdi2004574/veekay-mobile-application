import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Camera,
  Check,
  CheckCheck,
  FileText,
  Image as ImageIcon,
  Paperclip,
  Phone,
  Send,
  Users,
  Video,
  X,
  Zap,
} from 'lucide-react-native';
import { Avatar } from './Avatar';
import { colors } from '../constants/colors';
import { useAuthStore } from '../stores/auth-store';
import { useToastStore } from '../stores/toast-store';
import { useConversation, useMessages } from '../hooks/use-chat-queries';
import { useMarkConversationRead, useSendMessage } from '../hooks/use-chat-mutations';
import { showInDevelopmentAlert } from '../utils/in-development';
import { pickAndUploadDocument, pickAndUploadFromCamera, pickAndUploadFromLibrary } from '../utils/upload-image';
import { SmartReplyPicker } from './SmartReplyPicker';
import type { Message } from '../api/types';

function StatusTick({ status }: { status?: Message['status'] }) {
  if (status === 'read') return <CheckCheck size={13} color={colors.vaykaePink} />;
  if (status === 'delivered') return <CheckCheck size={13} color="rgba(255,255,255,0.7)" />;
  if (status === 'sent') return <Check size={13} color="rgba(255,255,255,0.7)" />;
  return null;
}

export function ChatThreadScreen({ conversationId }: { conversationId: string }) {
  const currentUserId = useAuthStore((s) => s.user?.id) ?? '';
  const accessToken = useAuthStore((s) => s.accessToken);
  const showToast = useToastStore((s) => s.show);

  const conversation = useConversation(conversationId);
  const messages = useMessages(conversationId);
  const sendMessage = useSendMessage(conversationId);
  const markRead = useMarkConversationRead(conversationId);

  const [text, setText] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showGroupPanel, setShowGroupPanel] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isAttaching, setIsAttaching] = useState(false);
  const lastMessageIdRef = useRef<string | null>(null);

  const items = useMemo(
    () => (messages.data?.pages.flatMap((p) => p.items) ?? []).slice().reverse(),
    [messages.data],
  );

  useEffect(() => {
    const latest = items[items.length - 1]?.id ?? null;
    if (latest && latest !== lastMessageIdRef.current) {
      lastMessageIdRef.current = latest;
      markRead.mutate();
    }
  }, [items.length]);

  const handleSendText = () => {
    if (!text.trim()) return;
    sendMessage.mutate({ type: 'text', body: text.trim() });
    setText('');
  };

  const handlePickPhoto = async (source: 'camera' | 'library') => {
    if (!accessToken) return;
    setIsAttaching(true);
    setShowMediaPicker(false);
    try {
      const uploaded = await (source === 'camera'
        ? pickAndUploadFromCamera('chat_image', accessToken)
        : pickAndUploadFromLibrary('chat_image', accessToken));
      if (uploaded) {
        sendMessage.mutate({ type: 'image', mediaId: uploaded.mediaId });
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not attach that photo.');
    } finally {
      setIsAttaching(false);
    }
  };

  const handlePickDocument = async () => {
    if (!accessToken) return;
    setIsAttaching(true);
    setShowMediaPicker(false);
    try {
      const uploaded = await pickAndUploadDocument('chat_document', accessToken);
      if (uploaded) {
        sendMessage.mutate({
          type: 'document',
          mediaId: uploaded.mediaId,
          fileName: uploaded.fileName,
        });
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not attach that file.');
    } finally {
      setIsAttaching(false);
    }
  };

  if (conversation.isLoading || messages.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.vaykaePink} />
      </SafeAreaView>
    );
  }

  if (conversation.isError || !conversation.data) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
          Couldn&apos;t load this conversation.
        </Text>
        <Pressable onPress={() => conversation.refetch()}>
          <Text style={{ color: colors.vaykaePink }} className="font-semibold">
            Try again
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const convo = conversation.data;
  const isAgency = convo.type === 'agency';
  const isGroup = convo.type === 'group';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View
          className="flex-row items-center justify-between px-4 h-14"
          style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
        >
          <View className="flex-row items-center gap-3 flex-1">
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <ArrowLeft size={20} color={colors.foreground} />
            </Pressable>
            <Avatar name={convo.title} size={36} />
            <View className="flex-1">
              <Text className="font-semibold text-foreground" numberOfLines={1}>
                {convo.title}
              </Text>
              {isGroup && (
                <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                  {convo.members?.length ?? 0} members
                </Text>
              )}
            </View>
          </View>

          <View className="flex-row gap-1">
            {isAgency && (
              <>
                <Pressable
                  onPress={() => showInDevelopmentAlert(`Audio calls aren't available yet.`)}
                  hitSlop={6}
                  className="p-2"
                >
                  <Phone size={19} color={colors.foreground} />
                </Pressable>
                <Pressable
                  onPress={() => showInDevelopmentAlert(`Video calls aren't available yet.`)}
                  hitSlop={6}
                  className="p-2"
                >
                  <Video size={19} color={colors.foreground} />
                </Pressable>
              </>
            )}
            {isGroup && (
              <Pressable onPress={() => setShowGroupPanel((v) => !v)} hitSlop={6} className="p-2">
                <Users size={19} color={colors.foreground} />
              </Pressable>
            )}
          </View>
        </View>

        {isGroup && showGroupPanel && (
          <View
            className="px-4 py-3"
            style={{ borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.inputBackground }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-semibold text-foreground">Group Members</Text>
              <Pressable
                onPress={() => showInDevelopmentAlert(`Adding members from here isn't built yet.`)}
                hitSlop={6}
              >
                <Text className="text-xs font-semibold" style={{ color: colors.vaykaePink }}>
                  + Add
                </Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {convo.members?.map((m) => {
                  const name = m.displayName ?? `@${m.username}`;
                  return (
                    <View key={m.id} className="items-center" style={{ width: 56 }}>
                      <Avatar name={name} size={44} />
                      <Text className="text-xs mt-1 text-foreground" numberOfLines={1}>
                        {m.id === currentUserId ? 'You' : name}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}

        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }} className="flex-1">
          {items.length === 0 ? (
            <View className="py-16 items-center px-6">
              <Text className="text-center" style={{ color: colors.mutedForeground }}>
                No messages yet. Say hello!
              </Text>
            </View>
          ) : (
            items.map((message) => {
              const mine = message.sender.id === currentUserId;
               const senderName = message.sender.displayName ?? `@${message.sender.username}`;
              return (
                <View
                  key={message.id}
                   className={`flex-row ${mine ? 'justify-end' : 'justify-start'}`}
                >
                   <View className={`flex-row gap-2 ${mine ? 'flex-row-reverse' : ''}`} style={{ maxWidth: '85%' }}>
                    {isGroup && !mine && <Avatar name={senderName} size={28} />}
                    <View>
                      {isGroup && !mine && (
                        <Text className="text-xs mb-1 px-1" style={{ color: colors.mutedForeground }}>
                          {senderName}
                        </Text>
                      )}
                      <View
                        className="rounded-2xl px-4 py-2"
                        style={{ backgroundColor: mine ? colors.vaykaePink : colors.inputBackground }}
                      >
                        {message.type === 'text' && (
                          <Text style={{ color: mine ? colors.background : colors.foreground }}>
                            {message.body}
                          </Text>
                        )}
                        {message.type === 'image' &&
                          (message.mediaUrl ? (
                            <Image
                              source={{ uri: message.mediaUrl }}
                              style={{ width: 192, height: 192, borderRadius: 12 }}
                              resizeMode="cover"
                            />
                          ) : (
                            <Text style={{ color: mine ? colors.background : colors.foreground }}>
                              Photo unavailable
                            </Text>
                          ))}
                        {message.type === 'document' && (
                          <View className="flex-row items-center gap-2" style={{ minWidth: 180 }}>
                            <FileText size={20} color={mine ? colors.background : colors.foreground} />
                            <Text
                              className="flex-1 text-sm"
                              numberOfLines={1}
                              style={{ color: mine ? colors.background : colors.foreground }}
                            >
                              {message.fileName ?? 'Document'}
                            </Text>
                          </View>
                        )}
                        <View className="flex-row items-center gap-1 mt-1 justify-end">
                          <Text
                            style={{
                              fontSize: 11,
                              color: mine ? 'rgba(255,255,255,0.7)' : colors.mutedForeground,
                            }}
                          >
                            {new Date(message.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Text>
                          {mine && <StatusTick status={message.status} />}
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {showMediaPicker && (
          <View
            className="p-4"
            style={{ borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.background }}
          >
            <View className="flex-row items-center justify-around">
              <Pressable onPress={() => handlePickPhoto('library')} className="items-center gap-2">
                <View
                  className="items-center justify-center rounded-2xl"
                  style={{ width: 56, height: 56, backgroundColor: colors.vaykaePink }}
                >
                  <ImageIcon size={24} color={colors.background} />
                </View>
                <Text className="text-xs font-medium text-foreground">Photo</Text>
              </Pressable>
              <Pressable onPress={() => handlePickPhoto('camera')} className="items-center gap-2">
                <View
                  className="items-center justify-center rounded-2xl"
                  style={{ width: 56, height: 56, backgroundColor: colors.vaykaePink }}
                >
                  <Camera size={24} color={colors.background} />
                </View>
                <Text className="text-xs font-medium text-foreground">Camera</Text>
              </Pressable>
              <Pressable onPress={handlePickDocument} className="items-center gap-2">
                <View
                  className="items-center justify-center rounded-2xl"
                  style={{ width: 56, height: 56, backgroundColor: colors.vaykaePink }}
                >
                  <FileText size={24} color={colors.background} />
                </View>
                <Text className="text-xs font-medium text-foreground">Document</Text>
              </Pressable>
              <Pressable onPress={() => setShowMediaPicker(false)} className="items-center gap-2">
                <View
                  className="items-center justify-center rounded-2xl"
                  style={{ width: 56, height: 56, backgroundColor: colors.disabledBackground }}
                >
                  <X size={24} color={colors.foreground} />
                </View>
                <Text className="text-xs font-medium text-foreground">Close</Text>
              </Pressable>
            </View>
          </View>
        )}

        <View className="flex-row items-center gap-2 px-4 py-3" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
          <Pressable
            onPress={() => setShowMediaPicker((v) => !v)}
            disabled={isAttaching}
            hitSlop={6}
            className="p-2"
          >
            {isAttaching ? (
              <ActivityIndicator size="small" color={colors.mutedForeground} />
            ) : (
              <Paperclip size={20} color={colors.mutedForeground} />
            )}
          </Pressable>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor={colors.mutedForeground}
            onSubmitEditing={handleSendText}
            className="flex-1 h-12 rounded-full px-4 text-foreground"
            style={{ backgroundColor: colors.inputBackground }}
          />
          {isAgency && (
            <Pressable
              onPress={() => setShowQuickReplies((v) => !v)}
              hitSlop={6}
              className="items-center justify-center"
              style={{ width: 36 }}
            >
              <Zap size={20} color={colors.mutedForeground} />
            </Pressable>
          )}
          <Pressable
            onPress={handleSendText}
            disabled={!text.trim() || sendMessage.isPending}
            className="items-center justify-center rounded-full"
            style={{
              width: 44,
              height: 44,
              backgroundColor: text.trim() ? colors.vaykaePink : colors.disabledBackground,
            }}
          >
            <Send size={18} color={text.trim() ? colors.background : colors.mutedForeground} />
          </Pressable>
        </View>
        {isAgency && (
          <SmartReplyPicker
            visible={showQuickReplies}
            onClose={() => setShowQuickReplies(false)}
            onPick={(template) => {
              setText((prev) => prev ? prev + ' ' + template.body : template.body);
              setShowQuickReplies(false);
            }}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
