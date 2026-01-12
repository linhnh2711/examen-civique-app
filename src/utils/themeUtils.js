/**
 * Theme Utilities for Examen Civique
 * 
 * OFFICIAL themes as defined by the French Ministry of Interior.
 * These are the canonical names used in all data sources.
 */

// ═══════════════════════════════════════════════════════════════════
// OFFICIAL THEME NAMES (Source of Truth)
// ═══════════════════════════════════════════════════════════════════

export const OFFICIAL_THEMES = [
  "Principes et valeurs de la République",
  "Systèmes institutionnels et politiques",
  "Droits et devoirs",
  "Histoire, géographie et culture",
  "Vivre dans la société française"
];

// ═══════════════════════════════════════════════════════════════════
// UI DISPLAY MAPPING
// Maps official theme names to short display labels for UI
// Use ONLY for display (buttons, tabs, badges, etc.)
// NEVER use for filtering or logic
// ═══════════════════════════════════════════════════════════════════

export const THEME_DISPLAY_MAP = {
  "Principes et valeurs de la République": "Principes & valeurs",
  "Systèmes institutionnels et politiques": "Institutions",
  "Droits et devoirs": "Droits & devoirs",
  "Histoire, géographie et culture": "Histoire & culture",
  "Vivre dans la société française": "Vivre en France"
};

// ═══════════════════════════════════════════════════════════════════
// BACKWARD COMPATIBILITY - Legacy theme normalization
// Maps old shortened names to official names
// Used for data migration and compatibility with old cached data
// ═══════════════════════════════════════════════════════════════════

const LEGACY_THEME_MAP = {
  // Old app names → Official names
  "Système institutionnel": "Systèmes institutionnels et politiques",
  "Histoire et culture": "Histoire, géographie et culture",
  "Principes et valeurs": "Principes et valeurs de la République",
  
  // Old source names (from scraped data) → Official names
  "Système institutionnel et politique": "Systèmes institutionnels et politiques",
  "Histoire géographie et culture": "Histoire, géographie et culture",
  
  // Already official - map to self for completeness
  "Droits et devoirs": "Droits et devoirs",
  "Vivre dans la société française": "Vivre dans la société française",
  "Principes et valeurs de la République": "Principes et valeurs de la République",
  "Systèmes institutionnels et politiques": "Systèmes institutionnels et politiques",
  "Histoire, géographie et culture": "Histoire, géographie et culture"
};

/**
 * Normalizes a theme name to the official name.
 * Use this for backward compatibility with legacy data.
 * 
 * @param {string} theme - Theme name (may be legacy or official)
 * @returns {string} - Official theme name
 */
export function normalizeTheme(theme) {
  if (!theme) return theme;
  return LEGACY_THEME_MAP[theme] || theme;
}

/**
 * Gets the short display name for a theme.
 * Use ONLY for UI display (badges, buttons, tabs).
 * 
 * @param {string} theme - Official theme name
 * @returns {string} - Short display name for UI
 */
export function getThemeDisplayName(theme) {
  if (!theme) return theme;
  // First normalize in case legacy name is passed
  const normalized = normalizeTheme(theme);
  return THEME_DISPLAY_MAP[normalized] || normalized;
}

/**
 * Checks if a theme name is an official theme.
 * 
 * @param {string} theme - Theme name to check
 * @returns {boolean} - True if it's an official theme
 */
export function isOfficialTheme(theme) {
  return OFFICIAL_THEMES.includes(theme);
}

/**
 * Gets all official themes.
 * 
 * @returns {string[]} - Array of official theme names
 */
export function getOfficialThemes() {
  return [...OFFICIAL_THEMES];
}

// ═══════════════════════════════════════════════════════════════════
// THEME COLORS (for UI consistency)
// ═══════════════════════════════════════════════════════════════════

export const THEME_COLORS = {
  "Principes et valeurs de la République": {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800"
  },
  "Systèmes institutionnels et politiques": {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800"
  },
  "Droits et devoirs": {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800"
  },
  "Histoire, géographie et culture": {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800"
  },
  "Vivre dans la société française": {
    bg: "bg-rose-100 dark:bg-rose-900/30",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800"
  }
};

/**
 * Gets the color classes for a theme.
 * 
 * @param {string} theme - Theme name (official or legacy)
 * @returns {object} - Object with bg, text, border class strings
 */
export function getThemeColors(theme) {
  const normalized = normalizeTheme(theme);
  return THEME_COLORS[normalized] || {
    bg: "bg-gray-100 dark:bg-gray-900/30",
    text: "text-gray-600 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-800"
  };
}

