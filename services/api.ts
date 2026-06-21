import { trips } from '../constants/data';
import { Trip } from '../types';

const API_URL = 'https://api.example.com'; // Replace with actual API

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export const api = {
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      // Simulate API call with delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, return mock data from constants
      // In production, use: const response = await fetch(`${API_URL}${endpoint}`);
      return {
        data: {} as T,
        status: 200,
        message: 'Success',
      };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  post: async <T>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
    try {
      // In production:
      // const response = await fetch(`${API_URL}${endpoint}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      return {
        data: {} as T,
        status: 200,
        message: 'Success',
      };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

export const getTrips = async (originId?: string, destinationId?: string): Promise<Trip[]> => {
  // In production:
  // const response = await api.get<Trip[]>(`/trips?origin=${originId}&destination=${destinationId}`);
  // return response.data;
  
  // For demo, return mock data
  return trips;
};