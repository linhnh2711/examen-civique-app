import React, { useState, useEffect } from 'react';
import { Home, TrendingUp, Target, Award, Calendar, BarChart3, PieChart, HandMetal, Flame, Star, Crown, HelpCircle, Info } from 'lucide-react';
import { getProgress, loadQuizHistory, loadLearnedQuestions, loadWrongAnswers, loadSelectedExamType, calculatePrecision } from '../utils/storage';
import { questionsDB } from '../data/questions';
import { useSwipeBack } from '../hooks/useSwipeBack';

const StatsPage = ({ stats, onBack, onViewCategoryProgress }) => {
  // Enable swipe-back gesture
  useSwipeBack(onBack);

  const selectedExamType = loadSelectedExamType(); // Get user's selected exam type
  const [progress, setProgress] = useState({ learned: 0, total: 180, percentage: 0 });
  const [categoryStats, setCategoryStats] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  const [precision, setPrecision] = useState({ percentage: 0, isExamen: false, description: '' });
  const [showPrecisionTooltip, setShowPrecisionTooltip] = useState(false);
  const [showStreakTooltip, setShowStreakTooltip] = useState(false);
  const [showDatabaseInfo, setShowDatabaseInfo] = useState(false);
  const [databaseStats, setDatabaseStats] = useState([]);

  useEffect(() => {
    setProgress(getProgress(selectedExamType));
    setPrecision(calculatePrecision(selectedExamType));

    // Load user's answered questions for selected exam type only
    const learnedQuestions = loadLearnedQuestions();
    const learnedIds = new Set(learnedQuestions[selectedExamType] || []);

    // Load wrong answers to calculate accuracy
    const wrongAnswers = loadWrongAnswers();
    const wrongAnswerIds = new Set(wrongAnswers.map(w => w.questionId));

    // Calculate theme stats based on user's performance for selected exam type only
    const themes = {};
    questionsDB.forEach(q => {
      // Only include questions for the selected exam type
      if (!q.tags.includes(selectedExamType)) return;

      if (!themes[q.theme]) {
        themes[q.theme] = {
          total: 0,
          answered: 0,
          correct: 0
        };
      }
      themes[q.theme].total++;

      // Check if user answered this question
      if (learnedIds.has(q.id)) {
        themes[q.theme].answered++;
        // Check if they got it right
        if (!wrongAnswerIds.has(q.id)) {
          themes[q.theme].correct++;
        }
      }
    });

    // Sort alphabetically with French locale for consistency
    const categoryArray = Object.entries(themes)
      .map(([name, data]) => ({
        name,
        ...data,
        accuracy: data.answered > 0 ? Math.round((data.correct / data.answered) * 100) : 0
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
    setCategoryStats(categoryArray);

    // Calculate database stats for info popup (all themes regardless of exam type)
    const dbThemes = {};
    questionsDB.forEach(q => {
      if (!dbThemes[q.theme]) {
        dbThemes[q.theme] = { total: 0, csp: 0, cr: 0 };
      }
      dbThemes[q.theme].total++;
      if (q.tags.includes('CSP')) dbThemes[q.theme].csp++;
      if (q.tags.includes('CR')) dbThemes[q.theme].cr++;
    });

    const dbArray = Object.entries(dbThemes)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
    setDatabaseStats(dbArray);

    // Load recent quiz history
    const history = loadQuizHistory();
    setRecentHistory(history.slice(-5).reverse());
  }, [selectedExamType]);

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

          {/* Precision */}
          <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                  <span>{precision.isExamen ? "Précision d'examen" : "Précision"}</span>
                  <div className="relative">
                    <button
                      onMouseEnter={() => setShowPrecisionTooltip(true)}
                      onMouseLeave={() => setShowPrecisionTooltip(false)}
                      onClick={() => setShowPrecisionTooltip(!showPrecisionTooltip)}
                      className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <HelpCircle className="w-3 h-3" />
                    </button>
                    {showPrecisionTooltip && (
                      <div className="absolute left-0 top-full mt-1 w-48 p-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg z-10">
                        <div className="text-center">{precision.description}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`text-xl md:text-2xl font-bold ${
                  precision.percentage >= 80
                    ? 'text-green-600 dark:text-green-400'
                    : precision.percentage >= 60
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-red-600 dark:text-red-400'
                }`}>{precision.percentage}%</div>
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
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                  <span>Meilleure série</span>
                  <div className="relative">
                    <button
                      onMouseEnter={() => setShowStreakTooltip(true)}
                      onMouseLeave={() => setShowStreakTooltip(false)}
                      onClick={() => setShowStreakTooltip(!showStreakTooltip)}
                      className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <HelpCircle className="w-3 h-3" />
                    </button>
                    {showStreakTooltip && (
                      <div className="absolute left-0 top-full mt-1 w-64 p-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg z-10">
                        <div className="text-center">La plus longue série de réponses correctes consécutives en mode quiz</div>
                      </div>
                    )}
                  </div>
                </div>
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
                  {showExamResult ? `${lastExam.score}/${lastExam.total || 40}` : stats.correct}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress for Selected Type */}
        <div
          className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8"
        >
          <h3 className="font-bold text-lg md:text-xl text-gray-900 dark:text-white mb-3 md:mb-4 flex items-center gap-2">
            <PieChart className={`w-5 h-5 md:w-6 md:h-6 ${
              selectedExamType === 'CSP' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'
            }`} />
            <span>Progression {selectedExamType}</span>
          </h3>
          <div className="mb-3 md:mb-4">
            <div className="flex items-baseline justify-center gap-2 md:gap-3 mb-2">
              <span className={`text-4xl md:text-5xl font-bold leading-none ${
                selectedExamType === 'CSP' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'
              }`}>{progress.percentage}%</span>
              <span className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-semibold">complété</span>
            </div>
            <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center">
              {progress.learned} / {progress.total} questions étudiées
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 md:h-4">
            <div
              className={`h-3 md:h-4 rounded-full transition-all ${
                selectedExamType === 'CSP'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600'
              }`}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Theme Breakdown - User Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className={`w-5 h-5 ${
              selectedExamType === 'CSP' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'
            }`} />
            <span>Vos performances par thème</span>
            <button
              onClick={() => setShowDatabaseInfo(true)}
              className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              title="À propos de notre base de questions"
            >
              <Info className="w-4 h-4" />
            </button>
          </h3>
          <div className="space-y-4">
            {categoryStats.map((cat, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {cat.answered} / {cat.total} étudiées
                    </div>
                  </div>
                </div>

                {/* Progress bar showing answered questions */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Progression</span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {cat.answered > 0 ? Math.round((cat.answered / cat.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${cat.answered > 0 ? (cat.answered / cat.total) * 100 : 0}%` }}
                    />
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
                      {entry.score}/{entry.total || (entry.mode === 'Examen Blanc' ? 40 : entry.score)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {entry.total ? Math.round((entry.score / entry.total) * 100) : (entry.mode === 'Examen Blanc' ? Math.round((entry.score / 40) * 100) : 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Database Info Modal */}
        {showDatabaseInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  À propos de notre base de questions
                </h2>
                <button
                  onClick={() => setShowDatabaseInfo(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Notre application contient un total de <strong className="text-gray-900 dark:text-white">{questionsDB.length} questions</strong> officielles
                  réparties par thème pour vous préparer efficacement à l'examen civique français.
                </p>

                <div className="space-y-4">
                  {databaseStats.map((theme, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-base text-gray-900 dark:text-white">{theme.name}</h3>
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                          {theme.total} questions
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 mb-1 font-semibold">
                            CSP: {theme.csp} questions
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(theme.csp / theme.total) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-purple-600 dark:text-purple-400 mb-1 font-semibold">
                            CR: {theme.cr} questions
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${(theme.cr / theme.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    <strong>💡 Note:</strong> Certaines questions apparaissent à la fois dans CSP et CR.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPage;
