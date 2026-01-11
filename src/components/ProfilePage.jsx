import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, Save, AlertCircle, CheckCircle, Crown, Zap, RefreshCw, Loader2, LogOut } from 'lucide-react';
import { updateEmail, updatePassword, updateProfile, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { uploadLocalData } from '../services/syncService';
import { useSwipeBack } from '../hooks/useSwipeBack';
import { usePaywall } from '../contexts/PaywallContext';
import { restorePurchases } from '../services/purchaseService';
import { getTierDisplayName, PREMIUM_TIERS } from '../services/entitlementService';

const ProfilePage = ({ user, userName, onBack, onUpdateUserName }) => {
  // Enable swipe-back gesture
  useSwipeBack(onBack);
  
  // Paywall integration
  const { premiumStatus, showPaywall, refreshPremiumStatus } = usePaywall();

  const [name, setName] = useState(userName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [restoringPurchases, setRestoringPurchases] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle restore purchases
  const handleRestorePurchases = async () => {
    setRestoringPurchases(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await restorePurchases();
      if (result.success && result.restored?.length > 0) {
        setSuccess(result.message || 'Achats restaurés avec succès !');
        refreshPremiumStatus();
      } else if (result.success) {
        setError('Aucun achat à restaurer');
      } else {
        setError(result.error || 'Erreur lors de la restauration');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setRestoringPurchases(false);
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const updates = [];
    let hasChanges = false;

    try {
      // Update name if changed
      if (name.trim() && name !== userName) {
        hasChanges = true;
        updates.push('nom');

        if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName: name
          });
        }
        localStorage.setItem('userName', name);
        await uploadLocalData(user.uid, name);
        onUpdateUserName(name);
      }

      // Update email if changed
      if (email.trim() && email !== user.email) {
        hasChanges = true;
        updates.push('email');
        await updateEmail(auth.currentUser, email);
      }

      // Update password if provided
      if (newPassword || confirmPassword) {
        if (!newPassword || !confirmPassword) {
          setError('Veuillez remplir les deux champs du mot de passe');
          setLoading(false);
          return;
        }

        if (newPassword.length < 6) {
          setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
          setLoading(false);
          return;
        }

        if (newPassword !== confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          setLoading(false);
          return;
        }

        hasChanges = true;
        updates.push('mot de passe');
        await updatePassword(auth.currentUser, newPassword);
        setNewPassword('');
        setConfirmPassword('');
      }

      if (!hasChanges) {
        setError('Aucune modification à enregistrer');
        setLoading(false);
        return;
      }

      setSuccess(`Profil mis à jour avec succès! (${updates.join(', ')})`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      if (err.code === 'auth/requires-recent-login') {
        setError('Pour des raisons de sécurité, veuillez vous déconnecter et vous reconnecter avant de modifier votre profil.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Cet email est déjà utilisé par un autre compte');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email invalide');
      } else if (err.code === 'auth/weak-password') {
        setError('Le mot de passe est trop faible');
      } else {
        setError('Erreur lors de la mise à jour du profil');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold mb-4 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mon Profil
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gérez vos informations personnelles
          </p>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800 dark:text-green-300">{success}</p>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-4">
          <div className="space-y-6">
            {/* Name Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Nom d'utilisateur
              </h2>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>

            {/* Email Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Adresse email
              </h2>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>

            {/* Password Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Nouveau mot de passe
              </h2>
              <div className="space-y-3">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmez le mot de passe"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Single Save Button */}
        <button
          onClick={handleSaveAll}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
            loading
              ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105'
          }`}
        >
          <Save className="w-5 h-5" />
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>

        {/* Logout Button */}
        <button
          onClick={async () => {
            try {
              await signOut(auth);
              onBack();
            } catch (err) {
              setError('Erreur lors de la déconnexion');
            }
          }}
          className="w-full mt-4 py-4 rounded-xl font-bold text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Se déconnecter
        </button>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
          <p className="text-xs text-blue-900 dark:text-blue-300 text-center">
            <strong>🔒 Note de sécurité:</strong> Pour modifier votre email ou mot de passe,
            vous devrez peut-être vous reconnecter pour des raisons de sécurité.
          </p>
        </div>

        {/* Premium Management Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Crown className="w-6 h-6 text-purple-500" />
            Abonnement Premium
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            {/* Current Status */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Statut actuel</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {premiumStatus === PREMIUM_TIERS.FULL ? (
                    <>
                      <Crown className="w-5 h-5 text-purple-500" />
                      {getTierDisplayName(premiumStatus)}
                    </>
                  ) : premiumStatus === PREMIUM_TIERS.BASIC ? (
                    <>
                      <Zap className="w-5 h-5 text-blue-500" />
                      {getTierDisplayName(premiumStatus)}
                    </>
                  ) : (
                    getTierDisplayName(premiumStatus)
                  )}
                </p>
              </div>
              
              {/* Badge */}
              {premiumStatus === PREMIUM_TIERS.FULL && (
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  FULL
                </div>
              )}
              {premiumStatus === PREMIUM_TIERS.BASIC && (
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  BASIC
                </div>
              )}
            </div>

            {/* Features unlocked */}
            {premiumStatus !== PREMIUM_TIERS.FREE && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {premiumStatus === PREMIUM_TIERS.FULL 
                    ? 'Toutes les fonctionnalités sont débloquées !'
                    : 'Flashcards illimitées, tous les thèmes débloqués'
                  }
                </p>
              </div>
            )}

            {/* Upgrade button for non-Full users */}
            {premiumStatus !== PREMIUM_TIERS.FULL && (
              <button
                onClick={() => showPaywall(null, premiumStatus === PREMIUM_TIERS.FREE ? 'basic' : 'full')}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mb-4"
              >
                <Crown className="w-5 h-5" />
                {premiumStatus === PREMIUM_TIERS.FREE 
                  ? 'Passer à Premium'
                  : 'Passer à Premium Full'
                }
              </button>
            )}

            {/* Restore purchases button */}
            <button
              onClick={handleRestorePurchases}
              disabled={restoringPurchases}
              className="w-full py-3 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {restoringPurchases ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              {restoringPurchases ? 'Restauration...' : 'Restaurer les achats'}
            </button>

            {/* Info */}
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
              Si vous avez déjà effectué un achat sur un autre appareil, 
              utilisez "Restaurer les achats" pour le récupérer.
            </p>
            
            {/* DEV ONLY: Reset Premium (remove before App Store submission) */}
            {process.env.REACT_APP_TEST_MODE === 'true' && (
              <button
                onClick={() => {
                  localStorage.removeItem('premium_status');
                  localStorage.removeItem('premium_sig');
                  localStorage.removeItem('premium_data');
                  refreshPremiumStatus();
                  setSuccess('Premium réinitialisé (mode test)');
                }}
                className="mt-4 w-full py-2 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                🧪 Reset Premium (Test Mode)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
