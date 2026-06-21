import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BusCard from '../../components/BusCard';
import { trips } from '../../constants/data';

describe('BusCard', () => {
  it('renders trip information correctly', () => {
    const trip = trips[0];
    const { getByText } = render(
      <BusCard trip={trip} onPress={() => {}} />
    );
    
    expect(getByText(trip.origin.city)).toBeTruthy();
    expect(getByText(trip.destination.city)).toBeTruthy();
    expect(getByText(`🚌 ${trip.bus.type}`)).toBeTruthy();
    expect(getByText(`KES ${trip.price.toLocaleString()}`)).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const trip = trips[0];
    const { getByText } = render(
      <BusCard trip={trip} onPress={onPress} />
    );
    
    fireEvent.press(getByText(trip.origin.city));
    expect(onPress).toHaveBeenCalled();
  });
});