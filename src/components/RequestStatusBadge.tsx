import { Text, View } from 'react-native';
import type { TripRequestStatus } from '../api/types';

interface RequestStatusBadgeProps {
  status: TripRequestStatus;
  variant?: 'soft' | 'solid';
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<TripRequestStatus, { bg: string; text: string; solidBg: string; label: string }> = {
  pending: { bg: 'rgba(234,179,8,0.1)', text: '#ca8a04', solidBg: '#ca8a04', label: 'Pending' },
  in_discussion: { bg: 'rgba(59,130,246,0.1)', text: '#2563eb', solidBg: '#2563eb', label: 'In discussion' },
  confirmed: { bg: 'rgba(34,197,94,0.1)', text: '#16a34a', solidBg: '#16a34a', label: 'Confirmed' },
  completed: { bg: 'rgba(34,197,94,0.1)', text: '#15803d', solidBg: '#15803d', label: 'Completed' },
  declined: { bg: 'rgba(239,68,68,0.1)', text: '#dc2626', solidBg: '#dc2626', label: 'Declined' },
  cancelled: { bg: 'rgba(115,115,115,0.1)', text: '#52525b', solidBg: '#52525b', label: 'Cancelled' },
};

export function RequestStatusBadge({ status, variant = 'soft', size = 'md' }: RequestStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const isSolid = variant === 'solid';
  const isSm = size === 'sm';

  return (
    <View
      className="rounded-full"
      style={[
        { backgroundColor: isSolid ? config.solidBg : config.bg },
        isSm ? { paddingHorizontal: 10, paddingVertical: 2 } : { paddingHorizontal: 12, paddingVertical: 4 },
      ]}
    >
      <Text
        style={[
          { color: isSolid ? '#ffffff' : config.text },
          isSm ? { fontSize: 11 } : { fontSize: 12, fontWeight: '600' },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}
