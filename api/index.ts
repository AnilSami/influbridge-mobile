import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In Android emulator, 10.0.2.2 refers to the host computer localhost.
// In iOS simulator, localhost works fine.
// Fallback to localhost if not specified.
const API_BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:5000/api' 
  : 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token dynamically from AsyncStorage
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('brandly_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
