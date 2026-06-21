import React from 'react';
import { render } from '@testing-library/react-native';
import BookingScreen from '../../app/booking/[id]';
import { trips } from '../../constants/data';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ trip: JSON.stringify(trips[0]) }),
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('../../context/BookingContext', () => ({
  useBooking: () => ({
    addBooking: jest.fn(),
  }),
}));

describe('BookingScreen', () => {
  it('renders trip information correctly', () => {
    const { getByText } = render(<BookingScreen />);
    expect(getByText(/Nairobi → Mombasa/)).toBeTruthy();
  });
});