import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import QuizPage from './components/QuizPage';
import QuizSetupPage from './components/QuizSetupPage';
import ResultPage from './components/ResultPage';
import ExamenBlancPage from './components/ExamenBlancPage';
import ExamenResultPage from './components/ExamenResultPage';
import StatsPage from './components/StatsPage';
import ReviewPage from './components/ReviewPage';
import SavedQuestionsPage from './components/SavedQuestionsPage';
import CategoryProgressPage from './components/CategoryProgressPage';
import CategoryStatsPage from './components/CategoryStatsPage';
import InstallPrompt from './components/InstallPrompt';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import FeedbackPage from './components/FeedbackPage';
import { loadStats, saveStats, addQuizResult } from './utils/storage';
import { ThemeProvider } from './contexts/ThemeContext';
import { onAuthChange } from './services/authService';
import { downloadAndMergeCloudData, syncDataToCloud, uploadLocalData } from './services/syncService';

const App = () => {
  const [mode, setMode] = useState('home');
  const [quizType, setQuizType] = useState('CSP'); // CSP or CR
  const [stats, setStats] = useState({ total: 0, correct: 0, streak: 0, bestStreak: 0 });
  const [currentStreak, setCurrentStreak] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizQuestionCount, setQuizQuestionCount] = useState(15);
  const [examenResult, setExamenResult] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');

  // Load userName from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
      console.log('Loaded userName from localStorage:', savedName);
    }
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        console.log('Auth user:', authUser.email);
        // Load user name from localStorage if available
        const savedName = localStorage.getItem('userName');
        console.log('Saved name in localStorage:', savedName);
        if (savedName) {
          setUserName(savedName);
        } else if (authUser.displayName) {
          setUserName(authUser.displayName);
        }

        // Sync data from Firestore on login
        console.log('User authenticated, syncing data...');
        const syncResult = await downloadAndMergeCloudData(authUser.uid);

        if (syncResult.success) {
          // Reload stats after merge
          const updatedStats = loadStats();
          if (updatedStats) setStats(updatedStats);

          // Set userName from cloud data if available
          if (syncResult.userName) {
            console.log('Setting userName from Firebase:', syncResult.userName);
            setUserName(syncResult.userName);
            localStorage.setItem('userName', syncResult.userName);
          } else {
            console.log('No userName in syncResult');
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

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

  const handleQuizComplete = async (score) => {
    setQuizScore(score);
    // Save to history
    const quizResult = {
      type: quizType,
      mode: 'Practice',
      score: score,
      total: quizQuestionCount,
      passed: score >= Math.ceil(quizQuestionCount * 0.8)
    };
    addQuizResult(quizResult);

    // Sync to cloud in background (don't block UI)
    if (user) {
      const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
      syncDataToCloud(user.uid, 'quizHistory', history).catch(err => {
        console.error('Failed to sync quiz data:', err);
      });
    }

    setMode('result');
  };

  const handleExamenComplete = async (result) => {
    setExamenResult(result);
    // Save to history
    const quizResult = {
      type: quizType,
      mode: 'Examen Blanc',
      score: result.score,
      total: result.total,
      passed: result.passed,
      timeSpent: result.timeSpent
    };
    addQuizResult(quizResult);

    // Sync to cloud in background (don't block UI)
    if (user) {
      const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
      syncDataToCloud(user.uid, 'quizHistory', history).catch(err => {
        console.error('Failed to sync exam data:', err);
      });
    }

    setMode('examen-result');
  };

  const handleLoginSuccess = async (authUser, displayName) => {
    setUser(authUser);
    if (displayName) {
      setUserName(displayName);
      localStorage.setItem('userName', displayName);
      // Upload userName to Firestore
      await uploadLocalData(authUser.uid, displayName);
    } else if (authUser.displayName) {
      setUserName(authUser.displayName);
      localStorage.setItem('userName', authUser.displayName);
      await uploadLocalData(authUser.uid, authUser.displayName);
    }
    setMode('home');
  };

  return (
    <ThemeProvider>
      {mode === 'login' && (
        <LoginPage
          onBack={handleBackHome}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {mode === 'profile' && (
        <ProfilePage
          user={user}
          userName={userName}
          onBack={handleBackHome}
          onUpdateUserName={(newName) => setUserName(newName)}
        />
      )}

      {mode === 'feedback' && (
        <FeedbackPage
          user={user}
          userName={userName}
          onBack={handleBackHome}
        />
      )}

      {mode === 'home' && (
        <HomePage
          stats={stats}
          user={user}
          userName={userName}
          onStartQuiz={(type) => {
            setQuizType(type);
            setMode('quiz-setup');
          }}
          onStartExamen={(type) => {
            setQuizType(type);
            setMode('examen');
          }}
          onViewStats={() => setMode('stats')}
          onReviewWrong={() => setMode('review')}
          onViewSavedQuestions={() => setMode('saved-questions')}
          onViewCategoryProgress={(type) => {
            setQuizType(type);
            setMode('category-progress');
          }}
          onLogin={() => setMode('login')}
          onViewProfile={() => setMode('profile')}
          onFeedback={() => setMode('feedback')}
        />
      )}

      {mode === 'quiz-setup' && (
        <QuizSetupPage
          examType={quizType}
          onStart={(count) => {
            setQuizQuestionCount(count);
            setMode('quiz');
          }}
          onBack={handleBackHome}
        />
      )}
      
      {mode === 'quiz' && (
        <QuizPage
          stats={stats}
          currentStreak={currentStreak}
          quizType={quizType}
          totalQuestions={quizQuestionCount}
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
          totalQuestions={quizQuestionCount}
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

      {mode === 'saved-questions' && (
        <SavedQuestionsPage
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
          onNavigateToPractice={() => setMode('category-progress')}
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