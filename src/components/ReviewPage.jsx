import React, { useState, useEffect } from 'react';
import { Home, Check, X, ChevronRight, BookMarked } from 'lucide-react';
import { loadWrongAnswers, removeWrongAnswer } from '../utils/storage';
import { questionsDB } from '../data/questions';

const ReviewPage = ({ onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    loadWrongAnswersData();
  }, []);

  const loadWrongAnswersData = () => {
    const wrong = loadWrongAnswers();

    // Get full question data
    const questionData = wrong.map(w => {
      const q = questionsDB.find(q => q.id === w.questionId);
      return { ...q, wrongData: w };
    }).filter(q => q.id); // Filter out not found

    setQuestions(questionData);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-3xl mx-auto p-4 md:p-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mb-4 md:mb-6"
          >
            <Home className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-medium text-sm md:text-base">Accueil</span>
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Check className="w-8 h-8 md:w-10 md:h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">Excellent travail !</h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 md:mb-6">
              Vous n'avez aucune question à réviser pour le moment.
            </p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-medium text-sm md:text-base hover:shadow-lg transition-all"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentIndex];

  const handleAnswerSelect = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);

    // If correct, remove from wrong answers
    if (selectedAnswer === question.correct) {
      removeWrongAnswer(question.id);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Reload data to reflect removals
      loadWrongAnswersData();
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
    }
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
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1 md:gap-2 bg-red-100 dark:bg-red-900/50 px-2 md:px-3 py-1 rounded-full">
              <BookMarked className="w-3 h-3 md:w-4 md:h-4 text-red-600 dark:text-red-400" />
              <span className="font-bold text-xs md:text-sm text-red-600 dark:text-red-400">{questions.length}</span>
            </div>
            <div className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">
              {currentIndex + 1} / {questions.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 md:mb-8">
          <div
            className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Category and attempts */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium">
            {question.category}
          </div>
          <div className="inline-block bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium">
            {question.wrongData.attempts} {question.wrongData.attempts > 1 ? 'erreurs' : 'erreur'}
          </div>
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
                className={`w-full p-3 md:p-4 rounded-xl border-2 ${borderColor} ${bgColor} text-left transition-all flex items-center justify-between group ${!showResult && 'hover:scale-102'
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
          <div className={`p-4 rounded-xl mb-6 ${isCorrect ? 'bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800' : 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800'
            }`}>
            <p className={`font-medium mb-2 ${isCorrect ? 'text-green-900 dark:text-green-300' : 'text-blue-900 dark:text-blue-300'}`}>
              {isCorrect ? '✅ Parfait ! Cette question a été retirée de votre liste de révision.' : '💡 Explication'}
            </p>
            <p className={isCorrect ? 'text-green-800 dark:text-green-300' : 'text-blue-800 dark:text-blue-300'}>
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
              className={`flex-1 py-4 rounded-xl font-bold transition-all ${selectedAnswer === null
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
              {currentIndex < questions.length - 1 ? 'Suivant' : 'Terminer'}
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
