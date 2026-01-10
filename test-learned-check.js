// Simulate the storage logic
const loadLearnedQuestions = () => {
  try {
    const saved = localStorage.getItem('learned-questions');
    return saved ? JSON.parse(saved) : { CSP: [], CR: [] };
  } catch (err) {
    return { CSP: [], CR: [] };
  }
};

const { questionsDB } = require('./src/data/questions');

// Get CR questions
const crQuestions = questionsDB.filter(q => q.tags.includes('CR'));
console.log('Total CR questions in DB:', crQuestions.length);

// Simulate: Check for duplicates in a sample learned array
const sampleLearned = { CR: [1, 2, 3, 2, 5] }; // with duplicate

console.log('\nSample learned CR array:', sampleLearned.CR);
console.log('Length:', sampleLearned.CR.length);
console.log('Unique count:', new Set(sampleLearned.CR).size);

// The issue: learned[type].length counts ALL entries including duplicates
// But getProgress should use unique IDs only
