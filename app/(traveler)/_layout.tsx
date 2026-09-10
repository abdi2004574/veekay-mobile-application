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
      <Stack.Screen name="wallet/index" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="wallet/transactions" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="wallet/withdrawals/index" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="wallet/withdrawals/new" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="wallet/withdrawals/[id]" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}