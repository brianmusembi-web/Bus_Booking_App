import { Stack } from 'expo-router';
import { BookingProvider } from '../context/BookingContext';
import { registerForPushNotifications } from '../services/notifications';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    registerForPushNotifications();
  }, []);

  return (
    <BookingProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="booking/[id]" options={{ title: 'Book Tickets' }} />
        <Stack.Screen name="payment/[bookingId]" options={{ title: 'Payment' }} />
      </Stack>
    </BookingProvider>
  );
}