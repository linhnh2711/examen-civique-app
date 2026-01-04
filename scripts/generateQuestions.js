/**
 * Script to generate complete questions with options, answers, and explanations
 * Uses Claude API to generate high-quality French civics questions
 *
 * Usage:
 * 1. Add your ANTHROPIC_API_KEY to .env file
 * 2. Run: node scripts/generateQuestions.js
 */

import Anthropic from '@anthropic-ai/sdk';
import { cspQuestions, crQuestions } from './questionData.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

// Find common questions (appear in both CSP and CR)
function findCommonQuestions() {
  const cspSet = new Set(cspQuestions.map(q => q.q.toLowerCase().trim()));
  const commonQuestions = crQuestions.filter(q => cspSet.has(q.q.toLowerCase().trim()));
  return new Set(commonQuestions.map(q => q.q.toLowerCase().trim()));
}

// Generate questions in batches using Claude
async function generateQuestionsWithClaude(questions, commonQuestionsSet, examType) {
  const batchSize = 20; // Process 20 questions at a time
  const allGeneratedQuestions = [];
  let currentId = allGeneratedQuestions.length + 1;

  console.log(`\nGenerating ${questions.length} ${examType} questions in batches of ${batchSize}...`);

  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, Math.min(i + batchSize, questions.length));
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(questions.length / batchSize)}...`);

    const questionsText = batch.map((q, idx) => {
      const isCommon = commonQuestionsSet.has(q.q.toLowerCase().trim());
      const tags = isCommon ? "['CSP', 'CR']" : `['${examType}']`;
      return `${i + idx + 1}. "${q.q}" (Category: ${q.cat}, Tags: ${tags})`;
    }).join('\n');

    const prompt = `Tu es un expert en droit français et civisme. Génère des questions QCM complètes pour l'examen civique français.

Pour chaque question ci-dessous, crée:
1. 4 options de réponse plausibles en français (dont 1 seule correcte)
2. L'index de la bonne réponse (0-3)
3. Une explication claire en 1-2 phrases

QUESTIONS:
${questionsText}

FORMAT DE SORTIE (JSON array):
[
  {
    "question": "La question exactement comme donnée",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 1,
    "explanation": "Explication de la réponse correcte.",
    "category": "Category name",
    "tags": ["CSP"] ou ["CR"] ou ["CSP", "CR"]
  },
  ...
]

RÈGLES IMPORTANTES:
- Les 4 options doivent être plausibles et crédibles
- Une seule option est correcte
- L'explication doit être factuelle et éducative
- Utilise les vraies données officielles françaises
- Garde la question EXACTEMENT comme fournie
- Respecte les tags indiqués pour chaque question

Retourne UNIQUEMENT le tableau JSON, sans markdown ni texte supplémentaire.`;

    try {
      const message = await client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 16000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const responseText = message.content[0].text;

      // Extract JSON from response (handle potential markdown code blocks)
      let jsonText = responseText.trim();
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }

      const generatedQuestions = JSON.parse(jsonText);

      // Add IDs to generated questions
      const questionsWithIds = generatedQuestions.map((q, idx) => ({
        id: currentId++,
        ...q
      }));

      allGeneratedQuestions.push(...questionsWithIds);
      console.log(`✓ Generated ${questionsWithIds.length} questions (Total: ${allGeneratedQuestions.length})`);

      // Rate limiting: wait 1 second between batches
      if (i + batchSize < questions.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (error) {
      console.error(`Error generating batch ${Math.floor(i / batchSize) + 1}:`, error.message);
      console.error('Response text:', error.response?.text || 'No response');
      // Continue with next batch instead of failing completely
    }
  }

  return allGeneratedQuestions;
}

// Main function
async function main() {
  console.log('🚀 Starting question generation...');
  console.log(`CSP Questions: ${cspQuestions.length}`);
  console.log(`CR Questions: ${crQuestions.length}`);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ Error: ANTHROPIC_API_KEY environment variable is not set');
    console.log('Please set it with: $env:ANTHROPIC_API_KEY="your-api-key" (PowerShell)');
    console.log('Or: set ANTHROPIC_API_KEY=your-api-key (CMD)');
    process.exit(1);
  }

  const commonQuestionsSet = findCommonQuestions();
  console.log(`\nFound ${commonQuestionsSet.size} common questions between CSP and CR`);

  // Generate all questions
  const allQuestions = [];

  // Generate CSP questions
  const cspGenerated = await generateQuestionsWithClaude(cspQuestions, commonQuestionsSet, 'CSP');
  allQuestions.push(...cspGenerated);

  // Generate CR-only questions (excluding common ones)
  const crOnlyQuestions = crQuestions.filter(q => !commonQuestionsSet.has(q.q.toLowerCase().trim()));
  if (crOnlyQuestions.length > 0) {
    // Reset ID counter to continue from last CSP question
    const crGenerated = await generateQuestionsWithClaude(crOnlyQuestions, commonQuestionsSet, 'CR');
    // Update IDs to be continuous
    const updatedCrQuestions = crGenerated.map((q, idx) => ({
      ...q,
      id: cspGenerated.length + idx + 1
    }));
    allQuestions.push(...updatedCrQuestions);
  }

  console.log(`\n✅ Total generated questions: ${allQuestions.length}`);

  // Count by tag
  const cspCount = allQuestions.filter(q => q.tags.includes('CSP')).length;
  const crCount = allQuestions.filter(q => q.tags.includes('CR')).length;
  const commonCount = allQuestions.filter(q => q.tags.includes('CSP') && q.tags.includes('CR')).length;

  console.log(`\nQuestion counts:`);
  console.log(`- CSP total: ${cspCount} (${commonCount} common)`);
  console.log(`- CR total: ${crCount} (${commonCount} common)`);
  console.log(`- CSP-only: ${cspCount - commonCount}`);
  console.log(`- CR-only: ${crCount - commonCount}`);

  // Generate the complete questions.js file
  const outputContent = `// Database câu hỏi với tags CSP/CR
// Auto-generated by scripts/generateQuestions.js
// Total: ${cspCount} CSP + ${crCount} CR questions

export const questionsDB = ${JSON.stringify(allQuestions, null, 2)};

// Helper functions
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const shuffleQuestion = (question) => {
  const correctAnswer = question.options[question.correct];
  const shuffledOptions = shuffleArray(question.options);
  const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);

  return {
    ...question,
    options: shuffledOptions,
    correct: newCorrectIndex
  };
};

// Get questions by type (CSP or CR)
export const getQuestionsByType = (type, count) => {
  const filtered = questionsDB.filter(q => q.tags.includes(type));
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  return selected.map(q => shuffleQuestion(q));
};

// Get random questions (old function for backward compatibility)
export const getRandomQuestions = (count = 15) => {
  return getQuestionsByType('CSP', count);
};

// Get all questions for a type
export const getAllQuestions = (type = 'CSP') => {
  const filtered = questionsDB.filter(q => q.tags.includes(type));
  return filtered.map(q => shuffleQuestion(q));
};

// Get total count by type
export const getTotalQuestionsByType = (type) => {
  return questionsDB.filter(q => q.tags.includes(type)).length;
};

// Export for stats
export const TOTAL_QUESTIONS = {
  CSP: ${cspCount},
  CR: ${crCount}
};
`;

  // Write to file
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'questions.js');
  fs.writeFileSync(outputPath, outputContent, 'utf-8');

  console.log(`\n✅ Successfully generated questions.js at ${outputPath}`);
  console.log('\n🎉 Done!');
}

main().catch(console.error);
