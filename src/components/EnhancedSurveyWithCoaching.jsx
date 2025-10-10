import React, { useState, useEffect } from 'react';
import {
  Save, Send, ChevronLeft, ChevronRight, Layers, MessageSquare,
  Target, Check, Clock, User, Bot, Sparkles, HelpCircle
} from 'lucide-react';
import { LENSES } from '../data/nineLensesSchema';
import { useAICoaching } from '../contexts/AICoachingContext';
import CoachingTrigger, { InlineCoachingCard, CoachingPill } from './CoachingTrigger';

/**
 * Enhanced Survey Taking Page with AI Coaching Integration
 * Shows contextual coaching as users work through the assessment
 */
const EnhancedSurveyWithCoaching = ({ onNavigateToHome, onComplete }) => {
  const [currentLensIndex, setCurrentLensIndex] = useState(0);
  const [currentSubLensIndex, setCurrentSubLensIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [showInlineCoaching, setShowInlineCoaching] = useState(true);
  const [currentThemeCoaching, setCurrentThemeCoaching] = useState(null);
  const [expandedTheme, setExpandedTheme] = useState(null);

  const {
    getCoachingForLens,
    getCoachingForTheme,
    updateAssessmentContext,
    showCoach
  } = useAICoaching();

  const currentLens = LENSES[currentLensIndex];
  const currentSubLens = currentLens.subLenses[currentSubLensIndex];
  const totalSubLenses = LENSES.reduce((sum, lens) => sum + lens.subLenses.length, 0);
  const completedSubLenses = Object.keys(responses).length;
  const progress = (completedSubLenses / totalSubLenses) * 100;

  // Update coaching context when lens changes
  useEffect(() => {
    updateAssessmentContext({
      company: { name: 'Assessment in Progress' },
      participant: { name: userName, role: userRole },
      currentLens: currentLens.name,
      currentSubLens: currentSubLens.name,
      progress: Math.round(progress)
    });

    // Auto-load coaching for new sub-lens
    if (isStarted && showInlineCoaching) {
      loadLensCoaching();
    }
  }, [currentLensIndex, currentSubLensIndex, isStarted]);

  const loadLensCoaching = async () => {
    const coaching = await getCoachingForLens(currentLens.id);
    setCurrentThemeCoaching(coaching);
  };

  const loadThemeCoaching = async (themeName, themeIndex) => {
    setExpandedTheme(themeIndex);
    const coaching = await getCoachingForTheme(currentLens.id, currentSubLens.id, themeName);
    setCurrentThemeCoaching(coaching);
  };

  const getResponseKey = (lensId, subLensId, themeIndex) => {
    return `${lensId}-${subLensId}-${themeIndex}`;
  };

  const handleScoreChange = (themeIndex, score) => {
    const key = getResponseKey(currentLens.id, currentSubLens.id, themeIndex);
    setResponses({
      ...responses,
      [key]: {
        ...responses[key],
        score: parseInt(score),
        theme: currentSubLens.themes[themeIndex]
      }
    });
  };

  const handleCommentChange = (themeIndex, comment) => {
    const key = getResponseKey(currentLens.id, currentSubLens.id, themeIndex);
    setResponses({
      ...responses,
      [key]: {
        ...responses[key],
        comment,
        theme: currentSubLens.themes[themeIndex]
      }
    });
  };

  const goToNextSubLens = () => {
    if (currentSubLensIndex < currentLens.subLenses.length - 1) {
      setCurrentSubLensIndex(currentSubLensIndex + 1);
    } else if (currentLensIndex < LENSES.length - 1) {
      setCurrentLensIndex(currentLensIndex + 1);
      setCurrentSubLensIndex(0);
    }
    setExpandedTheme(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreviousSubLens = () => {
    if (currentSubLensIndex > 0) {
      setCurrentSubLensIndex(currentSubLensIndex - 1);
    } else if (currentLensIndex > 0) {
      setCurrentLensIndex(currentLensIndex - 1);
      const previousLens = LENSES[currentLensIndex - 1];
      setCurrentSubLensIndex(previousLens.subLenses.length - 1);
    }
    setExpandedTheme(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getScoreColor = (score) => {
    if (score >= 7) return 'text-green-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 7) return 'Strong';
    if (score >= 4) return 'Moderate';
    return 'Weak';
  };

  const handleSubmit = () => {
    alert(`Thank you! Submitted ${Object.keys(responses).length} responses.`);
    if (onComplete) onComplete();
  };

  // Welcome Screen with AI Coach Introduction
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Layers className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                9Vectors Assessment
              </span>
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              A comprehensive evaluation of your organization across 9 interconnected dimensions
            </p>

            {/* AI Coach Introduction */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Bot className="w-6 h-6 text-indigo-600" />
                <h3 className="font-bold text-gray-900">AI Coach Included</h3>
                <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
              </div>
              <p className="text-sm text-gray-700">
                Get real-time coaching and guidance as you complete your assessment. Our AI coach helps you understand each section and provides examples to ensure accurate ratings.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Before you begin:</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g., John Smith"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">Select your role...</option>
                  <option value="Executive">Executive / C-Suite</option>
                  <option value="Manager">Manager / Director</option>
                  <option value="Employee">Employee</option>
                  <option value="Board Member">Board Member</option>
                  <option value="Advisor">Advisor / Consultant</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <h4 className="font-semibold mb-3">What to expect:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>9 lenses covering all aspects of your organization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Rate themes on a 0-9 scale with contextual guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Bot className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span>AI coaching available throughout the assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Estimated time: 30-45 minutes</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setIsStarted(true)}
            disabled={!userName || !userRole}
            className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Assessment
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  // Main Survey Interface with AI Coaching
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      {/* Top Progress Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="h-2 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">9Vectors Assessment</h1>
                <p className="text-sm text-gray-600">
                  {completedSubLenses} of {totalSubLenses} completed ({Math.round(progress)}%)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowInlineCoaching(!showInlineCoaching)}
                className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
              >
                <Bot className="w-4 h-4" />
                {showInlineCoaching ? 'Hide' : 'Show'} Coaching
              </button>
              <button
                onClick={() => alert('Progress saved!')}
                className="px-4 py-2 border-2 border-green-500 text-green-700 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span className="hidden md:inline">Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Survey Content - Left Side (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lens & Sub-Lens Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                  style={{ backgroundColor: currentLens.color }}
                >
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-600 mb-1">
                    {currentLens.category} Phase • Lens {currentLensIndex + 1} of {LENSES.length}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    {currentLens.name}
                    <CoachingPill
                      onClick={() => {
                        showCoach();
                        loadLensCoaching();
                      }}
                      label="Need help?"
                    />
                  </h2>
                  <p className="text-gray-600">{currentLens.description}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {currentSubLens.name}
                </h3>
              </div>
            </div>

            {/* Theme Questions */}
            <div className="space-y-4">
              {currentSubLens.themes.map((theme, idx) => {
                const key = getResponseKey(currentLens.id, currentSubLens.id, idx);
                const response = responses[key] || {};

                return (
                  <div key={idx} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                          {theme}
                          <button
                            onClick={() => loadThemeCoaching(theme, idx)}
                            className="text-indigo-500 hover:text-indigo-700"
                          >
                            <HelpCircle className="w-4 h-4" />
                          </button>
                        </h4>
                      </div>
                      {response.score !== undefined && (
                        <span className={`text-sm font-bold ${getScoreColor(response.score)}`}>
                          {response.score}/9 - {getScoreLabel(response.score)}
                        </span>
                      )}
                    </div>

                    {/* Score Slider */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate from 0 (Weak) to 9 (Strong)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="9"
                        step="1"
                        value={response.score || 0}
                        onChange={(e) => handleScoreChange(idx, e.target.value)}
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0 - Weak</span>
                        <span>4-6 - Moderate</span>
                        <span>9 - Strong</span>
                      </div>
                    </div>

                    {/* Comment Area */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comments (optional)
                      </label>
                      <textarea
                        value={response.comment || ''}
                        onChange={(e) => handleCommentChange(idx, e.target.value)}
                        placeholder="Provide context, examples, or specific observations..."
                        rows={3}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-sm"
                      />
                    </div>

                    {/* Show inline coaching if this theme is expanded */}
                    {expandedTheme === idx && currentThemeCoaching && (
                      <div className="mt-4">
                        <InlineCoachingCard coaching={currentThemeCoaching} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between gap-4">
              <button
                onClick={goToPreviousSubLens}
                disabled={currentLensIndex === 0 && currentSubLensIndex === 0}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              {currentLensIndex === LENSES.length - 1 && currentSubLensIndex === currentLens.subLenses.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg"
                >
                  Submit Assessment
                  <Send className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={goToNextSubLens}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* AI Coaching Sidebar - Right Side (1/3) */}
          {showInlineCoaching && (
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {currentThemeCoaching ? (
                  <InlineCoachingCard coaching={currentThemeCoaching} />
                ) : (
                  <CoachingTrigger
                    lensId={currentLens.id}
                    variant="banner"
                    label="Get AI Coaching"
                    className="cursor-pointer"
                  />
                )}

                {/* Quick Stats */}
                <div className="mt-6 bg-white rounded-xl shadow-md border border-gray-200 p-5">
                  <h4 className="font-bold text-gray-900 mb-3">Your Progress</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-semibold">{completedSubLenses}/{totalSubLenses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Lens:</span>
                      <span className="font-semibold">{currentLens.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Sub-Lens:</span>
                      <span className="font-semibold">{currentSubLens.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSurveyWithCoaching;
