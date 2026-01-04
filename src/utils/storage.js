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
  return {
    learned: learned[type].length,
    total: 180, // Total questions per type
    percentage: Math.round((learned[type].length / 180) * 100)
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