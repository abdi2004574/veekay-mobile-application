import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { colors } from '../constants/colors';
import { useSmartReplyTemplates } from '../hooks/use-trip-requests-queries';
import type { SmartReplyTemplate } from '../api/types';

interface SmartReplyPickerProps {
  visible: boolean;
  onClose: () => void;
  onPick: (template: SmartReplyTemplate) => void;
}

export function SmartReplyPicker({ visible, onClose, onPick }: SmartReplyPickerProps) {
  const insets = useSafeAreaInsets();
  const templates = useSmartReplyTemplates();

  if (!visible) return null;

  return (
    <View
      className="bg-card border-t border-border rounded-t-3xl"
      style={{
        position: 'absolute',
        bottom: 64 + insets.bottom,
        left: 0,
        right: 0,
        maxHeight: 280,
      }}
    >
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="font-semibold text-foreground">Quick Replies</Text>
        <Pressable onPress={onClose} hitSlop={8}>
          <X size={20} color={colors.foreground} />
        </Pressable>
      </View>

      {templates.isLoading ? (
        <View className="py-8 items-center">
          <ActivityIndicator color={colors.vaykaePink} />
        </View>
      ) : templates.isError ? (
        <View className="px-6 py-6 items-center">
          <Text className="text-sm text-center mb-2" style={{ color: colors.mutedForeground }}>
            Couldn&apos;t load quick replies.
          </Text>
          <Pressable onPress={() => templates.refetch()}>
            <Text className="text-sm font-semibold" style={{ color: colors.vaykaePink }}>
              Try again
            </Text>
          </Pressable>
        </View>
      ) : templates.data && templates.data.length > 0 ? (
        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 8 }}>
          {templates.data.map((template) => (
            <Pressable
              key={template.id}
              onPress={() => onPick(template)}
              className="px-4 py-3"
              style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
            >
              <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
                {template.title}
              </Text>
              <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }} numberOfLines={2}>
                {template.body}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <View className="px-6 py-6 items-center">
          <Text className="text-sm text-center" style={{ color: colors.mutedForeground }}>
            No quick replies yet. Create them from the Requests tab.
          </Text>
        </View>
      )}
    </View>
  );
}
