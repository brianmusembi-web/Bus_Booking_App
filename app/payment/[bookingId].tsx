import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '../../types';

export default function PaymentScreen() {
  const router = useRouter();
  const { bookingId, booking } = useLocalSearchParams();
  const bookingData: Booking = JSON.parse(booking as string);
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'mpesa' | 'cash'>('mpesa');

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Update booking status
        const updatedBooking = {
          ...bookingData,
          status: 'confirmed',
          paymentStatus: 'paid',
        };
        
        await AsyncStorage.setItem(`booking_${bookingData.id}`, JSON.stringify(updatedBooking));
        
        // Save to bookings list
        const existingBookings = await AsyncStorage.getItem('bookings');
        const bookings = existingBookings ? JSON.parse(existingBookings) : [];
        bookings.push(updatedBooking);
        await AsyncStorage.setItem('bookings', JSON.stringify(bookings));
        
        setLoading(false);
        
        Alert.alert(
          'Payment Successful',
          `Your booking has been confirmed! Booking ID: ${bookingData.id}`,
          [
            {
              text: 'View Bookings',
              onPress: () => router.push('/(tabs)/bookings'),
            },
          ]
        );
      } catch (error) {
        setLoading(false);
        Alert.alert('Payment Failed', 'Please try again');
      }
    }, 2000);
  };

  const PaymentMethodCard = ({ method, title, icon }: { method: 'card' | 'mpesa' | 'cash', title: string, icon: string }) => (
    <TouchableOpacity
      style={[
        styles.paymentMethod,
        selectedMethod === method && styles.paymentMethodSelected,
      ]}
      onPress={() => setSelectedMethod(method)}
    >
      <Text style={styles.paymentIcon}>{icon}</Text>
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentTitle}>{title}</Text>
        <Text style={styles.paymentDescription}>
          {method === 'card' && 'Pay with credit/debit card'}
          {method === 'mpesa' && 'Pay with M-Pesa'}
          {method === 'cash' && 'Pay at the bus station'}
        </Text>
      </View>
      <View style={[styles.radioButton, selectedMethod === method && styles.radioButtonSelected]} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment</Text>
        <Text style={styles.subtitle}>Complete your booking</Text>
      </View>

      <View style={styles.bookingSummary}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Booking ID:</Text>
          <Text style={styles.summaryValue}>{bookingData.id}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Amount:</Text>
          <Text style={styles.amount}>KES {bookingData.totalPrice.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Seats:</Text>
          <Text style={styles.summaryValue}>{bookingData.seats.join(', ')}</Text>
        </View>
      </View>

      <View style={styles.paymentMethods}>
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        <PaymentMethodCard method="mpesa" title="M-Pesa" icon="📱" />
        <PaymentMethodCard method="card" title="Card Payment" icon="💳" />
        <PaymentMethodCard method="cash" title="Cash" icon="💰" />
      </View>

      {selectedMethod === 'mpesa' && (
        <View style={styles.mpesaInfo}>
          <Text style={styles.mpesaTitle}>M-Pesa Instructions:</Text>
          <Text style={styles.mpesaText}>1. Go to M-Pesa on your phone</Text>
          <Text style={styles.mpesaText}>2. Select "Lipa na M-Pesa"</Text>
          <Text style={styles.mpesaText}>3. Enter Business Number: 123456</Text>
          <Text style={styles.mpesaText}>4. Enter Account Number: {bookingData.id}</Text>
          <Text style={styles.mpesaText}>5. Enter Amount: KES {bookingData.totalPrice}</Text>
          <Text style={styles.mpesaText}>6. Enter your M-Pesa PIN</Text>
          <Text style={styles.mpesaNote}>After payment, click "I Have Paid" below</Text>
        </View>
      )}

      {selectedMethod === 'card' && (
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>Demo Card Details:</Text>
          <Text style={styles.cardText}>Card Number: 4242 4242 4242 4242</Text>
          <Text style={styles.cardText}>Expiry: 12/25</Text>
          <Text style={styles.cardText}>CVV: 123</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.payButton, loading && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.payButtonText}>
            {selectedMethod === 'cash' ? 'Confirm Booking' : 'Pay KES ' + bookingData.totalPrice.toLocaleString()}
          </Text>
        )}
      </TouchableOpacity>
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
  bookingSummary: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
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
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  paymentMethods: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  paymentMethodSelected: {
    borderColor: '#2ecc71',
    backgroundColor: '#e8f5e9',
  },
  paymentIcon: {
    fontSize: 30,
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  paymentDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  radioButtonSelected: {
    borderColor: '#2ecc71',
    backgroundColor: '#2ecc71',
  },
  mpesaInfo: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  mpesaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  mpesaText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  mpesaNote: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
    marginTop: 8,
  },
  cardInfo: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  payButton: {
    backgroundColor: '#2ecc71',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});