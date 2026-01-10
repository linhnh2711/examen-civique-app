# ✅ App Store Submission Checklist Complète

## 📱 PHASE 1: PRÉPARATION (FAIT ✅)

### Code & Build
- [x] Package.json mis à jour avec author info
- [x] Legal pages créées (Terms + Privacy)
- [x] Navigation vers legal pages fonctionnelle
- [x] Build production testé et fonctionnel
- [x] Privacy Manifest (PrivacyInfo.xcprivacy) créé

### Documentation Créée
- [x] APP_STORE_METADATA.md - Description, keywords, metadata
- [x] SCREENSHOTS_GUIDE.md - Guide complet pour screenshots
- [x] IOS_BUILD_GUIDE.md - Process de build et upload
- [x] legal/privacy-policy.html - Page standalone
- [x] legal/terms-of-service.html - Page standalone
- [x] legal/README.md - Guide hosting

---

## 🌐 PHASE 2: HOSTING LEGAL PAGES ✅ FAIT!

### Choisir une Option
- [x] Option 2: Netlify (gratuit) ✅

### Étapes
- [x] Héberger privacy-policy.html ✅
- [x] Héberger terms-of-service.html ✅
- [x] Tester les URLs en HTTPS ✅
- [x] Vérifier affichage mobile ✅
- [x] URLs finales notées:
  - Privacy Policy: `https://examen-civique-legal.netlify.app/privacy-policy` ✅
  - Terms of Service: `https://examen-civique-legal.netlify.app/terms-of-service` ✅

**Status: ✅ COMPLETE - Verified and ready!**

---

## 📸 PHASE 3: SCREENSHOTS (À FAIRE)

### Préparer l'App pour Screenshots
- [ ] Créer des données de test réalistes
  - [ ] Progression ~50%
  - [ ] 5-10 quiz dans l'historique
  - [ ] Scores entre 80-95%
  - [ ] Questions sauvegardées: 3-5
- [ ] Mode clair activé (recommandé pour screenshots)

### iPhone 6.7" (1290 x 2796) - OBLIGATOIRE
- [ ] 1. HomePage avec sélection CSP/CR visible
- [ ] 2. Quiz Setup Page
- [ ] 3. Quiz Page en action
- [ ] 4. Result Page avec bon score
- [ ] 5. Stats Page complète
- [ ] 6. Category Stats (progression par thème)
- [ ] 7. Flashcard Page (optionnel)
- [ ] 8. Examen Blanc en cours (optionnel)

### iPhone 6.5" (1242 x 2688) - OBLIGATOIRE
- [ ] Mêmes 5-8 screenshots que ci-dessus

### Vérification Screenshots
- [ ] Format PNG ou JPG
- [ ] Taille < 500 KB par image
- [ ] Pas de bords noirs
- [ ] Ordre narratif logique
- [ ] Nommage cohérent (01_HomePage_6.7.png, etc.)

---

## 🎨 PHASE 4: APP ICON (À FAIRE)

### Créer l'Icon
- [ ] Design 1024x1024 pixels
- [ ] Format PNG
- [ ] Pas de transparence
- [ ] Pas de canal alpha
- [ ] Coins carrés (iOS ajoute les arrondis automatiquement)

### Placer l'Icon
- [ ] Ajouter dans: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- [ ] Ou upload directement dans App Store Connect

---

## 🍎 PHASE 5: APPLE DEVELOPER SETUP (À FAIRE)

### Compte Apple Developer
- [ ] Account actif ($99/an payé)
- [ ] Accepter les agreements
- [ ] Configurer payment info (si app payante)

### Identifiers & Certificates
- [ ] App ID créé: `com.linhnh.examencivique`
- [ ] Distribution Certificate créé
- [ ] Provisioning Profile créé (ou Automatic Signing)

### App Store Connect
- [ ] App créée avec le même Bundle ID
- [ ] App Name: "Examen Civique - Vibe Study"
- [ ] Primary Language: French
- [ ] SKU: unique identifier (ex: examencivique001)

---

## 🏗️ PHASE 6: BUILD & UPLOAD (À FAIRE)

### Build Web
- [ ] `npm run build` - Succès
- [ ] `npx cap sync ios` - Succès
- [ ] Aucune erreur dans la console

### Xcode Setup
- [ ] Ouvrir `ios/App/App.xcworkspace`
- [ ] Sélectionner Team dans Signing
- [ ] Version: 1.0.0
- [ ] Build: 1
- [ ] Display Name: "Examen Civique - Vibe Study"
- [ ] Bundle ID: `com.linhnh.examencivique`

### Archive & Upload
- [ ] Sélectionner "Any iOS Device"
- [ ] Product → Archive
- [ ] Archive réussie
- [ ] Validate App - Pas d'erreurs
- [ ] Distribute App → App Store Connect
- [ ] Upload réussi

### Vérification
- [ ] Email de confirmation d'Apple reçu
- [ ] Build apparaît dans App Store Connect (peut prendre 30-60 min)
- [ ] Status: "Ready to Submit"

---

## 📝 PHASE 7: METADATA APP STORE (À FAIRE)

### App Information
- [ ] **Name**: Examen Civique - Vibe Study
- [ ] **Subtitle**: Préparez votre examen civique
- [ ] **Category**:
  - [ ] Primary: Education
  - [ ] Secondary: Reference
- [ ] **Privacy Policy URL**: [Votre URL hébergée]
- [ ] **Support URL**: https://github.com/linhnh/examen-civique-app

