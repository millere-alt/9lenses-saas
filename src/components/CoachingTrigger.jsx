import React from 'react';
import { Bot, Sparkles, HelpCircle } from 'lucide-react';
import { useAICoaching } from '../contexts/AICoachingContext';

/**
 * Coaching Trigger Component
 * Can be placed anywhere in the app to trigger contextual coaching
 */
const CoachingTrigger = ({
  lensId,
  subLensId,
  themeName,
  workflow = 'assessment',
  variant = 'button', // 'button', 'icon', 'banner'
  label = 'Get AI Coaching',
  autoTrigger = false,
  className = ''
}) => {
  const { getCoachingForLens, getCoachingForTheme, showCoach } = useAICoaching();

  const handleClick = async () => {
    showCoach();

    if (themeName && lensId && subLensId) {
      await getCoachingForTheme(lensId, subLensId, themeName);
    } else if (lensId) {
      await getCoachingForLens(lensId);
    }
  };

  // Auto-trigger on mount if requested
  React.useEffect(() => {
    if (autoTrigger) {
      handleClick();
    }
  }, [autoTrigger]);

  // Button variant
  if (variant === 'button') {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl ${className}`}
      >
        <Bot className="w-4 h-4" />
        {label}
        <Sparkles className="w-3 h-3 animate-pulse" />
      </button>
    );
  }

  // Icon variant
  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`group relative p-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-lg transition-all ${className}`}
        aria-label={label}
      >
        <Bot className="w-5 h-5" />
        <span className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {label}
        </span>
      </button>
    );
  }

  // Banner variant
  if (variant === 'banner') {
    return (
      <div
        onClick={handleClick}
        className={`cursor-pointer bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-4 hover:border-indigo-400 transition-all ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
              {label}
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            </h4>
            <p className="text-sm text-gray-600">
              Get personalized insights and guidance for this section
            </p>
          </div>
          <HelpCircle className="w-5 h-5 text-indigo-400" />
        </div>
      </div>
    );
  }

  return null;
};

/**
 * Inline Coaching Card
 * Shows coaching immediately without triggering the widget
 */
export const InlineCoachingCard = ({ coaching, className = '' }) => {
  if (!coaching) return null;

  return (
    <div className={`bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-5 ${className}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 flex items-center gap-2">
            AI Coaching
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
          </h4>
          <p className="text-xs text-gray-600">Contextual guidance for this section</p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700">
        {coaching.message.split('\n').map((paragraph, idx) => (
          <p key={idx} className="mb-2 last:mb-0">
            {paragraph.split('**').map((part, j) =>
              j % 2 === 0 ? part : <strong key={j} className="font-semibold text-gray-900">{part}</strong>
            )}
          </p>
        ))}
      </div>

      {coaching.suggestions && coaching.suggestions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-indigo-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">💡 Quick Tips:</p>
          <ul className="space-y-1">
            {coaching.suggestions.map((suggestion, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/**
 * Proactive Coaching Pill
 * Small, unobtrusive trigger that can be placed next to section headers
 */
export const CoachingPill = ({ onClick, label = 'Ask AI Coach' }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-medium rounded-full transition-all"
    >
      <Bot className="w-3 h-3" />
      {label}
    </button>
  );
};

export default CoachingTrigger;
