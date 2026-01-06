// Firebase Configuration
// IMPORTANT: Replace with your actual Firebase config from Firebase Console
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase project configuration
// Get this from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyARkDIpWfRNMVFscXo0vJ7SVahbLzQO5yQ",
  authDomain: "examen-civique-app-41c05.firebaseapp.com",
  projectId: "examen-civique-app-41c05",
  storageBucket: "examen-civique-app-41c05.firebasestorage.app",
  messagingSenderId: "1074754569572",
  appId: "1:1074754569572:web:0a32dd0c512c2b79ade671"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
// This handles all auth operations (email/password, Apple Sign-In, etc.)
export const auth = getAuth(app);

// Initialize Cloud Firestore
// This is our database where user data will be synced
export const db = getFirestore(app);

export default app;
