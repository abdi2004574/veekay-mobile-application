import { Image, Pressable, Text, View } from 'react-native';
import { Edit, MapPin } from 'lucide-react-native';
import { colors } from '../constants/colors';
import type { Package } from '../api/types';

interface PackageCardProps {
  pkg: Package;
  onEdit: () => void;
  onPress: () => void;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  active: { bg: 'rgba(34,197,94,0.2)', text: '#86efac', ring: 'rgba(34,197,94,0.3)' },
  inactive: { bg: 'rgba(234,179,8,0.2)', text: '#fde68a', ring: 'rgba(234,179,8,0.3)' },
  archived: { bg: 'rgba(115,115,115,0.2)', text: '#d4d4d8', ring: 'rgba(115,115,115,0.3)' },
};

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
};

export function PackageCard({ pkg, onEdit, onPress }: PackageCardProps) {
  const heroUrl = pkg.media?.[0]?.url;
  const statusColor = STATUS_COLORS[pkg.status] ?? STATUS_COLORS.archived;
  const label = STATUS_LABEL[pkg.status] ?? pkg.status;
  const destination = pkg.destinationType ?? pkg.title;

  return (
    <Pressable onPress={onPress} className="bg-card rounded-3xl border border-border overflow-hidden">
      <View style={{ position: 'relative', height: 160 }}>
        {heroUrl ? (
          <Image source={{ uri: heroUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <View style={{ width: '100%', height: '100%', backgroundColor: colors.inputBackground }} />
        )}
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} pointerEvents="none" />

        <View style={{ position: 'absolute', top: 12, left: 12 }}>
          <View className="px-3 py-1 rounded-full" style={{ backgroundColor: statusColor.bg, borderWidth: 1, borderColor: statusColor.ring }}>
            <Text className="text-xs font-medium" style={{ color: statusColor.text }}>
              {label}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={(e) => { e.stopPropagation(); onEdit(); }}
          style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
        >
          <Edit size={16} color="#ffffff" />
        </Pressable>

        <View style={{ position: 'absolute', bottom: 12, left: 12, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <MapPin size={16} color="#ffffff" />
          <Text className="text-sm font-medium" style={{ color: '#ffffff' }}>
            {destination}
          </Text>
        </View>
      </View>

      <View className="p-4">
        <Text className="font-semibold mb-3" numberOfLines={1}>
          {pkg.title}
        </Text>

        <View className="flex-row items-center justify-between pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
          <View>
            <Text className="text-xs" style={{ color: colors.mutedForeground }}>
              Season / Theme
            </Text>
            <Text className="text-sm font-medium">
              {pkg.season ?? pkg.theme ?? '—'}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text className="text-xs" style={{ color: colors.mutedForeground }}>
              Price
            </Text>
            <Text className="text-lg font-bold" style={{ color: colors.vaykaePink }}>
              ${pkg.basePrice.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
