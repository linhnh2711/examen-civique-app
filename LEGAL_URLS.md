# ✅ Legal Pages URLs - Ready for App Store

## 🌐 Public URLs (Netlify Hosted)

### Privacy Policy
```
https://examen-civique-legal.netlify.app/privacy-policy
```

### Terms of Service
```
https://examen-civique-legal.netlify.app/terms-of-service
```

---

## ✅ Verification Status

**Tested on:** 2026-01-10

| Check | Status |
|-------|--------|
| HTTPS Secure | ✅ Pass |
| Loads Correctly | ✅ Pass |
| No Login Required | ✅ Pass |
| Mobile Responsive | ✅ Pass |
| Content Complete | ✅ Pass |
| GDPR Compliant | ✅ Pass |
| Apple Requirements | ✅ Pass |

---

## 📋 For App Store Connect

### Where to Use These URLs

#### 1. App Information Section
- **Privacy Policy URL**: `https://examen-civique-legal.netlify.app/privacy-policy`

#### 2. App Privacy Section
- When completing privacy questionnaire
- Apple will check this URL during review

#### 3. Support URL (Optional)
- Can use: `https://examen-civique-legal.netlify.app/terms-of-service`
- Or use: GitHub repo URL

---

## 📱 In-App vs Public URLs

### In-App (Current Implementation)
- ✅ HomePage footer links to **React components**
- ✅ TermsOfServicePage.jsx
- ✅ PrivacyPolicyPage.jsx
- **Better UX**: Stays in app, dark mode support, back button

### Public URLs (For Apple)
- ✅ Netlify hosted HTML pages
- ✅ Accessible to anyone
- **For compliance**: Apple reviewers, web users, app store listing

**Both are needed and both are ✅ implemented!**

---

## 🔄 Content Updates

If you need to update legal content:

### Option 1: Update Both
1. Edit React components: `src/components/TermsOfServicePage.jsx` and `PrivacyPolicyPage.jsx`
2. Edit HTML files: `legal/terms-of-service.html` and `legal/privacy-policy.html`
3. Re-deploy to Netlify
4. Rebuild app

### Option 2: Update Public Only (Quick)
1. Edit HTML files only
2. Re-deploy to Netlify
3. Changes live immediately (no app rebuild needed)
4. Update app in next release

**Recommendation**: Keep both in sync for consistency

---

## 🎯 Copy-Paste for App Store Connect

**When filling out App Store Connect, use these exact URLs:**

**Privacy Policy URL:**
```
https://examen-civique-legal.netlify.app/privacy-policy
```

**Support URL:**
```
https://examen-civique-legal.netlify.app/terms-of-service
```

**Marketing URL (optional):**
```
https://examen-civique-legal.netlify.app/
```

---

## ✅ Ready for Submission

- [x] Legal pages created
- [x] Content GDPR compliant
- [x] Hosted publicly on Netlify
- [x] HTTPS secure
- [x] Verified accessible
- [x] URLs documented
- [x] Ready for App Store Connect

**Status: READY TO SUBMIT** 🚀

---

## 📞 Troubleshooting

### If URLs change in future
1. Update this file
2. Update `APP_STORE_METADATA.md`
3. Update App Store Connect (can do anytime, no review needed)

### If content needs update
1. Edit HTML files in `legal/` folder
2. Re-deploy to Netlify
3. Changes are immediate

### If Netlify site goes down
- Backup: Host on GitHub Pages using same HTML files
- Or: Use any other free hosting (Vercel, Cloudflare Pages)
- Update URLs in App Store Connect

---

**Last verified:** 2026-01-10
**Status:** ✅ All systems go!
