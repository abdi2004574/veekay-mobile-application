import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '../constants/colors';
import { useAddGroupContribution } from '../hooks/use-group-campaigns-mutations';

interface AddContributionSheetProps {
  visible: boolean;
  campaignId: string;
  onClose: () => void;
}

export function AddContributionSheet({ visible, campaignId, onClose }: AddContributionSheetProps) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const addContribution = useAddGroupContribution(campaignId);

  const parsedAmount = parseFloat(amount);
  const canSubmit = amount.length > 0 && parsedAmount > 0;

  const handleClose = () => {
    setAmount('');
    setNote('');
    onClose();
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    addContribution.mutate(
      { amount: parsedAmount, note: note || undefined },
      { onSuccess: handleClose },
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={handleClose}>
        <View className="flex-1" />
        <Pressable onPress={(e) => e.stopPropagation()} className="bg-background rounded-t-3xl">
          <View className="items-center pt-3 pb-2">
            <View className="w-10 h-1 rounded-full" style={{ backgroundColor: colors.border }} />
          </View>

          <View
            className="flex-row items-center justify-between px-4 py-3"
            style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
          >
            <Text className="text-lg font-bold text-foreground">Add Contribution</Text>
            <Pressable onPress={handleClose} hitSlop={8}>
              <X size={20} color={colors.foreground} />
            </Pressable>
          </View>

          <View className="p-4" style={{ gap: 16 }}>
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
              <Text className="text-sm font-bold text-foreground mb-2">Note (Optional)</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="e.g., Flight deposit, Hotel booking"
                placeholderTextColor={colors.mutedForeground}
                className="h-12 rounded-2xl px-4 text-foreground"
                style={{ backgroundColor: colors.inputBackground }}
              />
            </View>
          </View>

          <View className="px-4 py-4" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit || addContribution.isPending}
              className="h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: canSubmit ? colors.vaykaePink : colors.disabledBackground }}
            >
              {addContribution.isPending ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text
                  className="font-bold"
                  style={{ color: canSubmit ? colors.background : colors.mutedForeground }}
                >
                  Add Contribution
                </Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
