const { questionsDB } = require('./src/data/questions');

const crQuestions = questionsDB.filter(q => q.tags.includes('CR'));
console.log('Total CR questions:', crQuestions.length);

const themes = {};
crQuestions.forEach(q => {
  if (!themes[q.theme]) themes[q.theme] = 0;
  themes[q.theme]++;
});

console.log('\nBy theme:');
Object.keys(themes).sort().forEach(theme => {
  console.log(`  ${theme}: ${themes[theme]}`);
});

console.log('\nSum of all themes:', Object.values(themes).reduce((a,b) => a+b, 0));
