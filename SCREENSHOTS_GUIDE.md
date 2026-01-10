# Guide Screenshots pour App Store

## 📱 Tailles Requises

Apple requiert des screenshots pour différentes tailles d'iPhone. Voici les tailles exactes :

### ✅ OBLIGATOIRE - iPhone 6.7" (iPhone 15 Pro Max, 14 Pro Max, 13 Pro Max, 12 Pro Max)
- **Résolution**: 1290 x 2796 pixels
- **Format**: PNG ou JPG
- **Nombre**: 3 à 10 screenshots
- **Note**: C'est la taille la plus importante, Apple l'utilise pour tous les grands iPhones

### ✅ OBLIGATOIRE - iPhone 6.5" (iPhone 11 Pro Max, XS Max)
- **Résolution**: 1242 x 2688 pixels
- **Format**: PNG ou JPG
- **Nombre**: 3 à 10 screenshots

### 📋 OPTIONNEL - iPhone 5.5" (iPhone 8 Plus, 7 Plus, 6s Plus)
- **Résolution**: 1242 x 2208 pixels
- **Format**: PNG ou JPG
- **Recommandé**: Oui (pour compatibilité avec anciens iPhones)

### 📋 OPTIONNEL - iPad Pro 12.9"
- **Résolution**: 2048 x 2732 pixels (portrait) ou 2732 x 2048 pixels (landscape)
- **Note**: Seulement si votre app supporte iPad

---

## 🎨 Screens à Capturer (Ordre Recommandé)

Voici les 5-8 screenshots que vous devriez prendre:

### Screenshot 1: HomePage (Écran d'accueil)
**Ce qui doit être visible**:
- Sélection CSP/CR bien visible
- Barre de progression
- Tous les boutons principaux (Quiz Pratique, Flashcards, Apprendre par thème, Examen Blanc)
- Le footer avec les liens légaux

**Message marketing à superposer** (optionnel):
> "Préparez votre examen civique français"

---

### Screenshot 2: Quiz Setup Page
**Ce qui doit être visible**:
- Interface de sélection du nombre de questions
- Design moderne et clair
- Bouton "Commencer"

**Message marketing**:
> "Quiz personnalisables à votre rythme"

---

### Screenshot 3: Quiz Page en action
**Ce qui doit être visible**:
- Une question affichée
- Les 4 options de réponse
- Barre de progression en haut
- Interface propre

**Message marketing**:
> "Interface intuitive et facile"

---

### Screenshot 4: Result Page (Résultats)
**Ce qui doit être visible**:
- Score affiché (choisir un bon score, ex: 85%)
- Détails des réponses correctes/incorrectes
- Design motivant

**Message marketing**:
> "Suivez votre progression en temps réel"

---

### Screenshot 5: Stats Page (Statistiques)
**Ce qui doit être visible**:
- Graphiques de progression
- Statistiques par thème
- Historique des quiz
- Tout bien organisé

**Message marketing**:
> "Statistiques détaillées et précises"

---

### Screenshot 6: Category Stats (Progression par thème)
**Ce qui doit être visible**:
- Les 5 thématiques
- Barres de progression pour chaque thème
- Pourcentages de complétion

**Message marketing**:
> "Ciblez vos points faibles"

---

### Screenshot 7: Flashcard Page
**Ce qui doit être visible**:
- Une flashcard avec question
- Interface de swipe/flip
- Compteur de cartes

**Message marketing**:
> "Mémorisez avec les flashcards"

---

### Screenshot 8: Examen Blanc en cours
**Ce qui doit être visible**:
- Timer en haut (montrant temps restant)
- Question d'examen
- Interface sérieuse

**Message marketing**:
> "Conditions réelles d'examen"

---

## 🛠️ Comment Prendre les Screenshots

### Option 1: Avec Simulateur Xcode (RECOMMANDÉ)

1. **Ouvrir le projet iOS**:
   ```bash
   cd ios/App
   open App.xcworkspace
   ```

