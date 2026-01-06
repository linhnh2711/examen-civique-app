import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, Award, Target, BarChart3, RefreshCw, Moon, Sun, Star } from 'lucide-react';
import { getProgress, loadWrongAnswers, loadSavedQuestions } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';

const HomePage = ({ stats, onStartQuiz, onStartExamen, onViewStats, onReviewWrong, onViewCategoryProgress, onViewSavedQuestions }) => {
  const { isDark, toggleTheme } = useTheme();
  const [progressCSP, setProgressCSP] = useState({ learned: 0, total: 180, percentage: 0 });
  const [progressCR, setProgressCR] = useState({ learned: 0, total: 180, percentage: 0 });
  const [selectedType, setSelectedType] = useState('CSP');
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [savedQuestionsCount, setSavedQuestionsCount] = useState(0);

  useEffect(() => {
    setProgressCSP(getProgress('CSP'));
    setProgressCR(getProgress('CR'));
    setWrongAnswersCount(loadWrongAnswers().length);
    setSavedQuestionsCount(loadSavedQuestions().length);
  }, []);

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header with Type Selector */}
        <div className="text-center mb-4 md:mb-6 pt-2 md:pt-4">
          <div className="flex justify-end mb-3 md:mb-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
            </button>
          </div>
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-3 md:mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-2">
            Examen Civique
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 md:mb-4">Préparez-vous pour votre examen civique français</p>

          {/* Type Selector */}
          <div className="inline-flex bg-white dark:bg-gray-700 rounded-xl p-1 shadow-md">
            <button
              onClick={() => setSelectedType('CSP')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedType === 'CSP'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              CSP
            </button>
            <button
              onClick={() => setSelectedType('CR')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedType === 'CR'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              CR
            </button>
          </div>
        </div>

        {/* Progress and Best Streak - Side by side */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-8">
          {/* Progress Card - Shows only selected type */}
          <button
            onClick={() => onViewCategoryProgress(selectedType)}
            className={`bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border-2 transition-all hover:shadow-xl hover:scale-105 text-left ${
              selectedType === 'CSP' ? 'border-blue-500' : 'border-purple-500'
            }`}>
            <div className="flex items-center gap-2 mb-2">
              <Target className={`w-4 h-4 md:w-5 md:h-5 ${
                selectedType === 'CSP' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'
              }`} />
              <div className="font-bold text-base md:text-lg text-gray-900 dark:text-white">
                Progress {selectedType}
              </div>
            </div>
            <div className="mb-2">
              <div className={`text-2xl md:text-3xl font-bold ${
                selectedType === 'CSP' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'
              }`}>
                {selectedType === 'CSP' ? progressCSP.percentage : progressCR.percentage}%
              </div>
              <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                {selectedType === 'CSP'
                  ? `${progressCSP.learned} / ${progressCSP.total} questions`
                  : `${progressCR.learned} / ${progressCR.total} questions`
                }
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  selectedType === 'CSP'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600'
                }`}
                style={{
                  width: `${selectedType === 'CSP' ? progressCSP.percentage : progressCR.percentage}%`
                }}
              />
            </div>
          </button>

          {/* Statistics */}
          <button
            onClick={onViewStats}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border-2 border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600 transition-all hover:shadow-xl hover:scale-105 text-left">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-orange-600 dark:text-orange-400" />
              <div className="font-bold text-base md:text-lg text-gray-900 dark:text-white">
                Statistiques
              </div>
            </div>
            <div className="mb-2">
              <div className="flex items-baseline gap-2">
                <div className={`text-2xl md:text-3xl font-bold ${
                  accuracy >= 80
                    ? 'text-green-600 dark:text-green-400'
                    : accuracy >= 60
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-red-600 dark:text-red-400'
                }`}>
                  {accuracy}%
                </div>
                <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  Précision
                </div>
              </div>
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
              Toutes vos statistiques →
            </div>
          </button>
        </div>

        {/* Mode de jeu */}
        <div className="space-y-3 md:space-y-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Modes d'apprentissage</h2>
          
          <button
            onClick={() => onStartQuiz(selectedType)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="text-left">
                <div className="font-bold text-base md:text-lg">Quiz Pratique {selectedType}</div>
                <div className="text-xs md:text-sm text-white/80">Mode entrainement</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onStartExamen(selectedType)}
            className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:shadow-xl hover:scale-105 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                  <Award className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-base md:text-lg text-gray-900 dark:text-white">Examen Blanc {selectedType}</div>
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">40 questions - 45 minutes - Conditions réelles</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Saved Questions */}
          {savedQuestionsCount > 0 && (
            <button
              onClick={onViewSavedQuestions}
              className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border-2 border-yellow-200 dark:border-yellow-800 hover:border-yellow-400 dark:hover:border-yellow-600 transition-all hover:shadow-xl hover:scale-105 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800/50 transition-colors">
                    <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 dark:text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-base md:text-lg text-gray-900 dark:text-white">Questions enregistrées</div>
                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{savedQuestionsCount} question{savedQuestionsCount > 1 ? 's' : ''} sauvegardée{savedQuestionsCount > 1 ? 's' : ''}</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 dark:text-yellow-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          )}

          {/* Review Wrong Answers */}
          {wrongAnswersCount > 0 && (
            <button
              onClick={onReviewWrong}
              className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border-2 border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600 transition-all hover:shadow-xl hover:scale-105 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-800/50 transition-colors">
                    <RefreshCw className="w-5 h-5 md:w-6 md:h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-base md:text-lg text-gray-900 dark:text-white">Réviser les erreurs</div>
                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{wrongAnswersCount} question{wrongAnswersCount > 1 ? 's' : ''} à réviser</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 md:mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 md:p-6">
          <h3 className="font-bold text-sm md:text-base text-blue-900 dark:text-blue-300 mb-2">📚 À propos de l'examen {selectedType}</h3>
          <ul className="text-xs md:text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• 40 questions à choix multiples</li>
            <li>• 80% de bonnes réponses requis (32/40)</li>
            <li>• 5 thématiques officielles</li>
            <li>• Durée: 45 minutes maximum</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;