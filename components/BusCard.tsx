import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trip } from '../types';

interface BusCardProps {
  trip: Trip;
  onPress: () => void;
}

const BusCard: React.FC<BusCardProps> = ({ trip, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.routeContainer}>
        <View style={styles.locationContainer}>
          <Text style={styles.cityName}>{trip.origin.city}</Text>
          <Text style={styles.timeText}>{trip.departureTime}</Text>
          <Text style={styles.stopText}>{trip.origin.busStop}</Text>
        </View>
        
        <View style={styles.durationContainer}>
          <View style={styles.line} />
          <Text style={styles.durationText}>{trip.duration}</Text>
          <View style={styles.line} />
        </View>
        
        <View style={styles.locationContainer}>
          <Text style={styles.cityName}>{trip.destination.city}</Text>
          <Text style={styles.timeText}>{trip.arrivalTime}</Text>
          <Text style={styles.stopText}>{trip.destination.busStop}</Text>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.busInfo}>
          <Text style={styles.busType}>🚌 {trip.bus.type}</Text>
          <Text style={styles.amenities}>{trip.bus.amenities.join(' • ')}</Text>
        </View>
        
        <View style={styles.priceInfo}>
          <Text style={styles.priceLabel}>KES</Text>
          <Text style={styles.price}>{trip.price.toLocaleString()}</Text>
          <Text style={styles.seats}>🎫 {trip.availableSeats} seats left</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationContainer: {
    flex: 1,
    alignItems: 'center',
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  stopText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    paddingHorizontal: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  durationText: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  busInfo: {
    flex: 2,
  },
  busType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  amenities: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  priceInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    color: '#999',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  seats: {
    fontSize: 11,
    color: '#e74c3c',
    marginTop: 4,
  },
});

export default BusCard;