import React, { useState } from 'react';
import { Home, BookOpen, CheckCircle } from 'lucide-react';

const QuizSetupPage = ({ examType, onStart, onBack }) => {
  const [questionCount, setQuestionCount] = useState('15');
  const [error, setError] = useState('');

  const presetOptions = [15, 30, 45, 100];

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setQuestionCount(value);
      setError('');
    }
  };

  const handleStart = () => {
    const count = parseInt(questionCount);

    if (!questionCount || count < 1) {
      setError('Veuillez entrer un nombre valide');
      return;
    }

    if (count > 180) {
      setError('Maximum 180 questions');
      return;
    }

    onStart(count);
  };

  const handlePresetClick = (count) => {
    setQuestionCount(count.toString());
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Home className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-medium text-sm md:text-base">Accueil</span>
          </button>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">Quiz Pratique {examType}</h1>
          <div className="w-16 md:w-20"></div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-8">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-4 shadow-lg">
              <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Combien de questions ?
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Choisissez le nombre de questions pour votre quiz
            </p>
          </div>

          {/* Input Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre de questions
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={questionCount}
              onChange={handleInputChange}
              placeholder="Entrez un nombre..."
              className="w-full px-4 py-3 md:py-4 text-center text-2xl md:text-3xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            )}
          </div>

          {/* Preset Options */}
          <div className="mb-6 md:mb-8">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
              Suggestions rapides
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {presetOptions.map((count) => (
                <button
                  key={count}
                  onClick={() => handlePresetClick(count)}
                  className={`p-3 md:p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    questionCount === count.toString()
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className="text-xl md:text-2xl font-bold">{count}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">questions</div>
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
            Commencer le quiz
          </button>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <p className="text-xs md:text-sm text-blue-800 dark:text-blue-300">
              💡 Mode apprentissage : vous verrez la correction après chaque question
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSetupPage;
