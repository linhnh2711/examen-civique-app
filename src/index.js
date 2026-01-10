import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';

/**
 * iOS Viewport Height Fix
 * 
 * Problem: On iOS Safari, 100vh includes the URL bar height, causing content
 * to be hidden behind the browser UI. The newer dvh unit fixes this, but older
 * iOS versions don't support it.
 * 
 * Solution: Calculate the actual visible viewport height and store it in a
 * CSS custom property (--vh) that can be used as a fallback.
 * 
 * Usage in CSS: height: calc(var(--vh, 1vh) * 100);
 */
const setViewportHeight = () => {
  // Get the actual visible viewport height
  const vh = window.innerHeight * 0.01;
  // Set the CSS custom property
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Set initial value
setViewportHeight();

// Update on resize (handles orientation change and iOS Safari URL bar hide/show)
window.addEventListener('resize', setViewportHeight);

// Also update on orientation change for iOS
window.addEventListener('orientationchange', () => {
  // Small delay to ensure the viewport has updated
  setTimeout(setViewportHeight, 100);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);