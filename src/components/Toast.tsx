import { useEffect, useState } from 'react';
import { Animated, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToastStore } from '../stores/toast-store';
import { colors } from '../constants/colors';

export function ToastHost() {
  const message = useToastStore((s) => s.message);
  const hide = useToastStore((s) => s.hide);
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: message ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [message, opacity]);

  if (!message) return null;

  return (
    <SafeAreaView
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 50,
      }}
    >
      <Animated.View style={{ opacity, marginTop: 12, maxWidth: '90%' }}>
        <Pressable
          onPress={hide}
          className="px-4 py-3 rounded-2xl"
          style={{ backgroundColor: colors.foreground }}
        >
          <Text className="text-white text-center font-medium">{message}</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
