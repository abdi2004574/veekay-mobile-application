import { ReactNode, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Camera, User as UserIcon } from 'lucide-react-native';
import { GradientButton } from '../../src/components/GradientButton';
import { DestinationTypeChips } from '../../src/components/DestinationTypeChips';
import { TravelStyleChips } from '../../src/components/TravelStyleChips';
import { colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/stores/auth-store';
import { useUpdateProfile } from '../../src/hooks/use-users-mutations';
import { useToastStore } from '../../src/stores/toast-store';
import { pickAndUploadFromLibrary } from '../../src/utils/upload-image';
import type { DestinationType, Gender, TravelStyle } from '../../src/api/types';

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];
const BIO_LIMIT = 200;

function splitParam(value: string | undefined): string[] {
  return value ? value.split(',').filter(Boolean) : [];
}

export default function EditProfileScreen() {
  const params = useLocalSearchParams<{
    email?: string;
    displayName?: string;
    username?: string;
    bio?: string;
    location?: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
    destinationTypes?: string;
    travelStyles?: string;
  }>();
  const accessToken = useAuthStore((s) => s.accessToken);
  const showToast = useToastStore((s) => s.show);
  const updateProfile = useUpdateProfile();

  const [photoMediaId, setPhotoMediaId] = useState<string>();
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [displayName, setDisplayName] = useState(params.displayName ?? '');
  const [username, setUsername] = useState(params.username ?? '');
  const [bio, setBio] = useState(params.bio ?? '');
  const [location, setLocation] = useState(params.location ?? '');
  const [phone, setPhone] = useState(params.phone ?? '');
  const [gender, setGender] = useState<Gender | undefined>(
    (params.gender as Gender) || undefined,
  );
  const [dateOfBirth, setDateOfBirth] = useState(params.dateOfBirth ?? '');
  const [destinationTypes, setDestinationTypes] = useState<DestinationType[]>(
    splitParam(params.destinationTypes) as DestinationType[],
  );
  const [travelStyles, setTravelStyles] = useState<TravelStyle[]>(
    splitParam(params.travelStyles) as TravelStyle[],
  );
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handleAddPhoto = async () => {
    if (!accessToken) return;
    setIsUploadingPhoto(true);
    try {
      const uploaded = await pickAndUploadFromLibrary('profile_photo', accessToken);
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

  const toggleDestinationType = (value: DestinationType) =>
    setDestinationTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  const toggleTravelStyle = (value: TravelStyle) =>
    setTravelStyles((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  const handleSave = () => {
    updateProfile.mutate(
      {
        displayName: displayName || undefined,
        username: username || undefined,
        photoMediaId,
        bio,
        location,
        phone,
        gender,
        dateOfBirth: dateOfBirth || undefined,
        destinationTypes,
        travelStyles,
      },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View
        className="flex-row items-center px-4 h-14"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Pressable>
        <Text className="text-lg font-bold text-foreground ml-3">Edit Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View className="items-center mb-6">
          <Pressable onPress={handleAddPhoto} disabled={isUploadingPhoto}>
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.inputBackground,
                overflow: 'hidden',
              }}
            >
              {isUploadingPhoto ? (
                <ActivityIndicator color={colors.vaykaePink} />
              ) : photoUrl ? (
                <Image source={{ uri: photoUrl }} style={{ width: 96, height: 96 }} resizeMode="cover" />
              ) : (
                <UserIcon size={40} color={colors.mutedForeground} />
              )}
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 32,
                height: 32,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.vaykaePink,
              }}
            >
              <Camera size={16} color={colors.background} />
            </View>
          </Pressable>
        </View>

        <View style={{ gap: 16 }}>
          <Field label="Name">
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholderTextColor={colors.mutedForeground}
              className="h-12 rounded-2xl px-4 text-foreground"
              style={{ backgroundColor: colors.inputBackground }}
            />
          </Field>

          <Field label="Username">
            <TextInput
              value={username}
              onChangeText={(v) => setUsername(v.toLowerCase().replace(/[^a-z0-9]/g, ''))}
              autoCapitalize="none"
              placeholderTextColor={colors.mutedForeground}
              className="h-12 rounded-2xl px-4 text-foreground"
              style={{ backgroundColor: colors.inputBackground }}
            />
          </Field>

          <Field label="Email" hint="Contact support to change your email.">
            <View
              className="h-12 rounded-2xl px-4 justify-center"
              style={{ backgroundColor: colors.disabledBackground }}
            >
              <Text style={{ color: colors.mutedForeground }}>{params.email}</Text>
            </View>
          </Field>

          <Field label="Phone">
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+1 555 010 2000"
              placeholderTextColor={colors.mutedForeground}
              className="h-12 rounded-2xl px-4 text-foreground"
              style={{ backgroundColor: colors.inputBackground }}
            />
          </Field>

          <Field label="Location">
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="City, Country"
              placeholderTextColor={colors.mutedForeground}
              className="h-12 rounded-2xl px-4 text-foreground"
              style={{ backgroundColor: colors.inputBackground }}
            />
          </Field>

          <Field label="Gender">
            <View className="flex-row gap-2">
              {GENDER_OPTIONS.map((opt) => {
                const selected = gender === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => setGender(opt.value)}
                    style={{
                      flex: 1,
                      height: 44,
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2,
                      borderColor: selected ? colors.vaykaePink : colors.border,
                      backgroundColor: selected ? colors.vaykaePink : colors.inputBackground,
                    }}
                  >
                    <Text
                      className="font-medium text-sm"
                      style={{ color: selected ? colors.background : colors.foreground }}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field label="Date of Birth" hint="YYYY-MM-DD">
            <TextInput
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="1995-04-12"
              placeholderTextColor={colors.mutedForeground}
              className="h-12 rounded-2xl px-4 text-foreground"
              style={{ backgroundColor: colors.inputBackground }}
            />
          </Field>

          <View>
            <Text className="text-sm font-bold text-foreground mb-2">About</Text>
            <TextInput
              value={bio}
              onChangeText={(v) => setBio(v.slice(0, BIO_LIMIT))}
              multiline
              numberOfLines={4}
              placeholderTextColor={colors.mutedForeground}
              className="rounded-2xl px-4 py-3 text-foreground"
              style={{ backgroundColor: colors.inputBackground, minHeight: 96, textAlignVertical: 'top' }}
            />
            <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
              {bio.length}/{BIO_LIMIT} characters
            </Text>
          </View>

          <View>
            <Text className="text-sm font-bold text-foreground mb-3">Favorite Destinations</Text>
            <DestinationTypeChips value={destinationTypes} onToggle={toggleDestinationType} />
          </View>

          <View>
            <Text className="text-sm font-bold text-foreground mb-3">Travel Style</Text>
            <TravelStyleChips value={travelStyles} onToggle={toggleTravelStyle} />
          </View>
        </View>

        <View className="mt-8">
          <GradientButton onPress={handleSave} loading={updateProfile.isPending}>
            Save Changes
          </GradientButton>
        </View>
      </ScrollView>
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
