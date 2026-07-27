import { Modal, Pressable, Text, View } from 'react-native';
import { useAlertStore } from '../stores/alert-store';
import { colors } from '../constants/colors';

export function AlertHost() {
  const request = useAlertStore((s) => s.request);
  const hide = useAlertStore((s) => s.hide);

  if (!request) return null;

  const handlePress = (onPress?: () => void) => {
    hide();
    onPress?.();
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={() => hide()}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: 32,
        }}
      >
        <View
          className="w-full rounded-2xl p-5"
          style={{ backgroundColor: colors.background, maxWidth: 340 }}
        >
          <Text className="text-lg font-bold text-foreground mb-1">{request.title}</Text>
          {!!request.message && (
            <Text className="mb-5" style={{ color: colors.mutedForeground }}>
              {request.message}
            </Text>
          )}
          <View className="gap-2">
            {request.buttons.map((button, index) => (
              <Pressable
                key={`${button.text}-${index}`}
                onPress={() => handlePress(button.onPress)}
                className="h-11 rounded-xl items-center justify-center"
                style={{
                  backgroundColor:
                    button.style === 'destructive'
                      ? colors.destructive
                      : button.style === 'cancel'
                        ? colors.inputBackground
                        : colors.vaykaePink,
                }}
              >
                <Text
                  className="font-semibold"
                  style={{
                    color: button.style === 'cancel' ? colors.foreground : colors.background,
                  }}
                >
                  {button.text}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}
