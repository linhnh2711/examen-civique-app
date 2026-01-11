// Firestore Sync Service
// Handles synchronization of user data between localStorage and Firestore

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  loadStats,
  saveStats,
  loadQuizHistory,
  saveQuizHistory,
  loadWrongAnswers,
  saveWrongAnswers,
  loadSavedQuestions,
  saveSavedQuestions,
  loadAnsweredQuestions,
  saveAnsweredQuestions
} from '../utils/storage';
import { canSyncToCloud } from './entitlementService';

/**
 * SECURITY NOTE:
 * - All sync operations require authentication
 * - Firestore security rules ensure users can only access their own data
 * - Local data is always preferred for offline-first experience
 */

/**
 * Merge strategy for stats
 * Takes the higher value for each metric
 */
const mergeStats = (local, cloud) => {
  if (!cloud) return local;
  if (!local) return cloud;

  return {
    total: Math.max(local.total || 0, cloud.total || 0),
    correct: Math.max(local.correct || 0, cloud.correct || 0),
    streak: Math.max(local.streak || 0, cloud.streak || 0),
    bestStreak: Math.max(local.bestStreak || 0, cloud.bestStreak || 0)
  };
};

/**
 * Merge strategy for quiz history
 * Combines both arrays and removes duplicates by timestamp
 */
const mergeQuizHistory = (local, cloud) => {
  if (!cloud || cloud.length === 0) return local;
  if (!local || local.length === 0) return cloud;

  // Create a map by timestamp to avoid duplicates
  const historyMap = new Map();

  [...local, ...cloud].forEach(entry => {
    const key = `${entry.timestamp}-${entry.type}-${entry.mode}`;
    if (!historyMap.has(key)) {
      historyMap.set(key, entry);
    }
  });

  return Array.from(historyMap.values()).sort((a, b) => b.timestamp - a.timestamp);
};

/**
 * Merge strategy for answered questions
 * Combines both sets, preferring higher progress
 */
const mergeAnsweredQuestions = (local, cloud) => {
  if (!cloud) return local;
  if (!local) return cloud;

  const merged = { ...cloud };

  Object.keys(local).forEach(type => {
    if (!merged[type]) {
      merged[type] = local[type];
    } else {
      // Merge the question ID sets
      merged[type] = [...new Set([...local[type], ...merged[type]])];
    }
  });

  return merged;
};

/**
 * Merge strategy for wrong answers
 * Combines both arrays, keeping unique questions by questionId
 * Prefers the entry with more attempts or most recent timestamp
 */
const mergeWrongAnswers = (local, cloud) => {
  if (!cloud || cloud.length === 0) return local;
  if (!local || local.length === 0) return cloud;

  const wrongMap = new Map();

  [...local, ...cloud].forEach(item => {
    const existingItem = wrongMap.get(item.questionId);

    if (!existingItem) {
      // New question, add it
      wrongMap.set(item.questionId, item);
    } else {
      // Question exists, merge attempts and keep most recent data
      const merged = {
        ...item,
        attempts: Math.max(existingItem.attempts || 1, item.attempts || 1),
        lastAttempt: item.lastAttempt > existingItem.lastAttempt ? item.lastAttempt : existingItem.lastAttempt
      };
      wrongMap.set(item.questionId, merged);
    }
  });

  return Array.from(wrongMap.values());
};

/**
 * Merge strategy for saved questions
 * Combines both arrays, keeping unique questions
 */
const mergeSavedQuestions = (local, cloud) => {
  if (!cloud || cloud.length === 0) return local;
  if (!local || local.length === 0) return cloud;

  return [...new Set([...local, ...cloud])];
};

/**
 * Upload all local data to Firestore
 * Called after login or when user explicitly requests sync
 * 
 * PREMIUM FULL ONLY: Cloud sync requires Premium Full subscription
 */
