import React, { useState, useEffect } from 'react';
import { Home, Flame, Check, X, ChevronRight, Star } from 'lucide-react';
import { getQuestionsByType } from '../data/questions';
import { markQuestionAsLearned, addWrongAnswer, toggleSavedQuestion, isQuestionSaved } from '../utils/storage';

const QuizPage = ({ stats, currentStreak, onUpdateStats, onStreakUpdate, onComplete, onBack, quizType = 'CSP', totalQuestions = 15 }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [savedQuestions, setSavedQuestions] = useState(new Set());

  useEffect(() => {
    const randomQuestions = getQuestionsByType(quizType, totalQuestions);
    setQuestions(randomQuestions);

    // Load saved questions status
    const saved = new Set();
    randomQuestions.forEach(q => {
      if (isQuestionSaved(q.id)) {
        saved.add(q.id);
      }
    });
    setSavedQuestions(saved);
  }, [quizType, totalQuestions]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des questions {quizType}...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  const handleAnswerSelect = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    setShowResult(true);
    const isCorrect = selectedAnswer === question.correct;

    // Mark question as learned (đã trả lời)
    markQuestionAsLearned(question.id, question.tags);

    if (isCorrect) {
      setScore(score + 1);
      const newStreak = currentStreak + 1;
      onStreakUpdate(newStreak);
      const newStats = {
        ...stats,
        total: stats.total + 1,
        correct: stats.correct + 1,
        streak: newStreak,
        bestStreak: Math.max(stats.bestStreak, newStreak)
      };
      onUpdateStats(newStats);
    } else {
      // Save wrong answer for review
      addWrongAnswer(question.id, selectedAnswer, question.correct);

      onStreakUpdate(0);
      const newStats = {
        ...stats,
        total: stats.total + 1,
        streak: 0
      };
      onUpdateStats(newStats);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      onComplete(score);
    }
  };

  const handleToggleSave = () => {
    toggleSavedQuestion(question.id);
    setSavedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(question.id)) {
        newSet.delete(question.id);
      } else {
        newSet.add(question.id);
      }
      return newSet;
    });
  };

  const isCorrect = showResult && selectedAnswer === question.correct;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1 md:gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Home className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-medium text-sm md:text-base">Accueil</span>
          </button>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold">
              {quizType}
            </div>
            {currentStreak > 0 && (
              <div className="flex items-center gap-1 md:gap-2 bg-orange-100 dark:bg-orange-900/50 px-2 md:px-3 py-1 rounded-full">
                <Flame className="w-3 h-3 md:w-4 md:h-4 text-orange-600 dark:text-orange-400" />
                <span className="font-bold text-xs md:text-sm text-orange-600 dark:text-orange-400">{currentStreak}</span>
              </div>
            )}
            <div className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">
              {currentQuestion + 1} / {questions.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 md:mb-8">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Category and Save Button */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium">
            {question.category}
          </div>
          <button
            onClick={handleToggleSave}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            title={savedQuestions.has(question.id) ? "Retirer des favoris" : "Sauvegarder pour réviser"}
          >
            <Star
              className={`w-5 h-5 md:w-6 md:h-6 ${
                savedQuestions.has(question.id)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            />
          </button>
        </div>

        {/* Question */}
        <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === question.correct;

            let bgColor = 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700';
            let borderColor = 'border-gray-200 dark:border-gray-600';
            let icon = null;

            if (showResult) {
              if (isCorrectAnswer) {
                bgColor = 'bg-green-50 dark:bg-green-900/30 border-green-500';
                borderColor = 'border-green-500';
                icon = <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400" />;
              } else if (isSelected && !isCorrectAnswer) {
                bgColor = 'bg-red-50 dark:bg-red-900/30 border-red-500';
                borderColor = 'border-red-500';
                icon = <X className="w-4 h-4 md:w-5 md:h-5 text-red-600 dark:text-red-400" />;
              }
            } else if (isSelected) {
              bgColor = 'bg-blue-50 dark:bg-blue-900/30 border-blue-500';
              borderColor = 'border-blue-500';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-3 md:p-4 rounded-xl border-2 ${borderColor} ${bgColor} text-left transition-all flex items-center justify-between group ${
                  !showResult && 'hover:scale-102'
                }`}
              >
                <span className="font-medium text-sm md:text-base text-gray-900 dark:text-white">{option}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className={`p-3 md:p-4 rounded-xl mb-4 md:mb-6 ${
            isCorrect ? 'bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800' : 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800'
          }`}>
            <p className={`font-medium mb-2 text-sm md:text-base ${isCorrect ? 'text-green-900 dark:text-green-300' : 'text-blue-900 dark:text-blue-300'}`}>
              {isCorrect ? '✅ Correct !' : '💡 Explication'}
            </p>
            <p className={`text-xs md:text-sm ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-blue-800 dark:text-blue-300'}`}>
              {question.explanation}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className={`flex-1 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base transition-all ${
                selectedAnswer === null
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
              }`}
            >
              Vérifier
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 md:py-4 rounded-xl font-bold text-sm md:text-base hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {currentQuestion < questions.length - 1 ? 'Suivant' : 'Terminer'}
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;