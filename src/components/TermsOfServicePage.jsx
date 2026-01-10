import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { useSwipeBack } from '../hooks/useSwipeBack';

const TermsOfServicePage = ({ onBack }) => {
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
            Conditions d'utilisation
          </h1>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg space-y-6">
          <div className="flex items-start gap-3 mb-4">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Section 1 */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">
              1. Application non officielle
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Cette application est un outil d'entraînement pédagogique indépendant.
              Elle n'est ni affiliée, ni approuvée par un organisme gouvernemental français ou toute autre autorité publique.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">
              2. Objectif pédagogique
            </h2>
            <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
              <p>
                L'objectif de l'application est d'aider les utilisateurs à se préparer à l'examen civique requis dans le cadre d'une demande de naturalisation française ou de carte de résident.
              </p>
              <p>
                L'application propose des quiz, des exercices et des mises en situation destinés à l'entraînement personnel.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">
              3. Contenu et sources
            </h2>
            <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
              <p>
                Les contenus pédagogiques (questions, thématiques, explications) sont élaborés à partir de sources publiques et de documents de référence tels que le Livret du Citoyen et les textes réglementaires en vigueur, dans le but de proposer une expérience proche des conditions réelles de l'examen.
              </p>
              <p>
                Toutefois, cette application ne constitue pas une source officielle et ne remplace pas les informations fournies par les autorités compétentes.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">
              4. Limitation de responsabilité
            </h2>
            <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
              <p>
                Malgré le soin apporté à la mise à jour et à la qualité des contenus, aucune garantie n'est donnée quant à l'exactitude ou l'exhaustivité des informations proposées.
              </p>
              <p>
                L'éditeur de l'application ne saurait être tenu responsable :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>d'une utilisation incorrecte des contenus,</li>
                <li>d'une décision administrative prise sur la base des informations fournies par l'application,</li>
                <li>ou de l'échec ou de la réussite à un examen.</li>
              </ul>
              <p className="mt-2">
                Les utilisateurs sont invités à consulter les sources officielles pour toute démarche administrative.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">
              5. Utilisation de l'application
            </h2>
            <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
              <p>
                L'application est destinée à un usage personnel et non commercial.
              </p>
              <p>
                Toute reproduction, redistribution ou exploitation non autorisée du contenu est interdite.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">
              6. Modification des conditions
            </h2>
            <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
              <p>
                Les présentes conditions peuvent être modifiées à tout moment afin de refléter l'évolution de l'application.
              </p>
              <p>
                L'utilisation continue de l'application vaut acceptation des conditions mises à jour.
              </p>
            </div>
          </section>
        </div>

        {/* Back button */}
        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all hover:scale-105"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
