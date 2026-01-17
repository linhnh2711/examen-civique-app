/**
 * Demo Account Service
 * 
 * ⚠️ STRICTLY FOR APPLE APP REVIEW PURPOSES ⚠️
 * 
 * This service provides a demo account for Apple reviewers to test
 * all app features without requiring real purchases or sandbox accounts.
 * 
 * IMPORTANT:
 * - Does NOT modify any IAP logic
 * - Does NOT affect real users
 * - Demo state is stored in sessionStorage (cleared on app close)
 * - Completely isolated from purchase/entitlement logic
 */

// Demo account credentials (hardcoded, safe for Apple Review)
const DEMO_CREDENTIALS = {
  EMAIL: 'review@examen-civique-demo.fr',
  PASSWORD: 'Review123!Linh',
};

// Storage key for demo state (sessionStorage only - non-persistent)
const DEMO_FLAG_KEY = 'is_demo_account';

/**
 * Check if email matches demo account
 * @param {string} email - Email to check
 * @returns {boolean}
 */
export const isDemoEmail = (email) => {
  if (!email) {
    console.log('[DemoAccount] isDemoEmail: no email provided');
    return false;
  }
  const isDemo = email.toLowerCase().trim() === DEMO_CREDENTIALS.EMAIL.toLowerCase();
  console.log('[DemoAccount] isDemoEmail check:', { 
    email: email.substring(0, 10) + '...', 
    isDemo 
  });
  return isDemo;
};

/**
 * Check if BOTH email AND password match demo account credentials
 * @param {string} email - Email to check
 * @param {string} password - Password to check
 * @returns {boolean}
 */
export const isDemoCredentials = (email, password) => {
  if (!email || !password) {
    console.log('[DemoAccount] isDemoCredentials: missing email or password');
    return false;
  }
  const emailMatch = email.toLowerCase().trim() === DEMO_CREDENTIALS.EMAIL.toLowerCase();
  const passwordMatch = password === DEMO_CREDENTIALS.PASSWORD;
  const isDemo = emailMatch && passwordMatch;
  console.log('[DemoAccount] isDemoCredentials check:', { 
    email: email.substring(0, 10) + '...', 
    emailMatch,
    passwordMatch,
    isDemo 
  });
  return isDemo;
};

/**
 * Set demo account flag
 * Called when demo account successfully logs in
 */
export const setDemoAccountActive = () => {
  try {
    console.log('[DemoAccount] Setting demo flag in sessionStorage...');
    sessionStorage.setItem(DEMO_FLAG_KEY, 'true');
    // Verify it was set
    const verification = sessionStorage.getItem(DEMO_FLAG_KEY);
    console.log('[DemoAccount] Demo account activated for Apple Review', { 
      flagKey: DEMO_FLAG_KEY, 
      flagValue: verification,
      verified: verification === 'true' 
    });
  } catch (e) {
    console.error('[DemoAccount] Failed to set demo flag:', e);
  }
};

/**
 * Clear demo account flag
 * Called on logout or when demo session ends
 */
export const clearDemoAccount = () => {
  try {
    sessionStorage.removeItem(DEMO_FLAG_KEY);
    console.log('[DemoAccount] Demo account cleared');
  } catch (e) {
    console.error('[DemoAccount] Failed to clear demo flag:', e);
  }
};

/**
 * Check if current session is a demo account
 * @returns {boolean}
 */
export const isDemoAccount = () => {
  try {
    const flagValue = sessionStorage.getItem(DEMO_FLAG_KEY);
    const isDemo = flagValue === 'true';
    console.log('[DemoAccount] isDemoAccount check:', { 
      flagKey: DEMO_FLAG_KEY, 
      flagValue, 
      isDemo 
    });
    return isDemo;
  } catch (e) {
    console.error('[DemoAccount] Error reading demo flag:', e);
    return false;
  }
};

/**
 * Get demo account credentials
 * (For reference only - not exposed in production)
 * @returns {object}
 */
export const getDemoCredentials = () => {
  return { ...DEMO_CREDENTIALS };
};
