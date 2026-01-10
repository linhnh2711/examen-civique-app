# Legal Pages Hosting Guide

## 📄 Files

Ce dossier contient les pages légales en HTML standalone pour hosting public:

- `privacy-policy.html` - Politique de confidentialité
- `terms-of-service.html` - Conditions d'utilisation

## 🌐 Options de Hosting

Vous devez héberger ces fichiers publiquement pour fournir les URLs à Apple.

### Option 1: GitHub Pages (GRATUIT - Recommandé)

**Étapes**:

1. **Créer un repo public** (si pas déjà fait):
   ```bash
   cd /path/to/your/repo
   git init
   git add .
   git commit -m "Initial commit with legal pages"
   ```

2. **Push sur GitHub**:
   ```bash
   git remote add origin https://github.com/VOTRE-USERNAME/examen-civique-app.git
   git push -u origin main
   ```

3. **Activer GitHub Pages**:
   - Aller sur votre repo GitHub
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / folder: `/legal`
   - Save

4. **Vos URLs seront**:
   - Privacy Policy: `https://VOTRE-USERNAME.github.io/examen-civique-app/privacy-policy.html`
   - Terms of Service: `https://VOTRE-USERNAME.github.io/examen-civique-app/terms-of-service.html`

**Temps**: ~5 minutes pour être live

---

### Option 2: Netlify (GRATUIT)

**Étapes**:

1. Aller sur https://www.netlify.com
2. Sign up (gratuit)
3. Drag & drop le dossier `legal` sur Netlify
4. Netlify génère une URL: `https://random-name-123.netlify.app`

**URLs**:
- Privacy: `https://your-site.netlify.app/privacy-policy.html`
- Terms: `https://your-site.netlify.app/terms-of-service.html`

---

### Option 3: Vercel (GRATUIT)

1. Aller sur https://vercel.com
2. Sign up avec GitHub
3. Importer votre repo
4. Deploy automatique

**URLs**: `https://your-app.vercel.app/legal/privacy-policy.html`

---

### Option 4: Votre Propre Domaine

Si vous avez un domaine (ex: examencivique.com):

1. Upload `privacy-policy.html` et `terms-of-service.html`
2. URLs:
   - `https://examencivique.com/privacy-policy.html`
   - `https://examencivique.com/terms-of-service.html`

---

## ✅ Vérification

Après hosting, testez vos URLs:

1. Ouvrez dans un navigateur
2. Vérifiez que la page s'affiche correctement
3. Testez sur mobile
4. Copier les URLs pour App Store Connect

---

## 📋 URLs pour App Store Connect

Une fois hébergé, vous aurez besoin de ces URLs pour:

1. **App Store Connect**:
   - Privacy Policy URL (obligatoire)
   - Support URL

2. **Dans votre app** (déjà fait):
   - Les pages sont déjà intégrées dans l'app
   - Accessible via HomePage footer

---

## 🔄 Mises à Jour

Si vous modifiez les conditions:

1. Mettez à jour les fichiers HTML
2. Re-upload sur votre hosting
3. Mettez à jour la date "Dernière mise à jour"
4. Les changements sont instantanés

**Note**: Pas besoin de re-submit l'app à Apple pour changer les legal pages hébergées!

---

## ⚠️ Important

- Les URLs doivent être **HTTPS** (pas HTTP)
- Les pages doivent être **accessibles sans login**
- Le contenu doit être **lisible sur mobile**
- **Pas de redirects** vers d'autres domaines

---

## 📱 Test

Testez vos URLs avec l'outil Apple:

https://search.developer.apple.com/appsearch-validation-tool

Entrez votre Privacy Policy URL pour vérifier qu'elle est accessible.
