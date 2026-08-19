import { Image, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Users } from 'lucide-react-native';
import { CampaignProgressBar } from './CampaignProgressBar';
import { colors } from '../constants/colors';
import type { GroupTrip } from '../api/types';

export function GroupTripCard({ trip }: { trip: GroupTrip }) {
  return (
    <Pressable
      onPress={() => router.push(`/(traveler)/group-campaign/${trip.id}`)}
      className="rounded-2xl overflow-hidden bg-card mb-3"
      style={{ borderWidth: 1, borderColor: colors.border }}
    >
      {trip.photoUrl ? (
        <Image source={{ uri: trip.photoUrl }} style={{ width: '100%', aspectRatio: 16 / 9 }} resizeMode="cover" />
      ) : (
        <View style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.inputBackground }} />
      )}

      <View className="p-3">
        <Text className="font-bold text-foreground mb-0.5" numberOfLines={1}>
          {trip.title}
        </Text>
        <View className="flex-row items-center gap-1 mb-2">
          <Users size={12} color={colors.mutedForeground} />
          <Text className="text-xs" style={{ color: colors.mutedForeground }}>
            {trip.memberCount} member{trip.memberCount === 1 ? '' : 's'} • {trip.destination}
          </Text>
        </View>
        <CampaignProgressBar raised={trip.raised} goal={trip.goalAmount} />
        <Text className="text-xs mt-1.5" style={{ color: colors.mutedForeground }}>
          ${trip.raised.toLocaleString()} of ${trip.goalAmount.toLocaleString()}
        </Text>
      </View>
    </Pressable>
  );
}
