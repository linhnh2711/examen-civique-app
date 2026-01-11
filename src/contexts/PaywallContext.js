/**
 * Paywall Context
 * 
 * Provides global access to paywall state and functions.
 * Makes it easy to show paywall from any component.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PaywallModal from '../components/PaywallModal';
import { initializePurchases } from '../services/purchaseService';
import { 
  getPremiumStatus, 
  isPremiumBasic, 
  isPremiumFull,
  isFreeUser,
  canAccessFlashcard,
  canAccessTheme,
  canAccessExamenBlanc,
  canAccessRevisionErreurs,
  canSyncToCloud,
  canStartQuiz,
  getRemainingQuizzesToday,
  getMaxQuestionsPerQuiz,
  incrementDailyQuizCount,
  FREE_LIMITS,
} from '../services/entitlementService';

const PaywallContext = createContext(null);

export const usePaywall = () => {
  const context = useContext(PaywallContext);
  if (!context) {
    throw new Error('usePaywall must be used within a PaywallProvider');
  }
  return context;
};

export const PaywallProvider = ({ children }) => {
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [triggerFeature, setTriggerFeature] = useState(null);
  const [recommendedTier, setRecommendedTier] = useState(null);
  const [premiumStatus, setPremiumStatusState] = useState(getPremiumStatus());

  // Initialize purchases on mount - wait for Capacitor to be ready
  useEffect(() => {
    const initPurchases = async () => {
      // Wait a bit for native plugins to load
      console.log('[PaywallContext] Waiting for plugins to load...');
      
      // Check if running in Capacitor
      if (window.Capacitor && window.Capacitor.isNativePlatform()) {
        console.log('[PaywallContext] Native platform detected, waiting for CdvPurchase...');
        
        // Wait up to 5 seconds for CdvPurchase to be available
        let attempts = 0;
        while (!window.CdvPurchase && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        if (window.CdvPurchase) {
          console.log('[PaywallContext] CdvPurchase loaded after', attempts * 100, 'ms');
        } else {
          console.warn('[PaywallContext] CdvPurchase not available after 5s');
        }
      }
      
      const result = await initializePurchases();
      console.log('[PaywallContext] Purchase service initialized:', result);
    };
    
    initPurchases();
  }, []);

  // Refresh premium status
  const refreshPremiumStatus = useCallback(() => {
    setPremiumStatusState(getPremiumStatus());
  }, []);

  /**
   * Show paywall with optional feature trigger
   * @param {string} feature - Feature that triggered the paywall
   * @param {string} tier - Recommended tier ('basic' | 'full')
   */
  const showPaywall = useCallback((feature = null, tier = null) => {
    setTriggerFeature(feature);
    setRecommendedTier(tier);
    setIsPaywallOpen(true);
  }, []);

  /**
   * Hide paywall
   */
  const hidePaywall = useCallback(() => {
    setIsPaywallOpen(false);
    setTriggerFeature(null);
    setRecommendedTier(null);
  }, []);

  /**
   * Handle successful purchase
   */
  const handlePurchaseSuccess = useCallback((tier) => {
    setPremiumStatusState(tier);
    hidePaywall();
  }, [hidePaywall]);

  // ============================================
  // FEATURE GATE FUNCTIONS
  // These check access and show paywall if needed
  // ============================================

  /**
   * Check if user can access Examen Blanc, show paywall if not
   * @returns {boolean} True if can access
   */
  const checkExamenBlancAccess = useCallback(() => {
    if (canAccessExamenBlanc()) {
      return true;
    }
    showPaywall('examen_blanc', 'full');
    return false;
  }, [showPaywall]);

  /**
   * Check if user can access Réviser les erreurs, show paywall if not
   * @returns {boolean} True if can access
   */
  const checkRevisionErreursAccess = useCallback(() => {
    if (canAccessRevisionErreurs()) {
      return true;
    }
    showPaywall('revision_erreurs', 'full');
    return false;
  }, [showPaywall]);

  /**
   * Check if user can access a theme, show paywall if not
   * @param {string} themeName - Theme name
   * @returns {boolean} True if can access
   */
  const checkThemeAccess = useCallback((themeName) => {
    if (canAccessTheme(themeName)) {
      return true;
    }
    showPaywall('theme', 'basic');
    return false;
  }, [showPaywall]);

  /**
   * Check if user can access a flashcard at given index, show paywall if not
   * @param {number} cardIndex - Card index (0-based)
   * @returns {boolean} True if can access
   */
  const checkFlashcardAccess = useCallback((cardIndex) => {
    if (canAccessFlashcard(cardIndex)) {
      return true;
    }
    showPaywall('flashcards', 'basic');
    return false;
  }, [showPaywall]);

  /**
   * Check if user can start a quiz, show paywall if not
   * @returns {boolean} True if can start
   */
  const checkQuizAccess = useCallback(() => {
    if (canStartQuiz()) {
      return true;
    }
    showPaywall('quiz_limit', 'basic');
    return false;
  }, [showPaywall]);

  /**
   * Check if user can sync to cloud, show paywall if not
   * @returns {boolean} True if can sync
   */
  const checkSyncAccess = useCallback(() => {
    if (canSyncToCloud()) {
      return true;
    }
    showPaywall('sync', 'full');
    return false;
  }, [showPaywall]);

  const value = {
    // State
    premiumStatus,
    isPaywallOpen,
    
    // Status checks (no paywall trigger)
    isPremiumBasic: isPremiumBasic(),
    isPremiumFull: isPremiumFull(),
    isFreeUser: isFreeUser(),
    
    // Limits
    maxQuestionsPerQuiz: getMaxQuestionsPerQuiz(),
    remainingQuizzesToday: getRemainingQuizzesToday(),
    maxFlashcards: FREE_LIMITS.MAX_FLASHCARDS,
    unlockedThemes: FREE_LIMITS.UNLOCKED_THEMES,
    
    // Functions
    showPaywall,
    hidePaywall,
    refreshPremiumStatus,
    incrementDailyQuizCount,
    
    // Feature gate functions (check + show paywall)
    checkExamenBlancAccess,
    checkRevisionErreursAccess,
    checkThemeAccess,
    checkFlashcardAccess,
    checkQuizAccess,
    checkSyncAccess,
    
    // Raw access checks (no paywall trigger)
    canAccessFlashcard,
    canAccessTheme,
    canAccessExamenBlanc,
    canAccessRevisionErreurs,
    canSyncToCloud,
    canStartQuiz,
  };

  return (
    <PaywallContext.Provider value={value}>
      {children}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={hidePaywall}
        onPurchaseSuccess={handlePurchaseSuccess}
        triggerFeature={triggerFeature}
        recommendedTier={recommendedTier}
      />
    </PaywallContext.Provider>
  );
};

export default PaywallContext;

