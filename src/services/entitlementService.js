/**
 * Entitlement Service
 * 
 * Manages premium state and feature access for the app.
 * 
 * APPLE COMPLIANCE NOTES:
 * - Premium state is persisted locally after purchase verification
 * - No external payment methods referenced
 * - Restore purchases must always be available
 * 
 * PREMIUM TIERS:
 * - FREE: Limited access (30 questions/quiz, 3 quiz/day, 2 themes, 30 flashcards)
 * - PREMIUM_BASIC (1.99€): Unlimited flashcards, all themes, advanced stats
 * - PREMIUM_FULL (2.99€): Everything + Examen Blanc, Réviser erreurs, Cloud sync
 */

// Storage keys
const STORAGE_KEYS = {
  PREMIUM_STATUS: 'premium_status',
  PREMIUM_SIGNATURE: 'premium_sig',
  PREMIUM_DATA: 'premium_data', // Stores full purchase info
  DAILY_QUIZ_COUNT: 'daily_quiz_count',
  DAILY_QUIZ_DATE: 'daily_quiz_date',
};

// Simple obfuscation salt (not for crypto security, just to deter casual tampering)
const SALT = 'ec_2024_premium_';

// Static signature version - NO time-based expiration for non-consumable purchases
// This ensures users don't lose premium access just because time has passed
const SIGNATURE_VERSION = 'v2_static';

// Flag to track if entitlements have been verified this session
let entitlementsVerified = false;

// Premium tiers
export const PREMIUM_TIERS = {
  FREE: 'free',
  BASIC: 'premium_basic',
  FULL: 'premium_full',
};

// Product IDs for Apple IAP (must match App Store Connect)
export const PRODUCT_IDS = {
  PREMIUM_BASIC: 'com.linh.examenCivique.premium.basic',
  PREMIUM_FULL: 'com.linh.examenCivique.premium.full',
};

// Free tier limits
export const FREE_LIMITS = {
  MAX_QUESTIONS_PER_QUIZ: 30,
  MAX_QUIZ_PER_DAY: 3,
  MAX_FLASHCARDS: 30,
  UNLOCKED_THEMES: [
    'Vivre dans la société française',
    'Droits et devoirs',
  ],
};

/**
 * Generate a static signature for premium status
 * 
 * IMPORTANT (Non-Consumable IAP Compliance):
 * - NO time-based expiration - purchases are permanent
 * - Signature is static and does NOT rotate daily
 * - This is NOT for security - just to deter casual localStorage tampering
 * - Apple Store verification via Restore Purchases is the real authority
 * 
 * @param {string} status - Premium tier
 * @returns {string} Signature
 */
const generateSignature = (status) => {
  // Static signature - no timestamp rotation for non-consumable purchases
  const data = SALT + status + SIGNATURE_VERSION;
  // Simple hash using btoa and string manipulation
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return btoa(String(Math.abs(hash)));
};

/**
 * Verify premium status signature
 * 
 * For non-consumable purchases, we use a static signature that never expires.
 * The only way to revoke premium is via explicit Restore Purchases action.
 * 
 * @param {string} status - Premium tier
 * @param {string} signature - Stored signature
 * @returns {boolean} True if valid
 */
const verifySignature = (status, signature) => {
  if (!signature) return false;
  
  // Check against current static signature
  const expected = generateSignature(status);
  if (signature === expected) {
    return true;
  }
  
  // MIGRATION: Also accept old v1 signatures (daily-based) for existing users
  // This ensures users who purchased before this update don't lose access
  // They will get a new static signature on next setPremiumStatus call
  const legacyCheck = (() => {
    // Check last 7 days of old-format signatures for migration grace period
    for (let daysAgo = 0; daysAgo <= 7; daysAgo++) {
      const timestamp = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) - daysAgo;
      const legacyData = SALT + status + timestamp;
      let hash = 0;
      for (let i = 0; i < legacyData.length; i++) {
        const char = legacyData.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      if (signature === btoa(String(Math.abs(hash)))) {
        console.log('[Entitlement] Migrating legacy signature to static format');
        return true;
      }
    }
    return false;
  })();
  
  return legacyCheck;
};

/**
 * Get current premium status from storage
 * Includes integrity check to detect tampering
 * 
 * IMPORTANT: For non-consumable IAP, we do NOT auto-revoke premium
 * even if signature verification fails. User must use Restore Purchases.
 * 
 * @returns {string} Premium tier (free, premium_basic, premium_full)
 */
