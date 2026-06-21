import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '../types';

interface BookingContextType {
  bookings: Booking[];
  loading: boolean;
  addBooking: (booking: Booking) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  loadBookings: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const stored = await AsyncStorage.getItem('bookings');
      setBookings(stored ? JSON.parse(stored) : []);
    } catch (error) {
      console.error('Load bookings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBooking = async (booking: Booking) => {
    try {
      const updated = [...bookings, booking];
      await AsyncStorage.setItem('bookings', JSON.stringify(updated));
      setBookings(updated);
    } catch (error) {
      console.error('Add booking error:', error);
      throw error;
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const updated = bookings.filter(b => b.id !== bookingId);
      await AsyncStorage.setItem('bookings', JSON.stringify(updated));
      setBookings(updated);
    } catch (error) {
      console.error('Cancel booking error:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <BookingContext.Provider value={{ bookings, loading, addBooking, cancelBooking, loadBookings }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};