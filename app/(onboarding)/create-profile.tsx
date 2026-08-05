import { ReactNode, useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Camera, User as UserIcon } from 'lucide-react-native';
import { AuthScreenLayout } from '../../src/components/AuthScreenLayout';
import { OnboardingStepper } from '../../src/components/OnboardingStepper';
import { GradientButton } from '../../src/components/GradientButton';
import { colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/stores/auth-store';
import { useOnboardingWizardStore } from '../../src/stores/onboarding-wizard-store';
import { useToastStore } from '../../src/stores/toast-store';
import { pickAndUploadFromLibrary } from '../../src/utils/upload-image';
import type { Gender } from '../../src/api/types';

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];
const BIO_LIMIT = 200;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export default function CreateProfileScreen() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const displayName = useAuthStore((s) => s.user?.displayName);
  const showToast = useToastStore((s) => s.show);
  const wizard = useOnboardingWizardStore();

  const [photoMediaId, setPhotoMediaId] = useState(wizard.photoMediaId);
  const [photoUrl, setPhotoUrl] = useState(wizard.photoUrl);
  const [gender, setGender] = useState<Gender | undefined>(wizard.gender);
  const [dateOfBirth, setDateOfBirth] = useState(wizard.dateOfBirth ?? '');
  const [bio, setBio] = useState(wizard.bio ?? '');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const isValid = !!gender && DATE_PATTERN.test(dateOfBirth);

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

  const handleContinue = () => {
    wizard.setProfileFields({ photoMediaId, photoUrl, gender, dateOfBirth, bio });
    router.push('/(onboarding)/travel-preferences');
  };

  return (
    <AuthScreenLayout>
      <OnboardingStepper step={1} label="Create Your Profile" />
      <Text className="text-xl font-bold text-foreground mb-1">Create Your Profile</Text>
      <Text className="text-sm mb-6" style={{ color: colors.mutedForeground }}>
        Tell us about yourself
      </Text>

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

      <Text className="text-center font-bold text-foreground mb-6">{displayName}</Text>

      <View style={{ gap: 16 }}>
        <Field label="Gender *">
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

        <Field label="Date of Birth *" hint="YYYY-MM-DD">
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
          <Text className="text-sm font-bold text-foreground mb-2">About (Optional)</Text>
          <TextInput
            value={bio}
            onChangeText={(v) => setBio(v.slice(0, BIO_LIMIT))}
            placeholder="A little about you and why you love to travel..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={4}
            className="rounded-2xl px-4 py-3 text-foreground"
            style={{ backgroundColor: colors.inputBackground, minHeight: 96, textAlignVertical: 'top' }}
          />
          <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
            {bio.length}/{BIO_LIMIT} characters
          </Text>
        </View>
      </View>

      <View className="mt-8">
        <GradientButton onPress={handleContinue} disabled={!isValid}>
          Continue
        </GradientButton>
      </View>
    </AuthScreenLayout>
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
