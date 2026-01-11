/**
 * Purchase Service
 * 
 * Handles In-App Purchase logic for iOS and provides stubs for PWA.
 * 
 * APPLE COMPLIANCE NOTES:
 * - Uses native Apple StoreKit via Capacitor plugin
 * - No external payment methods
 * - Restore purchases always available
 * - Prices fetched from Apple (not hardcoded)
 * 
 * For PWA/Web:
 * - All purchase functions return mock responses
 * - Premium flags stay false (no purchases possible outside App Store)
 * 
 * NOTE: The actual IAP implementation requires installing the cordova-plugin-purchase
 * and configuring it in Capacitor. For now, this provides stubs that work on web.
 */

import { 
  PRODUCT_IDS, 
  PREMIUM_TIERS, 
  setPremiumStatus, 
  needsEntitlementVerification,
  markEntitlementsVerified,
  clearPremiumStatus 
} from './entitlementService';

// Import CdvPurchase library - this makes window.CdvPurchase available
// Only import on native platforms to avoid bundling issues on web
if (typeof window !== 'undefined') {
  try {
    // Dynamic import for native platforms
    import('cordova-plugin-purchase/www/store.js').then(() => {
      console.log('[PurchaseService] CdvPurchase library loaded');
    }).catch((e) => {
      console.log('[PurchaseService] CdvPurchase library not loaded (expected on web):', e.message);
    });
  } catch (e) {
    console.log('[PurchaseService] CdvPurchase import error:', e);
  }
}

/**
 * TEST MODE SAFETY GUARD
 * 
 * IMPORTANT: TEST_MODE can only be active in development builds.
 * This prevents accidental premium unlocking in production if
 * REACT_APP_TEST_MODE is incorrectly set.
 * 
 * Conditions for TEST_MODE to be active:
 * 1. REACT_APP_TEST_MODE must be 'true' in environment
 * 2. NODE_ENV must NOT be 'production'
 * 
 * In production builds, TEST_MODE is ALWAYS false regardless of env vars.
 */
const TEST_MODE = (() => {
  const envTestMode = process.env.REACT_APP_TEST_MODE === 'true';
  const isProduction = process.env.NODE_ENV === 'production';
  
  // SAFETY: Never allow TEST_MODE in production builds
  if (isProduction && envTestMode) {
    console.warn('[PurchaseService] ⚠️ TEST_MODE blocked in production build');
    return false;
  }
  
  if (envTestMode) {
    console.log('[PurchaseService] 🧪 TEST_MODE active (development only)');
  }
  
  return envTestMode && !isProduction;
})();

// Dynamic check for iOS - called when needed, not at module load
const checkIsNativeIOS = () => {
  try {
    if (typeof window !== 'undefined' && window.Capacitor) {
      const platform = window.Capacitor.getPlatform();
      console.log('[PurchaseService] Platform detected:', platform);
      return platform === 'ios';
    }
  } catch (e) {
    console.log('[PurchaseService] Capacitor check failed:', e);
  }
  return false;
};

// Check for CdvPurchase availability
const checkCdvPurchase = () => {
  if (typeof window !== 'undefined' && window.CdvPurchase) {
    console.log('[PurchaseService] CdvPurchase available');
    return window.CdvPurchase;
  }
  console.log('[PurchaseService] CdvPurchase NOT available');
  return null;
};

// Store products cache
let productsCache = null;

// IAP store reference (set during initialization on iOS)
let iapStore = null;

/**
 * Initialize the purchase service
 * Must be called on app startup
 * 
 * IMPORTANT: This also verifies existing entitlements with the store
 */
