import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Camera, Image as ImageIcon, Type, X } from 'lucide-react-native';
import { GradientButton } from '../../src/components/GradientButton';
import { colors } from '../../src/constants/colors';
import { useCreateStory } from '../../src/hooks/use-feed-mutations';
import { showInDevelopmentAlert } from '../../src/utils/in-development';
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

type Mode = 'choose' | 'edit-text';

export default function CreateStoryScreen() {
  const [mode, setMode] = useState<Mode>('choose');
  const [text, setText] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(BACKGROUND_COLORS[0]);
  const [textSize, setTextSize] = useState<StoryTextSize>('medium');
  const createStory = useCreateStory();

  const handlePost = () => {
    if (!text.trim()) return;
    createStory.mutate(
      { text: text.trim(), backgroundColor, textSize },
      { onSuccess: () => router.back() },
    );
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
            onPress={() =>
              showInDevelopmentAlert('Taking a photo for a story isn’t wired up yet.')
            }
            className="h-16 rounded-2xl flex-row items-center gap-3 px-5"
            style={{ borderWidth: 1, borderColor: colors.border }}
          >
            <Camera size={22} color={colors.vaykaePink} />
            <Text className="font-semibold text-foreground">Take Photo</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              showInDevelopmentAlert('Choosing a photo for a story isn’t wired up yet.')
            }
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

          <GradientButton onPress={handlePost} disabled={!text.trim()} loading={createStory.isPending}>
            Post Story
          </GradientButton>
        </View>
      </SafeAreaView>
    </View>
  );
}