export const getPremiumStatus = () => {
  try {
    const status = localStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS);
    const signature = localStorage.getItem(STORAGE_KEYS.PREMIUM_SIGNATURE);
    
    if (!status) {
      return PREMIUM_TIERS.FREE;
    }
    
    // Verify integrity for premium tiers
    if (status !== PREMIUM_TIERS.FREE) {
      const isValid = verifySignature(status, signature);
      
      if (isValid) {
        // Check if we need to migrate to new static signature format
        const currentStaticSig = generateSignature(status);
        if (signature !== currentStaticSig) {
          // Migrate legacy daily signature to static signature
          console.log('[Entitlement] Migrating to static signature format');
          localStorage.setItem(STORAGE_KEYS.PREMIUM_SIGNATURE, currentStaticSig);
        }
        return status;
      } else {
        // Signature invalid - but for non-consumable, we log warning only
        // We do NOT auto-revoke. User must explicitly Restore Purchases.
        console.warn('[Entitlement] Signature mismatch - user should restore purchases');
        // Still return the status - let user keep access until they restore
        // This is safer than locking them out of paid features
        return status;
      }
    }
    
    return status;
  } catch (error) {
    console.error('Error reading premium status:', error);
    return PREMIUM_TIERS.FREE;
  }
};

/**
 * Set premium status (called after successful purchase or restore)
 * Stores full purchase data, not just a boolean
 * @param {string} tier - Premium tier to set
 * @param {object} purchaseData - Optional purchase metadata
 */
export const setPremiumStatus = (tier, purchaseData = null) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, tier);
    
    // Generate and store signature for non-free tiers
    if (tier !== PREMIUM_TIERS.FREE) {
      const signature = generateSignature(tier);
      localStorage.setItem(STORAGE_KEYS.PREMIUM_SIGNATURE, signature);
      
      // Store full purchase data (more than just boolean)
      const data = {
        tier,
        purchaseDate: purchaseData?.purchaseDate || Date.now(),
        transactionId: purchaseData?.transactionId || null,
        productId: purchaseData?.productId || null,
        platform: purchaseData?.platform || 'unknown',
        verifiedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEYS.PREMIUM_DATA, JSON.stringify(data));
    } else {
      localStorage.removeItem(STORAGE_KEYS.PREMIUM_SIGNATURE);
      localStorage.removeItem(STORAGE_KEYS.PREMIUM_DATA);
    }
    
    // Mark as verified for this session
    entitlementsVerified = true;
  } catch (error) {
    console.error('Error saving premium status:', error);
  }
};

/**
 * Get stored purchase data
 * @returns {object|null} Purchase data or null
 */
export const getPurchaseData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PREMIUM_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Check if entitlements need to be verified with store
 * Called on app startup to re-validate purchases
 * @returns {boolean} True if verification needed
 */
export const needsEntitlementVerification = () => {
  if (entitlementsVerified) return false;
  
  const status = localStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS);
  if (!status || status === PREMIUM_TIERS.FREE) {
    entitlementsVerified = true;
    return false;
  }
  
  // Has premium status - needs verification with store
  return true;
};

/**
 * Mark entitlements as verified for this session
 */
export const markEntitlementsVerified = () => {
  entitlementsVerified = true;
};

/**
 * Clear all premium data (for testing or when purchase is invalid)
 */
export const clearPremiumStatus = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.PREMIUM_STATUS);
    localStorage.removeItem(STORAGE_KEYS.PREMIUM_SIGNATURE);
    localStorage.removeItem(STORAGE_KEYS.PREMIUM_DATA);
    entitlementsVerified = false;
  } catch (error) {
    console.error('Error clearing premium status:', error);
  }
};

/**
 * Check if user has Premium Basic or higher
 * @returns {boolean}
 */
export const isPremiumBasic = () => {
  const status = getPremiumStatus();
  return status === PREMIUM_TIERS.BASIC || status === PREMIUM_TIERS.FULL;
};

/**
 * Check if user has Premium Full
 * @returns {boolean}
 */
export const isPremiumFull = () => {
  const status = getPremiumStatus();
  return status === PREMIUM_TIERS.FULL;
};

/**
 * Check if user is on free tier
 * @returns {boolean}
 */
export const isFreeUser = () => {
  return getPremiumStatus() === PREMIUM_TIERS.FREE;
};

// ============================================
// FEATURE ACCESS HELPERS
// ============================================

/**
 * Check if user can access unlimited flashcards
 * Free users limited to 30 cards
 * @param {number} currentCardIndex - Current card index (0-based)
 * @returns {boolean}
 */
