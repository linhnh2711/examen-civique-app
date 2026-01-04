import React, { useState, useEffect } from 'react';
import { Home, TrendingUp, Target, Award, Calendar, BarChart3, PieChart } from 'lucide-react';
import { getProgress, loadQuizHistory } from '../utils/storage';
import { questionsDB } from '../data/questions';

const StatsPage = ({ stats, onBack }) => {
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

    const categoryArray = Object.entries(categories).map(([name, data]) => ({
      name,
      ...data
    }));
    setCategoryStats(categoryArray);

    // Load recent quiz history
    const history = loadQuizHistory();
    setRecentHistory(history.slice(-5).reverse());
  }, []);

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Total Questions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total réponses</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          </div>

          {/* Accuracy */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Précision</div>
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{accuracy}%</div>
          </div>

          {/* Best Streak */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Meilleure série</div>
            </div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.bestStreak}</div>
          </div>

          {/* Correct Answers */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Bonnes réponses</div>
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.correct}</div>
          </div>
        </div>

        {/* Progress by Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* CSP Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Progression CSP
            </h3>
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{progressCSP.percentage}%</span>
                <span className="text-gray-500 dark:text-gray-400">complété</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {progressCSP.learned} / {progressCSP.total} questions étudiées
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${progressCSP.percentage}%` }}
              />
            </div>
          </div>

          {/* CR Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Progression CR
            </h3>
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">{progressCR.percentage}%</span>
                <span className="text-gray-500 dark:text-gray-400">complété</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {progressCR.learned} / {progressCR.total} questions étudiées
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${progressCR.percentage}%` }}
              />
            </div>
          </div>
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
