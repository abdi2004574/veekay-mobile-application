import { useState, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Plus, X } from 'lucide-react-native';
import { GradientButton } from '../../../src/components/GradientButton';
import { colors } from '../../../src/constants/colors';
import { useAuthStore } from '../../../src/stores/auth-store';
import { useToastStore } from '../../../src/stores/toast-store';
import { useCreatePackage, useUpdatePackage } from '../../../src/hooks/use-packages-mutations';
import { usePackage } from '../../../src/hooks/use-packages-queries';
import { pickAndUploadFromLibrary } from '../../../src/utils/upload-image';
import type { PackageInput, PackageStatus, DestinationType } from '../../../src/api/types';

const DESTINATION_OPTIONS: { value: DestinationType | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: 'beach', label: 'Beach' },
  { value: 'mountain', label: 'Mountain' },
  { value: 'city', label: 'City' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'cruise', label: 'Cruise' },
];

const STATUS_OPTIONS: { value: PackageStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
];

const MAX_PHOTOS = 6;
const ITINERARY_LIMIT = 5000;

export default function CreatePackageScreen() {
  const params = useLocalSearchParams<{ editPackageId?: string }>();
  const isEditing = !!params.editPackageId;
  const insets = useSafeAreaInsets();

  const accessToken = useAuthStore((s) => s.accessToken);
  const showToast = useToastStore((s) => s.show);
  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage();
  const isPending = createPackage.isPending || updatePackage.isPending;

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [destinationType, setDestinationType] = useState<DestinationType | null>(null);
  const [season, setSeason] = useState('');
  const [theme, setTheme] = useState('');
  const [status, setStatus] = useState<PackageStatus>('active');
  const [itinerary, setItinerary] = useState('');
  const [photos, setPhotos] = useState<{ mediaId: string; previewUri: string }[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const prefillRef = useRef(false);
  const pkgQuery = usePackage(params.editPackageId ?? '', {
    enabled: isEditing,
  });

  useEffect(() => {
    if (isEditing && pkgQuery.data && !prefillRef.current) {
      prefillRef.current = true;
      const d = pkgQuery.data;
      setTitle(d.title);
      setDescription(d.description ?? '');
      setBasePrice(String(d.basePrice));
      setCurrency(d.currency);
      setDestinationType(d.destinationType);
      setSeason(d.season ?? '');
      setTheme(d.theme ?? '');
      setStatus(d.status);
      setItinerary(d.itinerary ?? '');
      setPhotos(
        (d.media ?? [])
          .filter((m) => m.url)
          .map((m) => ({ mediaId: m.mediaId, previewUri: m.url! })),
      );
    }
  }, [isEditing, pkgQuery.data]);

  const isStep1Valid = !!(title && description && Number(basePrice) > 0);

  const handleAddPhoto = async () => {
    if (!accessToken || photos.length >= MAX_PHOTOS) return;
    setIsUploadingPhoto(true);
    try {
      const uploaded = await pickAndUploadFromLibrary('package_visual', accessToken);
      if (uploaded) {
        setPhotos((prev) => [...prev, { mediaId: uploaded.mediaId, previewUri: uploaded.previewUri }]);
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not add that photo.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    const input: PackageInput = {
      title,
      description,
      basePrice: Number(basePrice),
      currency,
      destinationType,
      season: season || undefined,
      theme: theme || undefined,
      status,
      itinerary: itinerary || undefined,
      mediaMediaIds: photos.map((p) => p.mediaId),
    };

    if (isEditing && params.editPackageId) {
      updatePackage.mutate(
        { packageId: params.editPackageId, input },
        {
          onSuccess: () => {
            showToast('Package saved.');
            router.replace('/(agency)/packages');
          },
        },
      );
    } else {
      createPackage.mutate(input, {
        onSuccess: () => {
          showToast('Package created.');
          router.replace('/(agency)/packages');
        },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View className="flex-row items-center justify-between px-4 h-14">
          <Pressable onPress={handleBack} hitSlop={8}>
            <ArrowLeft size={20} color={colors.foreground} />
          </Pressable>
          <Text className="font-bold text-foreground">
            {isEditing ? 'Edit Package' : 'Create Package'}
          </Text>
          <View style={{ width: 20 }} />
        </View>
        <View className="px-4 pb-3">
          <View className="flex-row gap-2">
            {[1, 2, 3, 4].map((s) => (
              <View
                key={s}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 4,
                  backgroundColor: s <= step ? colors.vaykaePink : colors.disabledBackground,
                }}
              />
            ))}
          </View>
          <Text className="text-xs mt-2" style={{ color: colors.mutedForeground }}>
            Step {step} of 4
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }} style={{ flex: 1 }}>
        {step === 1 && (
          <View style={{ gap: 16 }}>
            <View>
              <Text className="text-xl font-bold text-foreground mb-1">Basic Information</Text>
              <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                Tell travelers about this package
              </Text>
            </View>

            <Field label="Title *">
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Romantic Santorini Getaway"
                placeholderTextColor={colors.mutedForeground}
                maxLength={120}
                className="h-12 rounded-2xl px-4 text-foreground"
                style={{ backgroundColor: colors.inputBackground }}
              />
            </Field>

            <Field label="Description *">
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe what makes this package special..."
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={4}
                maxLength={2000}
                className="rounded-2xl px-4 py-3 text-foreground"
                style={{ backgroundColor: colors.inputBackground, minHeight: 100, textAlignVertical: 'top' }}
              />
              <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
                {description.length}/2000
              </Text>
            </Field>

            <Field label="Base Price *" hint="Enter a number greater than 0">
              <TextInput
                value={basePrice}
                onChangeText={(v) => setBasePrice(v.replace(/[^0-9]/g, ''))}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={colors.mutedForeground}
                className="h-12 rounded-2xl px-4 text-foreground"
                style={{ backgroundColor: colors.inputBackground }}
              />
            </Field>

            <Field label="Currency" hint="3-letter code (e.g., USD)">
              <TextInput
                value={currency}
                onChangeText={(v) => setCurrency(v.slice(0, 3).toUpperCase())}
                placeholder="USD"
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="characters"
                className="h-12 rounded-2xl px-4 text-foreground"
                style={{ backgroundColor: colors.inputBackground }}
              />
            </Field>

            <Field label="Destination Type">
              <View className="flex-row flex-wrap gap-2">
                {DESTINATION_OPTIONS.map((opt) => {
                  const isActive = destinationType === opt.value;
                  return (
                    <Pressable
                      key={opt.label}
                      onPress={() => setDestinationType(opt.value)}
                      className="px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: isActive ? colors.vaykaePink : colors.inputBackground,
                        borderWidth: 1,
                        borderColor: isActive ? colors.vaykaePink : colors.border,
                      }}
                    >
                      <Text
                        className="text-sm font-medium"
                        style={{ color: isActive ? colors.background : colors.foreground }}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Field>

            <View className="flex-row gap-3">
              <View style={{ flex: 1 }}>
                <Field label="Season">
                  <TextInput
                    value={season}
                    onChangeText={setSeason}
                    placeholder="e.g., Summer"
                    placeholderTextColor={colors.mutedForeground}
                    className="h-12 rounded-2xl px-4 text-foreground"
                    style={{ backgroundColor: colors.inputBackground }}
                  />
                </Field>
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Theme">
                  <TextInput
                    value={theme}
                    onChangeText={setTheme}
                    placeholder="e.g., Luxury"
                    placeholderTextColor={colors.mutedForeground}
                    className="h-12 rounded-2xl px-4 text-foreground"
                    style={{ backgroundColor: colors.inputBackground }}
                  />
                </Field>
              </View>
            </View>

            <Field label="Status">
              <View className="flex-row gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <Pressable
                    key={opt.value}
                    onPress={() => setStatus(opt.value)}
                    className="px-4 py-2 rounded-full"
                    style={{
                      backgroundColor: status === opt.value ? colors.vaykaePink : colors.inputBackground,
                      borderWidth: 1,
                      borderColor: status === opt.value ? colors.vaykaePink : colors.border,
                    }}
                  >
                    <Text
                      className="text-sm font-medium"
                      style={{ color: status === opt.value ? colors.background : colors.foreground }}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Field>
          </View>
        )}

        {step === 2 && (
          <View style={{ gap: 16 }}>
            <View>
              <Text className="text-xl font-bold text-foreground mb-1">Itinerary</Text>
              <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                Describe the day-by-day itinerary
              </Text>
            </View>
            <TextInput
              value={itinerary}
              onChangeText={(v) => setItinerary(v.slice(0, ITINERARY_LIMIT))}
              placeholder="Day 1: Arrival and welcome dinner...&#10;Day 2: Guided tour of historic sites...&#10;Day 3: Free day at the beach..."
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={8}
              className="rounded-2xl px-4 py-3 text-foreground"
              style={{ backgroundColor: colors.inputBackground, minHeight: 200, textAlignVertical: 'top' }}
            />
            <Text className="text-xs" style={{ color: colors.mutedForeground }}>
              {itinerary.length}/{ITINERARY_LIMIT} characters
            </Text>
          </View>
        )}

        {step === 3 && (
          <View style={{ gap: 16 }}>
            <View>
              <Text className="text-xl font-bold text-foreground mb-1">Media</Text>
              <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                Add up to {MAX_PHOTOS} photos to showcase this package
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {photos.map((photo, index) => (
                <View key={photo.mediaId} style={{ width: '31%', aspectRatio: 1, position: 'relative' }}>
                  <Image
                    source={{ uri: photo.previewUri }}
                    style={{ width: '100%', height: '100%', borderRadius: 16 }}
                    resizeMode="cover"
                  />
                  <Pressable
                    onPress={() => setPhotos((prev) => prev.filter((_, i) => i !== index))}
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.destructive,
                    }}
                  >
                    <X size={14} color="#fff" />
                  </Pressable>
                </View>
              ))}
              {photos.length < MAX_PHOTOS && (
                <Pressable
                  onPress={handleAddPhoto}
                  disabled={isUploadingPhoto}
                  style={{
                    width: '31%',
                    aspectRatio: 1,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderStyle: 'dashed',
                    borderColor: colors.border,
                    backgroundColor: colors.inputBackground,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                  }}
                >
                  {isUploadingPhoto ? (
                    <ActivityIndicator color={colors.mutedForeground} />
                  ) : (
                    <>
                      <Plus size={22} color={colors.mutedForeground} />
                      <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                        Add Photo
                      </Text>
                    </>
                  )}
                </Pressable>
              )}
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={{ gap: 16 }}>
            <View>
              <Text className="text-xl font-bold text-foreground mb-1">Review</Text>
              <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                Review your package before publishing
              </Text>
            </View>
            <View
              className="p-5 rounded-2xl"
              style={{ backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.border }}
            >
              <PreviewRow label="Title" value={title} />
              <PreviewRow label="Description" value={description.slice(0, 100) + (description.length > 100 ? '...' : '')} />
              <PreviewRow label="Price" value={`${currency} ${Number(basePrice).toLocaleString()}`} />
              <PreviewRow label="Destination" value={destinationType ?? 'All'} />
              <PreviewRow label="Season" value={season || '—'} />
              <PreviewRow label="Theme" value={theme || '—'} />
              <PreviewRow label="Status" value={STATUS_LABEL[status] ?? status} />
              <PreviewRow label="Itinerary" value={itinerary.slice(0, 80) + (itinerary.length > 80 ? '...' : '') || '—'} />
              <PreviewRow label="Photos" value={`${photos.length} uploaded`} last />
            </View>
          </View>
        )}
      </ScrollView>

      <View className="p-4 flex-row gap-3" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
        {step > 1 && (
          <Pressable
            onPress={handleBack}
            style={{
              flex: 1,
              height: 48,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: colors.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text className="font-bold text-foreground">Back</Text>
          </Pressable>
        )}
        <View style={{ flex: step > 1 ? 2 : 1 }}>
          <GradientButton
            onPress={handleNext}
            disabled={step === 1 && !isStep1Valid}
            loading={isPending}
          >
            {step === 4 ? (isEditing ? 'Save Changes' : 'Create Package') : 'Next'}
          </GradientButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <View>
      <Text className="text-sm font-bold text-foreground mb-2">{label}</Text>
      {children}
      {hint && (
        <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
          {hint}
        </Text>
      )}
    </View>
  );
}

function PreviewRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View
      className="flex-row justify-between py-2"
      style={!last ? { borderBottomWidth: 1, borderBottomColor: colors.border } : undefined}
    >
      <Text className="text-sm" style={{ color: colors.mutedForeground }}>
        {label}
      </Text>
      <Text className="text-sm font-medium text-foreground" numberOfLines={1} style={{ maxWidth: '60%' }}>
        {value}
      </Text>
    </View>
  );
}

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
};