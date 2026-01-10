import React, { useState } from 'react';
import { Mail, Lock, User, ArrowLeft, Apple, AlertCircle } from 'lucide-react';
import { loginWithEmail, registerWithEmail, signInWithApple } from '../services/authService';

const LoginPage = ({ onBack, onLoginSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (isRegisterMode) {
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }
      if (password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return;
      }
    }

    setLoading(true);

    try {
      const result = isRegisterMode
        ? await registerWithEmail(email, password)
        : await loginWithEmail(email, password);

      if (result.success) {
        onLoginSuccess(result.user, displayName);
      } else {
        // Parse Firebase error messages
        if (result.error.includes('email-already-in-use')) {
          setError('Cette adresse email est déjà utilisée');
        } else if (result.error.includes('invalid-email')) {
          setError('Adresse email invalide');
        } else if (result.error.includes('user-not-found')) {
          setError('Aucun compte trouvé avec cette adresse email');
        } else if (result.error.includes('wrong-password')) {
          setError('Mot de passe incorrect');
        } else if (result.error.includes('weak-password')) {
          setError('Le mot de passe est trop faible');
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithApple();

      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        if (result.error.includes('popup-closed-by-user')) {
          setError('Connexion annulée');
        } else if (result.error.includes('popup-blocked')) {
          setError('Veuillez autoriser les fenêtres popup pour cette fonctionnalité');
        } else {
          setError('Erreur lors de la connexion avec Apple');
        }
      }
    } catch (err) {
      setError('Une erreur est survenue avec Apple Sign-In');
    } finally {
      setLoading(false);
    }
  };

  return (
    // pt-2 instead of p-6 because safe-area padding is applied on #root
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 pb-6 pt-2">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold mb-6 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRegisterMode ? 'Créer un compte' : 'Connexion'}
          </h1>
          <p className="text-gray-600">
            {isRegisterMode
              ? 'Synchronisez vos données sur tous vos appareils'
              : 'Accédez à vos données depuis n\'importe quel appareil'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Email/Password Form */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isRegisterMode && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom (optionnel)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Votre nom"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {isRegisterMode && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Chargement...' : (isRegisterMode ? 'Créer mon compte' : 'Se connecter')}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError('');
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
            >
              {isRegisterMode
                ? 'Vous avez déjà un compte ? Connectez-vous'
                : 'Pas encore de compte ? Inscrivez-vous'}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-500 font-semibold">
              OU
            </span>
          </div>
        </div>

        {/* Apple Sign-In */}
        <button
          onClick={handleAppleSignIn}
          disabled={loading}
          className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          <Apple className="w-5 h-5" />
          Continuer avec Apple
        </button>

        {/* Skip Login */}
        <button
          onClick={onBack}
          className="w-full text-gray-600 hover:text-gray-800 py-3 rounded-xl font-semibold transition-all"
        >
          Continuer sans compte
        </button>

        {/* Security Note */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <p className="text-xs text-blue-900 text-center">
            <strong>🔒 Sécurité:</strong> Votre mot de passe est chiffré et jamais stocké en clair.
            Nous utilisons Firebase pour garantir la sécurité de vos données.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
