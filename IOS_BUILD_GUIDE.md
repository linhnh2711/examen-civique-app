# Guide Build iOS cho App Store

## 📋 Checklist Avant Build

Assurez-vous d'avoir:
- ✅ Apple Developer Account actif ($99/an)
- ✅ Xcode installé (latest version recommandée)
- ✅ Certificats de signature configurés
- ✅ App ID créé sur Apple Developer Portal
- ✅ App créée sur App Store Connect

---

## 🔧 ÉTAPE 1: Préparer le Build Web

1. **Build la version production de React**:
   ```bash
   cd "c:\Users\nhatl\source\repos\examen-civique-app"
   npm run build
   ```

2. **Synchroniser avec Capacitor**:
   ```bash
   npx cap sync ios
   ```

   Cette commande:
   - Copie le build web vers iOS
   - Met à jour les plugins Capacitor
   - Synchronise les configurations

---

## 📱 ÉTAPE 2: Ouvrir le Projet Xcode

```bash
cd ios/App
open App.xcworkspace
```

**⚠️ IMPORTANT**: Ouvrir `.xcworkspace`, PAS `.xcodeproj` !

---

## ⚙️ ÉTAPE 3: Configurer Version & Build Number

### Dans Xcode:

1. **Sélectionner le projet "App"** dans le navigateur de gauche

2. **Onglet "General"**:
   - **Identity Section**:
     - Display Name: `Examen Civique - Vibe Study`
     - Bundle Identifier: `com.linhnh.examencivique`

   - **Version Section**:
     - **Version**: `1.0.0` (MARKETING_VERSION)
     - **Build**: `1` (CURRENT_PROJECT_VERSION)

### Quand incrémenter quoi?

- **Version (1.0.0)**: Changez quand vous ajoutez des features majeures
  - 1.0.0 → 1.1.0 (nouvelle feature)
  - 1.1.0 → 2.0.0 (changement majeur)

- **Build Number (1, 2, 3...)**: Incrémentez à chaque upload sur App Store Connect
  - Même si c'est le même code, nouveau build = nouveau numéro
  - Ex: 1.0.0 (Build 1), 1.0.0 (Build 2) si vous re-uploadez

---

## 🎯 ÉTAPE 4: Configurer Signing & Capabilities

### 1. Signing

Dans **Signing & Capabilities**:

- [ ] **Team**: Sélectionnez votre Apple Developer Team
- [ ] **Provisioning Profile**: Automatic (recommandé) ou Manual
- [ ] **Signing Certificate**: Distribution (pour App Store)

### 2. Vérifier les Capabilities

Les capabilities actuellement utilisées:
- Aucune capability spéciale nécessaire pour cette app

Si vous utilisez Firebase Cloud Messaging ou Push Notifications:
- [ ] Ajouter "Push Notifications" capability
- [ ] Configurer dans Apple Developer Portal

---

## 🏗️ ÉTAPE 5: Build pour Archive

### 1. Sélectionner le Target

En haut de Xcode, cliquez sur le scheme:
- Sélectionnez: **Any iOS Device (arm64)**
- NE PAS sélectionner un simulateur!

### 2. Créer l'Archive

**Menu**: Product → Archive

Ou raccourci: `Cmd + Shift + B` (après avoir sélectionné Generic iOS Device)

### Temps de build
- Premier build: 5-10 minutes
- Builds suivants: 2-5 minutes

### Erreurs communes

**Erreur**: "No provisioning profiles found"
- **Solution**: Aller dans Signing & Capabilities, sélectionner votre Team

**Erreur**: "Code signing failed"
- **Solution**:
  1. Ouvrir Xcode Preferences → Accounts
  2. Vérifier que votre Apple ID est connecté
  3. Download Manual Profiles

**Erreur**: "Build input file cannot be found"
- **Solution**: Clean Build Folder (Cmd + Shift + K) puis rebuild

---

## 📤 ÉTAPE 6: Upload vers App Store Connect

### 1. Ouvrir l'Organizer

Après archive réussie, Xcode ouvre automatiquement **Organizer**.

Sinon: **Window** → **Organizer** (Cmd + Shift + Option + O)

### 2. Valider l'Archive

1. Sélectionnez votre archive
2. Cliquez sur **Validate App**
3. Sélectionnez votre team
4. Options:
   - [x] Upload your app's symbols (recommandé)
   - [x] Manage Version and Build Number (Xcode fait ça automatiquement)
5. Cliquez **Validate**

### 3. Upload

Si validation réussie:
1. Cliquez sur **Distribute App**
2. Sélectionnez **App Store Connect**
3. Sélectionnez **Upload**
4. Options recommandées:
   - [x] Upload your app's symbols to receive symbolicated reports
   - [x] Manage Version and Build Number
5. Cliquez **Upload**

### Temps d'upload
- Dépend de votre connexion: 5-20 minutes
- Vous pouvez continuer à travailler pendant l'upload

---

## ✅ ÉTAPE 7: Vérifier sur App Store Connect

### 1. Accéder à App Store Connect

