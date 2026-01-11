import React, { useState } from 'react';
import { Trophy, XCircle, Home, ChevronDown, ChevronUp, Check, X, Clock, Star } from 'lucide-react';
import { toggleSavedQuestion, isQuestionSaved } from '../utils/storage';
import { useSwipeBack } from '../hooks/useSwipeBack';

const ExamenResultPage = ({ result, onBackHome }) => {
  // Enable swipe-back gesture
  useSwipeBack(onBackHome);

  const [showDetails, setShowDetails] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const { score, total, answers, questions, timeSpent } = result;
  const [savedQuestions, setSavedQuestions] = useState(() => {
    const saved = new Set();
    questions.forEach(q => {
      if (isQuestionSaved(q.id)) {
        saved.add(q.id);
      }
    });
    return saved;
  });
  
  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 80; // 80% requis (32/40)
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}min ${secs}s`;
  };

  const handleToggleSave = (questionId) => {
    toggleSavedQuestion(questionId);
    setSavedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const scrollToQuestion = (index) => {
    setActiveQuestionIndex(index);
    setShowNavigation(false); // Close menu after selection
    const element = document.getElementById(`question-${index}`);
    if (element) {
      const yOffset = -80; // Offset for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Grouper par catégorie
  const resultsByTheme = {};
  questions.forEach(q => {
    if (!resultsByTheme[q.theme]) {
      resultsByTheme[q.theme] = { correct: 0, total: 0 };
    }
    resultsByTheme[q.theme].total++;
    if (answers[q.id] === q.correct) {
      resultsByTheme[q.theme].correct++;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 pb-24">
      {/* Fixed "Retour à l'accueil" button - with safe-area padding for Dynamic Island */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md z-50 pt-safe">
        <div className="max-w-4xl mx-auto p-4">
          <button
            onClick={onBackHome}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold transition-all"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </button>
        </div>
      </div>

      {/* Add extra padding to account for safe-area + header height */}
      <div className="max-w-4xl mx-auto pt-20 mt-safe">
        {/* Result Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center mb-6">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {passed ? (
              <Trophy className="w-12 h-12 text-green-600" />
            ) : (
              <XCircle className="w-12 h-12 text-red-600" />
            )}
          </div>

          <h2 className="text-3xl font-bold mb-2 text-gray-900">
            {passed ? 'Félicitations ! Vous avez réussi !' : 'Examen non validé'}
          </h2>
          <p className="text-gray-600 mb-8">
            {passed 
              ? "Vous avez atteint le niveau requis pour l'examen civique français." 
              : "Vous devez obtenir au moins 80% (32/40) pour valider l'examen."}
          </p>

          {/* Score principale */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-6">
            <div className={`text-6xl font-bold mb-2 ${
              passed ? 'text-green-600' : 'text-red-600'
            }`}>
              {percentage}%
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-4">
              {score} / {total}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all ${
                  passed ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-orange-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="mt-4 text-sm text-gray-600 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Temps écoulé: {formatTime(timeSpent)}</span>
            </div>
          </div>

          {/* Stats par catégorie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.entries(resultsByTheme).map(([theme, stats]) => {
              const catPercentage = Math.round((stats.correct / stats.total) * 100);
              return (
                <div key={theme} className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm font-medium text-gray-600 mb-2">{theme}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      {stats.correct} / {stats.total}
                    </span>
                    <span className={`text-sm font-bold ${
                      catPercentage >= 80 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {catPercentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Voir détails button */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {showDetails ? (
              <>
                <ChevronUp className="w-5 h-5" />
                Masquer les détails
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5" />
                Voir les réponses détaillées
              </>
            )}
          </button>
        </div>

        {/* Détails des réponses */}
        {showDetails && (
          <div className="relative">
            {/* Minimized navigation button */}
            <div className="sticky top-24 z-40 mb-6">
              <button
                onClick={() => setShowNavigation(!showNavigation)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-semibold text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Navigation ({activeQuestionIndex + 1}/40)
                <svg className={`w-4 h-4 transition-transform ${showNavigation ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded navigation grid */}
              {showNavigation && (
                <div className="absolute top-12 left-0 right-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border-2 border-blue-200">
                  <div className="text-xs font-semibold text-gray-600 mb-3">Sélectionnez une question :</div>
                  <div className="grid grid-cols-8 md:grid-cols-10 gap-2 max-h-64 overflow-y-auto">
                    {questions.map((q, index) => {
                      const userAnswer = answers[q.id];
                      const isCorrect = userAnswer === q.correct;
                      const wasAnswered = userAnswer !== undefined;

                      return (
                        <button
                          key={q.id}
                          onClick={() => scrollToQuestion(index)}
                          className={`aspect-square rounded-lg text-xs font-bold transition-all ${
                            activeQuestionIndex === index
                              ? 'ring-2 ring-blue-500 scale-110'
                              : ''
                          } ${
                            isCorrect
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : wasAnswered
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          title={`Question ${index + 1}`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Questions list */}
            <div className="space-y-4">
              {questions.map((q, index) => {
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === q.correct;
                const wasAnswered = userAnswer !== undefined;

                return (
                  <div
                    key={q.id}
                    id={`question-${index}`}
                    className={`bg-white rounded-2xl p-6 border-2 ${
                      isCorrect ? 'border-green-200' : wasAnswered ? 'border-red-200' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCorrect ? 'bg-green-100' : wasAnswered ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      {isCorrect ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : wasAnswered ? (
                        <X className="w-5 h-5 text-red-600" />
                      ) : (
                        <span className="text-gray-500 text-sm">?</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm text-gray-500">Question {index + 1} - {q.theme}</div>
                        <button
                          onClick={() => handleToggleSave(q.id)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-all"
                          title={savedQuestions.has(q.id) ? "Retirer des favoris" : "Sauvegarder pour réviser"}
                        >
                          <Star
                            className={`w-5 h-5 ${
                              savedQuestions.has(q.id)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-3">{q.question}</h3>
                      
                      <div className="space-y-2">
                        {q.options.map((option, optIndex) => {
                          const isUserAnswer = userAnswer === optIndex;
                          const isCorrectAnswer = q.correct === optIndex;
                          
                          let bgColor = 'bg-gray-50';
                          let textColor = 'text-gray-700';
                          let icon = null;
                          
                          if (isCorrectAnswer) {
                            bgColor = 'bg-green-50 border-2 border-green-300';
                            textColor = 'text-green-900';
                            icon = <Check className="w-5 h-5 text-green-600" />;
                          } else if (isUserAnswer && !isCorrectAnswer) {
                            bgColor = 'bg-red-50 border-2 border-red-300';
                            textColor = 'text-red-900';
                            icon = <X className="w-5 h-5 text-red-600" />;
                          }
                          
                          return (
                            <div key={optIndex} className={`p-3 rounded-lg ${bgColor} flex items-center justify-between`}>
                              <span className={`${textColor} text-sm`}>{option}</span>
                              {icon}
                            </div>
                          );
                        })}
                      </div>
                      
                      {!isCorrect && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-900">
                            <strong>💡 Explication:</strong> {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamenResultPage;