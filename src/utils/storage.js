// Storage for stats
export const loadStats = () => {
  try {
    const saved = localStorage.getItem('examen-stats');
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.error('Load error:', err);
    return null;
  }
};

export const saveStats = (stats) => {
  try {
    localStorage.setItem('examen-stats', JSON.stringify(stats));
  } catch (err) {
    console.error('Save error:', err);
  }
};

// NEW: Storage for learned questions (câu đã học)
export const loadLearnedQuestions = () => {
  try {
    const saved = localStorage.getItem('learned-questions');
    return saved ? JSON.parse(saved) : { CSP: [], CR: [] };
  } catch (err) {
    console.error('Load learned questions error:', err);
    return { CSP: [], CR: [] };
  }
};

export const saveLearnedQuestions = (learnedQuestions) => {
  try {
    localStorage.setItem('learned-questions', JSON.stringify(learnedQuestions));
  } catch (err) {
    console.error('Save learned questions error:', err);
  }
};

// Mark question as learned (khi user đã trả lời)
export const markQuestionAsLearned = (questionId, questionTags) => {
  const learned = loadLearnedQuestions();
  
  questionTags.forEach(tag => {
    if (!learned[tag].includes(questionId)) {
      learned[tag].push(questionId);
    }
  });
  
  saveLearnedQuestions(learned);
  return learned;
};

// Get progress for a type
export const getProgress = (type) => {
  const learned = loadLearnedQuestions();
  // Dynamically import questionsDB to get real total
  const { questionsDB } = require('../data/questions');

  // Get all question IDs that have this type tag
  const validQuestionIds = new Set(
    questionsDB.filter(q => q.tags.includes(type)).map(q => q.id)
  );

  const totalQuestions = validQuestionIds.size;

  // Count only learned questions that actually belong to this type
  const learnedSet = new Set(learned[type] || []);
  const validLearnedCount = Array.from(learnedSet).filter(id => validQuestionIds.has(id)).length;

  return {
    learned: validLearnedCount,
    total: totalQuestions,
    percentage: totalQuestions > 0 ? Math.round((validLearnedCount / totalQuestions) * 100) : 0
  };
};

// Reset learned questions (for testing)
export const resetLearnedQuestions = () => {
  localStorage.removeItem('learned-questions');
};

// Quiz History Storage
export const loadQuizHistory = () => {
  try {
    const saved = localStorage.getItem('quiz-history');
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Load quiz history error:', err);
    return [];
  }
};

export const saveQuizHistory = (history) => {
  try {
    localStorage.setItem('quiz-history', JSON.stringify(history));
  } catch (err) {
    console.error('Save quiz history error:', err);
  }
};

export const addQuizResult = (result) => {
  const history = loadQuizHistory();
  history.push({
    ...result,
    date: new Date().toISOString()
  });
  // Keep only last 50 results
  if (history.length > 50) {
    history.shift();
  }
  saveQuizHistory(history);
};

// Wrong Answers Storage
export const loadWrongAnswers = () => {
  try {
    const saved = localStorage.getItem('wrong-answers');
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Load wrong answers error:', err);
    return [];
  }
};

export const saveWrongAnswers = (wrongAnswers) => {
  try {
    localStorage.setItem('wrong-answers', JSON.stringify(wrongAnswers));
  } catch (err) {
    console.error('Save wrong answers error:', err);
  }
};

export const addWrongAnswer = (questionId, userAnswer, correctAnswer) => {
  const wrongAnswers = loadWrongAnswers();
  const existing = wrongAnswers.find(w => w.questionId === questionId);

  if (existing) {
    existing.attempts++;
    existing.lastAttempt = new Date().toISOString();
  } else {
    wrongAnswers.push({
      questionId,
      userAnswer,
      correctAnswer,
      attempts: 1,
      lastAttempt: new Date().toISOString()
    });
  }

  saveWrongAnswers(wrongAnswers);
};

export const removeWrongAnswer = (questionId) => {
  const wrongAnswers = loadWrongAnswers();
  const filtered = wrongAnswers.filter(w => w.questionId !== questionId);
  saveWrongAnswers(filtered);
};