1. Aller sur https://appstoreconnect.apple.com
2. Connectez-vous avec votre Apple ID
3. Cliquez sur **My Apps**
4. Sélectionnez "Examen Civique - Vibe Study"

### 2. Attendre le Processing

Après upload:
- Status: "Processing" (⏳ 10-60 minutes)
- Vous recevrez un email quand c'est prêt
- Ne fermez pas Xcode pendant ce temps (optionnel)

### 3. Vérifier le Build

1. Onglet **TestFlight** → **iOS Builds**
2. Votre build devrait apparaître
3. Status doit être: ✅ Ready to Submit

---

## 🚀 ÉTAPE 8: Soumettre pour Review

### 1. Compléter les Informations

Dans **App Store** tab:

#### App Information
- [ ] App Name: Examen Civique - Vibe Study
- [ ] Subtitle: Préparez votre examen civique
- [ ] Category: Education / Reference

#### Pricing and Availability
- [ ] Price: Free (ou votre prix)
- [ ] Availability: All countries ou sélectionnez

#### App Privacy
- [ ] Privacy Policy URL: https://[VOTRE-URL]/privacy-policy.html
- [ ] Privacy Questions: Répondez au questionnaire

#### Version Information (1.0.0)
- [ ] Screenshots (minimum 3 par taille)
  - iPhone 6.7": 3-10 images
  - iPhone 6.5": 3-10 images
- [ ] Description: (Copier depuis APP_STORE_METADATA.md)
- [ ] Keywords: examen civique,naturalisation,citoyenneté française...
- [ ] Support URL: https://github.com/linhnh/examen-civique-app
- [ ] Marketing URL: (optionnel)

#### Build
- [ ] Cliquez sur "+ Build"
- [ ] Sélectionnez votre build uploadé

#### General App Information
- [ ] App Icon: 1024x1024 (upload ici)
- [ ] Age Rating: Complete le questionnaire → Devrait être 4+
- [ ] Copyright: © 2026 Linh NH

### 2. Répondre aux Questions Export Compliance

- **Does your app use encryption?**: NO
  (Sauf si vous avez ajouté de la crypto custom, ce qui n'est pas le cas)

### 3. Soumettre

1. Vérifiez tout une dernière fois
2. Cliquez **Add for Review** (en haut à droite)
3. Puis **Submit for Review**

---

## ⏰ Temps de Review Apple

- **Moyenne**: 24-48 heures
- **Peut prendre**: Jusqu'à 7 jours
- **Status possibles**:
  - 🟡 Waiting for Review
  - 🔵 In Review
  - 🟢 Ready for Sale (APPROUVÉ!)
  - 🔴 Rejected (besoin de corrections)

---

## 📊 Après Approbation

### Si Approuvé ✅
- L'app apparaît sur App Store automatiquement
- Ou vous pouvez choisir "Manual Release"

### Si Rejeté ❌
- Lisez attentivement les raisons
- Corrections communes:
  - Bugs/crashes
  - Metadata incorrect
  - Manque de fonctionnalité
  - Privacy policy manquante
- Faites les corrections
- Re-soumettez

---

## 🔄 Updates Futures

Pour chaque nouvelle version:

1. **Incrémenter la version**:
   - Version 1.0.0 → 1.0.1 (bug fixes)
   - Version 1.0.0 → 1.1.0 (new features)

2. **Build number** doit TOUJOURS augmenter:
   - Build 1 → Build 2 → Build 3...
   - Même pour la même version!

3. **Workflow**:
   ```bash
   npm run build
   npx cap sync ios
   # Ouvrir Xcode
   # Incrémenter version/build
   # Archive
   # Upload
   # Soumettre
   ```

---

## 🐛 Troubleshooting

### Build Fails

**Erreur**: Pod install failed
```bash
cd ios/App
pod install --repo-update
```

**Erreur**: Module not found
```bash
npm run build
npx cap sync ios
```

### Upload Fails

**Erreur**: Invalid Bundle
- Vérifier Bundle ID: `com.linhnh.examencivique`
- Vérifier que c'est bien `.xcworkspace` qui est ouvert

**Erreur**: Missing compliance
- Répondre à la question export compliance

### Archive Option Greyed Out

- Assurez-vous d'avoir sélectionné "Any iOS Device"
- PAS un simulateur!

---

## 📞 Support

**Apple Developer Support**: https://developer.apple.com/support/

**App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/

**Common Rejection Reasons**: https://developer.apple.com/app-store/review/rejections/

---

## ✅ Final Checklist

Avant de soumettre:

- [ ] App build et run sans erreur
- [ ] Testé sur device réel
- [ ] Toutes les features fonctionnent
- [ ] Legal pages accessibles
- [ ] Privacy Policy hosted publiquement
- [ ] Screenshots de qualité (5-8 images)
- [ ] App icon 1024x1024 prêt
- [ ] Description et metadata complétés
- [ ] Version et build number corrects
- [ ] Export compliance répondu
- [ ] Contact info correct

**Bonne chance! 🍀**
