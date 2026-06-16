export interface Bus {
  id: string;
  type: 'Scania' | 'Yutong' | 'MAN' | 'Zhongtong' | 'Isuzu';
  capacity: number;
  amenities: string[];
}

export interface Destination {
  id: string;
  name: string;
  city: string;
  busStop: string;
}

export interface Trip {
  id: string;
  origin: Destination;
  destination: Destination;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  bus: Bus;
  price: number;
  availableSeats: number;
  date: string;
}

export interface Booking {
  id: string;
  tripId: string;
  userId: string;
  seats: number[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingDate: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  passengerDetails: PassengerDetails;
}

export interface PassengerDetails {
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}