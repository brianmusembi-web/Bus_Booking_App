import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trip, PassengerDetails, Booking } from '../../types';

export default function BookingScreen() {
  const router = useRouter();
  const { id, trip } = useLocalSearchParams();
  const tripData: Trip = JSON.parse(trip as string);
  
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetails>({
    name: '',
    email: '',
    phone: '',
    age: 0,
    gender: 'male',
  });

  const generateSeats = () => {
    const seats = [];
    for (let i = 1; i <= tripData.bus.capacity; i++) {
      const isBooked = i > tripData.availableSeats + selectedSeats.length;
      seats.push({
        number: i,
        isSelected: selectedSeats.includes(i),
        isBooked: isBooked,
      });
    }
    return seats;
  };

  const handleSeatSelection = (seatNumber: number) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      if (selectedSeats.length < 4) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      } else {
        Alert.alert('Limit Reached', 'You can only book up to 4 seats at a time');
      }
    }
  };

  const calculateTotal = () => {
    return selectedSeats.length * tripData.price;
  };

  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0) {
      Alert.alert('Error', 'Please select at least one seat');
      return;
    }

    if (!passengerDetails.name || !passengerDetails.email || !passengerDetails.phone) {
      Alert.alert('Error', 'Please fill in all passenger details');
      return;
    }

    const booking: Booking = {
      id: Date.now().toString(),
      tripId: tripData.id,
      userId: 'current-user',
      seats: selectedSeats,
      totalPrice: calculateTotal(),
      status: 'pending',
      bookingDate: new Date().toISOString(),
      paymentStatus: 'pending',
      passengerDetails: passengerDetails,
    };

    try {
      await AsyncStorage.setItem(`booking_${booking.id}`, JSON.stringify(booking));
      router.push({
        pathname: '/payment/[bookingId]',
        params: { bookingId: booking.id, booking: JSON.stringify(booking) },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to save booking');
    }
  };

  const seats = generateSeats();
  const rows = [];
  for (let i = 0; i < seats.length; i += 4) {
    rows.push(seats.slice(i, i + 4));
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tripInfo}>
        <Text style={styles.routeTitle}>
          {tripData.origin.city} → {tripData.destination.city}
        </Text>
        <View style={styles.timeInfo}>
          <Text style={styles.timeText}>
            🕐 {tripData.departureTime} - {tripData.arrivalTime}
          </Text>
          <Text style={styles.durationText}>⏱️ {tripData.duration}</Text>
        </View>
        <View style={styles.busInfo}>
          <Text style={styles.busType}>🚌 {tripData.bus.type}</Text>
          <Text style={styles.amenities}>{tripData.bus.amenities.join(' • ')}</Text>
        </View>
      </View>

      <View style={styles.seatSelection}>
        <Text style={styles.sectionTitle}>Select Seats (Max 4)</Text>
        <View style={styles.seatLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.availableSeat]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.selectedSeat]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.bookedSeat]} />
            <Text style={styles.legendText}>Booked</Text>
          </View>
        </View>

        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.seatRow}>
            {row.map((seat) => (
              <TouchableOpacity
                key={seat.number}
                style={[
                  styles.seat,
                  seat.isBooked && styles.bookedSeat,
                  seat.isSelected && styles.selectedSeat,
                  !seat.isBooked && !seat.isSelected && styles.availableSeat,
                ]}
                onPress={() => !seat.isBooked && handleSeatSelection(seat.number)}
                disabled={seat.isBooked}
              >
                <Text
                  style={[
                    styles.seatText,
                    (seat.isBooked || seat.isSelected) && styles.seatTextWhite,
                  ]}
                >
                  {seat.number}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.passengerForm}>
        <Text style={styles.sectionTitle}>Passenger Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={passengerDetails.name}
          onChangeText={(text) => setPassengerDetails({ ...passengerDetails, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={passengerDetails.email}
          onChangeText={(text) => setPassengerDetails({ ...passengerDetails, email: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={passengerDetails.phone}
          onChangeText={(text) => setPassengerDetails({ ...passengerDetails, phone: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          value={passengerDetails.age.toString()}
          onChangeText={(text) => setPassengerDetails({ ...passengerDetails, age: parseInt(text) || 0 })}
        />
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              passengerDetails.gender === 'male' && styles.genderButtonActive,
            ]}
            onPress={() => setPassengerDetails({ ...passengerDetails, gender: 'male' })}
          >
            <Text style={styles.genderText}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderButton,
              passengerDetails.gender === 'female' && styles.genderButtonActive,
            ]}
            onPress={() => setPassengerDetails({ ...passengerDetails, gender: 'female' })}
          >
            <Text style={styles.genderText}>Female</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderButton,
              passengerDetails.gender === 'other' && styles.genderButtonActive,
            ]}
            onPress={() => setPassengerDetails({ ...passengerDetails, gender: 'other' })}
          >
            <Text style={styles.genderText}>Other</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Selected Seats:</Text>
          <Text style={styles.summaryValue}>
            {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Price per seat:</Text>
          <Text style={styles.summaryValue}>KES {tripData.price}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>KES {calculateTotal()}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.bookButton} onPress={handleProceedToPayment}>
        <Text style={styles.bookButtonText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tripInfo: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  durationText: {
    fontSize: 14,
    color: '#666',
  },
  busInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  busType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  amenities: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  seatSelection: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  seatLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  seatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  seat: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  availableSeat: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  selectedSeat: {
    backgroundColor: '#2ecc71',
  },
  bookedSeat: {
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#999',
  },
  seatText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  seatTextWhite: {
    color: 'white',
  },
  passengerForm: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#2ecc71',
  },
  genderText: {
    fontSize: 14,
    color: '#333',
  },
  summary: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginTop: 8,
  },
  bookButton: {
    backgroundColor: '#2ecc71',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});