import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import QuizPage from './components/QuizPage';
import ResultPage from './components/ResultPage';
import InstallPrompt from './components/InstallPrompt';
import { loadStats, saveStats } from './utils/storage';

const App = () => {
  const [mode, setMode] = useState('home');
  const [stats, setStats] = useState({ total: 0, correct: 0, streak: 0, bestStreak: 0 });
  const [currentStreak, setCurrentStreak] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

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

  return (
    <>
      {mode === 'home' && (
        <HomePage
          stats={stats}
          onStartQuiz={() => setMode('quiz')}
        />
      )}
      
      {mode === 'quiz' && (
        <QuizPage
          stats={stats}
          currentStreak={currentStreak}
          onUpdateStats={updateStats}
          onStreakUpdate={setCurrentStreak}
          onComplete={(score) => {
            setQuizScore(score);
            setMode('result');
          }}
          onBack={() => setMode('home')}
        />
      )}
      
      {mode === 'result' && (
        <ResultPage
          score={quizScore}
          currentStreak={currentStreak}
          onBackHome={() => setMode('home')}
        />
      )}

      {showInstallPrompt && (
        <InstallPrompt
          onInstall={handleInstall}
          onClose={() => setShowInstallPrompt(false)}
        />
      )}
    </>
  );
};

export default App;