import { useMemo } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Edit3, Trash2 } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, vaykaeGradient } from '../../../src/constants/colors';
import { usePackage } from '../../../src/hooks/use-packages-queries';
import { useDeletePackage } from '../../../src/hooks/use-packages-mutations';
import { showAlert } from '../../../src/utils/show-alert';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active: { bg: 'rgba(34,197,94,0.2)', text: '#86efac' },
  inactive: { bg: 'rgba(234,179,8,0.2)', text: '#fde68a' },
  archived: { bg: 'rgba(115,115,115,0.2)', text: '#d4d4d8' },
};

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
};

export default function PackageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pkg = usePackage(id);
  const deletePackage = useDeletePackage();
  const insets = useSafeAreaInsets();

  const confirmDelete = () => {
    showAlert('Delete package?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deletePackage.mutate(id, {
            onSuccess: () => router.replace('/(agency)/packages'),
          });
        },
      },
    ]);
  };

  if (pkg.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.vaykaePink} />
      </SafeAreaView>
    );
  }

  if (pkg.isError || !pkg.data) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
          Couldn&apos;t load this package.
        </Text>
        <Pressable onPress={() => pkg.refetch()}>
          <Text style={{ color: colors.vaykaePink }} className="font-semibold">
            Try again
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const p = pkg.data;
  const heroUrl = p.media?.[0]?.url;
  const statusColor = STATUS_COLORS[p.status] ?? STATUS_COLORS.archived;
  const label = STATUS_LABEL[p.status] ?? p.status;
  const remainingMedia = p.media?.slice(1) ?? [];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View style={{ flex: 1 }}>
        <View style={{ position: 'relative' }}>
          {heroUrl ? (
            <Image source={{ uri: heroUrl }} style={{ width: '100%', aspectRatio: 4 / 3 }} resizeMode="cover" />
          ) : (
            <View style={{ width: '100%', aspectRatio: 4 / 3, backgroundColor: colors.inputBackground }} />
          )}
          <Pressable
            onPress={() => router.back()}
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <ArrowLeft size={20} color="#fff" />
          </Pressable>
          <View style={{ position: 'absolute', top: 16, right: 16 }}>
            <View
              className="px-3 py-1.5 rounded-full"
              style={{ backgroundColor: statusColor.bg, borderWidth: 1, borderColor: statusColor.bg }}
            >
              <Text className="text-xs font-bold" style={{ color: statusColor.text }}>
                {label}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 96 }}>
          <Text className="text-2xl font-bold text-foreground mb-2">{p.title}</Text>
          <Text className="text-3xl font-bold mb-3" style={{ color: colors.vaykaePink }}>
            {p.currency} {p.basePrice.toLocaleString()}
          </Text>
          {p.description ? (
            <Text className="mb-5" style={{ color: colors.mutedForeground, lineHeight: 22 }}>
              {p.description}
            </Text>
          ) : null}

          <View
            className="p-4 rounded-2xl mb-5"
            style={{ backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.border }}
          >
            <View className="flex-row flex-wrap gap-x-4 gap-y-3">
              <MetaTile label="Destination" value={p.destinationType ?? '—'} />
              <MetaTile label="Season" value={p.season ?? '—'} />
              <MetaTile label="Theme" value={p.theme ?? '—'} />
              <MetaTile label="Status" value={label} />
              <MetaTile label="Created" value={new Date(p.createdAt).toLocaleDateString()} />
            </View>
          </View>

          {!!p.itinerary && (
            <View className="mb-5">
              <Text className="text-lg font-bold text-foreground mb-2">Itinerary</Text>
              <View
                className="p-4 rounded-2xl"
                style={{ backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.border }}
              >
                <Text style={{ color: colors.mutedForeground, lineHeight: 22 }}>{p.itinerary}</Text>
              </View>
            </View>
          )}

          {remainingMedia.length > 0 && (
            <View className="mb-5">
              <Text className="text-lg font-bold text-foreground mb-2">Gallery</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3">
                  {remainingMedia.map((m) => (
                    <Image
                      key={m.mediaId}
                      source={{ uri: m.url! }}
                      style={{ width: 200, aspectRatio: 4 / 3, borderRadius: 16 }}
                      resizeMode="cover"
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          <View style={{ height: 16 }} />
        </ScrollView>

        <View
          className="flex-row gap-3 px-4"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: insets.bottom + 16,
            paddingTop: 8,
            paddingBottom: insets.bottom,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.background,
          }}
        >
          <Pressable
            onPress={() =>
              router.push({ pathname: '/(agency)/packages/edit', params: { packageId: p.id } })
            }
            className="flex-1 items-center justify-center rounded-2xl"
            style={{ height: 56, overflow: 'hidden' }}
          >
            <LinearGradient
              colors={vaykaeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
              }}
            >
              <Edit3 size={18} color={colors.background} />
              <Text className="font-bold" style={{ color: colors.background }}>Edit</Text>
            </LinearGradient>
          </Pressable>
          <Pressable
            onPress={confirmDelete}
            className="flex-1 items-center justify-center rounded-2xl"
            style={{ borderWidth: 2, borderColor: colors.border }}
          >
            <View className="flex-row items-center justify-center gap-2">
              <Trash2 size={18} color={colors.destructive} />
              <Text className="font-bold" style={{ color: colors.destructive }}>
                Delete
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function MetaTile({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ minWidth: '45%' }}>
      <Text className="text-xs" style={{ color: colors.mutedForeground }}>
        {label}
      </Text>
      <Text className="text-sm font-medium text-foreground">{value}</Text>
    </View>
  );
}