### Pricing & Availability
- [ ] Price: Free (ou autre)
- [ ] Availability: Tous les pays ou sélection

### App Privacy
- [ ] Répondre au questionnaire privacy
- [ ] Confirmer les data types collectées:
  - [ ] Performance Data (stats de quiz)
  - [ ] Other Usage Data (progression)
- [ ] Confirmer: Pas de tracking
- [ ] Confirmer: Données non liées à l'identité

### Version 1.0.0 Information
- [ ] **Description**: (Copier depuis APP_STORE_METADATA.md)
- [ ] **Keywords**: examen civique,naturalisation,citoyenneté française,carte résident,CSP,CR,quiz,France,immigration,test
- [ ] **Promotional Text**: (Optionnel, 170 char)
- [ ] **Screenshots**: Upload tous les screenshots
- [ ] **App Icon**: 1024x1024 uploadé

### General Information
- [ ] **Copyright**: © 2026 Linh NH
- [ ] **Age Rating**: Complete questionnaire → Should be 4+
- [ ] **Contact Information**:
  - [ ] Email: nglinh2121@gmail.com
  - [ ] Phone: (optionnel)
  - [ ] Name: Linh NH

---

## 🚀 PHASE 8: SUBMISSION (À FAIRE)

### App Review Information
- [ ] **Contact Email**: nglinh2121@gmail.com
- [ ] **Contact Phone**: (si disponible)
- [ ] **Demo Account**: (si login requis - pas le cas ici)
- [ ] **Notes pour Review**:
  ```
  Cette application éducative aide les utilisateurs à se préparer pour
  l'examen civique français requis pour la naturalisation ou la carte
  de résident. L'application fonctionne entièrement hors ligne.
  La synchronisation cloud est optionnelle.
  ```

### Export Compliance
- [ ] **Does your app use encryption?**: NO
  (HTTPS standard uniquement, pas de crypto custom)

### Attachments
- [ ] Aucun attachment nécessaire (sauf si demandé par Apple)

### Build Selection
- [ ] Sélectionner le build uploadé (Version 1.0.0, Build 1)

### Final Check
- [ ] Relire TOUTES les informations
- [ ] Vérifier screenshots ordre et qualité
- [ ] Vérifier description sans fautes
- [ ] Vérifier URLs accessibles
- [ ] **Cliquer "Submit for Review"** ✨

---

## ⏰ PHASE 9: ATTENTE & SUIVI

### Statuses Possibles
- [ ] 🟡 **Waiting for Review** (0-3 jours)
- [ ] 🔵 **In Review** (quelques heures à 2 jours)
- [ ] 🟢 **Ready for Sale** - APPROUVÉ!
- [ ] 🔴 **Rejected** - Lire les raisons et corriger

### Pendant la Review
- [ ] Vérifier emails d'Apple quotidiennement
- [ ] Téléphone accessible (Apple peut appeler)
- [ ] Préparer réponses aux questions potentielles

### Si Approuvé ✅
- [ ] Célébrer! 🎉
- [ ] Partager le lien App Store
- [ ] Monitorer reviews et ratings
- [ ] Répondre aux user reviews

### Si Rejeté ❌
- [ ] Lire attentivement les raisons
- [ ] Faire les corrections nécessaires
- [ ] Incrémenter build number
- [ ] Re-soumettre

---

## 📊 POST-LAUNCH (APRÈS APPROBATION)

### Monitoring
- [ ] Installer Analytics (App Store Connect ou Firebase)
- [ ] Suivre downloads et active users
- [ ] Lire les reviews utilisateurs
- [ ] Suivre crash reports

### Maintenance
- [ ] Planifier updates régulières
- [ ] Répondre aux feedback utilisateurs
- [ ] Fixer bugs reportés rapidement
- [ ] Ajouter nouvelles features basées sur feedback

### Marketing (Optionnel)
- [ ] Créer page landing web
- [ ] Partager sur réseaux sociaux
- [ ] Contacter blogs/sites français sur immigration
- [ ] Créer contenu éducatif (YouTube, blog)

---

## 🆘 RESSOURCES UTILES

### Documentation Apple
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

### Outils
- [App Store Connect](https://appstoreconnect.apple.com)
- [Apple Developer Portal](https://developer.apple.com)
- [Validation Tool](https://search.developer.apple.com/appsearch-validation-tool)

### Support
- Apple Developer Support: https://developer.apple.com/support/
- Email: nglinh2121@gmail.com

---

## 📋 RÉSUMÉ - CE QU'IL RESTE À FAIRE

### Actions Critiques (OBLIGATOIRES)
1. ⚡ Héberger les legal pages et obtenir URLs HTTPS
2. ⚡ Prendre 5-8 screenshots (2 tailles minimum)
3. ⚡ Créer App Icon 1024x1024
4. ⚡ Setup Apple Developer Account (si pas fait)
5. ⚡ Créer app dans App Store Connect
6. ⚡ Build et upload depuis Xcode
7. ⚡ Remplir toutes les metadata
8. ⚡ Soumettre pour review

### Temps Estimé Total
- Préparation screenshots: 1-2 heures
- Setup Apple & Build: 1-2 heures
- Metadata & Submission: 1 heure
- **TOTAL: 3-5 heures de travail**

### Timeline
- Aujourd'hui: Screenshots + Hosting
- Demain: Build + Upload + Metadata
- Dans 2-7 jours: Décision Apple
- **App live: ~1 semaine**

---

**Bonne chance! 🍀 N'hésitez pas si vous avez des questions!**
