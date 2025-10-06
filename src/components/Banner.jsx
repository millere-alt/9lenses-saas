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
      bg: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      icon: CheckCircle,
      border: 'border-emerald-400'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-rose-600',
      icon: AlertCircle,
      border: 'border-red-400'
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-500 to-green-600',
      icon: AlertTriangle,
      border: 'border-yellow-400'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      icon: Info,
      border: 'border-blue-400'
    }
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} text-white py-3 px-6 shadow-lg border-b-2 ${style.border} animate-slideDown`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <p className="font-medium">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Banner;
