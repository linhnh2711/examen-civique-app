# Firebase Setup Guide for Examen Civique App

This guide will help you configure Firebase for the Examen Civique app to enable authentication and cloud sync.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `examen-civique-app` (or your preferred name)
4. Disable Google Analytics (optional, not needed for this app)
5. Click "Create project"

## Step 2: Register Your Web App

1. In the Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Register app with nickname: `Examen Civique PWA`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. **IMPORTANT**: Copy the Firebase configuration object shown

It will look like this:
```javascript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Initialize Firebase
const app = initializeApp(firebaseConfig);
```

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

6. Replace the placeholder values in `src/config/firebase.js` with your actual configuration

## Step 3: Enable Authentication Methods

### Email/Password Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Email/Password**
3. Enable the first toggle (Email/Password)
4. Click "Save"

### Sign in with Apple (Required for App Store)

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Apple**
3. Enable the toggle
4. You'll need to configure Apple Developer settings:
   - **Services ID**: Create in [Apple Developer Console](https://developer.apple.com/account/resources/identifiers/list)
   - **Team ID**: Found in Apple Developer membership details
   - **Key ID** and **Private Key**: Generate in Apple Developer Console under Keys
5. Follow Firebase's instructions to complete Apple Sign-In setup
6. Click "Save"

**Note**: For testing purposes, you can skip Apple Sign-In initially and just use email/password.

## Step 4: Enable Cloud Firestore

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (we'll add security rules next)
4. Select your preferred Firestore location (e.g., `us-central` for USA)
5. Click "Enable"

## Step 5: Configure Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** > **Rules**
2. Replace the default rules with the content from `firestore.rules` file in this project:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      allow create, update: if request.auth != null
        && request.auth.uid == userId
        && request.resource.data.keys().hasAll(['lastSyncTimestamp'])
        && request.resource.data.lastSyncTimestamp is number;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click "Publish"

These rules ensure:
- Users can only access their own data
- Authentication is required for all operations
- Data structure is validated

## Step 6: Test Your Configuration

1. Start your development server:
   ```bash
   npm start
   ```

2. Open the app in your browser (http://localhost:3000)

3. Click the "Connexion" button on the home page

4. Try registering a new account with email/password

5. After successful login, your data should automatically sync to Firestore

6. Verify in Firebase Console:
   - Go to **Firestore Database** > **Data**
   - You should see a `users` collection with your user ID as a document
   - The document should contain your quiz data

## Step 7: Deploy to Production

When deploying to production (iOS app or hosted PWA):

1. Update your Firebase project settings:
   - Go to **Project Settings** > **General**
   - Add your production domain to authorized domains

2. For iOS app:
   - Configure iOS app in Firebase Console
   - Download and add `GoogleService-Info.plist` to your Xcode project
   - Update your iOS app's URL scheme

## Firestore Data Structure

The app stores user data in the following structure:

```
users (collection)
  └── {userId} (document)
      ├── stats (object)
      │   ├── total: number
      │   ├── correct: number
      │   ├── streak: number
      │   └── bestStreak: number
      ├── quizHistory (array)
      │   └── [
      │         {
      │           type: "CSP" | "CR",
      │           mode: "Practice" | "Examen Blanc",
      │           score: number,
      │           total: number,
      │           passed: boolean,
      │           timestamp: number
      │         }
      │       ]
      ├── wrongAnswers (array)
      ├── savedQuestions (array)
      ├── answeredQuestions (object)
      └── lastSyncTimestamp (number)
```

## Security Notes

1. **API Keys**: The Firebase API key in `firebase.js` is safe to expose in client-side code. It's not a secret - it just identifies your Firebase project.

2. **Security**: Protection comes from Firestore Security Rules, not from hiding the API key.

3. **Passwords**: Firebase handles all password hashing and security. Never store passwords in Firestore or localStorage.

4. **User Privacy**: Each user can only access their own data thanks to security rules.

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure you've replaced the placeholder config in `src/config/firebase.js` with your actual Firebase config

### "Missing or insufficient permissions"
- Check that your Firestore security rules are published correctly
- Verify that the user is authenticated before trying to access Firestore

### Apple Sign-In not working
- Ensure you've completed all steps in Apple Developer Console
- Verify your Services ID and credentials are correct in Firebase Console
- For web testing, you may need to test on a real domain (not localhost)

## Next Steps

After completing Firebase setup:

1. ✅ Test login/registration flow
2. ✅ Verify data syncs across devices
3. ✅ Test offline functionality (data stored locally)
4. ✅ Prepare for iOS App Store submission
5. ✅ Configure Apple Sign-In for production

## Support

For more information:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Sign in with Apple (Firebase)](https://firebase.google.com/docs/auth/web/apple)
