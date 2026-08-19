import { Text, View } from 'react-native';
import { colors } from '../constants/colors';
import type { GroupContribution } from '../api/types';

export function GroupContributionRow({ contribution }: { contribution: GroupContribution }) {
  const name = contribution.member.displayName ?? `@${contribution.member.username}`;
  const date = new Date(contribution.createdAt).toLocaleDateString();

  return (
    <View
      className="flex-row items-center justify-between p-3 rounded-2xl mb-2"
      style={{ backgroundColor: colors.inputBackground }}
    >
      <View style={{ flex: 1 }}>
        <Text className="font-bold text-sm text-foreground">{name}</Text>
        <Text className="text-xs" style={{ color: colors.mutedForeground }}>
          {contribution.type === 'donation' ? 'Donation' : 'Manual Entry'}
          {contribution.note ? ` • ${contribution.note}` : ''} • {date}
        </Text>
      </View>
      <Text className="font-bold" style={{ color: colors.vaykaePink }}>
        +${contribution.amount.toLocaleString()}
      </Text>
    </View>
  );
}
