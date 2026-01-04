import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import QuizPage from './components/QuizPage';
import ResultPage from './components/ResultPage';
import ExamenBlancPage from './components/ExamenBlancPage';
import ExamenResultPage from './components/ExamenResultPage';
import StatsPage from './components/StatsPage';
import ReviewPage from './components/ReviewPage';
import CategoryProgressPage from './components/CategoryProgressPage';
import CategoryStatsPage from './components/CategoryStatsPage';
import InstallPrompt from './components/InstallPrompt';
import { loadStats, saveStats, addQuizResult } from './utils/storage';
import { ThemeProvider } from './contexts/ThemeContext';

const App = () => {
  const [mode, setMode] = useState('home');
  const [quizType, setQuizType] = useState('CSP'); // CSP or CR
  const [stats, setStats] = useState({ total: 0, correct: 0, streak: 0, bestStreak: 0 });
  const [currentStreak, setCurrentStreak] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [examenResult, setExamenResult] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const savedStats = loadStats();
    if (savedStats) setStats(savedStats);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS && !isStandalone) {
      setTimeout(() => setShowInstallPrompt(true), 3000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const updateStats = (newStats) => {
    saveStats(newStats);
    setStats(newStats);
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
    setShowInstallPrompt(false);
  };

  const handleBackHome = () => {
    setMode('home');
    setCurrentStreak(0);
  };

  const handleQuizComplete = (score) => {
    setQuizScore(score);
    // Save to history
    addQuizResult({
      type: quizType,
      mode: 'Practice',
      score: score,
      total: 15,
      passed: score >= 12
    });
    setMode('result');
  };

  const handleExamenComplete = (result) => {
    setExamenResult(result);
    // Save to history
    addQuizResult({
      type: quizType,
      mode: 'Examen Blanc',
      score: result.score,
      total: result.totalQuestions,
      passed: result.passed,
      timeSpent: result.timeSpent
    });
    setMode('examen-result');
  };

  return (
    <ThemeProvider>
      {mode === 'home' && (
        <HomePage
          stats={stats}
          onStartQuiz={(type) => {
            setQuizType(type);
            setMode('quiz');
          }}
          onStartExamen={(type) => {
            setQuizType(type);
            setMode('examen');
          }}
          onViewStats={() => setMode('stats')}
          onReviewWrong={() => setMode('review')}
          onViewCategoryProgress={(type) => {
            setQuizType(type);
            setMode('category-progress');
          }}
        />
      )}
      
      {mode === 'quiz' && (
        <QuizPage
          stats={stats}
          currentStreak={currentStreak}
          quizType={quizType}
          onUpdateStats={updateStats}
          onStreakUpdate={setCurrentStreak}
          onComplete={handleQuizComplete}
          onBack={handleBackHome}
        />
      )}

      {mode === 'result' && (
        <ResultPage
          score={quizScore}
          currentStreak={currentStreak}
          onBackHome={handleBackHome}
          totalQuestions={15}
        />
      )}

      {mode === 'examen' && (
        <ExamenBlancPage
          examType={quizType}
          onBack={handleBackHome}
          onComplete={handleExamenComplete}
        />
      )}

      {mode === 'examen-result' && (
        <ExamenResultPage
          result={examenResult}
          onBackHome={handleBackHome}
        />
      )}

      {mode === 'stats' && (
        <StatsPage
          stats={stats}
          onBack={handleBackHome}
          onViewCategoryProgress={(type) => {
            setQuizType(type);
            setMode('category-stats');
          }}
        />
      )}

      {mode === 'review' && (
        <ReviewPage
          onBack={handleBackHome}
        />
      )}

      {mode === 'category-progress' && (
        <CategoryProgressPage
          examType={quizType}
          onBack={handleBackHome}
          onStartCategoryQuiz={(type, category) => {
            setQuizType(type);
            setSelectedCategory(category);
            setMode('quiz');
          }}
        />
      )}

      {mode === 'category-stats' && (
        <CategoryStatsPage
          examType={quizType}
          onBack={() => setMode('stats')}
        />
      )}

      {showInstallPrompt && (
        <InstallPrompt
          onInstall={handleInstall}
          onClose={() => setShowInstallPrompt(false)}
        />
      )}
    </ThemeProvider>
  );
};

export default App;