import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, Persistence } from 'firebase/auth';
import * as firebaseAuth from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps()[0] ?? initializeApp(firebaseConfig);

// getReactNativePersistence solo existe en el build para React Native de @firebase/auth,
// que Metro resuelve en runtime vía su export condition "react-native". Los tipos de
// "firebase/auth" no lo exponen por esa ruta, así que lo sacamos del namespace a mano.
const getReactNativePersistence = (
  firebaseAuth as unknown as {
    getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
  }
).getReactNativePersistence;

// En dev, Fast Refresh puede volver a ejecutar este módulo sobre una app de Firebase que
// ya tiene Auth inicializado; initializeAuth() no es idempotente y tira "auth/already-
// initialized" en ese caso, así que recurrimos a getAuth() cuando eso pasa.
export let auth: ReturnType<typeof getAuth>;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}
