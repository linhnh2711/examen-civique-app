import React from 'react';
import { Trophy, Star, Flame, Home } from 'lucide-react';

const ResultPage = ({ score, currentStreak, onBackHome, totalQuestions = 15 }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 80;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 md:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 md:p-8 text-center">
        {/* Icon */}
        <div className={`w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-full flex items-center justify-center ${
          passed ? 'bg-green-100' : 'bg-orange-100'
        }`}>
          {passed ? (
            <Trophy className="w-10 h-10 md:w-12 md:h-12 text-green-600" />
          ) : (
            <Star className="w-10 h-10 md:w-12 md:h-12 text-orange-600" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
          {passed ? 'Félicitations !' : 'Bon effort !'}
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
          {passed
            ? 'Vous avez réussi le quiz !'
            : 'Continuez à vous entraîner !'}
        </p>

        {/* Score Card */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
          <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {percentage}%
          </div>
          <div className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
            {score} / {totalQuestions} correctes
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
            <div
              className={`h-2 md:h-3 rounded-full transition-all ${
                passed ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-orange-500 to-yellow-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Streak Badge */}
        {currentStreak > 0 && (
          <div className="flex items-center justify-center gap-2 mb-4 md:mb-6 text-orange-600">
            <Flame className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-bold text-sm md:text-base">{currentStreak} série en cours !</span>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={onBackHome}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 md:py-4 rounded-xl font-bold text-sm md:text-base hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4 md:w-5 md:h-5" />
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default ResultPage;