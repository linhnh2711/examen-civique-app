import React from 'react';
import { BookOpen, Trophy, Flame, Star, ChevronRight, Award } from 'lucide-react';

const HomePage = ({ stats, onStartQuiz, onStartExamen }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-4 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Examen Civique
          </h1>
          <p className="text-gray-600">Préparez-vous pour votre examen civique français</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.correct}</div>
                <div className="text-sm text-gray-500">Correctes</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.streak}</div>
                <div className="text-sm text-gray-500">Série actuelle</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.bestStreak}</div>
                <div className="text-sm text-gray-500">Meilleure série</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mode de jeu */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Modes d'apprentissage</h2>
          
          <button
            onClick={onStartQuiz}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-bold text-lg">Quiz Pratique</div>
                <div className="text-sm text-white/80">15 questions - Mode apprentissage</div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onStartExamen}
            className="w-full bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-xl hover:scale-105 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg text-gray-900">Examen Blanc</div>
                  <div className="text-sm text-gray-600">40 questions - 45 minutes - Conditions réelles</div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">📚 À propos de l'examen</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 40 questions à choix multiples</li>
            <li>• 80% de bonnes réponses requis (32/40)</li>
            <li>• 5 thématiques officielles</li>
            <li>• Durée: 45 minutes maximum</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;