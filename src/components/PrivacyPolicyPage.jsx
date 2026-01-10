import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { useSwipeBack } from '../hooks/useSwipeBack';

const PrivacyPolicyPage = ({ onBack }) => {
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
            Politique de confidentialité
          </h1>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg space-y-6">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Section 1 */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">
              1. Données collectées
            </h2>
            <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
              <p>Selon l'utilisation de l'application, les données suivantes peuvent être collectées :</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Données de progression (réponses aux quiz, statistiques)</li>
                <li>Questions sauvegardées</li>
                <li>Informations de compte (si l'utilisateur choisit de se connecter), telles que l'identifiant de connexion fourni par le service d'authentification</li>
              </ul>
              <p className="mt-2">
                Aucun mot de passe n'est stocké par l'application.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">
              2. Utilisation des données
            </h2>
            <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
              <p>Les données sont utilisées exclusivement pour :</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Permettre le fonctionnement de l'application</li>
                <li>Sauvegarder la progression de l'utilisateur</li>
                <li>Fournir des statistiques de performance</li>
                <li>Synchroniser les données entre appareils (le cas échéant)</li>
              </ul>
              <p className="mt-2">
                Les données ne sont ni vendues, ni partagées avec des tiers à des fins commerciales.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">
              3. Stockage des données
            </h2>
            <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
              <p>
                En l'absence de connexion à un compte, les données sont stockées localement sur l'appareil de l'utilisateur.
              </p>
              <p>
                En cas de connexion, certaines données peuvent être stockées de manière sécurisée afin de permettre la synchronisation.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">
              4. Sécurité
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Des mesures techniques appropriées sont mises en œuvre afin de protéger les données contre tout accès non autorisé.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">
              5. Droits des utilisateurs
            </h2>
            <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
              <p>Conformément au Règlement Général sur la Protection des Données (RGPD), les utilisateurs disposent des droits suivants :</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Accès à leurs données</li>
                <li>Rectification ou suppression de leurs données</li>
                <li>Suppression de leur compte le cas échéant</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">
              6. Contact
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Pour toute question relative à la confidentialité ou aux données personnelles, l'utilisateur peut contacter l'éditeur de l'application via les informations fournies dans l'application.
            </p>
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

export default PrivacyPolicyPage;
