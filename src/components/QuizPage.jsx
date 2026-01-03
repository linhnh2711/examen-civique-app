import React, { useState, useEffect } from 'react';
import { Home, Flame, Check, X, ChevronRight } from 'lucide-react';
import { getRandomQuestions } from '../data/questions';

const QuizPage = ({ stats, currentStreak, onUpdateStats, onStreakUpdate, onComplete, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // Lấy 15 câu hỏi random khi component mount
  useEffect(() => {
    const randomQuestions = getRandomQuestions(15);
    setQuestions(randomQuestions);
  }, []);

  // Đợi questions load xong
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des questions...</p>
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

  const isCorrect = showResult && selectedAnswer === question.correct;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Accueil</span>
          </button>
          <div className="flex items-center gap-4">
            {currentStreak > 0 && (
              <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full">
                <Flame className="w-4 h-4 text-orange-600" />
                <span className="font-bold text-orange-600">{currentStreak}</span>
              </div>
            )}
            <div className="text-sm font-medium text-gray-600">
              {currentQuestion + 1} / {questions.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Category */}
        <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          {question.category}
        </div>

        {/* Question */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === question.correct;
            
            let bgColor = 'bg-white hover:bg-gray-50';
            let borderColor = 'border-gray-200';
            let icon = null;

            if (showResult) {
              if (isCorrectAnswer) {
                bgColor = 'bg-green-50 border-green-500';
                borderColor = 'border-green-500';
                icon = <Check className="w-5 h-5 text-green-600" />;
              } else if (isSelected && !isCorrectAnswer) {
                bgColor = 'bg-red-50 border-red-500';
                borderColor = 'border-red-500';
                icon = <X className="w-5 h-5 text-red-600" />;
              }
            } else if (isSelected) {
              bgColor = 'bg-blue-50 border-blue-500';
              borderColor = 'border-blue-500';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl border-2 ${borderColor} ${bgColor} text-left transition-all flex items-center justify-between group ${
                  !showResult && 'hover:scale-102'
                }`}
              >
                <span className="font-medium text-gray-900">{option}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className={`p-4 rounded-xl mb-6 ${
            isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-blue-50 border-2 border-blue-200'
          }`}>
            <p className={`font-medium mb-2 ${isCorrect ? 'text-green-900' : 'text-blue-900'}`}>
              {isCorrect ? '✅ Correct !' : '💡 Explication'}
            </p>
            <p className={isCorrect ? 'text-green-800' : 'text-blue-800'}>
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
              className={`flex-1 py-4 rounded-xl font-bold transition-all ${
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
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {currentQuestion < questions.length - 1 ? 'Suivant' : 'Terminer'}
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;