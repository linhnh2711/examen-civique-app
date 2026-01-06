import React, { useState, useEffect } from 'react';
import { Home, Star, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { loadSavedQuestions, toggleSavedQuestion } from '../utils/storage';
import { questionsDB } from '../data/questions';

const SavedQuestionsPage = ({ onBack }) => {
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  useEffect(() => {
    const savedIds = loadSavedQuestions();
    const questions = questionsDB.filter(q => savedIds.includes(q.id));
    setSavedQuestions(questions);
  }, []);

  const handleRemove = (questionId) => {
    toggleSavedQuestion(questionId);
    setSavedQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const toggleExpanded = (questionId) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Group by exam type
  const cspQuestions = savedQuestions.filter(q => q.tags.includes('CSP'));
  const crQuestions = savedQuestions.filter(q => q.tags.includes('CR'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Accueil</span>
          </button>
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <Star className="w-6 h-6 fill-yellow-400" />
            <span className="font-bold text-lg">{savedQuestions.length}</span>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Questions enregistrées
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Révisez vos questions sauvegardées pour un apprentissage personnalisé
        </p>

        {savedQuestions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
            <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Aucune question enregistrée
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Cliquez sur l'étoile pendant vos quiz pour sauvegarder des questions
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* CSP Questions */}
            {cspQuestions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-bold">
                    CSP
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {cspQuestions.length} question{cspQuestions.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-3">
                  {cspQuestions.map((q, index) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      index={index}
                      isExpanded={expandedQuestions.has(q.id)}
                      onToggleExpand={() => toggleExpanded(q.id)}
                      onRemove={() => handleRemove(q.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* CR Questions */}
            {crQuestions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-bold">
                    CR
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {crQuestions.length} question{crQuestions.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-3">
                  {crQuestions.map((q, index) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      index={index}
                      isExpanded={expandedQuestions.has(q.id)}
                      onToggleExpand={() => toggleExpanded(q.id)}
                      onRemove={() => handleRemove(q.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const QuestionCard = ({ question, index, isExpanded, onToggleExpand, onRemove }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Question Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {question.category}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">
              {question.question}
            </h3>
          </div>
          <button
            onClick={onRemove}
            className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-all text-red-600 dark:text-red-400"
            title="Retirer des favoris"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={onToggleExpand}
          className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Masquer la réponse
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Voir la réponse
            </>
          )}
        </button>
      </div>

      {/* Answer Details (Expanded) */}
      {isExpanded && (
        <div className="border-t-2 border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
          <div className="space-y-2 mb-4">
            {question.options.map((option, optIndex) => {
              const isCorrect = optIndex === question.correct;
              return (
                <div
                  key={optIndex}
                  className={`p-3 rounded-lg ${
                    isCorrect
                      ? 'bg-green-50 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <span
                    className={`text-sm ${
                      isCorrect
                        ? 'text-green-900 dark:text-green-300 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {option}
                    {isCorrect && ' ✓'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <strong>💡 Explication:</strong> {question.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedQuestionsPage;
