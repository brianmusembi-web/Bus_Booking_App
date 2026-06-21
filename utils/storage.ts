import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '../types';

export const exportData = async () => {
  try {
    const bookings = await AsyncStorage.getItem('bookings');
    const user = await AsyncStorage.getItem('userProfile');
    return { 
      bookings: bookings ? JSON.parse(bookings) : [], 
      user: user ? JSON.parse(user) : null 
    };
  } catch (error) {
    console.error('Export error:', error);
    return null;
  }
};

export const importData = async (data: any) => {
  try {
    if (data.bookings) {
      await AsyncStorage.setItem('bookings', JSON.stringify(data.bookings));
    }
    if (data.user) {
      await AsyncStorage.setItem('userProfile', JSON.stringify(data.user));
    }
    return true;
  } catch (error) {
    console.error('Import error:', error);
    return false;
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Clear error:', error);
    return false;
  }
};