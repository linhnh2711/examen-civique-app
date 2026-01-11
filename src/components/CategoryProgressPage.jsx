import React, { useState, useEffect } from 'react';
import { Home, ChevronRight, BookOpen, Lock, Crown } from 'lucide-react';
import { questionsDB } from '../data/questions';
import { loadLearnedQuestions } from '../utils/storage';
import { useSwipeBack } from '../hooks/useSwipeBack';
import { usePaywall } from '../contexts/PaywallContext';

const CategoryProgressPage = ({ examType, onBack, onStartCategoryQuiz }) => {
  // Enable swipe-back gesture
  useSwipeBack(onBack);
  
  // Paywall integration
  const { 
    checkThemeAccess,
    canAccessTheme,
  } = usePaywall();

  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(() => {
    // Load learned questions
    const learned = loadLearnedQuestions();
    const learnedSet = new Set(learned[examType] || []);

    // Calculate theme stats
    const themes = {};
    questionsDB.forEach(q => {
      // Only include questions for this exam type
      if (!q.tags.includes(examType)) return;

      if (!themes[q.theme]) {
        themes[q.theme] = {
          total: 0,
          learned: 0
        };
      }
      themes[q.theme].total++;
      if (learnedSet.has(q.id)) {
        themes[q.theme].learned++;
      }
    });

    // Sort alphabetically with French locale for consistency
    const themeArray = Object.entries(themes)
      .map(([name, data]) => ({
        name,
        total: data.total,
        learned: data.learned,
        percentage: Math.round((data.learned / data.total) * 100)
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));

    setCategoryStats(themeArray);
  }, [examType]);

  const totalQuestions = categoryStats.reduce((sum, theme) => sum + theme.total, 0);
  const totalLearned = categoryStats.reduce((sum, theme) => sum + theme.learned, 0);
  const overallPercentage = totalQuestions > 0 ? Math.round((totalLearned / totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Home className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-medium text-sm md:text-base">Accueil</span>
          </button>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">Progression {examType}</h1>
          <div className="w-12 md:w-20"></div>
        </div>

        {/* Overall Progress */}
        <div className={`bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-8 shadow-lg border-2 mb-4 md:mb-8 ${
          examType === 'CSP' ? 'border-blue-500' : 'border-purple-500'
        }`}>
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Progression globale {examType}
              </h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                {totalLearned} / {totalQuestions} questions étudiées
              </p>
            </div>
            <div className={`text-3xl md:text-5xl font-bold ${
              examType === 'CSP' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'
            }`}>
              {overallPercentage}%
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 md:h-4">
            <div
              className={`h-3 md:h-4 rounded-full transition-all ${
                examType === 'CSP'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600'
              }`}
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* Themes Title */}
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
          Progression par thème
        </h2>

        {/* Theme Cards */}
        <div className="space-y-3 md:space-y-4">
          {categoryStats.map((theme, idx) => {
            const isLocked = !canAccessTheme(theme.name);
            
            return (
              <div
                key={idx}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border transition-all ${
                  isLocked 
                    ? 'border-gray-200 dark:border-gray-700 opacity-80' 
                    : 'border-gray-100 dark:border-gray-700 hover:shadow-xl'
                }`}
              >
                {/* Premium badge for locked themes */}
                {isLocked && (
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Crown className="w-3 h-3" />
                    BASIC
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div className="flex-1">
                    <h3 className={`font-bold text-base md:text-lg mb-1 flex items-center gap-2 ${
                      isLocked ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                    }`}>
                      {isLocked && <Lock className="w-4 h-4" />}
                      {theme.name}
                    </h3>
                    <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      <span>{theme.total} questions</span>
                      <span>•</span>
                      <span className={examType === 'CSP' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}>
                        {theme.learned} étudiées
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl md:text-3xl font-bold ${
                      isLocked 
                        ? 'text-gray-400 dark:text-gray-500'
                        : examType === 'CSP' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'
                    }`}>
                      {theme.percentage}%
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      {theme.learned}/{theme.total}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 md:h-3 mb-3 md:mb-4">
                  <div
                    className={`h-2 md:h-3 rounded-full transition-all ${
                      isLocked
                        ? 'bg-gray-300 dark:bg-gray-600'
                        : examType === 'CSP'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                          : 'bg-gradient-to-r from-purple-500 to-purple-600'
                    }`}
                    style={{ width: `${theme.percentage}%` }}
                  />
                </div>

                {/* Practice Button */}
                <button
                  onClick={() => {
                    if (checkThemeAccess(theme.name)) {
                      onStartCategoryQuiz(examType, theme.name);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 transition-all group ${
                    isLocked
                      ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                      : examType === 'CSP'
                        ? 'border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                        : 'border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                  }`}
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    {isLocked ? (
                      <Lock className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    ) : (
                      <BookOpen className={`w-4 h-4 md:w-5 md:h-5 ${
                        examType === 'CSP' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'
                      }`} />
                    )}
                    <span className={`font-medium text-sm md:text-base ${
                      isLocked
                        ? 'text-gray-500 dark:text-gray-400'
                        : examType === 'CSP' ? 'text-blue-700 dark:text-blue-300' : 'text-purple-700 dark:text-purple-300'
                    }`}>
                      {isLocked ? 'Débloquer ce thème' : 'Pratiquer ce thème'}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1 ${
                    isLocked
                      ? 'text-gray-400'
                      : examType === 'CSP' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'
                  }`} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className={`mt-4 md:mt-8 rounded-2xl p-4 md:p-6 border ${
          examType === 'CSP'
            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
            : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
        }`}>
          <h3 className={`font-bold mb-2 text-sm md:text-base ${
            examType === 'CSP' ? 'text-blue-900 dark:text-blue-300' : 'text-purple-900 dark:text-purple-300'
          }`}>
            💡 Conseil
          </h3>
          <p className={`text-xs md:text-sm ${
            examType === 'CSP' ? 'text-blue-800 dark:text-blue-300' : 'text-purple-800 dark:text-purple-300'
          }`}>
            Concentrez-vous sur les thèmes où votre progression est la plus faible pour maximiser vos chances de réussite à l'examen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryProgressPage;
