import React from 'react';
import { ArrowLeft, CheckCircle, Clock, Award, BookOpen, Calendar } from 'lucide-react';
import { useSwipeBack } from '../hooks/useSwipeBack';

const ExamInfoPage = ({ onBack }) => {
  // Enable swipe-back gesture
  useSwipeBack(onBack);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-8 pt-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            À propos de l'examen civique
          </h1>
        </div>

        {/* Introduction */}
        <div className="mb-6">
          <div className="flex items-start gap-3">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
                Obligatoire depuis le 1er Janvier 2026
              </h2>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                L'examen civique devient obligatoire pour toute demande de Carte de Séjour Pluriannuelle (CSP) ou de Carte de Résident (CR).
              </p>
            </div>
          </div>
        </div>

        {/* Structure de l'examen */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg mb-6">
          <div className="flex items-start gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              Structure de l'examen
            </h2>
          </div>

          <div className="space-y-4 text-sm md:text-base text-gray-700 dark:text-gray-300">
            <p>
              <span className="font-bold text-blue-600 dark:text-blue-400">40 questions de QCM</span> avec une seule bonne réponse parmi quatre options, réparties en <span className="font-bold">5 thématiques</span> :
            </p>

            <ul className="list-none space-y-1 ml-4">
              <li>1. Principes et valeurs de la République</li>
              <li>2. Systèmes institutionnels et politiques</li>
              <li>3. Droits et devoirs</li>
              <li>4. Histoire, géographie et culture</li>
              <li>5. Vivre dans la société française</li>
            </ul>

            <p className="pt-2">
              La structure se répartit en :
            </p>
            <ul className="list-none space-y-1 ml-4">
              <li>• <span className="font-semibold">28 questions de connaissances</span></li>
              <li>• <span className="font-semibold">12 questions de mise en situation</span></li>
            </ul>
          </div>
        </div>

        {/* Durée et format */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              Durée et format
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                <span className="font-bold">45 minutes maximum</span> pour répondre aux 40 questions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                Examen <span className="font-bold">numérique</span> sur tablette ou ordinateur
              </p>
            </div>
          </div>
        </div>

        {/* Critères de réussite */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 md:p-8 shadow-lg mb-6 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3 mb-4">
            <Award className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              Critères de réussite
            </h2>
          </div>

          <div className="text-center text-sm md:text-base">
            <p className="font-semibold text-gray-900 dark:text-white mb-2">
              <span className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">80%</span> Score minimum requis
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Soit <span className="font-bold text-green-600 dark:text-green-400">32 bonnes réponses sur 40</span> minimum
            </p>
          </div>
        </div>

        {/* Informations importantes */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-6 md:p-8 shadow-lg mb-6 border-2 border-yellow-200 dark:border-yellow-800">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">
            💡 Informations importantes
          </h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                <span className="font-bold">L'attestation de réussite n'a pas de période de validité</span> - Elle reste valable indéfiniment
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                <span className="font-bold">Possibilité de repasser l'examen autant de fois que nécessaire</span> sans limitation
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                Ressources officielles disponibles{' '}
                <a
                  href="https://formation-civique.interieur.gouv.fr/examen-civique/informations-générales-sur-lexamen-civique/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  ici
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-2xl p-6 md:p-8 shadow-lg text-center text-white">
          <h3 className="text-lg md:text-xl font-bold mb-3">
            Prêt à commencer ?
          </h3>
          <p className="text-sm md:text-base mb-6 text-white/90">
            Entraînez-vous efficacement et réussissez votre examen
          </p>
          <button
            onClick={onBack}
            className="bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all hover:scale-105 shadow-lg"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamInfoPage;
