# iOS Build Guide - Examen Civique App

Guide complet pour build l'app iOS sur Mac.

## Prérequis sur Mac

### 1. Installer Xcode
1. Ouvrir App Store sur Mac
2. Chercher "Xcode"
3. Installer (gratuit, ~15GB)
4. Ouvrir Xcode une fois pour accepter les termes

### 2. Installer Command Line Tools
```bash
xcode-select --install
```

### 3. Installer Homebrew (si pas encore installé)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 4. Installer CocoaPods (OPTIONNEL - pas nécessaire!)
```bash
# CocoaPods n'est PAS requis pour ce projet
# Capacitor 8 utilise Swift Package Manager (SPM)
# Vous pouvez sauter cette étape!

# Si vous voulez quand même l'installer (optional):
sudo gem install cocoapods
```

**Note**: Si vous rencontrez une erreur SSL lors de l'installation de CocoaPods (souvent sur Mac d'entreprise avec proxy), vous pouvez complètement ignorer CocoaPods. Ce projet utilise Swift Package Manager à la place.

---

## Étapes de Build

### Étape 1: Cloner le projet sur Mac

**Option A: Si vous avez déjà push sur GitHub**
```bash
cd ~/Desktop
git clone https://github.com/linhnh2711/examen-civique-app.git
cd examen-civique-app
git checkout app-for-ios
```

**Option B: Copier le projet depuis Windows**
- Copier le dossier `examen-civique-app` depuis Windows vers Mac
- Via USB, AirDrop, ou cloud storage

### Étape 2: Installer les dépendances Node.js

```bash
# Installer Node.js si pas encore installé
brew install node

# Installer les dépendances npm
npm install
```

### Étape 3: Vérifier que GoogleService-Info.plist existe

```bash
ls ios/App/App/GoogleService-Info.plist
```

Si le fichier n'existe pas:
1. Aller sur Firebase Console: https://console.firebase.google.com/
2. Projet: examen-civique-app-41c05
3. Settings → Your apps → iOS app
4. Download GoogleService-Info.plist
5. Copier vers `ios/App/App/`

### Étape 4: Ouvrir le projet dans Xcode

**Deux options selon votre setup:**

**Option A: Si vous N'AVEZ PAS installé CocoaPods** (Recommended)
```bash
cd ios/App
open App.xcodeproj
```

**Option B: Si vous AVEZ installé CocoaPods et run `pod install`**
```bash
cd ios/App
open App.xcworkspace
```

**Note**: Si `App.xcworkspace` n'existe pas, utilisez `App.xcodeproj`. Xcode va automatiquement installer les dépendances via Swift Package Manager!

### Étape 5: Configurer le projet dans Xcode

#### A. Vérifier Bundle Identifier
1. Dans Xcode, sélectionner le projet "App" dans la sidebar gauche
2. Sélectionner target "App"
3. Onglet "Signing & Capabilities"
4. Vérifier que **Bundle Identifier** = `com.linhnh.examencivique`

#### B. Configurer Team
1. Sous "Signing & Capabilities"
2. **Team**: Sélectionner votre Apple Developer Account personnel
   - Si votre compte n'apparaît pas, cliquer "Add Account..."
   - Se connecter avec votre Apple ID

#### C. Ajouter Sign in with Apple Capability
1. Cliquer le bouton **"+ Capability"** en haut
2. Chercher et ajouter **"Sign in with Apple"**
3. Xcode va automatiquement configurer cette capability

#### D. Ajouter GoogleService-Info.plist au projet
1. Dans Xcode, faites un clic droit sur le dossier "App" dans la sidebar
2. Choisir "Add Files to App..."
3. Sélectionner `GoogleService-Info.plist`
4. **IMPORTANT**: Cocher "Copy items if needed" et "Add to targets: App"

### Étape 6: Build et Run

#### Option A: Tester sur Simulator (Plus facile)
1. En haut de Xcode, sélectionner un simulateur (ex: "iPhone 15 Pro")
2. Cliquer le bouton **Play (▶)** ou appuyer `Cmd+R`
3. L'app va se lancer dans le simulateur

**Note**: Apple Sign-In peut ne pas fonctionner dans le simulator. Il faut un vrai device pour tester.

#### Option B: Tester sur vrai iPhone (Recommended pour Apple Sign-In)
1. Connecter votre iPhone via USB
2. Déverrouiller l'iPhone et accepter "Trust This Computer"
3. En haut de Xcode, sélectionner votre iPhone
4. Cliquer **Play (▶)**
5. Si erreur "Untrusted Developer":
   - Sur iPhone: Settings → General → VPN & Device Management
   - Faire confiance à votre developer certificate

---

## Troubleshooting

### Erreur: "No matching provisioning profiles found"
**Solution**:
1. Xcode → Preferences → Accounts
2. Sélectionner votre Apple ID
3. Cliquer "Download Manual Profiles"
4. Ou activer "Automatically manage signing"

