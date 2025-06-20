// src/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: 'AIzaSyAeFDQiFs7vhHn54hDyU4El3eZ78gth9Oo',
  authDomain: 'web3-mobile-auth-starter.firebaseapp.com',
  projectId: 'web3-mobile-auth-starter',
  storageBucket: 'web3-mobile-auth-starter.appspot.com',
  messagingSenderId: '360323243142',
  appId: '1:360323243142:web:5b6dbd519be717f7008507',
};

const app = initializeApp(firebaseConfig);

// this replaces getAuth(app)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});