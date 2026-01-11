/**
 * Toast Component
 * 
 * Simple toast notification for displaying messages.
 */

import React, { useEffect } from 'react';
import { X, Info, CheckCircle, AlertTriangle, Crown } from 'lucide-react';

const Toast = ({ 
  message, 
  type = 'info', // 'info' | 'success' | 'warning' | 'premium'
  onClose,
  duration = 5000, // Auto-close after 5 seconds
  action = null, // { label: string, onClick: () => void }
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/30',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    warning: {
      bg: 'bg-orange-50 dark:bg-orange-900/30',
      border: 'border-orange-200 dark:border-orange-800',
      text: 'text-orange-800 dark:text-orange-200',
      icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
    },
    premium: {
      bg: 'bg-purple-50 dark:bg-purple-900/30',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-800 dark:text-purple-200',
      icon: <Crown className="w-5 h-5 text-purple-500" />,
    },
  };

  const style = styles[type] || styles.info;

  return (
    <div className={`fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up`}>
      <div className={`${style.bg} ${style.border} border rounded-xl p-4 shadow-lg`}>
        <div className="flex items-start gap-3">
          {style.icon}
          <div className="flex-1">
            <p className={`text-sm font-medium ${style.text}`}>
              {message}
            </p>
            {action && (
              <button
                onClick={action.onClick}
                className="mt-2 text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                {action.label}
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;