// Saved Questions Storage (Questions favorites/enregistrées - for QCM mode)
export const loadSavedQuestions = () => {
  try {
    const saved = localStorage.getItem('saved-questions');
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Load saved questions error:', err);
    return [];
  }
};

export const saveSavedQuestions = (savedQuestions) => {
  try {
    localStorage.setItem('saved-questions', JSON.stringify(savedQuestions));
  } catch (err) {
    console.error('Save saved questions error:', err);
  }
};

export const toggleSavedQuestion = (questionId) => {
  const savedQuestions = loadSavedQuestions();
  const index = savedQuestions.indexOf(questionId);

  if (index > -1) {
    // Question already saved, remove it
    savedQuestions.splice(index, 1);
  } else {
    // Add question to saved
    savedQuestions.push(questionId);
  }

  saveSavedQuestions(savedQuestions);
  return savedQuestions;
};

export const isQuestionSaved = (questionId) => {
  const savedQuestions = loadSavedQuestions();
  return savedQuestions.includes(questionId);
};

// Note: Saved flashcards now use the same storage as saved questions
// since both store only question + correct answer

// Selected Exam Type Storage (CSP or CR)
export const loadSelectedExamType = () => {
  try {
    const saved = localStorage.getItem('selected-exam-type');
    return saved || 'CSP'; // Default to CSP
  } catch (err) {
    console.error('Load selected exam type error:', err);
    return 'CSP';
  }
};

export const saveSelectedExamType = (examType) => {
  try {
    localStorage.setItem('selected-exam-type', examType);
  } catch (err) {
    console.error('Save selected exam type error:', err);
  }
};

// Calculate Precision based on recent quiz history
export const calculatePrecision = (examType) => {
  const history = loadQuizHistory();

  // Filter by exam type
  const filteredHistory = history.filter(entry => entry.type === examType);

  if (filteredHistory.length === 0) {
    return {
      percentage: 0,
      isExamen: false,
      count: 0,
      description: 'Aucun quiz effectué'
    };
  }

  // Check if user has done any Examen Blanc for this type
  const examenHistory = filteredHistory.filter(entry => entry.mode === 'Examen Blanc');

  let relevantHistory;
  let isExamen = false;

  if (examenHistory.length > 0) {
    // User has done examen blanc - use only examen blanc results
    relevantHistory = examenHistory.slice(-5); // Last 5 examen blanc
    isExamen = true;
  } else {
    // No examen blanc - use quiz pratique results
    relevantHistory = filteredHistory.slice(-5); // Last 5 quiz
  }

  // Calculate average precision
  const totalQuestions = relevantHistory.reduce((sum, entry) => sum + (entry.total || 0), 0);
  const totalCorrect = relevantHistory.reduce((sum, entry) => sum + (entry.score || 0), 0);

  const percentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return {
    percentage,
    isExamen,
    count: relevantHistory.length,
    description: isExamen
      ? `Moyenne des ${relevantHistory.length} dernier${relevantHistory.length > 1 ? 's' : ''} examen${relevantHistory.length > 1 ? 's' : ''} blanc${relevantHistory.length > 1 ? 's' : ''}`
      : `Moyenne des ${relevantHistory.length} dernier${relevantHistory.length > 1 ? 's' : ''} quiz`
  };
};

// Answered Questions Storage (alias for learned questions for Firebase sync)
export const loadAnsweredQuestions = () => {
  return loadLearnedQuestions();
};

export const saveAnsweredQuestions = (answeredQuestions) => {
  saveLearnedQuestions(answeredQuestions);
};

// Save individual answered question (for flashcards)
export const saveAnsweredQuestion = (questionId, isCorrect) => {
  const answeredQuestions = loadAnsweredQuestions();

  if (!answeredQuestions[questionId]) {
    answeredQuestions[questionId] = {
      id: questionId,
      correct: 0,
      total: 0,
      lastAnswered: Date.now()
    };
  }

  answeredQuestions[questionId].total += 1;
  if (isCorrect) {
    answeredQuestions[questionId].correct += 1;
  }
  answeredQuestions[questionId].lastAnswered = Date.now();

  saveAnsweredQuestions(answeredQuestions);
};