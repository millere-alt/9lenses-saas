import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Sparkles,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useAICoaching } from '../contexts/AICoachingContext';

/**
 * AI Coach Widget - Floating coaching assistant
 * Provides contextual coaching throughout the 9Vectors application
 */
const AICoach = ({ position = 'bottom-right', inline = false }) => {
  const {
    isCoachVisible,
    coachingMessage,
    isLoading,
    askQuestion,
    hideCoach,
    showCoach,
    toggleCoach
  } = useAICoaching();

  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (coachingMessage && isCoachVisible) {
      scrollToBottom();
    }
  }, [coachingMessage, isCoachVisible]);

  const handleSendQuestion = async () => {
    if (!input.trim()) return;

    const question = input;
    setInput('');
    await askQuestion(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuestion();
    }
  };

  // Inline mode (embedded in page)
  if (inline) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border-2 border-indigo-100 overflow-hidden">
        <CoachHeader
          onClose={hideCoach}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
          isExpanded={isExpanded}
          inline={true}
        />

        {isExpanded && (
          <>
            <CoachMessages
              coachingMessage={coachingMessage}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
            />

            <CoachInput
              input={input}
              setInput={setInput}
              handleSendQuestion={handleSendQuestion}
              handleKeyPress={handleKeyPress}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    );
  }

  // Floating mode (bottom-right widget)
  if (!isCoachVisible) {
    return (
      <button
        onClick={showCoach}
        data-tour="ai-coach-button"
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-50 group"
        aria-label="Open AI Coach"
      >
        <Bot className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Ask your AI Coach
        </div>
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="w-64 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl shadow-2xl flex items-center justify-between px-4 transition-all"
        >
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <span className="font-semibold">AI Coach</span>
            {isLoading && (
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
          </div>
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed ${position === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6'} w-96 z-50`}>
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-indigo-100 overflow-hidden">
        <CoachHeader
          onClose={hideCoach}
          onMinimize={() => setIsMinimized(true)}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
          isExpanded={isExpanded}
        />

        {isExpanded && (
          <>
            <CoachMessages
              coachingMessage={coachingMessage}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
            />

            <CoachInput
              input={input}
              setInput={setInput}
              handleSendQuestion={handleSendQuestion}
              handleKeyPress={handleKeyPress}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Coach Header Component
 */
const CoachHeader = ({ onClose, onMinimize, onToggleExpand, isExpanded, inline = false }) => (
  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2 text-white">
      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
        <Bot className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-bold text-sm">AI Coach</h3>
        <p className="text-xs text-white/80">9Vectors Expert</p>
      </div>
      <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse ml-1" />
    </div>

    <div className="flex items-center gap-1">
      {!inline && onMinimize && (
        <button
          onClick={onMinimize}
          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Minimize"
        >
          <Minimize2 className="w-4 h-4 text-white" />
        </button>
      )}
      <button
        onClick={onToggleExpand}
        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
        aria-label={isExpanded ? 'Collapse' : 'Expand'}
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-white" />
        ) : (
          <ChevronUp className="w-4 h-4 text-white" />
        )}
      </button>
      <button
        onClick={onClose}
        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4 text-white" />
      </button>
    </div>
  </div>
);

/**
 * Coach Messages Component
 */
const CoachMessages = ({ coachingMessage, isLoading, messagesEndRef }) => (
  <div className="h-80 overflow-y-auto p-4 bg-gray-50">
    {!coachingMessage && !isLoading && (
      <div className="text-center py-8">
        <Lightbulb className="w-12 h-12 text-indigo-300 mx-auto mb-3" />
        <p className="text-gray-600 text-sm">
          I'm your AI coach for the 9Vectors framework.
          <br />
          Ask me anything!
        </p>
      </div>
    )}

    {coachingMessage && (
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="prose prose-sm max-w-none text-gray-700">
              {coachingMessage.message.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-2 last:mb-0 whitespace-pre-wrap">
                  {paragraph.split('**').map((part, j) =>
                    j % 2 === 0 ? part : <strong key={j} className="font-semibold text-gray-900">{part}</strong>
                  )}
                </p>
              ))}
            </div>

            {coachingMessage.suggestions && coachingMessage.suggestions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  Quick Suggestions:
                </p>
                <div className="space-y-1">
                  {coachingMessage.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                      <span className="text-indigo-500 mt-0.5">•</span>
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )}

    {isLoading && (
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    )}

    <div ref={messagesEndRef} />
  </div>
);

/**
 * Coach Input Component
 */
const CoachInput = ({ input, setInput, handleSendQuestion, handleKeyPress, isLoading }) => (
  <div className="p-3 border-t border-gray-100 bg-white">
    <div className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask me about any lens, theme, or strategy..."
        className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm transition-colors"
        disabled={isLoading}
      />
      <button
        onClick={handleSendQuestion}
        disabled={!input.trim() || isLoading}
        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>

    <p className="text-xs text-gray-500 mt-2 text-center">
      Powered by Claude AI • Context-aware coaching
    </p>
  </div>
);

export default AICoach;
