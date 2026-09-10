import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react-native';
import { GradientButton } from '../../../src/components/GradientButton';
import { colors } from '../../../src/constants/colors';
import { useSmartReplyTemplates } from '../../../src/hooks/use-trip-requests-queries';
import {
  useCreateSmartReplyTemplate,
  useDeleteSmartReplyTemplate,
  useUpdateSmartReplyTemplate,
} from '../../../src/hooks/use-trip-requests-mutations';
import { showAlert } from '../../../src/utils/show-alert';
import type { SmartReplyTemplate } from '../../../src/api/types';

const TITLE_MAX = 100;
const BODY_MAX = 2000;

export default function AgencySmartRepliesScreen() {
  const templatesQuery = useSmartReplyTemplates();
  const createMutation = useCreateSmartReplyTemplate();
  const updateMutation = useUpdateSmartReplyTemplate();
  const deleteMutation = useDeleteSmartReplyTemplate();

  const [editing, setEditing] = useState<SmartReplyTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const closeModal = () => {
    setEditing(null);
    setIsCreating(false);
    setTitle('');
    setBody('');
  };

  const openCreate = () => {
    setEditing(null);
    setTitle('');
    setBody('');
    setIsCreating(true);
  };

  const openEdit = (template: SmartReplyTemplate) => {
    setIsCreating(false);
    setEditing(template);
    setTitle(template.title);
    setBody(template.body);
  };

  const save = () => {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    if (!trimmedTitle || !trimmedBody) return;

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, input: { title: trimmedTitle, body: trimmedBody } },
        { onSuccess: () => closeModal() },
      );
    } else {
      createMutation.mutate(
        { title: trimmedTitle, body: trimmedBody },
        { onSuccess: () => closeModal() },
      );
    }
  };

  const confirmDelete = (template: SmartReplyTemplate) => {
    showAlert('Delete template?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(template.id),
      },
    ]);
  };

  const templates = templatesQuery.data ?? [];
  const showModal = isCreating || editing !== null;
  const modalTitle = editing ? 'Edit Quick Reply' : 'New Quick Reply';
  const saveDisabled =
    !title.trim() || !body.trim() || createMutation.isPending || updateMutation.isPending;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View
        className="h-14 flex-row items-center justify-between px-4"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={24} color={colors.foreground} />
        </Pressable>
        <Text className="text-lg font-semibold text-foreground">Quick Replies</Text>
        <Pressable
          onPress={openCreate}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="New quick reply"
        >
          <Plus size={22} color={colors.foreground} />
        </Pressable>
      </View>

      {templatesQuery.isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.vaykaePink} />
        </View>
      ) : templatesQuery.isError ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
            Couldn&apos;t load your templates.
          </Text>
          <Text
            onPress={() => templatesQuery.refetch()}
            style={{ color: colors.vaykaePink }}
            className="font-semibold"
          >
            Try again
          </Text>
        </View>
      ) : templates.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-lg font-medium mb-2 text-foreground text-center">
            No quick replies yet
          </Text>
          <Text
            className="text-sm text-center mb-6"
            style={{ color: colors.mutedForeground }}
          >
            Create reusable messages you can send to travelers from the chat composer.
          </Text>
          <GradientButton onPress={openCreate}>Create First Template</GradientButton>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
          {templates.map((template, idx) => (
            <View
              key={template.id}
              style={{
                paddingHorizontal: 24,
                paddingVertical: 16,
                borderBottomWidth: idx === templates.length - 1 ? 0 : 1,
                borderBottomColor: colors.border,
              }}
            >
              <Pressable onPress={() => openEdit(template)}>
                <View className="flex-row items-start justify-between mb-2">
                  <Text
                    className="font-semibold text-foreground flex-1 mr-3"
                    numberOfLines={1}
                  >
                    {template.title}
                  </Text>
                  <Pressable
                    onPress={() => confirmDelete(template)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Delete template"
                  >
                    <Trash2 size={18} color={colors.destructive} />
                  </Pressable>
                </View>
                <Text
                  className="text-sm"
                  numberOfLines={2}
                  style={{ color: colors.mutedForeground }}
                >
                  {template.body}
                </Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'flex-end',
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{
              backgroundColor: colors.background,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 24,
            }}
          >
            <Text className="text-lg font-semibold text-foreground mb-4">{modalTitle}</Text>

            <Text className="text-sm mb-1" style={{ color: colors.mutedForeground }}>
              Title
            </Text>
            <TextInput
              value={title}
              onChangeText={(t) => setTitle(t.slice(0, TITLE_MAX))}
              placeholder="e.g. Welcome"
              placeholderTextColor={colors.mutedForeground}
              className="h-12 rounded-2xl px-4 mb-1 text-foreground"
              style={{ backgroundColor: colors.inputBackground }}
              maxLength={TITLE_MAX}
            />
            <Text
              className="text-xs mb-4 self-end"
              style={{ color: colors.mutedForeground }}
            >
              {title.length}/{TITLE_MAX}
            </Text>

            <Text className="text-sm mb-1" style={{ color: colors.mutedForeground }}>
              Message
            </Text>
            <TextInput
              value={body}
              onChangeText={(b) => setBody(b.slice(0, BODY_MAX))}
              placeholder="Type your reusable reply..."
              placeholderTextColor={colors.mutedForeground}
              className="rounded-2xl px-4 py-3 mb-1 text-foreground"
              style={{
                backgroundColor: colors.inputBackground,
                minHeight: 140,
                textAlignVertical: 'top',
              }}
              multiline
              maxLength={BODY_MAX}
            />
            <Text
              className="text-xs mb-5 self-end"
              style={{ color: colors.mutedForeground }}
            >
              {body.length}/{BODY_MAX}
            </Text>

            <View className="flex-row gap-3">
              <View style={{ flex: 1 }}>
                <GradientButton variant="outline" onPress={closeModal}>
                  Cancel
                </GradientButton>
              </View>
              <View style={{ flex: 1 }}>
                <GradientButton
                  onPress={save}
                  disabled={saveDisabled}
                  loading={createMutation.isPending || updateMutation.isPending}
                >
                  Save
                </GradientButton>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
