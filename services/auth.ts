import * as SecureStore from 'expo-secure-store';
import { User } from '../types';

const USER_KEY = 'user_profile';
const AUTH_TOKEN_KEY = 'auth_token';

export const saveUserSecure = async (user: User): Promise<boolean> => {
  try {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Save user error:', error);
    return false;
  }
};

export const getUserSecure = async (): Promise<User | null> => {
  try {
    const user = await SecureStore.getItemAsync(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

export const deleteUserSecure = async (): Promise<boolean> => {
  try {
    await SecureStore.deleteItemAsync(USER_KEY);
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('Delete user error:', error);
    return false;
  }
};

export const saveAuthToken = async (token: string): Promise<boolean> => {
  try {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Save token error:', error);
    return false;
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Get token error:', error);
    return null;
  }
};