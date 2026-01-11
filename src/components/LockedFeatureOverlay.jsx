/**
 * LockedFeatureOverlay Component
 * 
 * Shows a lock icon overlay on features that require premium.
 * Used to indicate locked features without blocking the entire button.
 */

import React from 'react';
import { Lock, Crown } from 'lucide-react';

/**
 * Small lock badge to show on buttons
 */
export const LockBadge = ({ tier = 'basic' }) => {
  const bgColor = tier === 'full' 
    ? 'bg-purple-500' 
    : 'bg-blue-500';

  return (
    <div className={`absolute -top-1 -right-1 ${bgColor} text-white rounded-full p-1 shadow-lg`}>
      <Lock className="w-3 h-3" />
    </div>
  );
};

/**
 * Premium badge showing which tier unlocks feature
 */
export const PremiumBadge = ({ tier = 'basic', className = '' }) => {
  const bgColor = tier === 'full' 
    ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
    : 'bg-gradient-to-r from-blue-500 to-cyan-500';

  const label = tier === 'full' ? 'PREMIUM' : 'BASIC';

  return (
    <div className={`inline-flex items-center gap-1 ${bgColor} text-white text-xs font-bold px-2 py-0.5 rounded-full ${className}`}>
      <Crown className="w-3 h-3" />
      {label}
    </div>
  );
};

/**
 * Locked feature card wrapper
 * Adds a subtle overlay and lock indicator
 */
export const LockedFeatureWrapper = ({ 
  children, 
  isLocked, 
  tier = 'basic',
  onClick,
  className = '' 
}) => {
  if (!isLocked) {
    return (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <div 
      className={`relative ${className}`} 
      onClick={onClick}
    >
      {children}
      {/* Lock overlay */}
      <div className="absolute inset-0 bg-gray-900/10 dark:bg-gray-900/30 rounded-2xl pointer-events-none" />
      {/* Lock badge */}
      <div className="absolute top-3 right-3">
        <PremiumBadge tier={tier} />
      </div>
    </div>
  );
};

/**
 * Limit indicator for free users
 * Shows remaining uses (e.g., "2/3 quiz restants")
 */
export const LimitIndicator = ({ current, max, label, className = '' }) => {
  const percentage = (current / max) * 100;
  const isNearLimit = current >= max - 1;

  return (
    <div className={`flex items-center gap-2 text-xs ${className}`}>
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all ${
            isNearLimit ? 'bg-orange-500' : 'bg-blue-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span className={`font-medium ${isNearLimit ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'}`}>
        {current}/{max} {label}
      </span>
    </div>
  );
};

export default LockedFeatureWrapper;

