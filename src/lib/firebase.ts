import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "masembe-group.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "masembe-group",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "masembe-group.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:123456789",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://masembe-group-default-rtdb.firebaseio.com",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const auth = getAuth(app);

// Initialize Analytics only in browser environments where it is supported and configured
if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
  isSupported().then((supported) => {
    if (supported) {
      try {
        getAnalytics(app);
      } catch (err) {
        console.warn('Firebase Analytics disabled:', err);
      }
    }
  }).catch(() => {});
}
