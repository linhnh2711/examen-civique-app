import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Send, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { submitFeedback } from '../services/feedbackService';
import { APP_CONFIG } from '../config/appConfig';
import { useSwipeBack } from '../hooks/useSwipeBack';

const FeedbackPage = ({ onBack, user, userName }) => {
  // Enable swipe-back gesture
  useSwipeBack(onBack);

  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);

  const feedbackTypes = [
    { value: 'bug', label: 'Signaler un bug', icon: '🐛', color: 'red' },
    { value: 'suggestion', label: 'Suggestion', icon: '💡', color: 'blue' },
    { value: 'question', label: 'Question', icon: '❓', color: 'purple' },
    { value: 'compliment', label: 'Compliment', icon: '❤️', color: 'green' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!message.trim()) {
      setError('Veuillez entrer votre message');
      return;
    }

    if (!user && !email.trim()) {
      setError('Veuillez entrer votre email');
      return;
    }

    setLoading(true);

    try {
      const feedbackData = {
        type: feedbackType,
        rating,
        message: message.trim(),
        email: user ? user.email : email.trim(),
        userName: user ? (userName || 'Utilisateur') : 'Anonyme',
        userId: user ? user.uid : null,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: navigator.platform
      };

      const result = await submitFeedback(feedbackData);

      if (result.success) {
        setSuccess(true);
        setMessage('');
        setEmail('');
        setRating(0);
        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        setError(result.error || 'Erreur lors de l\'envoi du feedback');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Merci pour votre feedback!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Votre message a été envoyé avec succès. Nous l'examinerons rapidement.
          </p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold mb-6 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Envoyer un feedback
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Votre avis nous aide à améliorer l'application
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Feedback Form */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Type de feedback
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {feedbackTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFeedbackType(type.value)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      feedbackType === type.value
                        ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-900/20`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className={`text-xs font-semibold ${
                      feedbackType === type.value
                        ? `text-${type.color}-700 dark:text-${type.color}-300`
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Note globale de l'application (optionnel)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setRating(star);
                      setShowRatingModal(true);
                    }}
                    className="transition-all hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <button
                    type="button"
                    onClick={() => setRating(0)}
                    className="ml-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>

            {/* Email (if not logged in) */}
            {!user && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Votre email (pour recevoir une réponse)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all"
                  required
                />
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Votre message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Décrivez votre suggestion, bug, question ou commentaire..."
                rows="6"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all resize-none"
                required
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Plus vous donnez de détails, mieux nous pourrons vous aider!
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Envoi en cours...'
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Envoyer le feedback
                </>
              )}
            </button>
          </form>
        </div>

        {/* Rating Modal Popup */}
        {showRatingModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
            onClick={() => setShowRatingModal(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-6 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {rating === 5 ? (
                // 5 stars only - Suggest App Store rating
                <>
                  <div className="text-center mb-4">
                    <span className="text-4xl">⭐⭐⭐⭐⭐</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-3">
                    Merci pour votre excellente note!
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 text-center mb-6">
                    Cela nous ferait très plaisir si vous pouviez laisser un avis sur l'App Store pour soutenir l'application 💛
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowRatingModal(false)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    >
                      Plus tard
                    </button>
                    <a
                      href={APP_CONFIG.APP_STORE_REVIEW_URL}
                      onClick={() => setShowRatingModal(false)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl font-semibold text-center transition-all"
                    >
                      Noter sur l'App Store
                    </a>
                  </div>
                </>
              ) : rating === 4 ? (
                // 4 stars - Encourage improvement suggestions
                <>
                  <div className="text-center mb-4">
                    <span className="text-4xl">😊</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-3">
                    Merci pour votre note!
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 text-center mb-6">
                    Qu'est-ce qui pourrait rendre votre expérience encore meilleure? Vos suggestions nous aident à atteindre l'excellence! 💙
                  </p>
                  <button
                    onClick={() => setShowRatingModal(false)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all"
                  >
                    D'accord!
                  </button>
                </>
              ) : rating >= 1 && rating <= 3 ? (
                // Low rating (1-3 stars) - Encourage detailed feedback
                <>
                  <div className="text-center mb-4">
                    <span className="text-4xl">💙</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-3">
                    Merci pour votre retour honnête
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 text-center mb-6">
                    N'hésitez pas à détailler ce qui ne vous satisfait pas dans le message. Vos suggestions nous aident à progresser!
                  </p>
                  <button
                    onClick={() => setShowRatingModal(false)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all"
                  >
                    Compris, merci!
                  </button>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