export const canAccessFlashcard = (currentCardIndex) => {
  if (isPremiumBasic()) return true;
  return currentCardIndex < FREE_LIMITS.MAX_FLASHCARDS;
};

/**
 * Check if user can access a specific theme
 * Free users only get 2 themes
 * @param {string} themeName - Theme name to check
 * @returns {boolean}
 */
export const canAccessTheme = (themeName) => {
  if (isPremiumBasic()) return true;
  return FREE_LIMITS.UNLOCKED_THEMES.includes(themeName);
};

/**
 * Check if user can start Examen Blanc
 * Only Premium Full users
 * @returns {boolean}
 */
export const canAccessExamenBlanc = () => {
  return isPremiumFull();
};

/**
 * Check if user can access Réviser les erreurs
 * Only Premium Full users
 * @returns {boolean}
 */
export const canAccessRevisionErreurs = () => {
  return isPremiumFull();
};

/**
 * Check if user can sync to cloud
 * Only Premium Full users
 * @returns {boolean}
 */
export const canSyncToCloud = () => {
  return isPremiumFull();
};

/**
 * Check if user can access advanced statistics
 * Premium Basic and above
 * @returns {boolean}
 */
export const canAccessAdvancedStats = () => {
  return isPremiumBasic();
};

/**
 * Get maximum questions allowed per quiz for current user
 * @returns {number}
 */
export const getMaxQuestionsPerQuiz = () => {
  if (isPremiumBasic()) return 40; // Full quiz
  return FREE_LIMITS.MAX_QUESTIONS_PER_QUIZ;
};

// ============================================
// DAILY QUIZ LIMIT (FREE USERS)
// ============================================

/**
 * Get today's date string (YYYY-MM-DD)
 */
const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get number of quizzes taken today
 * @returns {number}
 */
export const getDailyQuizCount = () => {
  try {
    const savedDate = localStorage.getItem(STORAGE_KEYS.DAILY_QUIZ_DATE);
    const today = getTodayString();
    
    // Reset count if it's a new day
    if (savedDate !== today) {
      localStorage.setItem(STORAGE_KEYS.DAILY_QUIZ_DATE, today);
      localStorage.setItem(STORAGE_KEYS.DAILY_QUIZ_COUNT, '0');
      return 0;
    }
    
    return parseInt(localStorage.getItem(STORAGE_KEYS.DAILY_QUIZ_COUNT) || '0', 10);
  } catch (error) {
    return 0;
  }
};

/**
 * Increment daily quiz count
 */
export const incrementDailyQuizCount = () => {
  try {
    const today = getTodayString();
    localStorage.setItem(STORAGE_KEYS.DAILY_QUIZ_DATE, today);
    const current = getDailyQuizCount();
    localStorage.setItem(STORAGE_KEYS.DAILY_QUIZ_COUNT, String(current + 1));
  } catch (error) {
    console.error('Error incrementing daily quiz count:', error);
  }
};

/**
 * Check if user can start another quiz today
 * @returns {boolean}
 */
export const canStartQuiz = () => {
  if (isPremiumBasic()) return true;
  return getDailyQuizCount() < FREE_LIMITS.MAX_QUIZ_PER_DAY;
};

/**
 * Get remaining quizzes for today (free users)
 * @returns {number}
 */
export const getRemainingQuizzesToday = () => {
  if (isPremiumBasic()) return Infinity;
  return Math.max(0, FREE_LIMITS.MAX_QUIZ_PER_DAY - getDailyQuizCount());
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get user-friendly tier name
 * @param {string} tier - Premium tier
 * @returns {string}
 */
export const getTierDisplayName = (tier) => {
  switch (tier) {
    case PREMIUM_TIERS.BASIC:
      return 'Premium Basic';
    case PREMIUM_TIERS.FULL:
      return 'Premium Full';
    default:
      return 'Gratuit';
  }
};

/**
 * Get list of locked features for current tier
 * @returns {string[]}
 */
export const getLockedFeatures = () => {
  const status = getPremiumStatus();
  
  if (status === PREMIUM_TIERS.FULL) {
    return []; // Nothing locked
  }
  
  if (status === PREMIUM_TIERS.BASIC) {
    return [
      'Examen Blanc',
      'Réviser les erreurs',
      'Synchronisation cloud',
    ];
  }
  
  // Free user
  return [
    'Flashcards illimitées',
    'Tous les thèmes',
    'Statistiques avancées',
    'Examen Blanc',
    'Réviser les erreurs',
    'Synchronisation cloud',
  ];
};

