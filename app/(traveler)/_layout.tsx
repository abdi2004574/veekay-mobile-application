import { Stack } from 'expo-router';

export default function TravelerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Bottom-nav tab destinations switch instantly, like a real tab bar —
          the default slide is reserved for genuine drill-down navigation
          (a post's author, a conversation, a story). */}
      <Stack.Screen name="index" options={{ animation: 'none' }} />
      <Stack.Screen name="chat/index" options={{ animation: 'none' }} />
      <Stack.Screen name="profile/index" options={{ animation: 'none' }} />
    </Stack>
  );
}
