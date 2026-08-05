import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Camera, Minus, Plus, X } from 'lucide-react-native';
import { AuthScreenLayout } from '../../src/components/AuthScreenLayout';
import { OnboardingStepper } from '../../src/components/OnboardingStepper';
import { GradientButton } from '../../src/components/GradientButton';
import { colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/stores/auth-store';
import { useOnboardingWizardStore } from '../../src/stores/onboarding-wizard-store';
import { useToastStore } from '../../src/stores/toast-store';
import { pickAndUploadFromLibrary } from '../../src/utils/upload-image';

const DESCRIPTION_LIMIT = 150;

export default function AddTripsScreen() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const showToast = useToastStore((s) => s.show);
  const previousTrips = useOnboardingWizardStore((s) => s.previousTrips);
  const addTrip = useOnboardingWizardStore((s) => s.addTrip);
  const removeTrip = useOnboardingWizardStore((s) => s.removeTrip);

  const [showForm, setShowForm] = useState(false);
  const [photoMediaId, setPhotoMediaId] = useState<string>();
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelerCount, setTravelerCount] = useState(1);
  const [description, setDescription] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const isFormValid = !!(photoMediaId && name && location && startDate && endDate);

  const resetForm = () => {
    setPhotoMediaId(undefined);
    setPhotoUrl(undefined);
    setName('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setTravelerCount(1);
    setDescription('');
    setShowForm(false);
  };

  const handleAddPhoto = async () => {
    if (!accessToken) return;
    setIsUploadingPhoto(true);
    try {
      const uploaded = await pickAndUploadFromLibrary('previous_trip_photo', accessToken);
      if (uploaded) {
        setPhotoMediaId(uploaded.mediaId);
        setPhotoUrl(uploaded.previewUri);
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not add that photo.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleAddTrip = () => {
    if (!isFormValid || !photoMediaId) return;
    addTrip({
      mediaId: photoMediaId,
      photoUrl,
      name,
      location,
      startDate,
      endDate,
      travelerCount,
      description: description || undefined,
    });
    resetForm();
  };

  return (
    <AuthScreenLayout>
      <OnboardingStepper step={3} label="Previous Trips" />
      <Text className="text-xl font-bold text-foreground mb-1">Previous Trips</Text>
      <Text className="text-sm mb-6" style={{ color: colors.mutedForeground }}>
        Share your travel memories (optional)
      </Text>

      <View style={{ gap: 12 }}>
        {previousTrips.map((trip, index) => (
          <View
            key={index}
            className="flex-row gap-3 p-3 rounded-2xl"
            style={{ backgroundColor: colors.inputBackground }}
          >
            {trip.photoUrl ? (
              <Image
                source={{ uri: trip.photoUrl }}
                style={{ width: 56, height: 56, borderRadius: 12 }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: colors.disabledBackground }}
              />
            )}
            <View style={{ flex: 1 }}>
              <Text className="font-bold text-foreground">{trip.name}</Text>
              <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                {trip.location}
              </Text>
              <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                {trip.startDate} – {trip.endDate} • {trip.travelerCount} traveler
                {trip.travelerCount > 1 ? 's' : ''}
              </Text>
            </View>
            <Pressable onPress={() => removeTrip(index)} hitSlop={8}>
              <X size={18} color={colors.mutedForeground} />
            </Pressable>
          </View>
        ))}

        {showForm ? (
          <View
            className="p-4 rounded-2xl"
            style={{ borderWidth: 2, borderColor: colors.border, gap: 12 }}
          >
            <Pressable
              onPress={handleAddPhoto}
              disabled={isUploadingPhoto}
              style={{
                height: 96,
                borderRadius: 16,
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: colors.border,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                overflow: 'hidden',
              }}
            >
              {isUploadingPhoto ? (
                <ActivityIndicator color={colors.mutedForeground} />
              ) : photoUrl ? (
                <Image source={{ uri: photoUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              ) : (
                <>
                  <Camera size={22} color={colors.mutedForeground} />
                  <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                    Trip Photo *
                  </Text>
                </>
              )}
            </Pressable>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Trip Name *"
              placeholderTextColor={colors.mutedForeground}
              className="h-12 rounded-2xl px-4 text-foreground"
              style={{ backgroundColor: colors.inputBackground }}
            />
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Location *"
              placeholderTextColor={colors.mutedForeground}
              className="h-12 rounded-2xl px-4 text-foreground"
              style={{ backgroundColor: colors.inputBackground }}
            />
            <View className="flex-row gap-3">
              <TextInput
                value={startDate}
                onChangeText={setStartDate}
                placeholder="Start (YYYY-MM-DD) *"
                placeholderTextColor={colors.mutedForeground}
                className="h-12 rounded-2xl px-4 text-foreground text-sm"
                style={{ backgroundColor: colors.inputBackground, flex: 1 }}
              />
              <TextInput
                value={endDate}
                onChangeText={setEndDate}
                placeholder="End (YYYY-MM-DD) *"
                placeholderTextColor={colors.mutedForeground}
                className="h-12 rounded-2xl px-4 text-foreground text-sm"
                style={{ backgroundColor: colors.inputBackground, flex: 1 }}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-bold text-foreground">Travelers</Text>
              <View className="flex-row items-center gap-4">
                <Pressable
                  onPress={() => setTravelerCount((c) => Math.max(1, c - 1))}
                  hitSlop={8}
                >
                  <Minus size={18} color={colors.foreground} />
                </Pressable>
                <Text className="font-bold text-foreground">{travelerCount}</Text>
                <Pressable onPress={() => setTravelerCount((c) => c + 1)} hitSlop={8}>
                  <Plus size={18} color={colors.foreground} />
                </Pressable>
              </View>
            </View>

            <TextInput
              value={description}
              onChangeText={(v) => setDescription(v.slice(0, DESCRIPTION_LIMIT))}
              placeholder="Description (optional)"
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={3}
              className="rounded-2xl px-4 py-3 text-foreground"
              style={{ backgroundColor: colors.inputBackground, minHeight: 72, textAlignVertical: 'top' }}
            />

            <View className="flex-row gap-3">
              <Pressable
                onPress={resetForm}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: colors.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text className="font-bold text-foreground">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleAddTrip}
                disabled={!isFormValid}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isFormValid ? colors.vaykaePink : colors.disabledBackground,
                }}
              >
                <Text
                  className="font-bold"
                  style={{ color: isFormValid ? colors.background : colors.mutedForeground }}
                >
                  Add
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={() => setShowForm(true)}
            style={{
              height: 56,
              borderRadius: 16,
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: colors.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text className="font-bold" style={{ color: colors.vaykaePink }}>
              + Add Previous Trip
            </Text>
          </Pressable>
        )}
      </View>

      <View className="mt-8" style={{ gap: 12 }}>
        <GradientButton
          onPress={() => router.push('/(onboarding)/payment-setup')}
          disabled={previousTrips.length === 0}
        >
          Continue
        </GradientButton>
        <Pressable onPress={() => router.push('/(onboarding)/payment-setup')} className="items-center py-2">
          <Text className="font-semibold" style={{ color: colors.mutedForeground }}>
            Skip for Now
          </Text>
        </Pressable>
      </View>
    </AuthScreenLayout>
  );
}
