import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Heart, Send, X } from 'lucide-react-native';
import { Avatar } from '../../../src/components/Avatar';
import { colors } from '../../../src/constants/colors';
import { formatTimeAgo } from '../../../src/utils/format-time-ago';
import { showInDevelopmentAlert } from '../../../src/utils/in-development';
import { useActiveStories } from '../../../src/hooks/use-feed-queries';
import { useLikeStory, useViewStory } from '../../../src/hooks/use-feed-mutations';

const STORY_DURATION_MS = 5000;
const TICK_MS = 100;

// Keyed by `${storyId}-${isActive}` from the parent so becoming active mounts
// a fresh instance — progress starts at 0 via useState's initializer, never
// via a synchronous setState call inside the effect body.
function StoryProgressBar({
  isActive,
  isPast,
  onExpire,
}: {
  isActive: boolean;
  isPast: boolean;
  onExpire: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(1, prev + TICK_MS / STORY_DURATION_MS));
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [isActive]);

  // Runs onExpire as its own effect once progress commits to 1, instead of
  // calling it (and its downstream setState/navigation) from inside the
  // setProgress updater above — nested setState-during-render otherwise.
  useEffect(() => {
    if (isActive && progress >= 1 && !firedRef.current) {
      firedRef.current = true;
      onExpire();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, progress]);

  const width = isPast ? 100 : isActive ? progress * 100 : 0;

  return (
    <View style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' }}>
      <View style={{ height: 3, borderRadius: 2, backgroundColor: '#fff', width: `${width}%` }} />
    </View>
  );
}

export default function StoryViewerScreen() {
  const { ids } = useLocalSearchParams<{ id: string; ids: string }>();
  const storyIds = useMemo(() => (ids ? ids.split(',') : []), [ids]);
  const stories = useActiveStories();
  const viewStory = useViewStory();
  const likeStory = useLikeStory();

  const orderedStories = useMemo(
    () =>
      storyIds
        .map((sid) => stories.data?.find((s) => s.id === sid))
        .filter((s): s is NonNullable<typeof s> => !!s),
    [storyIds, stories.data],
  );

  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [reply, setReply] = useState('');
  const viewedRef = useRef<Set<string>>(new Set());

  const current = orderedStories[index];

  useEffect(() => {
    if (!current || viewedRef.current.has(current.id)) return;
    viewedRef.current.add(current.id);
    viewStory.mutate(current.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  const advance = () => {
    if (index < orderedStories.length - 1) {
      setIndex((i) => i + 1);
    } else {
      router.back();
    }
  };

  if (stories.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator color={colors.background} />
      </SafeAreaView>
    );
  }

  if (!current) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center px-6">
        <Text className="text-center text-white mb-3">This story is no longer available.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.vaykaePink }} className="font-semibold">
            Go back
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const name = current.author.displayName ?? `@${current.author.username}`;
  const isLiked = liked.has(current.id);

  const handleLike = () => {
    if (isLiked) return;
    setLiked((prev) => new Set(prev).add(current.id));
    likeStory.mutate(current.id);
  };

  const content = current.imageMediaId ? (
    <View style={{ flex: 1 }}>
      {current.imageUrl ? (
        <Image source={{ uri: current.imageUrl }} style={{ flex: 1 }} resizeMode="contain" />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text className="text-white/70 text-center">Photo unavailable</Text>
        </View>
      )}
      {!!current.text && (
        <View style={{ position: 'absolute', bottom: 100, left: 0, right: 0 }} className="items-center px-8">
          <Text
            className="text-white font-semibold text-center px-4 py-2"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12 }}
          >
            {current.text}
          </Text>
        </View>
      )}
    </View>
  ) : (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text
        className="text-white font-semibold text-center px-8"
        style={{
          fontSize: current.textSize === 'large' ? 32 : current.textSize === 'small' ? 18 : 24,
        }}
      >
        {current.text}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor || '#000' }}>
      {content}

      <Pressable
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '35%' }}
        onPress={() => (index > 0 ? setIndex(index - 1) : router.back())}
      />
      <Pressable
        style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '65%' }}
        onPress={() =>
          index < orderedStories.length - 1 ? setIndex(index + 1) : router.back()
        }
      />

      <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <View className="flex-row gap-1 px-3 pt-2">
          {orderedStories.map((s, i) => (
            <StoryProgressBar
              key={`${s.id}-${i === index}`}
              isActive={i === index}
              isPast={i < index}
              onExpire={advance}
            />
          ))}
        </View>

        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center gap-2">
            <Avatar name={name} size={32} />
            <Text className="text-white font-semibold">{name}</Text>
            <Text className="text-white/70 text-xs">{formatTimeAgo(current.createdAt)}</Text>
          </View>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <X size={22} color="#fff" />
          </Pressable>
        </View>
      </SafeAreaView>

      <SafeAreaView style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} edges={['bottom']}>
        <View className="flex-row items-center gap-3 px-4 pb-4">
          <TextInput
            value={reply}
            onChangeText={setReply}
            placeholder="Reply..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            className="flex-1 h-11 rounded-full px-4 text-white"
            style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' }}
          />
          <Pressable onPress={handleLike} hitSlop={8}>
            <Heart size={26} color={isLiked ? colors.vaykaePink : '#fff'} fill={isLiked ? colors.vaykaePink : 'transparent'} />
          </Pressable>
          <Pressable
            onPress={() =>
              showInDevelopmentAlert('Replying to stories isn’t wired up yet.', undefined, () =>
                setReply(''),
              )
            }
            hitSlop={8}
          >
            <Send size={24} color="#fff" />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
