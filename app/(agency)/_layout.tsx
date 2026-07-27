import { Stack } from 'expo-router';

export default function AgencyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ animation: 'none' }} />
      <Stack.Screen name="inbox/index" options={{ animation: 'none' }} />
    </Stack>
  );
}
