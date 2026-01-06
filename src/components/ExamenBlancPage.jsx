import React, { useState, useEffect, useCallback } from 'react';
import { Home, Clock, AlertCircle, ChevronRight, Star } from 'lucide-react';
import { getQuestionsByType } from '../data/questions';
import { markQuestionAsLearned, addWrongAnswer, toggleSavedQuestion, isQuestionSaved } from '../utils/storage';

const ExamenBlancPage = ({ onBack, onComplete, examType = 'CSP' }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes en secondes
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedQuestions, setSavedQuestions] = useState(new Set());

  // Define callbacks first before useEffect
  const calculateAndSubmit = useCallback(() => {
    let score = 0;
    questions.forEach(q => {
      const userAnswer = answers[q.id];
      if (userAnswer === q.correct) {
        score++;
      } else if (userAnswer !== undefined) {
        // Save wrong answer for review
        addWrongAnswer(q.id, userAnswer, q.correct);
      }
    });

    const passed = score >= Math.ceil(questions.length * 0.8); // 80% to pass

    onComplete({
      score,
      total: questions.length,
      answers,
      questions,
      timeSpent: (45 * 60) - timeLeft,
      passed
    });
  }, [questions, answers, timeLeft, onComplete]);

  const handleAutoSubmit = useCallback(() => {
    setIsSubmitting(true);
    calculateAndSubmit();
  }, [calculateAndSubmit]);

  // Load 40 questions aléatoires
  useEffect(() => {
    const randomQuestions = getQuestionsByType(examType, 40);
    setQuestions(randomQuestions);

    // Load saved questions status
    const saved = new Set();
    randomQuestions.forEach(q => {
      if (isQuestionSaved(q.id)) {
        saved.add(q.id);
      }
    });
    setSavedQuestions(saved);
  }, [examType]);

  // Timer countdown
  useEffect(() => {
    if (questions.length === 0 || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions, isSubmitting, handleAutoSubmit]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex
    });
    
    // Mark as learned khi user chọn đáp án
    const q = questions.find(question => question.id === questionId);
    if (q) {
      markQuestionAsLearned(q.id, q.tags);
    }
  };

  const handleSubmit = () => {
    setShowConfirmSubmit(true);
  };

  const confirmSubmit = () => {
    setIsSubmitting(true);
    calculateAndSubmit();
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

  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / questions.length) * 100;
  const timePercentage = (timeLeft / (45 * 60)) * 100;
  const isTimeLow = timeLeft < 5 * 60; // Moins de 5 minutes

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Préparation de l'examen {examType}...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const selectedAnswer = answers[question.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header avec Timer */}
        <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1 md:gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Home className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-medium text-sm md:text-base">Abandonner</span>
            </button>

            <div className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full ${
              isTimeLow ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Clock className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-bold text-base md:text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Timer progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                isTimeLow ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${timePercentage}%` }}
            />
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs md:text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} / {questions.length}
            </span>
            <span className="text-xs md:text-sm font-medium text-gray-600">
              {answeredCount} / {questions.length} réponses
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="inline-block bg-purple-100 text-purple-700 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium">
              {question.category}
            </div>
            <button
              onClick={handleToggleSave}
              className="p-2 rounded-full hover:bg-gray-100 transition-all"
              title={savedQuestions.has(question.id) ? "Retirer des favoris" : "Sauvegarder pour réviser"}
            >
              <Star
                className={`w-5 h-5 md:w-6 md:h-6 ${
                  savedQuestions.has(question.id)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-400'
                }`}
              />
            </button>
          </div>

          <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
            {question.question}
          </h2>

          <div className="space-y-2 md:space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(question.id, index)}
                  className={`w-full p-3 md:p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="font-medium text-sm md:text-base text-gray-900">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-2 md:space-y-3">
          <div className="flex gap-2 md:gap-3">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="px-4 md:px-6 py-2.5 md:py-3 bg-gray-200 text-gray-700 rounded-xl font-bold text-sm md:text-base hover:bg-gray-300 transition-all"
              >
                Précédent
              </button>
            )}

            {currentQuestion < questions.length - 1 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Suivant
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            )}
          </div>

          {/* Terminer button always available */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base hover:shadow-lg transition-all"
          >
            Terminer l'examen
          </button>
        </div>

        {/* Questions non répondues warning */}
        {answeredCount < questions.length && currentQuestion === questions.length - 1 && (
          <div className="mt-3 md:mt-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3 md:p-4 flex items-start gap-2 md:gap-3">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm md:text-base text-yellow-900">Attention</p>
              <p className="text-xs md:text-sm text-yellow-800">
                Vous n'avez répondu qu'à {answeredCount} questions sur {questions.length}.
                Les questions non répondues seront comptées comme fausses.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Terminer l'examen ?
            </h3>
            <p className="text-gray-600 mb-6">
              {answeredCount === questions.length
                ? "Vous avez répondu à toutes les questions. Voulez-vous soumettre votre examen ?"
                : `Vous n'avez répondu qu'à ${answeredCount} questions sur ${questions.length}. Les questions non répondues seront comptées comme fausses.`
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                Continuer
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Soumettre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamenBlancPage;