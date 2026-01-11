/**
 * PaywallModal Component
 * 
 * Displays premium upgrade options when user hits a locked feature.
 * 
 * APPLE COMPLIANCE:
 * - Prices fetched from Apple IAP (not hardcoded in production)
 * - "Restaurer l'achat" always visible
 * - No external payment references
 * 
 * UX RULES:
 * - Only shown when user hits a locked feature
 * - Clear distinction between Basic and Full tiers
 * - Option to continue without premium
 */

import React, { useState, useEffect } from 'react';
import { X, Crown, Zap, Check, Loader2 } from 'lucide-react';
import { 
  getProducts, 
  purchasePremiumBasic, 
  purchasePremiumFull, 
  restorePurchases,
  isPurchaseAvailable 
} from '../services/purchaseService';
import { PREMIUM_TIERS, getPremiumStatus, isPremiumBasic } from '../services/entitlementService';

// Features included in each tier
const BASIC_FEATURES = [
  'Flashcards illimitées',
  'Tous les thèmes débloqués',
  'Statistiques avancées',
];

const FULL_FEATURES = [
  'Tout de Premium Basic',
  'Examen Blanc (40 questions)',
  'Réviser les erreurs',
  'Synchronisation multi-appareils',
];

const PaywallModal = ({ 
  isOpen, 
  onClose, 
  onPurchaseSuccess,
  triggerFeature = null, // Which feature triggered the paywall
  recommendedTier = null, // Which tier to highlight
}) => {
  const [products, setProducts] = useState({ basic: null, full: null });
  const [loading, setLoading] = useState(true);
  
  // Check if user already has Basic (needs to upgrade to Full)
  // Re-check every time modal opens
  const [userHasBasic, setUserHasBasic] = useState(false);
  const [purchasing, setPurchasing] = useState(null); // 'basic' | 'full' | 'restore'
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Reset state and load products when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset all state
      setSuccessMessage(null);
      setError(null);
      setPurchasing(null);
      // Check current premium status
      setUserHasBasic(isPremiumBasic());
      // Load products
      loadProducts();
    }
  }, [isOpen]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const productData = await getProducts();
      setProducts(productData);
    } catch (err) {
      setError('Impossible de charger les prix. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseBasic = async () => {
    setPurchasing('basic');
    setError(null);
    setSuccessMessage(null);
    
    try {
      // This now waits for the approved callback before returning
      const result = await purchasePremiumBasic();
      console.log('[PaywallModal] Purchase Basic result:', result);
      
      if (result.success) {
        // Purchase was approved by Apple - premium is now unlocked
        setSuccessMessage('Premium Basic activé !');
        setTimeout(() => {
          onPurchaseSuccess?.(result.tier || PREMIUM_TIERS.BASIC);
          onClose();
        }, 1000);
      } else if (result.testMode) {
        // Test mode - immediate success
        setSuccessMessage('Premium Basic activé !');
        setTimeout(() => {
          onPurchaseSuccess?.(PREMIUM_TIERS.BASIC);
          onClose();
        }, 1000);
      } else if (result.cancelled) {
        // User cancelled - just reset UI, no error message
        console.log('[PaywallModal] User cancelled purchase');
        setSuccessMessage(null);
        setError(null);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error('[PaywallModal] Purchase error:', err);
      setError('Une erreur est survenue');
    } finally {
      setPurchasing(null);
    }
  };

  const handlePurchaseFull = async () => {
    setPurchasing('full');
    setError(null);
    setSuccessMessage(null);
    
    try {
      // This now waits for the approved callback before returning
      const result = await purchasePremiumFull();
      console.log('[PaywallModal] Purchase Full result:', result);
      
      if (result.success) {
        // Purchase was approved by Apple - premium is now unlocked
        setSuccessMessage('Premium Full activé !');
        setTimeout(() => {
          onPurchaseSuccess?.(result.tier || PREMIUM_TIERS.FULL);
          onClose();
        }, 1000);
      } else if (result.testMode) {
        // Test mode - immediate success
        setSuccessMessage('Premium Full activé !');
        setTimeout(() => {
          onPurchaseSuccess?.(PREMIUM_TIERS.FULL);
          onClose();
        }, 1000);
      } else if (result.cancelled) {
        // User cancelled - just reset UI, no error message
        console.log('[PaywallModal] User cancelled purchase');
        setSuccessMessage(null);
        setError(null);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error('[PaywallModal] Purchase error:', err);
      setError('Une erreur est survenue');
    } finally {
      setPurchasing(null);
    }
  };

  const handleRestore = async () => {
    setPurchasing('restore');
    setError(null);
    try {
      const result = await restorePurchases();
      if (result.success && result.restored.length > 0) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          onPurchaseSuccess?.(getPremiumStatus());
          onClose();
        }, 1500);
      } else if (result.success) {
        setError('Aucun achat à restaurer');
      } else {
        setError(result.error || 'Échec de la restauration');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setPurchasing(null);
    }
  };

  if (!isOpen) return null;

  // Determine which tier to recommend based on trigger
  const getRecommendation = () => {
    if (recommendedTier) return recommendedTier;
    if (['examen_blanc', 'revision_erreurs', 'sync'].includes(triggerFeature)) {
      return 'full';
    }
    return 'basic';
  };

  const recommended = getRecommendation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10"
          disabled={purchasing !== null}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
            <Crown className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Passez à Premium</h2>
          <p className="text-white/80 text-sm">
            {triggerFeature === 'examen_blanc' && 'Débloquez l\'Examen Blanc pour vous préparer dans les conditions réelles'}
            {triggerFeature === 'flashcards' && 'Accédez à toutes les flashcards sans limite'}
            {triggerFeature === 'theme' && 'Débloquez tous les thèmes d\'apprentissage'}
            {triggerFeature === 'revision_erreurs' && 'Révisez vos erreurs pour progresser plus vite'}
            {triggerFeature === 'sync' && 'Synchronisez votre progression sur tous vos appareils'}
            {triggerFeature === 'quiz_limit' && 'Continuez à vous entraîner sans limite'}
            {!triggerFeature && 'Débloquez toutes les fonctionnalités'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          {/* Success message */}
          {successMessage && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-xl text-sm text-center flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              {successMessage}
            </div>
          )}

          {/* Products */}
          {!loading && !successMessage && (
            <>
              {/* Show upgrade message if user already has Basic */}
              {userHasBasic && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Zap className="w-5 h-5" />
                    <span className="font-semibold">Vous avez déjà Premium Basic !</span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    Passez à Premium Full pour débloquer cette fonctionnalité.
                  </p>
                </div>
              )}

              {/* Premium Basic - Only show if user doesn't have it */}
              {!userHasBasic && (
                <div className={`relative border-2 rounded-2xl p-4 transition-all ${
                  recommended === 'basic' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}>
                  {recommended === 'basic' && (
                    <div className="absolute -top-3 left-4 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Recommandé
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-500" />
                        Premium Basic
                      </h3>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {products.basic?.price || '1,99 €'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Achat unique</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {BASIC_FEATURES.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={handlePurchaseBasic}
                    disabled={purchasing !== null || !isPurchaseAvailable()}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {purchasing === 'basic' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Débloquer Basic'
                    )}
                  </button>
                </div>
              )}

              {/* Premium Full - Always show, highlight if user has Basic */}
              <div className={`relative border-2 rounded-2xl p-4 transition-all ${
                recommended === 'full' || userHasBasic
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}>
                {(recommended === 'full' || userHasBasic) && (
                  <div className="absolute -top-3 left-4 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {userHasBasic ? 'Mise à niveau' : 'Recommandé'}
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                      <Crown className="w-5 h-5 text-purple-500" />
                      Premium Full
                    </h3>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {products.full?.price || '2,99 €'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Achat unique</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  {FULL_FEATURES.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handlePurchaseFull}
                  disabled={purchasing !== null || !isPurchaseAvailable()}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {purchasing === 'full' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : userHasBasic ? (
                    'Passer à Full'
                  ) : (
                    'Débloquer Full'
                  )}
                </button>
              </div>

              {/* Web/PWA notice */}
              {!isPurchaseAvailable() && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 p-3 rounded-xl text-sm text-center">
                  Les achats sont uniquement disponibles dans l'application iOS
                </div>
              )}
            </>
          )}

          {/* Footer actions */}
          <div className="pt-4 space-y-3">
            {/* Restore purchases */}
            <button
              onClick={handleRestore}
              disabled={purchasing !== null}
              className="w-full py-2 text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline flex items-center justify-center gap-2"
            >
              {purchasing === 'restore' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              Restaurer un achat précédent
            </button>

            {/* Continue without premium */}
            <button
              onClick={onClose}
              disabled={purchasing !== null}
              className="w-full py-2 text-gray-500 dark:text-gray-400 font-medium text-sm hover:text-gray-700 dark:hover:text-gray-200"
            >
              Continuer sans premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;

