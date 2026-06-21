import * as Camera from 'expo-camera';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is needed for profile photos');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Camera permission error:', error);
    return false;
  }
};

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location access is needed to find nearby bus stops');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Location permission error:', error);
    return false;
  }
};

export const getCurrentLocation = async () => {
  try {
    const location = await Location.getCurrentPositionAsync({});
    return location;
  } catch (error) {
    console.error('Location error:', error);
    return null;
  }
};