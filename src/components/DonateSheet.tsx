import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { X, Gift } from 'lucide-react-native';
import { colors } from '../constants/colors';
import { useDonateManual } from '../hooks/use-wallet-mutations';

interface DonateSheetProps {
  visible: boolean;
  campaignId: string;
  onClose: () => void;
}

export function DonateSheet({ visible, campaignId, onClose }: DonateSheetProps) {
  const [amount, setAmount] = useState('');
  const [donorDisplayName, setDonorDisplayName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const donateManual = useDonateManual();

  const parsedAmount = parseFloat(amount);
  const canSubmit = amount.length > 0 && parsedAmount > 0;

  const handleClose = () => {
    setAmount('');
    setDonorDisplayName('');
    setIsAnonymous(false);
    setIsGift(false);
    setGiftMessage('');
    onClose();
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    donateManual.mutate(
      {
        campaignId,
        input: {
          amount: parsedAmount,
          currency: 'USD',
          donorDisplayName: donorDisplayName || undefined,
          isAnonymous,
          isGift,
          giftMessage: giftMessage || undefined,
        },
      },
      { onSuccess: handleClose },
    );
  };

  return (
    <Modal visible={visible} transparent animationType='slide' onRequestClose={handleClose}>
      <Pressable className='flex-1' style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={handleClose}>
        <View className='flex-1' />
        <Pressable onPress={(e) => e.stopPropagation()} className='bg-background rounded-t-3xl'>
          <View className='items-center pt-3 pb-2'>
            <View className='w-10 h-1 rounded-full' style={{ backgroundColor: colors.border }} />
          </View>

          <View
            className='flex-row items-center justify-between px-4 py-3'
            style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
          >
            <View className='flex-row items-center gap-2'>
              <Gift size={20} color={colors.vaykaePink} />
              <Text className='text-lg font-bold text-foreground'>Donate to Campaign</Text>
            </View>
            <Pressable onPress={handleClose} hitSlop={8}>
              <X size={20} color={colors.foreground} />
            </Pressable>
          </View>

          <View className='p-4' style={{ gap: 16 }}>
            <View>
              <Text className='text-sm font-bold text-foreground mb-2'>Amount ($)</Text>
              <TextInput
                value={amount}
                onChangeText={(v) => setAmount(v.replace(/[^0-9.]/g, ''))}
                placeholder='0.00'
                keyboardType='numeric'
                placeholderTextColor={colors.mutedForeground}
                className='h-12 rounded-2xl px-4 text-foreground'
                style={{ backgroundColor: colors.inputBackground }}
              />
            </View>

            <View>
              <Text className='text-sm font-bold text-foreground mb-2'>Your Name (Optional)</Text>
              <TextInput
                value={donorDisplayName}
                onChangeText={setDonorDisplayName}
                placeholder='Anonymous'
                placeholderTextColor={colors.mutedForeground}
                className='h-12 rounded-2xl px-4 text-foreground'
                style={{ backgroundColor: colors.inputBackground }}
              />
            </View>

            <View className='flex-row items-center gap-3'>
              <Pressable
                onPress={() => setIsAnonymous(!isAnonymous)}
                className='flex-row items-center gap-2'
              >
                <View
                  className='w-5 h-5 rounded border-2 items-center justify-center'
                  style={{ borderColor: isAnonymous ? colors.vaykaePink : colors.border, backgroundColor: isAnonymous ? colors.vaykaePink : 'transparent' }}
                >
                  {isAnonymous && <Text className='text-xs font-bold' style={{ color: colors.background }}>✓</Text>}
                </View>
                <Text className='text-sm text-foreground'>Anonymous donation</Text>
              </Pressable>
            </View>

            <View className='flex-row items-center gap-3'>
              <Pressable
                onPress={() => setIsGift(!isGift)}
                className='flex-row items-center gap-2'
              >
                <View
                  className='w-5 h-5 rounded border-2 items-center justify-center'
                  style={{ borderColor: isGift ? colors.vaykaePink : colors.border, backgroundColor: isGift ? colors.vaykaePink : 'transparent' }}
                >
                  {isGift && <Text className='text-xs font-bold' style={{ color: colors.background }}>✓</Text>}
                </View>
                <Text className='text-sm text-foreground'>This is a gift</Text>
              </Pressable>
            </View>

            {isGift && (
              <View>
                <Text className='text-sm font-bold text-foreground mb-2'>Gift Message (Optional)</Text>
                <TextInput
                  value={giftMessage}
                  onChangeText={setGiftMessage}
                  placeholder='Happy birthday! Enjoy your trip!'
                  placeholderTextColor={colors.mutedForeground}
                  className='h-12 rounded-2xl px-4 text-foreground'
                  style={{ backgroundColor: colors.inputBackground }}
                />
              </View>
            )}

            <View className='items-center py-2'>
              <Text className='text-xs text-center' style={{ color: colors.mutedForeground }}>
                This is a manual-funding demo. No real payment processor is used.
              </Text>
            </View>
          </View>

          <View className='px-4 py-4' style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit || donateManual.isPending}
              className='h-12 rounded-full items-center justify-center'
              style={{ backgroundColor: canSubmit ? colors.vaykaePink : colors.disabledBackground }}
            >
              {donateManual.isPending ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text
                  className='font-bold'
                  style={{ color: canSubmit ? colors.background : colors.mutedForeground }}
                >
                  Donate
                </Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}