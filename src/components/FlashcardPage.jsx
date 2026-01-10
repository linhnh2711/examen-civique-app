import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Bookmark, Filter } from 'lucide-react';
import { getQuestionsByType } from '../data/questions';
import { toggleSavedQuestion, isQuestionSaved } from '../utils/storage';
import { useSwipeBack } from '../hooks/useSwipeBack';

const FlashcardPage = ({ examType, onBack, onViewSavedQuestions }) => {
  // Enable swipe-back gesture
  useSwipeBack(onBack);
  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [savedQuestions, setSavedQuestions] = useState(new Set());
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('Tous');
  const [availableThemes, setAvailableThemes] = useState([]);

  // Load all questions and themes
  useEffect(() => {
    const allQs = getQuestionsByType(examType);
    setAllQuestions(allQs);

    // Extract unique themes
    const themes = ['Tous', ...new Set(allQs.map(q => q.theme))];
    setAvailableThemes(themes);

    // Load saved questions
    const saved = new Set();
    allQs.forEach(q => {
      if (isQuestionSaved(q.id)) {
        saved.add(q.id);
      }
    });
    setSavedQuestions(saved);
  }, [examType]);

  // Filter and shuffle questions when theme changes
  useEffect(() => {
    let filtered = allQuestions;
    if (selectedTheme !== 'Tous') {
      filtered = allQuestions.filter(q => q.theme === selectedTheme);
    }
    // Shuffle questions
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [allQuestions, selectedTheme]);

  const currentQuestion = questions[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSaveQuestion = () => {
    if (!currentQuestion) return;

    toggleSavedQuestion(currentQuestion.id);
    setSavedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
      } else {
        newSet.add(currentQuestion.id);
      }
      return newSet;
    });
  };

  const moveToNext = () => {
    setIsFlipped(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Loop back to start
      setCurrentIndex(0);
    }
  };

  const moveToPrevious = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      // No touch movement recorded, this was a tap - flip the card
      handleFlip();
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left = next card
      moveToNext();
    } else if (isRightSwipe) {
      // Swipe right = previous card
      moveToPrevious();
    } else {
      // Small movement, treat as tap - flip the card
      handleFlip();
    }

    // Reset touch state
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6 pt-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Flashcards {examType}
          </h1>

          <button
            onClick={handleRestart}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all"
          >
            <RotateCw className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Theme Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Thème:</span>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-600 focus:outline-none"
            >
              {availableThemes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Flashcard */}
        <div className="mb-6">
          <div
            className="relative w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300 hover:shadow-3xl select-none"
            style={{ minHeight: '400px' }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={() => {
              // For mouse clicks (non-touch devices)
              if (!('ontouchstart' in window)) {
                handleFlip();
              }
            }}
          >
            {!isFlipped ? (
              /* Front Side - Question */
              <div className="p-6 md:p-8 flex flex-col justify-center items-center" style={{ minHeight: '400px' }}>
                <div className="mb-4 flex flex-col items-center gap-2">
                  <span className="text-xs md:text-sm font-semibold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    Question {currentIndex + 1}/{questions.length}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    {currentQuestion.theme}
                  </span>
                </div>
                <p className="text-lg md:text-xl font-semibold text-center text-gray-900 dark:text-white mb-4">
                  {currentQuestion.question}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
                  Cliquez pour voir la réponse
                </p>
              </div>
            ) : (
              /* Back Side - Answer */
              <div className="p-6 md:p-8 flex flex-col justify-center items-center" style={{ minHeight: '400px' }}>
                <div className="mb-6">
                  <span className="text-xs md:text-sm font-semibold px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    Réponse
                  </span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-center text-green-600 dark:text-green-400">
                  {currentQuestion.options[currentQuestion.correct]}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
                  Cliquez pour revenir à la question
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleSaveQuestion}
            className={`flex items-center gap-2 py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all ${
              savedQuestions.has(currentQuestion?.id)
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${savedQuestions.has(currentQuestion?.id) ? 'fill-current' : ''}`} />
            {savedQuestions.has(currentQuestion?.id) ? 'Enregistré' : 'Enregistrer cette carte'}
          </button>
        </div>

        {/* Card Counter */}
        <div className="flex justify-center mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Saved Questions Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => onViewSavedQuestions && onViewSavedQuestions()}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all hover:scale-105 min-w-[200px] border-2 border-yellow-200 dark:border-yellow-800 hover:border-yellow-400 dark:hover:border-yellow-600"
          >
            <div className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">
              {savedQuestions.size}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Questions enregistrées
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
              Cliquez pour voir →
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardPage;
