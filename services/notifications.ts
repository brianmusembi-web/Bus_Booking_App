import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Check if we're in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

export const registerForPushNotifications = async () => {
  try {
    // Expo Go doesn't support push notifications properly
    if (isExpoGo) {
      console.log('Push notifications are limited in Expo Go');
      return null;
    }

    const { status } = await Notifications.getPermissionsAsync();
    let finalStatus = status;

    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      finalStatus = newStatus;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Permission Denied', 'Push notifications are needed for booking updates');
      return null;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2ecc71',
      });
    }

    const token = await Notifications.getExpoPushTokenAsync();
    console.log('Push token:', token);
    return token;
  } catch (error) {
    console.error('Register notification error:', error);
    return null;
  }
};

export const sendBookingConfirmation = async (bookingId: string, bookingDetails: any) => {
  try {
    if (isExpoGo) {
      console.log(`Booking ${bookingId} confirmed! (Expo Go - notification skipped)`);
      return false;
    }
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Booking Confirmed! 🎉',
        body: `Your booking #${bookingId} has been confirmed.`,
        data: { bookingId, ...bookingDetails },
      },
      trigger: null,
    });
    return true;
  } catch (error) {
    console.error('Send confirmation error:', error);
    return false;
  }
};

export const sendBookingReminder = async (bookingId: string, timeMinutes: number) => {
  try {
    if (isExpoGo) {
      console.log(`Reminder for booking ${bookingId} (Expo Go - notification skipped)`);
      return false;
    }
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Trip Reminder 🚌',
        body: `Your trip is in ${timeMinutes} minutes. Don't be late!`,
        data: { bookingId },
      },
      trigger: {
        seconds: timeMinutes * 60,
      },
    });
    return true;
  } catch (error) {
    console.error('Send reminder error:', error);
    return false;
  }
};