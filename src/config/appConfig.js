// App Configuration
// Central place for app-wide configuration values

export const APP_CONFIG = {
  // App Store Configuration
  // TODO: Replace with your actual App Store ID after publishing
  // You can find this in App Store Connect after creating your app
  // Format: Just the numeric ID (e.g., "123456789")
  APP_STORE_ID: 'YOUR_APP_ID',

  // App Store Review URL (automatically uses APP_STORE_ID)
  get APP_STORE_REVIEW_URL() {
    return `itms-apps://itunes.apple.com/app/id${this.APP_STORE_ID}?action=write-review`;
  },

  // App Information
  APP_NAME: 'Examen Civique - Vibe Study',
  BUNDLE_ID: 'com.linhnh.examencivique',

  // Firebase Project
  FIREBASE_PROJECT_ID: 'examen-civique-app-41c05',
};

export default APP_CONFIG;
