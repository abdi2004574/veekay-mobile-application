import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Camera, Image as ImageIcon, Type, X } from 'lucide-react-native';
import { GradientButton } from '../../src/components/GradientButton';
import { colors } from '../../src/constants/colors';
import { useCreateStory } from '../../src/hooks/use-feed-mutations';
import { useAuthStore } from '../../src/stores/auth-store';
import { useToastStore } from '../../src/stores/toast-store';
import { pickAndUploadFromCamera, pickAndUploadFromLibrary } from '../../src/utils/upload-image';
import type { StoryTextSize } from '../../src/api/types';

const BACKGROUND_COLORS = [
  '#D701A8',
  '#7700C6',
  '#FF6B6B',
  '#40C9C0',
  '#4A90D9',
  '#FA8072',
  '#98D8AA',
  '#F5D547',
  '#000000',
];

const TEXT_SIZES: { key: StoryTextSize; label: string; fontSize: number }[] = [
  { key: 'small', label: 'Small', fontSize: 18 },
  { key: 'medium', label: 'Medium', fontSize: 24 },
  { key: 'large', label: 'Large', fontSize: 32 },
];

const CAPTION_LIMIT = 50;

type Mode = 'choose' | 'edit-text' | 'edit-photo';

export default function CreateStoryScreen() {
  const [mode, setMode] = useState<Mode>('choose');
  const [isPicking, setIsPicking] = useState(false);
  const [text, setText] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(BACKGROUND_COLORS[0]);
  const [textSize, setTextSize] = useState<StoryTextSize>('medium');
  const [imageMediaId, setImageMediaId] = useState<string>();
  const [imagePreviewUri, setImagePreviewUri] = useState<string>();
  const [caption, setCaption] = useState('');

  const accessToken = useAuthStore((s) => s.accessToken);
  const showToast = useToastStore((s) => s.show);
  const createStory = useCreateStory();

  const handlePostText = () => {
    if (!text.trim()) return;
    createStory.mutate(
      { text: text.trim(), backgroundColor, textSize },
      { onSuccess: () => router.back() },
    );
  };

  const handlePostPhoto = () => {
    if (!imageMediaId) return;
    createStory.mutate(
      { imageMediaId, text: caption.trim() || undefined },
      { onSuccess: () => router.back() },
    );
  };

  const pickPhoto = async (source: 'camera' | 'library') => {
    if (!accessToken) return;
    setIsPicking(true);
    try {
      const uploaded = await (source === 'camera'
        ? pickAndUploadFromCamera('story_media', accessToken)
        : pickAndUploadFromLibrary('story_media', accessToken));
      if (uploaded) {
        setImageMediaId(uploaded.mediaId);
        setImagePreviewUri(uploaded.previewUri);
        setMode('edit-photo');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not add that photo.');
    } finally {
      setIsPicking(false);
    }
  };

  if (mode === 'choose') {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View
          className="flex-row items-center justify-between px-4 h-14"
          style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
        >
          <Text className="text-lg font-bold text-foreground">Add to Story</Text>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <X size={20} color={colors.foreground} />
          </Pressable>
        </View>

        <View className="flex-1 px-6 justify-center gap-4">
          <Pressable
            onPress={() => pickPhoto('camera')}
            disabled={isPicking}
            className="h-16 rounded-2xl flex-row items-center gap-3 px-5"
            style={{ borderWidth: 1, borderColor: colors.border }}
          >
            {isPicking ? (
              <ActivityIndicator color={colors.vaykaePink} />
            ) : (
              <>
                <Camera size={22} color={colors.vaykaePink} />
                <Text className="font-semibold text-foreground">Take Photo</Text>
              </>
            )}
          </Pressable>
          <Pressable
            onPress={() => pickPhoto('library')}
            disabled={isPicking}
            className="h-16 rounded-2xl flex-row items-center gap-3 px-5"
            style={{ borderWidth: 1, borderColor: colors.border }}
          >
            <ImageIcon size={22} color={colors.vaykaePink} />
            <Text className="font-semibold text-foreground">Choose Photo</Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('edit-text')}
            className="h-16 rounded-2xl flex-row items-center gap-3 px-5"
            style={{ borderWidth: 1, borderColor: colors.border }}
          >
            <Type size={22} color={colors.vaykaePink} />
            <Text className="font-semibold text-foreground">Text Story</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (mode === 'edit-photo') {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View className="flex-row items-center justify-between px-4 h-14">
            <Pressable
              onPress={() => {
                setImageMediaId(undefined);
                setImagePreviewUri(undefined);
                setCaption('');
                setMode('choose');
              }}
              hitSlop={8}
            >
              <X size={22} color="#fff" />
            </Pressable>
            <Text className="text-white/80 text-sm">
              {caption.length}/{CAPTION_LIMIT}
            </Text>
          </View>

          <View className="flex-1 items-center justify-center">
            {imagePreviewUri && (
              <Image
                source={{ uri: imagePreviewUri }}
                style={{ width: '100%', height: '70%' }}
                resizeMode="contain"
              />
            )}
          </View>

          <View className="px-6 mb-4">
            <TextInput
              value={caption}
              onChangeText={(v) => setCaption(v.slice(0, CAPTION_LIMIT))}
              placeholder="Add a caption..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              className="h-12 rounded-2xl px-4 mb-4 text-white"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            />
            <GradientButton onPress={handlePostPhoto} loading={createStory.isPending}>
              Post Story
            </GradientButton>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const selectedSize = TEXT_SIZES.find((s) => s.key === textSize)!;

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-row items-center justify-between px-4 h-14">
          <Pressable onPress={() => setMode('choose')} hitSlop={8}>
            <X size={22} color="#fff" />
          </Pressable>
          <Text className="text-white/80 text-sm">{text.length}/150</Text>
        </View>

        <View className="flex-1 items-center justify-center px-8">
          <TextInput
            value={text}
            onChangeText={(v) => setText(v.slice(0, 150))}
            placeholder="Type something..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            multiline
            autoFocus
            textAlign="center"
            style={{ color: '#fff', fontSize: selectedSize.fontSize, fontWeight: '600' }}
          />
        </View>

        <View className="px-6 mb-4">
          <View className="flex-row justify-center gap-3 mb-4">
            {TEXT_SIZES.map((s) => (
              <Pressable
                key={s.key}
                onPress={() => setTextSize(s.key)}
                className="px-4 py-2 rounded-full"
                style={{
                  backgroundColor:
                    textSize === s.key ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{ color: textSize === s.key ? '#000' : '#fff' }}
                >
                  {s.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="flex-row justify-center gap-3 mb-6 flex-wrap">
            {BACKGROUND_COLORS.map((color) => (
              <Pressable
                key={color}
                onPress={() => setBackgroundColor(color)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: color,
                  borderWidth: backgroundColor === color ? 3 : 0,
                  borderColor: '#fff',
                }}
              />
            ))}
          </View>

          <GradientButton onPress={handlePostText} disabled={!text.trim()} loading={createStory.isPending}>
            Post Story
          </GradientButton>
        </View>
      </SafeAreaView>
    </View>
  );
}
