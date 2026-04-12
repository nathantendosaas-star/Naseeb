import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDzMQtejKfKhOeX_30hEWOLcjTBWfIPvEE",
  authDomain: "naseeb-b4377.firebaseapp.com",
  projectId: "naseeb-b4377",
  storageBucket: "naseeb-b4377.firebasestorage.app",
  messagingSenderId: "268013548985",
  appId: "1:268013548985:web:2fcea1ae7777d7a4aeb268",
  measurementId: "G-XXKKG5FNNM"
};

// Initialize Firebase SDK
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const auth = getAuth(app);
