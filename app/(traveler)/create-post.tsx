import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Image as ImageIcon, MapPin, Tag, X } from 'lucide-react-native';
import { GradientButton } from '../../src/components/GradientButton';
import { colors } from '../../src/constants/colors';
import { useCreatePost, useUpdatePost } from '../../src/hooks/use-feed-mutations';
import { showInDevelopmentAlert } from '../../src/utils/in-development';

const TEXT_LIMIT = 2200;

export default function CreatePostScreen() {
  const params = useLocalSearchParams<{
    editPostId?: string;
    editText?: string;
    editLocation?: string;
    editTags?: string;
  }>();
  const isEditing = !!params.editPostId;

  const [text, setText] = useState(params.editText ?? '');
  const [location, setLocation] = useState(params.editLocation ?? '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(
    params.editTags ? params.editTags.split(',').filter(Boolean) : [],
  );

  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const isPending = createPost.isPending || updatePost.isPending;

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    const input = {
      text: text.trim(),
      location: location.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
    };

    if (isEditing && params.editPostId) {
      updatePost.mutate(
        { postId: params.editPostId, input },
        { onSuccess: () => router.back() },
      );
    } else {
      createPost.mutate(input, { onSuccess: () => router.back() });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          className="flex-row items-center justify-between px-4 h-14"
          style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
        >
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ArrowLeft size={20} color={colors.foreground} />
          </Pressable>
          <Text className="text-lg font-bold text-foreground">
            {isEditing ? 'Edit Post' : 'Create Post'}
          </Text>
          <View style={{ width: 20 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          <TextInput
            value={text}
            onChangeText={(v) => setText(v.slice(0, TEXT_LIMIT))}
            placeholder="What's on your mind? Share your travel thoughts..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={6}
            autoFocus
            className="rounded-2xl px-4 py-3 text-foreground mb-1"
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.inputBackground,
              minHeight: 140,
              textAlignVertical: 'top',
            }}
          />
          <Text
            className="text-xs mb-4 text-right"
            style={{ color: colors.mutedForeground }}
          >
            {text.length}/{TEXT_LIMIT}
          </Text>

          <Text className="text-sm font-medium mb-2" style={{ color: colors.mutedForeground }}>
            <MapPin size={14} color={colors.mutedForeground} /> Location (Optional)
          </Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Add a location..."
            placeholderTextColor={colors.mutedForeground}
            className="h-12 rounded-2xl px-4 mb-4 text-foreground"
            style={{ backgroundColor: colors.inputBackground }}
          />

          <Text className="text-sm font-medium mb-2" style={{ color: colors.mutedForeground }}>
            <Tag size={14} color={colors.mutedForeground} /> Tags (Optional)
          </Text>
          <View className="flex-row gap-2 mb-2">
            <TextInput
              value={tagInput}
              onChangeText={setTagInput}
              placeholder="Add a tag..."
              placeholderTextColor={colors.mutedForeground}
              onSubmitEditing={addTag}
              className="flex-1 h-12 rounded-2xl px-4 text-foreground"
              style={{ backgroundColor: colors.inputBackground }}
            />
            <Pressable
              onPress={addTag}
              className="px-5 items-center justify-center rounded-2xl"
              style={{ borderWidth: 2, borderColor: colors.vaykaePink }}
            >
              <Text className="font-bold" style={{ color: colors.vaykaePink }}>
                Add
              </Text>
            </Pressable>
          </View>
          {tags.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <View
                  key={tag}
                  className="flex-row items-center gap-1 rounded-full px-3 py-1.5"
                  style={{ backgroundColor: colors.inputBackground }}
                >
                  <Text className="text-sm font-medium text-foreground">#{tag}</Text>
                  <Pressable onPress={() => setTags(tags.filter((t) => t !== tag))} hitSlop={4}>
                    <X size={12} color={colors.foreground} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <Pressable
            onPress={() =>
              showInDevelopmentAlert('Photo uploads aren’t wired up yet.')
            }
            className="h-14 rounded-2xl items-center justify-center flex-row gap-2"
            style={{ borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed' }}
          >
            <ImageIcon size={20} color={colors.mutedForeground} />
            <Text className="font-medium" style={{ color: colors.mutedForeground }}>
              Add Photo
            </Text>
          </Pressable>
        </ScrollView>

        <View className="px-4 pb-4">
          <GradientButton onPress={handleSubmit} disabled={!text.trim()} loading={isPending}>
            {isEditing ? 'Update Post' : 'Post'}
          </GradientButton>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
