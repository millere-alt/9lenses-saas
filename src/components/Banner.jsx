import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const Banner = ({ type = 'info', message, onClose, autoClose = false, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: {
      bg: 'bg-blue-600',
      icon: CheckCircle,
      border: 'border-blue-500'
    },
    error: {
      bg: 'bg-red-600',
      icon: AlertCircle,
      border: 'border-red-500'
    },
    warning: {
      bg: 'bg-blue-600',
      icon: AlertTriangle,
      border: 'border-blue-500'
    },
    info: {
      bg: 'bg-blue-500',
      icon: Info,
      border: 'border-blue-400'
    }
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} text-white py-2 px-4 shadow-sm border-l-4 ${style.border}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Banner;
