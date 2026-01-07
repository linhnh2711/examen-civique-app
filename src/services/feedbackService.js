// Feedback Service
// Handles feedback submission to Firestore

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Submit user feedback to Firestore
 * @param {Object} feedbackData - Feedback data including type, rating, message, email, etc.
 * @returns {Object} Result with success status
 */
export const submitFeedback = async (feedbackData) => {
  try {
    // Add feedback to Firestore 'feedback' collection
    const feedbackRef = collection(db, 'feedback');

    const feedbackDoc = {
      type: feedbackData.type || 'suggestion',
      rating: feedbackData.rating || 0,
      message: feedbackData.message,
      email: feedbackData.email,
      userName: feedbackData.userName || 'Anonyme',
      userId: feedbackData.userId || null,
      userAgent: feedbackData.userAgent || '',
      platform: feedbackData.platform || '',
      status: 'new', // new, reviewed, resolved
      createdAt: serverTimestamp(),
      submittedAt: feedbackData.timestamp
    };

    const docRef = await addDoc(feedbackRef, feedbackDoc);

    console.log('Feedback submitted successfully with ID:', docRef.id);
    return { success: true, feedbackId: docRef.id };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get feedback statistics (optional - for admin dashboard in the future)
 */
export const getFeedbackStats = async () => {
  // TODO: Implement if needed for admin dashboard
  // This would query feedback collection and return stats
  return { success: false, error: 'Not implemented yet' };
};
