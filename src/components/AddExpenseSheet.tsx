import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '../constants/colors';
import { useAddGroupExpense } from '../hooks/use-group-campaigns-mutations';
import type { GroupExpenseCategory, GroupMember } from '../api/types';

const CATEGORIES: { value: GroupExpenseCategory; label: string }[] = [
  { value: 'transportation', label: 'Transportation' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'activities', label: 'Activities' },
  { value: 'food', label: 'Food' },
  { value: 'other', label: 'Other' },
];

interface AddExpenseSheetProps {
  visible: boolean;
  campaignId: string;
  members: GroupMember[];
  currentUserId: string;
  onClose: () => void;
}

export function AddExpenseSheet({
  visible,
  campaignId,
  members,
  currentUserId,
  onClose,
}: AddExpenseSheetProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<GroupExpenseCategory>('other');
  const [paidByUserId, setPaidByUserId] = useState(currentUserId);
  const addExpense = useAddGroupExpense(campaignId);

  const parsedAmount = parseFloat(amount);
  const canSubmit = !!name && amount.length > 0 && parsedAmount > 0;

  const reset = () => {
    setName('');
    setAmount('');
    setCategory('other');
    setPaidByUserId(currentUserId);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    addExpense.mutate(
      { name, amount: parsedAmount, category, paidByUserId },
      { onSuccess: handleClose },
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={handleClose}>
        <View className="flex-1" />
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-background rounded-t-3xl"
          style={{ maxHeight: '85%' }}
        >
          <View className="items-center pt-3 pb-2">
            <View className="w-10 h-1 rounded-full" style={{ backgroundColor: colors.border }} />
          </View>

          <View
            className="flex-row items-center justify-between px-4 py-3"
            style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
          >
            <Text className="text-lg font-bold text-foreground">Add Expense</Text>
            <Pressable onPress={handleClose} hitSlop={8}>
              <X size={20} color={colors.foreground} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
            <View>
              <Text className="text-sm font-bold text-foreground mb-2">Expense Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g., Flight tickets, Hotel booking"
                placeholderTextColor={colors.mutedForeground}
                className="h-12 rounded-2xl px-4 text-foreground"
                style={{ backgroundColor: colors.inputBackground }}
              />
            </View>

            <View>
              <Text className="text-sm font-bold text-foreground mb-2">Amount ($)</Text>
              <TextInput
                value={amount}
                onChangeText={(v) => setAmount(v.replace(/[^0-9.]/g, ''))}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor={colors.mutedForeground}
                className="h-12 rounded-2xl px-4 text-foreground"
                style={{ backgroundColor: colors.inputBackground }}
              />
            </View>

            <View>
              <Text className="text-sm font-bold text-foreground mb-2">Category</Text>
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const selected = category === c.value;
                  return (
                    <Pressable
                      key={c.value}
                      onPress={() => setCategory(c.value)}
                      className="px-3 py-2 rounded-full"
                      style={{ backgroundColor: selected ? colors.vaykaePink : colors.inputBackground }}
                    >
                      <Text
                        className="text-sm font-medium"
                        style={{ color: selected ? colors.background : colors.foreground }}
                      >
                        {c.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View>
              <Text className="text-sm font-bold text-foreground mb-2">Paid By</Text>
              <View className="flex-row flex-wrap gap-2">
                {members.map((m) => {
                  const selected = paidByUserId === m.userId;
                  const label = m.userId === currentUserId ? 'You' : (m.displayName ?? `@${m.username}`);
                  return (
                    <Pressable
                      key={m.userId}
                      onPress={() => setPaidByUserId(m.userId)}
                      className="px-3 py-2 rounded-full"
                      style={{ backgroundColor: selected ? colors.vaykaePink : colors.inputBackground }}
                    >
                      <Text
                        className="text-sm font-medium"
                        style={{ color: selected ? colors.background : colors.foreground }}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View className="px-4 py-4" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit || addExpense.isPending}
              className="h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: canSubmit ? colors.vaykaePink : colors.disabledBackground }}
            >
              {addExpense.isPending ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text
                  className="font-bold"
                  style={{ color: canSubmit ? colors.background : colors.mutedForeground }}
                >
                  Add Expense
                </Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