### Erreur: "GoogleService-Info.plist not found"
**Solution**:
```bash
# Vérifier que le fichier existe
ls ios/App/App/GoogleService-Info.plist

# Si non, re-download depuis Firebase et copier
```

### Erreur: "pod: command not found" ou SSL verification error
**Solution**: Ignorez CocoaPods! Ce projet utilise Swift Package Manager.
- Ouvrez directement `App.xcworkspace` dans Xcode
- Xcode va automatiquement résoudre les dépendances via SPM

### Erreur SSL lors de l'installation de CocoaPods
**Solution**: CocoaPods n'est pas nécessaire pour ce projet.
- Souvent causé par proxy d'entreprise
- Utilisez Swift Package Manager à la place (déjà configuré)

### Firebase ne fonctionne pas dans l'app
**Solution**: Vérifier que GoogleService-Info.plist est bien ajouté au target:
1. Cliquer sur GoogleService-Info.plist dans Xcode
2. Sidebar droite → Target Membership
3. Cocher "App"

---

## Préparer pour App Store

### Étape 1: Créer une Archive
1. En haut de Xcode, sélectionner **"Any iOS Device (arm64)"**
2. Menu: Product → Archive
3. Attendre la compilation (~5-10 minutes)

### Étape 2: Upload vers App Store Connect
1. Après archive, la fenêtre Organizer s'ouvre
2. Sélectionner votre archive
3. Cliquer **"Distribute App"**
4. Choisir **"App Store Connect"**
5. Suivre l'assistant

### Étape 3: Créer l'app dans App Store Connect
1. Aller sur https://appstoreconnect.apple.com/
2. My Apps → Click "+"
3. New App:
   - **Platform**: iOS
   - **Name**: "Examen Civique - Vibe Study" (ou votre nom préféré)
   - **Primary Language**: French (Canada)
   - **Bundle ID**: Sélectionner `com.linhnh.examencivique`
   - **SKU**: `examen-civique-001` (unique identifier)
4. Remplir les informations requises:
   - Description
   - Screenshots (iPhone 6.7", 6.5", 5.5")
   - App Icon (1024x1024px)
   - Privacy Policy URL
   - Support URL

### Étape 4: Soumettre pour Review
1. Sélectionner le build uploadé
2. Remplir tous les champs obligatoires
3. Cliquer **"Submit for Review"**
4. Apple review: 1-3 jours généralement

---

## Screenshots & Assets Nécessaires

### App Icon
- 1024x1024px PNG (sans transparence)
- À placer dans `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### Screenshots Obligatoires
Tailles requises:
- iPhone 6.7" (1290 x 2796 pixels) - iPhone 15 Pro Max
- iPhone 6.5" (1242 x 2688 pixels) - iPhone 11 Pro Max
- iPhone 5.5" (1242 x 2208 pixels) - iPhone 8 Plus

**Conseil**: Utiliser Xcode Simulator pour prendre les screenshots:
1. Lancer l'app dans le simulator (taille appropriée)
2. `Cmd+S` pour sauvegarder un screenshot
3. Les screenshots sont sauvegardés sur le Desktop

---

## Informations Utiles

### Bundle ID
```
com.linhnh.examencivique
```

### App Name
```
Examen Civique - Vibe Study
```

### Firebase Project
```
examen-civique-app-41c05
```

### Services ID (Apple Sign-In)
```
com.linhnh.examencivique.web
```

---

## Commandes Utiles

```bash
# Rebuild web assets et sync vers iOS
npm run build
npx cap sync ios

# Ouvrir Xcode (choisir selon votre setup)
cd ios/App
open App.xcodeproj    # Si pas de CocoaPods
# OU
open App.xcworkspace  # Si vous avez run pod install

# Nettoyer le build Xcode (si problèmes)
# Dans Xcode: Product → Clean Build Folder (Shift+Cmd+K)

# Reset SPM cache si problèmes de dépendances
# Dans Xcode: File → Packages → Reset Package Caches
```

---

## Notes Importantes

1. **GoogleService-Info.plist** doit être dans le projet Xcode
2. **Ouvrir App.xcodeproj** si vous n'avez pas CocoaPods, ou **App.xcworkspace** si vous l'avez
3. Sign in with Apple doit être testé sur un **vrai device**, pas simulator
4. Le premier build peut prendre 10-15 minutes
5. Apple Developer Account doit être **actif** ($99/an)
6. **CocoaPods n'est PAS nécessaire** - Ce projet utilise Swift Package Manager (SPM)
7. Si erreur SSL avec CocoaPods sur Mac d'entreprise, ignorez-le et utilisez `.xcodeproj`

---

## Support

- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Firebase iOS Setup](https://firebase.google.com/docs/ios/setup)
- [App Store Connect Help](https://developer.apple.com/app-store-connect/)
