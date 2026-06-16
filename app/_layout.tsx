import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="booking/[id]" options={{ title: 'Book Tickets' }} />
      <Stack.Screen name="payment/[bookingId]" options={{ title: 'Payment' }} />
    </Stack>
  );
}