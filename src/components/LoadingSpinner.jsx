import React from 'react';

/**
 * Enhanced LoadingSpinner component with accessibility and performance improvements
 * @param {'sm'|'md'|'lg'|'xl'} size - Spinner size
 * @param {boolean} fullScreen - Whether to show as fullscreen overlay
 * @param {string} message - Loading message to display
 * @param {string} ariaLabel - Custom aria-label for screen readers
 */
const LoadingSpinner = React.memo(({
  size = 'md',
  fullScreen = false,
  message,
  ariaLabel = 'Loading'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-4'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      <div
        className={`${sizeClasses[size]} border-blue-200 border-t-[#0176D3] rounded-full animate-spin`}
        aria-label={ariaLabel}
      />
      {message && (
        <p className="text-gray-600 font-medium text-center max-w-md" aria-live="polite">
          {message}
        </p>
      )}
      {/* Screen reader text */}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50"
        role="dialog"
        aria-modal="true"
        aria-label="Loading content"
      >
        {spinner}
      </div>
    );
  }

  return spinner;
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
