// Firebase Authentication Service
// Handles all authentication operations (login, register, logout, Apple Sign-In)

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  OAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * SECURITY: Email/Password Authentication
 * - Password is NEVER stored locally or in Firestore
 * - Firebase handles all password hashing and validation
 * - Email is only stored in Firebase Auth, not in our Firestore database
 */

// Register new user with email and password
export const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
};

// Login existing user with email and password
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * SECURITY: Sign in with Apple (Required for App Store)
 * - Uses Firebase OAuth provider for Apple
 * - No password management needed
 * - Compliant with Apple's authentication requirements
 */
export const signInWithApple = async () => {
  try {
    const provider = new OAuthProvider('apple.com');

    // Request user's name and email (Apple will ask user for permission)
    provider.addScope('email');
    provider.addScope('name');

    const userCredential = await signInWithPopup(auth, provider);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Apple Sign-In error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * SECURITY: Logout
 * - Clears Firebase auth session
 * - Does NOT clear localStorage (keeps local data intact)
 * - Stops sync operations
 */
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Auth State Observer
 * - Monitors authentication state changes
 * - Returns unsubscribe function for cleanup
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current authenticated user
 * - Returns null if not logged in
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};
