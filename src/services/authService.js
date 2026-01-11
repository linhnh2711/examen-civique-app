// Firebase Authentication Service
// Handles all authentication operations (login, register, logout, Apple Sign-In)

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Detect if running in Capacitor iOS native app
const isNativeIOS = () => {
  try {
    if (typeof window !== 'undefined' && window.Capacitor) {
      return window.Capacitor.getPlatform() === 'ios';
    }
  } catch (e) {
    // Ignore
  }
  return false;
};

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
 * 
 * NOTE: On iOS native apps, popup doesn't work well.
 * We use signInWithRedirect on iOS instead.
 */
export const signInWithApple = async () => {
  try {
    const provider = new OAuthProvider('apple.com');

    // Request user's name and email (Apple will ask user for permission)
    provider.addScope('email');
    provider.addScope('name');

    // On iOS native app, use redirect instead of popup
    if (isNativeIOS()) {
      console.log('[AuthService] Using signInWithRedirect for iOS');
      await signInWithRedirect(auth, provider);
      // After redirect, the result will be handled by handleAppleRedirectResult
      return { success: true, pending: true, message: 'Redirection en cours...' };
    }

    // On web, use popup
    const userCredential = await signInWithPopup(auth, provider);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Apple Sign-In error:', error);
    
    // Handle specific error codes with user-friendly messages
    if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
      return { success: false, cancelled: true, error: 'Connexion annulée' };
    }
    if (error.code === 'auth/popup-blocked') {
      return { success: false, error: 'Pop-up bloqué. Veuillez autoriser les pop-ups.' };
    }
    
    return { success: false, error: error.message || 'Erreur de connexion Apple' };
  }
};

/**
 * Handle Apple Sign-In redirect result (called on app init for iOS)
 * This catches the result after signInWithRedirect returns
 */
export const handleAppleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log('[AuthService] Redirect result:', result.user?.email);
      return { success: true, user: result.user };
    }
    return { success: false, noResult: true };
  } catch (error) {
    console.error('[AuthService] Redirect result error:', error);
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
