import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import QuizPage from './components/QuizPage';
import ResultPage from './components/ResultPage';
import ExamenBlancPage from './components/ExamenBlancPage';
import ExamenResultPage from './components/ExamenResultPage';
import InstallPrompt from './components/InstallPrompt';
import { loadStats, saveStats } from './utils/storage';

const App = () => {
  const [mode, setMode] = useState('home');
  useEffect(() => {
  console.log('Current mode:', mode);
}, [mode]);
  const [stats, setStats] = useState({ total: 0, correct: 0, streak: 0, bestStreak: 0 });
  const [currentStreak, setCurrentStreak] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [examenResult, setExamenResult] = useState(null);
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

  const handleBackHome = () => {
    setMode('home');
    setCurrentStreak(0);
  };

  return (
    <>
      {mode === 'home' && (
        <HomePage
          stats={stats}
          onStartQuiz={() => setMode('quiz')}
          onStartExamen={() => setMode('examen')}
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
          onBack={handleBackHome}
          onComplete={(result) => {
            setExamenResult(result);
            setMode('examen-result');
          }}
        />
      )}

      {mode === 'examen-result' && (
        <ExamenResultPage
          result={examenResult}
          onBackHome={handleBackHome}
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