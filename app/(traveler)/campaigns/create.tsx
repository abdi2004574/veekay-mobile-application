import { ReactNode, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Camera, FileText, Upload, X } from 'lucide-react-native';
import { GradientButton } from '../../../src/components/GradientButton';
import { colors } from '../../../src/constants/colors';
import { useAuthStore } from '../../../src/stores/auth-store';
import { useToastStore } from '../../../src/stores/toast-store';
import { useCreateCampaign, useUpdateCampaign } from '../../../src/hooks/use-campaigns-mutations';
import { pickAndUploadFromLibrary, pickAndUploadDocument } from '../../../src/utils/upload-image';

const STORY_LIMIT = 500;
const MAX_PHOTOS = 5;
const GIFT_OCCASIONS = ['Birthday', 'Graduation', 'Wedding', 'Anniversary', 'Retirement', 'Other'];

interface PhotoAsset {
  mediaId: string;
  previewUri: string;
}
interface DocAsset {
  mediaId: string;
  fileName: string;
}

function splitParam(value: string | undefined): string[] {
  return value ? value.split(',').filter(Boolean) : [];
}

export default function CreateCampaignScreen() {
  const params = useLocalSearchParams<{
    editCampaignId?: string;
    editTitle?: string;
    editDestination?: string;
    editGoalAmount?: string;
    editTripStartDate?: string;
    editTripEndDate?: string;
    editStory?: string;
    editPrivacy?: string;
    editGiftMode?: string;
    editGiftOccasion?: string;
    editPhotoMediaIds?: string;
    editPhotoUrls?: string;
    editItineraryMediaId?: string;
    editAgencyQuoteMediaId?: string;
  }>();
  const isEditing = !!params.editCampaignId;

  const accessToken = useAuthStore((s) => s.accessToken);
  const showToast = useToastStore((s) => s.show);
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const isPending = createCampaign.isPending || updateCampaign.isPending;

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(params.editTitle ?? '');
  const [destination, setDestination] = useState(params.editDestination ?? '');
  const [goalAmount, setGoalAmount] = useState(params.editGoalAmount ?? '');
  const [tripStartDate, setTripStartDate] = useState(params.editTripStartDate ?? '');
  const [tripEndDate, setTripEndDate] = useState(params.editTripEndDate ?? '');
  const [story, setStory] = useState(params.editStory ?? '');
  const [photos, setPhotos] = useState<PhotoAsset[]>(() => {
    const ids = splitParam(params.editPhotoMediaIds);
    const urls = splitParam(params.editPhotoUrls);
    return ids.map((mediaId, i) => ({ mediaId, previewUri: urls[i] ?? '' }));
  });
  const [itinerary, setItinerary] = useState<DocAsset | null>(
    params.editItineraryMediaId ? { mediaId: params.editItineraryMediaId, fileName: 'itinerary' } : null,
  );
  const [agencyQuote, setAgencyQuote] = useState<DocAsset | null>(
    params.editAgencyQuoteMediaId
      ? { mediaId: params.editAgencyQuoteMediaId, fileName: 'quote' }
      : null,
  );
  const [isPublic, setIsPublic] = useState(params.editPrivacy !== 'private');
  const [giftMode, setGiftMode] = useState(params.editGiftMode === '1');
  const [giftOccasion, setGiftOccasion] = useState(params.editGiftOccasion ?? '');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingItinerary, setIsUploadingItinerary] = useState(false);
  const [isUploadingQuote, setIsUploadingQuote] = useState(false);

  const isStep1Valid = !!(title && destination && goalAmount && tripStartDate);
  const isStep2Valid = !!(story && photos.length > 0);

  const handleAddPhoto = async () => {
    if (!accessToken || photos.length >= MAX_PHOTOS) return;
    setIsUploadingPhoto(true);
    try {
      const uploaded = await pickAndUploadFromLibrary('campaign_photo', accessToken);
      if (uploaded) {
        setPhotos((prev) => [...prev, { mediaId: uploaded.mediaId, previewUri: uploaded.previewUri }]);
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not add that photo.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handlePickDoc = async (kind: 'itinerary' | 'quote') => {
    if (!accessToken) return;
    const setUploading = kind === 'itinerary' ? setIsUploadingItinerary : setIsUploadingQuote;
    setUploading(true);
    try {
      const uploaded = await pickAndUploadDocument('campaign_document', accessToken);
      if (uploaded) {
        (kind === 'itinerary' ? setItinerary : setAgencyQuote)(uploaded);
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not add that file.');
    } finally {
      setUploading(false);
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
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    const input = {
      title,
      destination,
      goalAmount: Number(goalAmount),
      tripStartDate,
      tripEndDate: tripEndDate || undefined,
      story,
      privacy: (isPublic ? 'public' : 'private') as 'public' | 'private',
      giftMode,
      giftOccasion: giftMode ? giftOccasion || undefined : undefined,
      photoMediaIds: photos.map((p) => p.mediaId),
      itineraryMediaId: itinerary?.mediaId,
      agencyQuoteMediaId: agencyQuote?.mediaId,
    };

    if (isEditing && params.editCampaignId) {
      updateCampaign.mutate(
        { campaignId: params.editCampaignId, input },
        { onSuccess: () => router.replace('/(traveler)/campaigns') },
      );
    } else {
      createCampaign.mutate(input, {
        onSuccess: () => router.replace('/(traveler)/campaigns'),
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
            {isEditing ? 'Edit Campaign' : 'Create Campaign'}
          </Text>
          <View style={{ width: 20 }} />
        </View>
        <View className="px-4 pb-3">
          <View className="flex-row gap-2">
            {[1, 2, 3].map((s) => (
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
            Step {step} of 3 • {step === 1 ? 'Basic Details' : step === 2 ? 'Story & Media' : 'Privacy & Settings'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {step === 1 && (
          <View style={{ gap: 16 }}>
            <View>
              <Text className="text-xl font-bold text-foreground mb-1">Trip Details</Text>
              <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                Tell us about your dream vacation
              </Text>
            </View>

            <Field label="Campaign Title *">
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., My Dream Trip to Greece"
                placeholderTextColor={colors.mutedForeground}
                className="h-12 rounded-2xl px-4 text-foreground"
                style={{ backgroundColor: colors.inputBackground }}
              />
            </Field>

            <Field label="Destination *" hint="City, Country (e.g., Santorini, Greece)">
              <TextInput
                value={destination}
                onChangeText={setDestination}
                placeholder="Where do you want to go?"
                placeholderTextColor={colors.mutedForeground}
                className="h-12 rounded-2xl px-4 text-foreground"
                style={{ backgroundColor: colors.inputBackground }}
              />
            </Field>

            <Field label="Funding Goal *" hint="How much do you need to raise?">
              <TextInput
                value={goalAmount}
                onChangeText={(v) => setGoalAmount(v.replace(/[^0-9.]/g, ''))}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={colors.mutedForeground}
                className="h-12 rounded-2xl px-4 text-foreground"
                style={{ backgroundColor: colors.inputBackground }}
              />
            </Field>

            <View className="flex-row gap-3">
              <View style={{ flex: 1 }}>
                <Field label="Start Date *" hint="YYYY-MM-DD">
                  <TextInput
                    value={tripStartDate}
                    onChangeText={setTripStartDate}
                    placeholder="2026-08-15"
                    placeholderTextColor={colors.mutedForeground}
                    className="h-12 rounded-2xl px-4 text-foreground text-sm"
                    style={{ backgroundColor: colors.inputBackground }}
                  />
                </Field>
              </View>
              <View style={{ flex: 1 }}>
                <Field label="End Date" hint="YYYY-MM-DD">
                  <TextInput
                    value={tripEndDate}
                    onChangeText={setTripEndDate}
                    placeholder="2026-08-22"
                    placeholderTextColor={colors.mutedForeground}
                    className="h-12 rounded-2xl px-4 text-foreground text-sm"
                    style={{ backgroundColor: colors.inputBackground }}
                  />
                </Field>
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={{ gap: 16 }}>
            <View>
              <Text className="text-xl font-bold text-foreground mb-1">Tell Your Story</Text>
              <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                Share why this trip is important to you
              </Text>
            </View>

            <View>
              <Text className="text-sm font-bold text-foreground mb-2">Personal Story *</Text>
              <TextInput
                value={story}
                onChangeText={(v) => setStory(v.slice(0, STORY_LIMIT))}
                placeholder="Why is this trip important to you? What does it mean? Share your story to connect with potential donors..."
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={6}
                className="rounded-2xl px-4 py-3 text-foreground"
                style={{ backgroundColor: colors.inputBackground, minHeight: 140, textAlignVertical: 'top' }}
              />
              <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
                {story.length}/{STORY_LIMIT} characters
              </Text>
            </View>

            <View>
              <Text className="text-sm font-bold text-foreground mb-2">
                Campaign Images * (Up to {MAX_PHOTOS})
              </Text>
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
                        <Camera size={22} color={colors.mutedForeground} />
                        <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                          Add Photo
                        </Text>
                      </>
                    )}
                  </Pressable>
                )}
              </View>
              <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
                Add photos of your destination or inspiration
              </Text>
            </View>

            <DocPicker
              label="Itinerary (Optional)"
              asset={itinerary}
              uploading={isUploadingItinerary}
              uploadedLabel="Itinerary uploaded"
              onPress={() => handlePickDoc('itinerary')}
            />
            <DocPicker
              label="Agency Quote (Optional)"
              asset={agencyQuote}
              uploading={isUploadingQuote}
              uploadedLabel="Quote uploaded"
              onPress={() => handlePickDoc('quote')}
            />
          </View>
        )}

        {step === 3 && (
          <View style={{ gap: 16 }}>
            <View>
              <Text className="text-xl font-bold text-foreground mb-1">Privacy & Settings</Text>
              <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                Choose who can see and contribute to your campaign
              </Text>
            </View>

            <View className="p-4 rounded-2xl" style={{ borderWidth: 2, borderColor: colors.border }}>
              <View className="flex-row items-center justify-between mb-1">
                <Text className="font-bold text-foreground">
                  {isPublic ? 'Public Campaign' : 'Private Campaign'}
                </Text>
                <Switch
                  value={isPublic}
                  onValueChange={setIsPublic}
                  trackColor={{ true: colors.vaykaePink }}
                />
              </View>
              <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                {isPublic
                  ? 'Anyone can discover and donate to your campaign'
                  : 'Only you can view this campaign for now'}
              </Text>
            </View>

            <View className="p-4 rounded-2xl" style={{ borderWidth: 2, borderColor: colors.border }}>
              <View className="flex-row items-center justify-between mb-1">
                <Text className="font-bold text-foreground">Gift Mode</Text>
                <Switch
                  value={giftMode}
                  onValueChange={setGiftMode}
                  trackColor={{ true: colors.vaykaePink }}
                />
              </View>
              <Text className="text-sm mb-3" style={{ color: colors.mutedForeground }}>
                Let friends & family gift this trip for special occasions
              </Text>
              {giftMode && (
                <View className="flex-row flex-wrap gap-2">
                  {GIFT_OCCASIONS.map((occasion) => (
                    <Pressable
                      key={occasion}
                      onPress={() => setGiftOccasion(occasion)}
                      className="px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: giftOccasion === occasion ? colors.vaykaePink : colors.inputBackground,
                      }}
                    >
                      <Text
                        className="text-sm font-medium"
                        style={{ color: giftOccasion === occasion ? colors.background : colors.foreground }}
                      >
                        {occasion}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View
              className="p-5 rounded-2xl"
              style={{ backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.border }}
            >
              <Text className="font-bold text-foreground mb-3">Campaign Preview</Text>
              <PreviewRow label="Title" value={title || '—'} />
              <PreviewRow label="Destination" value={destination || '—'} />
              <PreviewRow label="Goal" value={goalAmount ? `$${Number(goalAmount).toLocaleString()}` : '$0'} />
              <PreviewRow label="Trip Date" value={tripStartDate || '—'} />
              <PreviewRow label="Privacy" value={isPublic ? 'Public' : 'Private'} />
              <PreviewRow label="Gift Mode" value={giftMode ? `Yes (${giftOccasion || 'Not set'})` : 'No'} />
              <PreviewRow label="Photos" value={String(photos.length)} last />
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
            disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
            loading={isPending}
          >
            {step === 3 ? (isEditing ? 'Save Changes' : 'Publish Campaign') : 'Continue'}
          </GradientButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
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

function DocPicker({
  label,
  asset,
  uploading,
  uploadedLabel,
  onPress,
}: {
  label: string;
  asset: DocAsset | null;
  uploading: boolean;
  uploadedLabel: string;
  onPress: () => void;
}) {
  return (
    <View>
      <Text className="text-sm font-bold text-foreground mb-2">{label}</Text>
      <Pressable
        onPress={onPress}
        disabled={uploading}
        style={{
          height: 96,
          borderRadius: 16,
          borderWidth: 2,
          borderStyle: 'dashed',
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        {uploading ? (
          <ActivityIndicator color={colors.mutedForeground} />
        ) : asset ? (
          <>
            <FileText size={22} color={colors.vaykaePink} />
            <Text className="text-sm font-medium text-foreground">{uploadedLabel} ✓</Text>
          </>
        ) : (
          <>
            <Upload size={22} color={colors.mutedForeground} />
            <Text className="text-sm" style={{ color: colors.mutedForeground }}>
              Upload {label.split(' ')[0]}
            </Text>
          </>
        )}
      </Pressable>
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