export const initializePurchases = async () => {
  const isNativeIOS = checkIsNativeIOS();
  console.log('[PurchaseService] Init - isNativeIOS:', isNativeIOS, 'TEST_MODE:', TEST_MODE);
  
  if (!isNativeIOS) {
    console.log('[PurchaseService] Running on web/PWA - IAP disabled');
    
    // For web/test mode, just mark as verified
    if (TEST_MODE) {
      markEntitlementsVerified();
    }
    
    return { success: true, platform: 'web' };
  }

  try {
    // On iOS, the cordova-plugin-purchase exposes CdvPurchase globally
    // This avoids webpack trying to bundle a non-existent module
    const CdvPurchase = checkCdvPurchase();
    if (CdvPurchase) {
      iapStore = CdvPurchase.store;
      console.log('[PurchaseService] Store reference obtained:', !!iapStore);
      
      // Register products
      iapStore.register([
        {
          id: PRODUCT_IDS.PREMIUM_BASIC,
          type: CdvPurchase.ProductType.NON_CONSUMABLE,
          platform: CdvPurchase.Platform.APPLE_APPSTORE,
        },
        {
          id: PRODUCT_IDS.PREMIUM_FULL,
          type: CdvPurchase.ProductType.NON_CONSUMABLE,
          platform: CdvPurchase.Platform.APPLE_APPSTORE,
        },
      ]);
      console.log('[PurchaseService] Products registered');

      // Set up purchase handlers
      setupPurchaseHandlers();
      console.log('[PurchaseService] Purchase handlers set up');

      // Initialize and refresh
      await iapStore.initialize([CdvPurchase.Platform.APPLE_APPSTORE]);
      console.log('[PurchaseService] Store initialized');
      
      // Finish any pending transactions from previous sessions
      console.log('[PurchaseService] Checking for pending transactions...');
      const pendingTransactions = iapStore.localTransactions || [];
      for (const tx of pendingTransactions) {
        if (tx.state === 'approved' || tx.state === 'finished') {
          console.log('[PurchaseService] Finishing pending transaction:', tx.transactionId);
          try {
            tx.finish();
          } catch (e) {
            console.log('[PurchaseService] Could not finish transaction:', e);
          }
        }
      }
      
      // Wait for products to be loaded from App Store
      console.log('[PurchaseService] Refreshing products from App Store...');
      await iapStore.refresh();
      console.log('[PurchaseService] Products refreshed');
      
      // Log available products
      const basicProduct = iapStore.get(PRODUCT_IDS.PREMIUM_BASIC);
      const fullProduct = iapStore.get(PRODUCT_IDS.PREMIUM_FULL);
      console.log('[PurchaseService] Basic product:', basicProduct?.id, basicProduct?.title, basicProduct?.pricing?.price);
      console.log('[PurchaseService] Full product:', fullProduct?.id, fullProduct?.title, fullProduct?.pricing?.price);
      console.log('[PurchaseService] All products:', iapStore.products);
      
      // IMPORTANT: Verify entitlements with store on startup
      if (needsEntitlementVerification()) {
        console.log('[PurchaseService] Verifying entitlements with store...');
        await verifyEntitlementsWithStore();
      }

      console.log('[PurchaseService] Initialized successfully');
      return { success: true, platform: 'ios' };
    } else {
      console.log('[PurchaseService] CdvPurchase not available');
      return { success: false, error: 'IAP plugin not available' };
    }
  } catch (error) {
    console.error('[PurchaseService] Initialization failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Verify entitlements with the App Store
 * Called on app startup to ensure cached entitlements are still valid
 * 
 * IMPORTANT (App Store Compliance for Non-Consumable IAP):
 * - We DO NOT auto-clear premium if store doesn't show ownership
 * - Store sync can be slow, offline, or delayed
 * - Premium should ONLY be revoked via explicit "Restore Purchases" action
 * - This prevents users from losing access to paid features on cold start
 */
const verifyEntitlementsWithStore = async () => {
  if (!iapStore) {
    console.warn('[PurchaseService] Cannot verify - store not initialized');
    // Keep existing premium cache - user can restore manually if needed
    markEntitlementsVerified();
    return;
  }

  try {
    // Check for owned products in the store
    const basicProduct = iapStore.get(PRODUCT_IDS.PREMIUM_BASIC);
    const fullProduct = iapStore.get(PRODUCT_IDS.PREMIUM_FULL);

    // If store confirms ownership, update/refresh the local cache
    if (fullProduct && fullProduct.owned) {
      console.log('[PurchaseService] Verified: Premium Full owned');
      setPremiumStatus(PREMIUM_TIERS.FULL, {
        productId: PRODUCT_IDS.PREMIUM_FULL,
        platform: 'apple_appstore',
        verifiedWithStore: true,
      });
    } else if (basicProduct && basicProduct.owned) {
      console.log('[PurchaseService] Verified: Premium Basic owned');
      setPremiumStatus(PREMIUM_TIERS.BASIC, {
        productId: PRODUCT_IDS.PREMIUM_BASIC,
        platform: 'apple_appstore',
        verifiedWithStore: true,
      });
    } else {
      // NO LONGER AUTO-CLEARING PREMIUM HERE
      // For non-consumable purchases, we keep the local cache
      // User must explicitly tap "Restore Purchases" to re-verify
      // This prevents false downgrades due to slow/offline store sync
      console.log('[PurchaseService] Store does not show ownership - keeping local cache');
      console.log('[PurchaseService] User can restore manually if needed');
    }

    markEntitlementsVerified();
  } catch (error) {
    console.error('[PurchaseService] Verification failed:', error);
    // On error, keep cached status - user can restore manually
    markEntitlementsVerified();
  }
};

// Pending purchase resolvers - for Promise-based purchase flow
let pendingPurchaseResolve = null;
let pendingPurchaseReject = null;
let currentPurchaseProductId = null; // Track which product is being purchased
let purchaseErrorHandled = false; // Prevent multiple error handlers

/**
 * Set up purchase event handlers
 * CRITICAL: Premium is ONLY unlocked here in the approved callback
 */
const setupPurchaseHandlers = () => {
  if (!iapStore) return;

  console.log('[PurchaseService] Setting up purchase handlers...');

  // CRITICAL: This is the ONLY place where premium should be unlocked
  iapStore.when().approved((transaction) => {
    console.log('[PurchaseService] ✅ Transaction APPROVED:', transaction);
    
    const productId = transaction.products?.[0]?.id || transaction.productId;
    console.log('[PurchaseService] Approved product ID:', productId);
    
    // Extract purchase metadata
    const purchaseData = {
      transactionId: transaction.transactionId || transaction.id,
      productId: productId,
      purchaseDate: transaction.purchaseDate || Date.now(),
      platform: 'apple_appstore',
      receipt: transaction.receipt || null,
    };
    
    // UNLOCK PREMIUM - This is the ONLY place this should happen
    let unlockedTier = null;
    if (productId === PRODUCT_IDS.PREMIUM_BASIC) {
      console.log('[PurchaseService] ✅✅✅ UNLOCKING Premium Basic');
      setPremiumStatus(PREMIUM_TIERS.BASIC, purchaseData);
      unlockedTier = PREMIUM_TIERS.BASIC;
    } else if (productId === PRODUCT_IDS.PREMIUM_FULL) {
      console.log('[PurchaseService] ✅✅✅ UNLOCKING Premium Full');
      setPremiumStatus(PREMIUM_TIERS.FULL, purchaseData);
      unlockedTier = PREMIUM_TIERS.FULL;
    }
    
    // Finish the transaction
    transaction.finish();
    console.log('[PurchaseService] Transaction finished');
    
    // Resolve pending purchase promise
    if (pendingPurchaseResolve && unlockedTier) {
      pendingPurchaseResolve({ success: true, tier: unlockedTier });
      pendingPurchaseResolve = null;
      pendingPurchaseReject = null;
      currentPurchaseProductId = null;
    }
  });

  // Listen for finished transactions
  iapStore.when().finished((transaction) => {
    console.log('[PurchaseService] Transaction FINISHED:', transaction);
  });

  // DO NOT unlock premium in productUpdated - only log for debugging
  iapStore.when().productUpdated((product) => {
    console.log('[PurchaseService] Product UPDATED:', product.id, 'owned:', product.owned);
    // NOTE: We do NOT set premium here - only in approved callback
  });

  // Listen for verified transactions
  iapStore.when().verified((receipt) => {
    console.log('[PurchaseService] Receipt verified:', receipt.id);
  });
  
  // Listen for unverified
  iapStore.when().unverified((unverified) => {
    console.log('[PurchaseService] Transaction UNVERIFIED:', unverified);
  });

  // Handle errors - including user cancellation and purchase failures
  iapStore.error((error) => {
    console.error('[PurchaseService] Store error:', error);
    
    // If no pending purchase or already handled, ignore
    if (!pendingPurchaseResolve || purchaseErrorHandled) {
      console.log('[PurchaseService] No pending purchase or already handled - ignoring');
      return;
    }
    
    // Mark as handled to prevent multiple resolutions
    purchaseErrorHandled = true;
    
    const resolvePurchase = (result) => {
      if (pendingPurchaseResolve) {
        console.log('[PurchaseService] Resolving purchase with:', result);
        pendingPurchaseResolve(result);
        pendingPurchaseResolve = null;
        pendingPurchaseReject = null;
        currentPurchaseProductId = null;
      }
    };
    
    // Check for cancellation first (6777006 or message contains 'cancel')
    if (error.code === 6777006 || error.message?.toLowerCase().includes('cancel')) {
      console.log('[PurchaseService] User cancelled the purchase');
      resolvePurchase({ success: false, cancelled: true });
    } else {
      // Any other error
      console.log('[PurchaseService] Purchase error:', error.code, error.message);
      resolvePurchase({ 
        success: false, 
        error: 'Échec de l\'achat. Veuillez réessayer.' 
      });
    }
  });
};

/**
 * Get available products with prices from Apple
 * @returns {Promise<{basic: object|null, full: object|null}>}
 */
export const getProducts = async () => {
  // Return cached products if available
  if (productsCache) {
    return productsCache;
  }

  // PWA/Web stub - return mock prices
  // NOTE: On iOS, these will be replaced with real prices from App Store
  if (!checkIsNativeIOS() || !iapStore) {
    productsCache = {
      basic: {
        id: PRODUCT_IDS.PREMIUM_BASIC,
        title: 'Premium Basic',
        description: 'Flashcards illimitées, tous les thèmes',
        price: '1,99 €',
        priceValue: 1.99,
        currency: 'EUR',
      },
      full: {
        id: PRODUCT_IDS.PREMIUM_FULL,
        title: 'Premium Full',
        description: 'Tout inclus + Examen Blanc + Sync',
        price: '2,99 €',
        priceValue: 2.99,
        currency: 'EUR',
      },
    };
    return productsCache;
  }

  try {
    const basicProduct = iapStore.get(PRODUCT_IDS.PREMIUM_BASIC);
    const fullProduct = iapStore.get(PRODUCT_IDS.PREMIUM_FULL);

    productsCache = {
      basic: basicProduct ? {
        id: basicProduct.id,
        title: basicProduct.title,
        description: basicProduct.description,
        price: basicProduct.pricing?.price || '1,99 €',
        priceValue: basicProduct.pricing?.priceMicros ? basicProduct.pricing.priceMicros / 1000000 : 1.99,
        currency: basicProduct.pricing?.currency || 'EUR',
      } : null,
      full: fullProduct ? {
        id: fullProduct.id,
        title: fullProduct.title,
        description: fullProduct.description,
        price: fullProduct.pricing?.price || '2,99 €',
        priceValue: fullProduct.pricing?.priceMicros ? fullProduct.pricing.priceMicros / 1000000 : 2.99,
        currency: fullProduct.pricing?.currency || 'EUR',
      } : null,
    };

    return productsCache;
  } catch (error) {
    console.error('[PurchaseService] Failed to get products:', error);
    return { basic: null, full: null };
  }
};

/**
 * Purchase Premium Basic
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const purchasePremiumBasic = async () => {
  const isNative = checkIsNativeIOS();
  console.log('[PurchaseService] purchasePremiumBasic - isNative:', isNative, 'iapStore:', !!iapStore);
  
  // TEST MODE: Simulate successful purchase
  if (TEST_MODE && !isNative) {
    console.log('[PurchaseService] TEST MODE: Simulating Premium Basic purchase');
    setPremiumStatus(PREMIUM_TIERS.BASIC, {
      transactionId: `test_${Date.now()}`,
      productId: PRODUCT_IDS.PREMIUM_BASIC,
      purchaseDate: Date.now(),
      platform: 'test_mode',
    });
    return { success: true, testMode: true };
  }
  
  // PWA stub - cannot purchase outside App Store
  if (!isNative || !iapStore) {
    console.log('[PurchaseService] Purchase not available - isNative:', isNative, 'iapStore:', !!iapStore);
    return { 
      success: false, 
      error: 'Les achats ne sont disponibles que dans l\'application iOS' 
    };
  }

  try {
    const product = iapStore.get(PRODUCT_IDS.PREMIUM_BASIC);
    console.log('[PurchaseService] Product Basic found:', product);
    
    if (!product) {
      console.log('[PurchaseService] Product not found. Available products:', iapStore.products);
      return { success: false, error: 'Produit non trouvé' };
    }

    // Get the offer
    const offer = product.getOffer();
    console.log('[PurchaseService] Offer:', offer);
    
    const orderTarget = offer || product;
    console.log('[PurchaseService] Ordering:', orderTarget);
    
    // Track which product we're purchasing and reset error flag
    currentPurchaseProductId = PRODUCT_IDS.PREMIUM_BASIC;
    purchaseErrorHandled = false;
    
    // Create a promise that will be resolved by the approved callback or error handler
    const purchasePromise = new Promise((resolve, reject) => {
      pendingPurchaseResolve = resolve;
      pendingPurchaseReject = reject;
      
      // Timeout after 60 seconds (user might be slow)
      setTimeout(() => {
        if (pendingPurchaseResolve) {
          console.log('[PurchaseService] Purchase timeout - user cancelled or slow');
          resolve({ success: false, cancelled: true });
          pendingPurchaseResolve = null;
          pendingPurchaseReject = null;
          currentPurchaseProductId = null;
        }
      }, 60000);
    });
    
    // Initiate the order (does NOT unlock premium)
    try {
      await iapStore.order(orderTarget);
      console.log('[PurchaseService] Order initiated - waiting for Apple callback...');
    } catch (orderError) {
      console.error('[PurchaseService] Order threw error:', orderError);
      // Order failed immediately - resolve promise
      if (pendingPurchaseResolve) {
        pendingPurchaseResolve({ success: false, error: 'Échec de la commande' });
        pendingPurchaseResolve = null;
        pendingPurchaseReject = null;
        currentPurchaseProductId = null;
      }
    }
    
    // Wait for the approved callback to resolve the promise
    const result = await purchasePromise;
    console.log('[PurchaseService] Purchase result:', result);
    return result;
    
  } catch (error) {
    console.error('[PurchaseService] Purchase failed:', error);
    pendingPurchaseResolve = null;
    pendingPurchaseReject = null;
    currentPurchaseProductId = null;
    return { success: false, error: error.message || 'Échec de l\'achat' };
  }
};

/**
 * Purchase Premium Full
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const purchasePremiumFull = async () => {
  const isNative = checkIsNativeIOS();
  console.log('[PurchaseService] purchasePremiumFull - isNative:', isNative, 'iapStore:', !!iapStore);
  
  // TEST MODE: Simulate successful purchase
  if (TEST_MODE && !isNative) {
    console.log('[PurchaseService] TEST MODE: Simulating Premium Full purchase');
    setPremiumStatus(PREMIUM_TIERS.FULL, {
      transactionId: `test_${Date.now()}`,
      productId: PRODUCT_IDS.PREMIUM_FULL,
      purchaseDate: Date.now(),
      platform: 'test_mode',
    });
    return { success: true, testMode: true };
  }
  
  // PWA stub - cannot purchase outside App Store
  if (!isNative || !iapStore) {
    console.log('[PurchaseService] Purchase not available - isNative:', isNative, 'iapStore:', !!iapStore);
    return { 
      success: false, 
      error: 'Les achats ne sont disponibles que dans l\'application iOS' 
    };
  }

  try {
    const product = iapStore.get(PRODUCT_IDS.PREMIUM_FULL);
    console.log('[PurchaseService] Product Full found:', product);
    
    if (!product) {
      console.log('[PurchaseService] Product not found. Available products:', iapStore.products);
      return { success: false, error: 'Produit non trouvé' };
    }

    // Get the offer
    const offer = product.getOffer();
    console.log('[PurchaseService] Offer:', offer);
    
    const orderTarget = offer || product;
    console.log('[PurchaseService] Ordering:', orderTarget);
    
    // Track which product we're purchasing and reset error flag
    currentPurchaseProductId = PRODUCT_IDS.PREMIUM_FULL;
    purchaseErrorHandled = false;
    
    // Create a promise that will be resolved by the approved callback or error handler
    const purchasePromise = new Promise((resolve, reject) => {
      pendingPurchaseResolve = resolve;
      pendingPurchaseReject = reject;
      
      // Timeout after 60 seconds
      setTimeout(() => {
        if (pendingPurchaseResolve) {
          console.log('[PurchaseService] Purchase timeout - user cancelled or slow');
          resolve({ success: false, cancelled: true });
          pendingPurchaseResolve = null;
          pendingPurchaseReject = null;
          currentPurchaseProductId = null;
        }
      }, 60000);
    });
    
    // Initiate the order (does NOT unlock premium)
    try {
      await iapStore.order(orderTarget);
      console.log('[PurchaseService] Order initiated - waiting for Apple callback...');
    } catch (orderError) {
      console.error('[PurchaseService] Order threw error:', orderError);
      // Order failed immediately - resolve promise
      if (pendingPurchaseResolve) {
        pendingPurchaseResolve({ success: false, error: 'Échec de la commande' });
        pendingPurchaseResolve = null;
        pendingPurchaseReject = null;
        currentPurchaseProductId = null;
      }
    }
    
    // Wait for the approved callback to resolve the promise
    const result = await purchasePromise;
    console.log('[PurchaseService] Purchase result:', result);
    return result;
    
  } catch (error) {
    console.error('[PurchaseService] Purchase failed:', error);
    pendingPurchaseResolve = null;
    pendingPurchaseReject = null;
    currentPurchaseProductId = null;
    return { success: false, error: error.message || 'Échec de l\'achat' };
  }
};

/**
 * Restore previous purchases
 * APPLE COMPLIANCE: Must always be available to users
 * 
 * IMPORTANT: This is the ONLY place where premium can be revoked.
 * If Apple explicitly confirms no purchases exist after restore,
 * we clear the local premium cache.
 * 
 * @returns {Promise<{success: boolean, restored: string[], error?: string}>}
 */
export const restorePurchases = async () => {
  const isNative = checkIsNativeIOS();
  
  // PWA stub
  if (!isNative || !iapStore) {
    console.log('[PurchaseService] Restore not available - isNative:', isNative, 'iapStore:', !!iapStore);
    return { 
      success: false, 
      restored: [],
      error: 'La restauration n\'est disponible que dans l\'application iOS' 
    };
  }

  try {
    await iapStore.restorePurchases();
    
    // Check for owned products after restore
    const restored = [];
    const basicProduct = iapStore.get(PRODUCT_IDS.PREMIUM_BASIC);
    const fullProduct = iapStore.get(PRODUCT_IDS.PREMIUM_FULL);

    if (fullProduct && fullProduct.owned) {
      setPremiumStatus(PREMIUM_TIERS.FULL, {
        productId: PRODUCT_IDS.PREMIUM_FULL,
        platform: 'apple_appstore',
        restoredAt: Date.now(),
      });
      restored.push('Premium Full');
    } else if (basicProduct && basicProduct.owned) {
      setPremiumStatus(PREMIUM_TIERS.BASIC, {
        productId: PRODUCT_IDS.PREMIUM_BASIC,
        platform: 'apple_appstore',
        restoredAt: Date.now(),
      });
      restored.push('Premium Basic');
    } else {
      // THIS IS THE ONLY PLACE WHERE PREMIUM CAN BE REVOKED
      // User explicitly tapped Restore, and Apple confirmed no purchases
      console.log('[PurchaseService] Restore complete - Apple confirms no purchases');
      clearPremiumStatus();
    }

    return { 
      success: true, 
      restored,
      message: restored.length > 0 
        ? `Achats restaurés: ${restored.join(', ')}` 
        : 'Aucun achat à restaurer'
    };
  } catch (error) {
    console.error('[PurchaseService] Restore failed:', error);
    // On error, do NOT clear premium - keep existing cache
    return { success: false, restored: [], error: error.message };
  }
};

/**
 * Check if purchases are available (iOS only, or TEST_MODE)
 * @returns {boolean}
 */
export const isPurchaseAvailable = () => {
  // In test mode, allow purchases for testing
  if (TEST_MODE) return true;
  return checkIsNativeIOS();
};

/**
 * Get platform name
 * @returns {string}
 */
export const getPlatform = () => {
  try {
    if (typeof window !== 'undefined' && window.Capacitor) {
      return window.Capacitor.getPlatform();
    }
  } catch (e) {
    // Ignore
  }
  return 'web';
};
