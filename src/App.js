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
// InstallPrompt removed - not needed for native iOS app
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import FeedbackPage from './components/FeedbackPage';
import ExamInfoPage from './components/ExamInfoPage';
import FlashcardPage from './components/FlashcardPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import Toast from './components/Toast';
import { loadStats, saveStats, addQuizResult } from './utils/storage';
import { ThemeProvider } from './contexts/ThemeContext';
import { PaywallProvider } from './contexts/PaywallContext';
import { onAuthChange } from './services/authService';
import { downloadAndMergeCloudData, syncDataToCloud, uploadLocalData } from './services/syncService';
import { canSyncToCloud } from './services/entitlementService';

const App = () => {
  const [mode, setMode] = useState('home');
  const [quizType, setQuizType] = useState('CSP'); // CSP or CR
  const [stats, setStats] = useState({ total: 0, correct: 0, streak: 0, bestStreak: 0 });
  const [currentStreak, setCurrentStreak] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizQuestionCount, setQuizQuestionCount] = useState(15);
  const [examenResult, setExamenResult] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [toast, setToast] = useState(null); // { message, type, action }

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
  }, []);

  // PART 3 FIX: Reset scroll position on page navigation
  // This ensures every page opens at the top, not where previous page was scrolled
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [mode]);

  const updateStats = (newStats) => {
    saveStats(newStats);
    setStats(newStats);
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
    const name = displayName || authUser.displayName || '';
    
    if (name) {
      setUserName(name);
      localStorage.setItem('userName', name);
    }
    
    // Try to sync data to cloud
    const syncResult = await uploadLocalData(authUser.uid, name);
    
    // Show appropriate toast based on sync result
    if (syncResult.skipped && syncResult.reason === 'premium_required') {
      // Sync was skipped because user is not Premium Full
      setToast({
        message: 'Connexion réussie ! Pour synchroniser vos données sur le cloud, passez à Premium Full.',
        type: 'premium',
        action: null, // Will use showPaywall from context
      });
    } else if (syncResult.success && !syncResult.skipped) {
      // Sync succeeded
      setToast({
        message: 'Connexion réussie ! Vos données sont synchronisées.',
        type: 'success',
      });
    }
    
    setMode('home');
  };

  return (
    <ThemeProvider>
      <PaywallProvider>
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

      {mode === 'exam-info' && (
        <ExamInfoPage
          onBack={handleBackHome}
        />
      )}

      {mode === 'terms-of-service' && (
        <TermsOfServicePage
          onBack={handleBackHome}
        />
      )}

      {mode === 'privacy-policy' && (
        <PrivacyPolicyPage
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
          onViewExamInfo={() => setMode('exam-info')}
          onStartFlashcard={(type) => {
            setQuizType(type);
            setMode('flashcard');
          }}
          onViewTermsOfService={() => setMode('terms-of-service')}
          onViewPrivacyPolicy={() => setMode('privacy-policy')}
        />
      )}

      {mode === 'flashcard' && (
        <FlashcardPage
          examType={quizType}
          onBack={handleBackHome}
          onViewSavedQuestions={() => setMode('saved-questions')}
          onAnswer={(correct) => {
            setStats(prevStats => ({
              ...prevStats,
              total: prevStats.total + 1,
              correct: correct ? prevStats.correct + 1 : prevStats.correct
            }));
          }}
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

      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          action={toast.action}
        />
      )}

      </PaywallProvider>
    </ThemeProvider>
  );
};

export default App;