// Firebase Configuration
// Configuration loaded from environment variables for security
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * SECURITY NOTE:
 * - Firebase config is loaded from environment variables
 * - These values are safe to expose (security is via Firestore Rules)
 * - See .env.example for required variables
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Validate config in development
if (process.env.NODE_ENV === 'development') {
  const missingKeys = Object.entries(firebaseConfig)
    .filter(([key, value]) => !value)
    .map(([key]) => key);
  
  if (missingKeys.length > 0) {
    console.warn('[Firebase] Missing config keys:', missingKeys);
    console.warn('[Firebase] Please check your .env file');
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
// This handles all auth operations (email/password, Apple Sign-In, etc.)
export const auth = getAuth(app);

// Initialize Cloud Firestore
// This is our database where user data will be synced
export const db = getFirestore(app);

export default app;
