import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RotateCw, Bookmark, Filter, Lock, Crown, ChevronLeft, ChevronRight } from 'lucide-react';
import { getQuestionsByType } from '../data/questions';
import { toggleSavedQuestion, isQuestionSaved } from '../utils/storage';
import { useSwipeBack } from '../hooks/useSwipeBack';
import { usePaywall } from '../contexts/PaywallContext';

const FlashcardPage = ({ examType, onBack, onViewSavedQuestions }) => {
  // Enable swipe-back gesture
  useSwipeBack(onBack);
  
  // Paywall integration
  const { 
    checkFlashcardAccess, 
    canAccessFlashcard, 
    maxFlashcards,
    isPremiumBasic 
  } = usePaywall();
  
  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [savedQuestions, setSavedQuestions] = useState(new Set());
  const [selectedTheme, setSelectedTheme] = useState('Tous');
  const [availableThemes, setAvailableThemes] = useState([]);
  
  // Use refs for touch tracking (immediate access, no async state updates)
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const isSwipingRef = useRef(false);

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

  // Filter questions when theme changes (no shuffle - keep fixed order)
  useEffect(() => {
    let filtered = allQuestions;
    if (selectedTheme !== 'Tous') {
      filtered = allQuestions.filter(q => q.theme === selectedTheme);
    }
    setQuestions(filtered);
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
    const nextIndex = currentIndex + 1;
    
    // Check if next card is accessible (free users limited to 30 cards)
    if (!canAccessFlashcard(nextIndex)) {
      checkFlashcardAccess(nextIndex); // Shows paywall
      return;
    }
    
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
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
  const isDraggingRef = useRef(false);

  // Handle swipe end logic (shared between touch and mouse)
  const handleSwipeEnd = () => {
    if (touchEndX.current === null || touchStartX.current === null) {
      touchStartX.current = null;
      isSwipingRef.current = false;
      isDraggingRef.current = false;
      return;
    }

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      moveToNext();
    } else if (isRightSwipe) {
      moveToPrevious();
    }

    // Reset
    touchStartX.current = null;
    touchEndX.current = null;
    isDraggingRef.current = false;
    
    setTimeout(() => {
      isSwipingRef.current = false;
    }, 100);
  };

  // Touch events (mobile)
  const onTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
    isSwipingRef.current = false;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
    if (touchStartX.current !== null) {
      const distance = Math.abs(touchStartX.current - touchEndX.current);
      if (distance > 10) {
        isSwipingRef.current = true;
      }
    }
  };

  const onTouchEnd = () => {
    handleSwipeEnd();
  };

  // Mouse events (desktop browser)
  const onMouseDown = (e) => {
    e.preventDefault();
    touchStartX.current = e.clientX;
    touchEndX.current = null;
    isSwipingRef.current = false;
    isDraggingRef.current = true;
  };

  const onMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    touchEndX.current = e.clientX;
    if (touchStartX.current !== null) {
      const distance = Math.abs(touchStartX.current - touchEndX.current);
      if (distance > 10) {
        isSwipingRef.current = true;
      }
    }
  };

  const onMouseUp = () => {
    if (!isDraggingRef.current) return;
    handleSwipeEnd();
  };

  const onMouseLeave = () => {
    if (isDraggingRef.current) {
      handleSwipeEnd();
    }
  };
  
  // Handle direct click/tap on the card
  const handleCardClick = () => {
    if (!isSwipingRef.current) {
      handleFlip();
    }
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

        {/* Flashcard with Navigation */}
        <div className="mb-6 flex items-center gap-2 md:gap-4">
          {/* Previous Button */}
          <button
            onClick={moveToPrevious}
            disabled={currentIndex === 0}
            className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
              currentIndex === 0
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:scale-110'
            }`}
          >
            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
          </button>

          {/* Card */}
          <div
            className="relative flex-1 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing transition-all duration-300 hover:shadow-3xl select-none"
            style={{ minHeight: '400px' }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onClick={handleCardClick}
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

          {/* Next Button */}
          <button
            onClick={moveToNext}
            className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center shadow-lg hover:bg-blue-50 dark:hover:bg-gray-700 hover:scale-110 transition-all"
          >
            <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
          </button>
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
        <div className="flex flex-col items-center mb-4 gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {currentIndex + 1} / {questions.length}
          </span>
          
          {/* Free user limit indicator */}
          {!isPremiumBasic && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-full">
              <Lock className="w-3 h-3 text-orange-500" />
              <span className="text-xs text-orange-600 dark:text-orange-400">
                {Math.min(currentIndex + 1, maxFlashcards)}/{maxFlashcards} cartes gratuites
              </span>
              <Crown className="w-3 h-3 text-orange-500" />
            </div>
          )}
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
