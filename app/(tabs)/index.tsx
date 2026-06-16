import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { trips, destinations } from '../../constants/data';
import BusCard from '../../components/BusCard';
import { Trip } from '../../types';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedOrigin, setSelectedOrigin] = useState(destinations[0]);
  const [selectedDestination, setSelectedDestination] = useState(destinations[1]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>(trips);

  const filterTrips = () => {
    const filtered = trips.filter(
      (trip) =>
        trip.origin.id === selectedOrigin.id &&
        trip.destination.id === selectedDestination.id
    );
    setFilteredTrips(filtered);
  };

  React.useEffect(() => {
    filterTrips();
  }, [selectedOrigin, selectedDestination]);

  const handleTripPress = (trip: Trip) => {
    router.push({
      pathname: '/booking/[id]',
      params: { id: trip.id, trip: JSON.stringify(trip) },
    });
  };

  const renderDestinationPicker = (
    label: string,
    selected: any,
    onSelect: (dest: any) => void,
    options: any[]
  ) => (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              selected.id === option.id && styles.optionButtonActive,
            ]}
            onPress={() => onSelect(option)}
          >
            <Text
              style={[
                styles.optionText,
                selected.id === option.id && styles.optionTextActive,
              ]}
            >
              {option.city}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bus Booking</Text>
        <Text style={styles.subtitle}>Find your perfect journey</Text>
      </View>

      <View style={styles.filters}>
        {renderDestinationPicker(
          'From',
          selectedOrigin,
          setSelectedOrigin,
          destinations
        )}
        {renderDestinationPicker(
          'To',
          selectedDestination,
          setSelectedDestination,
          destinations
        )}
      </View>

      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BusCard trip={item} onPress={() => handleTripPress(item)} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No trips found for this route</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2ecc71',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    marginTop: 4,
    opacity: 0.9,
  },
  filters: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonActive: {
    backgroundColor: '#2ecc71',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  optionTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});