export const uploadLocalData = async (userId, userName = null) => {
  if (!userId) {
    console.error('Cannot upload: No user ID provided');
    return { success: false, error: 'No user ID' };
  }
  
  // Check Premium Full entitlement
  if (!canSyncToCloud()) {
    console.log('Cloud sync skipped: Premium Full required');
    return { success: true, skipped: true, reason: 'premium_required' };
  }

  try {
    const userDocRef = doc(db, 'users', userId);

    // Gather all local data
    const localData = {
      stats: loadStats(),
      quizHistory: loadQuizHistory(),
      wrongAnswers: loadWrongAnswers(),
      savedQuestions: loadSavedQuestions(),
      answeredQuestions: loadAnsweredQuestions(),
      lastSyncTimestamp: Date.now()
    };

    // Add userName if provided
    const savedName = localStorage.getItem('userName');
    if (userName) {
      localData.userName = userName;
    } else if (savedName) {
      localData.userName = savedName;
    }

    // Upload to Firestore
    await setDoc(userDocRef, localData, { merge: true });

    console.log('Local data uploaded to Firestore successfully');
    return { success: true };
  } catch (error) {
    console.error('Error uploading local data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Download data from Firestore and REPLACE local data
 * Cloud is the source of truth - local data is always replaced by cloud data
 * Called after login to sync data across devices
 * 
 * PREMIUM FULL ONLY: Cloud sync requires Premium Full subscription
 */
export const downloadAndMergeCloudData = async (userId) => {
  if (!userId) {
    console.error('Cannot download: No user ID provided');
    return { success: false, error: 'No user ID' };
  }
  
  // Check Premium Full entitlement
  if (!canSyncToCloud()) {
    console.log('Cloud sync skipped: Premium Full required');
    return { success: true, skipped: true, reason: 'premium_required' };
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // No cloud data yet - this is first time login, upload local data
      console.log('No cloud data found. Uploading local data...');
      return await uploadLocalData(userId);
    }

    const cloudData = userDoc.data();

    // IMPORTANT: Cloud data REPLACES local data (no merge)
    console.log('Replacing local data with cloud data...');

    // Replace all local data with cloud data
    if (cloudData.stats) saveStats(cloudData.stats);
    if (cloudData.quizHistory) saveQuizHistory(cloudData.quizHistory);
    if (cloudData.wrongAnswers) saveWrongAnswers(cloudData.wrongAnswers);
    if (cloudData.savedQuestions) saveSavedQuestions(cloudData.savedQuestions);
    if (cloudData.answeredQuestions) saveAnsweredQuestions(cloudData.answeredQuestions);

    // Restore userName from cloud
    if (cloudData.userName) {
      localStorage.setItem('userName', cloudData.userName);
      console.log('Restored userName from cloud:', cloudData.userName);
    } else {
      console.log('No userName in cloud data');
    }

    console.log('Cloud data downloaded successfully');
    console.log('Wrong answers count:', cloudData.wrongAnswers?.length || 0);

    return { success: true, userName: cloudData.userName };
  } catch (error) {
    console.error('Error downloading cloud data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sync specific data type to Firestore
 * Called after user actions (quiz completion, save question, etc.)
 * 
 * PREMIUM FULL ONLY: Cloud sync requires Premium Full subscription
 */
export const syncDataToCloud = async (userId, dataType, data) => {
  if (!userId) {
    // User not logged in - skip sync
    return { success: true, skipped: true };
  }
  
  // Check Premium Full entitlement
  if (!canSyncToCloud()) {
    console.log('Cloud sync skipped: Premium Full required');
    return { success: true, skipped: true, reason: 'premium_required' };
  }

  try {
    const userDocRef = doc(db, 'users', userId);

    await updateDoc(userDocRef, {
      [dataType]: data,
      lastSyncTimestamp: Date.now()
    });

    console.log(`Synced ${dataType} to Firestore`);
    return { success: true };
  } catch (error) {
    // Document might not exist yet
    if (error.code === 'not-found') {
      return await uploadLocalData(userId);
    }

    console.error(`Error syncing ${dataType}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Auto-sync wrapper for storage operations
 * Use this to automatically sync data after local changes
 */
export const syncAfterUpdate = async (userId, updateFn, dataType) => {
  // Perform local update
  const result = updateFn();

  // Sync to cloud if user is logged in
  if (userId) {
    await syncDataToCloud(userId, dataType, result);
  }

  return result;
};
