import React, { useState, useEffect } from 'react';
import { Home, TrendingUp, Target, Award, Calendar, BarChart3, PieChart, HandMetal, Flame, Star, Crown } from 'lucide-react';
import { getProgress, loadQuizHistory } from '../utils/storage';
import { questionsDB } from '../data/questions';

const StatsPage = ({ stats, onBack, onViewCategoryProgress }) => {
  const [progressCSP, setProgressCSP] = useState({ learned: 0, total: 180, percentage: 0 });
  const [progressCR, setProgressCR] = useState({ learned: 0, total: 180, percentage: 0 });
  const [categoryStats, setCategoryStats] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);

  useEffect(() => {
    setProgressCSP(getProgress('CSP'));
    setProgressCR(getProgress('CR'));

    // Calculate category stats
    const categories = {};
    questionsDB.forEach(q => {
      if (!categories[q.category]) {
        categories[q.category] = { total: 0, csp: 0, cr: 0 };
      }
      categories[q.category].total++;
      if (q.tags.includes('CSP')) categories[q.category].csp++;
      if (q.tags.includes('CR')) categories[q.category].cr++;
    });

    // Sort alphabetically with French locale for consistency
    const categoryArray = Object.entries(categories)
      .map(([name, data]) => ({
        name,
        ...data
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
    setCategoryStats(categoryArray);

    // Load recent quiz history
    const history = loadQuizHistory();
    setRecentHistory(history.slice(-5).reverse());
  }, []);

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  // Find last exam blanc result
  const lastExam = recentHistory.find(entry => entry.mode === 'Examen Blanc');
  const showExamResult = lastExam !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Accueil</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📊 Statistiques</h1>
          <div className="w-20"></div>
        </div>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {/* Total Questions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">Total réponses</div>
                <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
              </div>
            </div>
          </div>

          {/* Accuracy */}
          <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">Précision</div>
                <div className={`text-xl md:text-2xl font-bold ${
                  accuracy >= 80
                    ? 'text-green-600 dark:text-green-400'
                    : accuracy >= 60
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-red-600 dark:text-red-400'
                }`}>{accuracy}%</div>
              </div>
            </div>
          </div>

          {/* Best Streak */}
          <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                {stats.bestStreak >= 40 ? (
                  <Crown className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 dark:text-yellow-400" />
                ) : stats.bestStreak >= 30 ? (
                  <Star className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                ) : stats.bestStreak >= 20 ? (
                  <Flame className="w-5 h-5 md:w-6 md:h-6 text-orange-600 dark:text-orange-400" />
                ) : stats.bestStreak >= 10 ? (
                  <HandMetal className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                ) : (
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-orange-600 dark:text-orange-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">Meilleure série</div>
                <div className="text-xl md:text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.bestStreak}</div>
              </div>
            </div>
          </div>

          {/* Last Exam or Correct Answers */}
          <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 md:gap-3">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 ${
                showExamResult
                  ? (lastExam.passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30')
                  : 'bg-purple-100 dark:bg-purple-900/30'
              }`}>
                <Award className={`w-5 h-5 md:w-6 md:h-6 ${
                  showExamResult
                    ? (lastExam.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')
                    : 'text-purple-600 dark:text-purple-400'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  {showExamResult ? 'Dernier examen' : 'Bonnes réponses'}
                </div>
                <div className={`text-xl md:text-2xl font-bold ${
                  showExamResult
                    ? (lastExam.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')
                    : 'text-purple-600 dark:text-purple-400'
                }`}>
                  {showExamResult ? `${lastExam.score}/${lastExam.total}` : stats.correct}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress by Type */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
          {/* CSP Progress */}
          <button
            onClick={() => onViewCategoryProgress('CSP')}
            className="bg-white dark:bg-gray-800 rounded-2xl p-3 md:p-4 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all text-left"
          >
            <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white mb-2 md:mb-3 flex items-center gap-2">
              <PieChart className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />
              <span className="hidden md:inline">Progression CSP</span>
              <span className="md:hidden">CSP</span>
            </h3>
            <div className="mb-2 md:mb-3">
              <div className="flex items-baseline justify-center gap-1.5 md:gap-2 mb-1">
                <span className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 leading-none">{progressCSP.percentage}%</span>
                <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-semibold">complété</span>
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center">
                {progressCSP.learned} / {progressCSP.total}
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 md:h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 md:h-3 rounded-full transition-all"
                style={{ width: `${progressCSP.percentage}%` }}
              />
            </div>
          </button>

          {/* CR Progress */}
          <button
            onClick={() => onViewCategoryProgress('CR')}
            className="bg-white dark:bg-gray-800 rounded-2xl p-3 md:p-4 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all text-left"
          >
            <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white mb-2 md:mb-3 flex items-center gap-2">
              <PieChart className="w-4 h-4 md:w-5 md:h-5 text-purple-600 dark:text-purple-400" />
              <span className="hidden md:inline">Progression CR</span>
              <span className="md:hidden">CR</span>
            </h3>
            <div className="mb-2 md:mb-3">
              <div className="flex items-baseline justify-center gap-1.5 md:gap-2 mb-1">
                <span className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400 leading-none">{progressCR.percentage}%</span>
                <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-semibold">complété</span>
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center">
                {progressCR.learned} / {progressCR.total}
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 md:h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 md:h-3 rounded-full transition-all"
                style={{ width: `${progressCR.percentage}%` }}
              />
            </div>
          </button>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Questions par catégorie
          </h3>
          <div className="space-y-4">
            {categoryStats.map((cat, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{cat.total} questions</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">CSP: {cat.csp}</div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(cat.csp / cat.total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">CR: {cat.cr}</div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(cat.cr / cat.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent History */}
        {recentHistory.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Historique récent
            </h3>
            <div className="space-y-3">
              {recentHistory.map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      entry.passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      <Award className={`w-5 h-5 ${entry.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{entry.type} - {entry.mode}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(entry.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      entry.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {entry.score}/{entry.total}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {Math.round((entry.score / entry.total) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPage;
