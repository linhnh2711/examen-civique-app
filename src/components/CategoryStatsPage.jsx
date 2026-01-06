import React, { useState, useEffect } from 'react';
import { Home, BarChart3, BookOpen } from 'lucide-react';
import { questionsDB } from '../data/questions';
import { loadLearnedQuestions } from '../utils/storage';

const CategoryStatsPage = ({ examType, onBack, onNavigateToPractice }) => {
  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(() => {
    // Load learned questions
    const learned = loadLearnedQuestions();
    const learnedSet = new Set(learned[examType] || []);

    // Calculate category stats
    const categories = {};
    questionsDB.forEach(q => {
      // Only include questions for this exam type
      if (!q.tags.includes(examType)) return;

      if (!categories[q.category]) {
        categories[q.category] = {
          total: 0,
          learned: 0
        };
      }
      categories[q.category].total++;
      if (learnedSet.has(q.id)) {
        categories[q.category].learned++;
      }
    });

    // Sort alphabetically with French locale for consistency
    const categoryArray = Object.entries(categories)
      .map(([name, data]) => ({
        name,
        total: data.total,
        learned: data.learned,
        percentage: Math.round((data.learned / data.total) * 100)
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));

    setCategoryStats(categoryArray);
  }, [examType]);

  const totalQuestions = categoryStats.reduce((sum, cat) => sum + cat.total, 0);
  const totalLearned = categoryStats.reduce((sum, cat) => sum + cat.learned, 0);
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
            <span className="font-medium text-sm md:text-base">Statistiques</span>
          </button>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">Détails {examType}</h1>
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

        {/* Practice Button */}
        <button
          onClick={onNavigateToPractice}
          className={`w-full mb-4 md:mb-8 rounded-2xl p-4 md:p-6 shadow-lg border-2 transition-all hover:shadow-xl hover:scale-105 group ${
            examType === 'CSP'
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500'
              : 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700 hover:border-purple-500 dark:hover:border-purple-500'
          }`}
        >
          <div className="flex items-center justify-center gap-2 md:gap-3">
            <BookOpen className={`w-5 h-5 md:w-6 md:h-6 ${
              examType === 'CSP' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'
            }`} />
            <span className={`text-base md:text-lg font-bold ${
              examType === 'CSP' ? 'text-blue-900 dark:text-blue-300' : 'text-purple-900 dark:text-purple-300'
            }`}>
              Pratiquer par catégorie
            </span>
            <span className="text-base md:text-lg">→</span>
          </div>
        </button>

        {/* Categories Title */}
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 flex items-center gap-2">
          <BarChart3 className={`w-4 h-4 md:w-5 md:h-5 ${
            examType === 'CSP' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'
          }`} />
          Statistiques par catégorie
        </h2>

        {/* Category Cards */}
        <div className="space-y-3 md:space-y-4">
          {categoryStats.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white mb-1">
                    {cat.name}
                  </h3>
                  <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    <span>{cat.total} questions</span>
                    <span>•</span>
                    <span className={examType === 'CSP' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}>
                      {cat.learned} étudiées
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl md:text-3xl font-bold ${
                    examType === 'CSP' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'
                  }`}>
                    {cat.percentage}%
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    {cat.learned}/{cat.total}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 md:h-3">
                <div
                  className={`h-2 md:h-3 rounded-full transition-all ${
                    examType === 'CSP'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                      : 'bg-gradient-to-r from-purple-500 to-purple-600'
                  }`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
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
            📊 Statistiques
          </h3>
          <p className={`text-xs md:text-sm ${
            examType === 'CSP' ? 'text-blue-800 dark:text-blue-300' : 'text-purple-800 dark:text-purple-300'
          }`}>
            Cette page affiche votre progression détaillée par catégorie pour l'examen {examType}.
            Les questions sont marquées comme "étudiées" une fois que vous y avez répondu dans un quiz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryStatsPage;
