import React, { useState } from 'react';
import {
  Save, Send, ChevronLeft, ChevronRight, Layers, MessageSquare,
  Target, Check, Clock, User
} from 'lucide-react';
import { LENSES } from '../data/nineVectorsSchema';

const SurveyTakingPage = ({ onNavigateToHome, onComplete }) => {
  const [currentLensIndex, setCurrentLensIndex] = useState(0);
  const [currentSubLensIndex, setCurrentSubLensIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isStarted, setIsStarted] = useState(false);

  const currentLens = LENSES[currentLensIndex];
  const currentSubLens = currentLens.subLenses[currentSubLensIndex];
  const totalSubLenses = LENSES.reduce((sum, lens) => sum + lens.subLenses.length, 0);
  const completedSubLenses = Object.keys(responses).length;
  const progress = (completedSubLenses / totalSubLenses) * 100;

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getScoreColor = (score) => {
    if (score >= 7) return 'text-score-strong';
    if (score >= 4) return 'text-score-moderate';
    return 'text-score-weak';
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

  // Welcome Screen
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-green-50 via-white to-brand-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-green-500 to-brand-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Layers className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-brand-green-600 to-brand-blue-600 bg-clip-text text-transparent">
                9Vectors Assessment
              </span>
            </h1>
            <p className="text-lg text-gray-600">Company Strategic Review</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-green-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Role *
              </label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-green-500 focus:outline-none transition-colors"
              >
                <option value="">Select your role...</option>
                <option value="CEO / Executive">CEO / Executive</option>
                <option value="Board Member">Board Member</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
                <option value="Customer">Customer</option>
                <option value="Partner">Partner</option>
                <option value="Advisor">Advisor</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="bg-gradient-to-br from-brand-green-50 to-brand-blue-50 rounded-xl p-6 border border-brand-green-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-green-600" />
                What to expect
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-brand-green-600 flex-shrink-0 mt-0.5" />
                  <span>Rate themes across 9 lenses using a 0-9 slider scale</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-brand-green-600 flex-shrink-0 mt-0.5" />
                  <span>Add comments to provide context and insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-brand-green-600 flex-shrink-0 mt-0.5" />
                  <span>Save progress and return anytime</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-brand-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Estimated time: 30-45 minutes</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsStarted(true)}
              disabled={!userName || !userRole}
              className="w-full px-8 py-4 bg-gradient-to-r from-brand-green-500 to-brand-blue-600 text-white rounded-lg font-bold text-lg hover:from-brand-green-600 hover:to-brand-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Assessment
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Survey Interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-brand-green-50 to-brand-blue-50">
      {/* Top Progress Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="h-2 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-brand-green-500 to-brand-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-green-500 to-brand-blue-600 rounded-lg flex items-center justify-center shadow-lg">
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
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                {userName} ({userRole})
              </div>
              <button
                onClick={() => alert('Progress saved!')}
                className="px-4 py-2 border-2 border-brand-green-500 text-brand-green-700 rounded-lg font-semibold hover:bg-brand-green-50 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span className="hidden md:inline">Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Lens & Sub-Lens Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 mb-6">
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {currentLens.name}
              </h2>
              <p className="text-gray-600">{currentLens.description}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900">
                {currentSubLens.name}
              </h3>
              <span className="text-sm text-gray-600">
                Sub-Lens {currentSubLensIndex + 1} of {currentLens.subLenses.length}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {currentSubLens.themes.length} themes to rate
            </p>
          </div>
        </div>

        {/* Theme Rating Cards */}
        <div className="space-y-6">
          {currentSubLens.themes.map((theme, index) => {
            const key = getResponseKey(currentLens.id, currentSubLens.id, index);
            const response = responses[key] || {};
            const score = response.score ?? 5;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-bold text-gray-900">{theme}</h4>
                    {response.score !== undefined && (
                      <div className="flex items-center gap-2">
                        <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                          {score}
                        </span>
                        <span className={`text-sm font-semibold ${getScoreColor(score)}`}>
                          {getScoreLabel(score)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Slider */}
                  <div className="mb-2">
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="9"
                        value={score}
                        onChange={(e) => handleScoreChange(index, e.target.value)}
                        className="w-full h-4 appearance-none cursor-pointer slider rounded-full"
                        style={{
                          background: `linear-gradient(to right,
                            #ef4444 0%,
                            #f97316 ${(2/9)*100}%,
                            #eab308 ${(4/9)*100}%,
                            #84cc16 ${(6/9)*100}%,
                            #22c55e ${(7/9)*100}%,
                            #10b981 100%)`
                        }}
                      />
                      {/* Score markers */}
                      <div className="flex justify-between absolute w-full -bottom-2 px-1 pointer-events-none">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                          <div
                            key={num}
                            className={`w-1 h-1 rounded-full ${
                              num === score ? 'bg-brand-green-600 w-2 h-2' : 'bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-4 px-1">
                      <span className="text-red-600 font-semibold">0 - Critical</span>
                      <span className="text-yellow-600 font-semibold">4 - Moderate</span>
                      <span className="text-green-600 font-semibold">9 - Excellent</span>
                    </div>
                  </div>
                </div>

                {/* Comment Box */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Add your insights (optional)
                  </label>
                  <textarea
                    value={response.comment || ''}
                    onChange={(e) => handleCommentChange(index, e.target.value)}
                    placeholder="Share your thoughts, examples, or concerns..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-green-500 focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <button
            onClick={goToPreviousSubLens}
            disabled={currentLensIndex === 0 && currentSubLensIndex === 0}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {currentLensIndex === LENSES.length - 1 &&
           currentSubLensIndex === currentLens.subLenses.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-brand-green-500 to-brand-blue-600 text-white rounded-lg font-bold hover:from-brand-green-600 hover:to-brand-blue-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5" />
              Submit Assessment
            </button>
          ) : (
            <button
              onClick={goToNextSubLens}
              className="px-8 py-3 bg-gradient-to-r from-brand-green-500 to-brand-blue-600 text-white rounded-lg font-semibold hover:from-brand-green-600 hover:to-brand-blue-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Lens Navigation (Optional Quick Jump) */}
        <div className="mt-6 bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Quick Navigation</h3>
          <div className="flex flex-wrap gap-2">
            {LENSES.map((lens, idx) => (
              <button
                key={lens.id}
                onClick={() => {
                  setCurrentLensIndex(idx);
                  setCurrentSubLensIndex(0);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  idx === currentLensIndex
                    ? 'bg-gradient-to-r from-brand-green-500 to-brand-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {lens.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22c55e 0%, #3b82f6 100%);
          border: 4px solid white;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 6px 20px rgba(34, 197, 94, 0.6);
        }

        .slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22c55e 0%, #3b82f6 100%);
          border: 4px solid white;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
          transition: all 0.2s ease;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 6px 20px rgba(34, 197, 94, 0.6);
        }
      `}</style>
    </div>
  );
};

export default SurveyTakingPage;
