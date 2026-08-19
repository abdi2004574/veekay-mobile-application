import { Pressable, Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { colors } from '../constants/colors';
import { showAlert } from '../utils/show-alert';
import type { GroupExpense } from '../api/types';

const CATEGORY_LABELS: Record<GroupExpense['category'], string> = {
  transportation: 'Transportation',
  accommodation: 'Accommodation',
  activities: 'Activities',
  food: 'Food',
  other: 'Other',
};

export function GroupExpenseRow({
  expense,
  canDelete,
  onDelete,
}: {
  expense: GroupExpense;
  canDelete: boolean;
  onDelete: () => void;
}) {
  const paidByName = expense.paidBy.displayName ?? `@${expense.paidBy.username}`;
  const date = new Date(expense.spentAt).toLocaleDateString();

  const handleDelete = () => {
    showAlert('Delete Expense?', `Remove "${expense.name}" from the group ledger?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <View
      className="flex-row items-center justify-between p-3 rounded-2xl mb-2"
      style={{ backgroundColor: colors.inputBackground }}
    >
      <View style={{ flex: 1 }}>
        <View className="flex-row items-center gap-2 mb-0.5">
          <Text className="font-bold text-sm text-foreground">{expense.name}</Text>
          <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.disabledBackground }}>
            <Text className="text-xs" style={{ color: colors.mutedForeground }}>
              {CATEGORY_LABELS[expense.category]}
            </Text>
          </View>
        </View>
        <Text className="text-xs" style={{ color: colors.mutedForeground }}>
          Paid by {paidByName} • {date}
        </Text>
      </View>
      <Text className="font-bold text-foreground mr-2">${expense.amount.toLocaleString()}</Text>
      {canDelete && (
        <Pressable onPress={handleDelete} hitSlop={8}>
          <Trash2 size={16} color={colors.destructive} />
        </Pressable>
      )}
    </View>
  );
}
