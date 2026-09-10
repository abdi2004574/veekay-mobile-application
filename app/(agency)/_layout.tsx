import { Stack } from 'expo-router';

export default function AgencyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ animation: 'none' }} />
      <Stack.Screen name="inbox/index" options={{ animation: 'none' }} />
      <Stack.Screen name="inbox/[id]" options={{ animation: 'none' }} />
      <Stack.Screen name="packages/index" options={{ animation: 'none' }} />
      <Stack.Screen name="packages/create" />
      <Stack.Screen name="packages/edit" />
      <Stack.Screen name="packages/[id]" />
      <Stack.Screen name="requests/index" options={{ animation: 'none' }} />
      <Stack.Screen name="notifications" options={{ animation: 'none' }} />
      <Stack.Screen name="requests/[id]" />
      <Stack.Screen name="requests/smart-replies" />
    </Stack>
  );
}