2. **Sélectionner le simulateur**:
   - iPhone 15 Pro Max (pour 6.7")
   - iPhone 11 Pro Max (pour 6.5")

3. **Lancer l'app**: Cmd + R

4. **Naviguer vers l'écran souhaité**

5. **Prendre screenshot**:
   - Cmd + S dans le simulateur
   - Ou: Capture d'écran > Capturer l'écran

6. **Les screenshots sont sauvegardés** sur votre bureau

### Option 2: Avec Device Réel

1. Brancher votre iPhone
2. Build et run sur le device
3. Prendre screenshot: Volume Up + Power button
4. Screenshots dans Photos app

### Option 3: Utiliser Fastlane Frameit (Avancé)

Pour ajouter des cadres iPhone autour des screenshots:
```bash
brew install fastlane
fastlane frameit
```

---

## ✨ Conseils pour de Beaux Screenshots

### 1. **Utilisez des données réalistes mais optimales**
- Progression: ~30-60% (montre que l'app est utilisée)
- Scores: 80-95% (positif mais pas parfait)
- Historique: 5-10 quiz/examens

### 2. **Mode Clair ou Sombre?**
- **Recommandé**: Mode clair pour les screenshots
- Raison: Plus universel et lisible sur l'App Store
- Option: Vous pouvez faire 1-2 screenshots en dark mode à la fin

### 3. **Texte Marketing (optionnel)**
Si vous voulez ajouter du texte marketing:
- Utilisez Figma, Sketch, ou Canva
- Police: San Francisco (SF Pro) ou similaire
- Taille: Assez grande pour être lisible (40-60pt)
- Position: En haut avec fond semi-transparent

### 4. **Ordre des Screenshots**
L'ordre est TRÈS important:
1. HomePage (donne vue d'ensemble)
2. Features principales (Quiz, Flashcards)
3. Résultats/Stats (prouve la valeur)
4. Écrans secondaires

---

## 📋 Checklist avant Upload

- [ ] 3-10 screenshots pour iPhone 6.7"
- [ ] 3-10 screenshots pour iPhone 6.5"
- [ ] Screenshots en portrait (pas landscape)
- [ ] Format PNG ou JPG (< 500 KB par image recommandé)
- [ ] Pas de bords noirs
- [ ] Texte lisible
- [ ] Interface cohérente (pas de mélanges iOS/Android)
- [ ] Données de test appropriées
- [ ] Screenshots dans le bon ordre narratif

---

## 🎯 Template de Nommage

Pour vous organiser, nommez vos fichiers:

```
01_HomePage_6.7.png
01_HomePage_6.5.png
02_QuizSetup_6.7.png
02_QuizSetup_6.5.png
03_QuizInProgress_6.7.png
03_QuizInProgress_6.5.png
04_Results_6.7.png
04_Results_6.5.png
05_Stats_6.7.png
05_Stats_6.5.png
06_CategoryStats_6.7.png
06_CategoryStats_6.5.png
07_Flashcards_6.7.png
07_Flashcards_6.5.png
08_ExamenBlanc_6.7.png
08_ExamenBlanc_6.5.png
```

---

## 🚀 Après avoir pris les Screenshots

1. **Vérifiez la qualité**: Ouvrez chaque image et vérifiez
2. **Redimensionnez si nécessaire**: Utilisez Photoshop, Preview, ou tools en ligne
3. **Optimisez la taille**: < 500 KB par image (utilisez TinyPNG ou ImageOptim)
4. **Upload sur App Store Connect**: Dans la section "App Preview and Screenshots"

---

## 📱 App Preview Video (Optionnel)

Apple permet aussi un video de 15-30 secondes:
- Format: .mov, .m4v, .mp4
- Résolution: 1080p ou 4K
- Durée: 15-30 secondes
- Montre les features principales en action

**Pas obligatoire mais recommandé pour augmenter les conversions!**

---

## ❓ Questions Fréquentes

**Q: Dois-je faire des screenshots pour toutes les tailles?**
A: Minimum 6.7" et 6.5". Apple peut auto-scale pour les autres tailles.

**Q: Puis-je utiliser des screenshots de l'émulateur?**
A: Oui! C'est même recommandé pour avoir les tailles exactes.

**Q: Combien de screenshots dois-je avoir?**
A: 5-8 est idéal. Minimum 3, maximum 10.

**Q: Puis-je changer les screenshots après publication?**
A: Oui! Vous pouvez les mettre à jour quand vous voulez sans nouvelle review.

**Q: Dois-je traduire les screenshots en anglais?**
A: Non, français uniquement suffit si vous ciblez le marché français.
