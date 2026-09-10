import { Stack } from 'expo-router';

export default function TravelerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ animation: 'none' }} />
      <Stack.Screen name="chat/index" options={{ animation: 'none' }} />
      <Stack.Screen name="profile/index" options={{ animation: 'none' }} />
      <Stack.Screen name="explore/index" options={{ animation: 'none' }} />
      <Stack.Screen name="campaigns/index" options={{ animation: 'none' }} />
      <Stack.Screen name="notifications" options={{ animation: 'none' }} />
      <Stack.Screen name="itinerary/index" options={{ animation: 'none' }} />
      <Stack.Screen name="package/[id]" />
    </Stack>
  );
}
