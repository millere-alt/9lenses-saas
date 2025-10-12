import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Circle, BookOpen, FileText, MessageSquare, Sliders, Home } from 'lucide-react';
import { LENSES } from '../data/nineVectorsSchema';

const AssessmentPage = ({ onNavigateToHome, onNavigateToDashboard }) => {
  const [currentLens, setCurrentLens] = useState(0);
  const [currentSubLens, setCurrentSubLens] = useState(0);
  const [assessmentMode, setAssessmentMode] = useState('learn'); // 'learn' or 'assess'
  const [responses, setResponses] = useState({});

  const lens = LENSES[currentLens];
  const subLens = lens.subLenses[currentSubLens];
  const totalSubLenses = lens.subLenses.length;

  const handleQuantitativeResponse = (theme, score) => {
    const key = `${lens.id}.${currentSubLens}.${theme}`;
    setResponses({
      ...responses,
      [key]: { ...responses[key], quantitative: score }
    });
  };

  const handleQualitativeResponse = (theme, text) => {
    const key = `${lens.id}.${currentSubLens}.${theme}`;
    setResponses({
      ...responses,
      [key]: { ...responses[key], qualitative: text }
    });
  };

  const handleNext = () => {
    if (currentSubLens < totalSubLenses - 1) {
      setCurrentSubLens(currentSubLens + 1);
    } else if (currentLens < LENSES.length - 1) {
      setCurrentLens(currentLens + 1);
      setCurrentSubLens(0);
    }
  };

  const handlePrevious = () => {
    if (currentSubLens > 0) {
      setCurrentSubLens(currentSubLens - 1);
    } else if (currentLens > 0) {
      setCurrentLens(currentLens - 1);
      setCurrentSubLens(LENSES[currentLens - 1].subLenses.length - 1);
    }
  };

  const getResponseForTheme = (theme) => {
    const key = `${lens.id}.${currentSubLens}.${theme}`;
    return responses[key] || { quantitative: null, qualitative: '' };
  };

  const calculateProgress = () => {
    const totalSubLenses = LENSES.reduce((sum, l) => sum + l.subLenses.length, 0);
    const currentPosition = LENSES.slice(0, currentLens).reduce((sum, l) => sum + l.subLenses.length, 0) + currentSubLens + 1;
    return (currentPosition / totalSubLenses) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Salesforce Header */}
      <header className="bg-salesforce-blue text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">9Vectors Assessment & Learning</h1>
              <p className="text-base text-blue-100 mt-1">Quantitative & Qualitative Input Approach</p>
            </div>
            <button
              onClick={onNavigateToDashboard}
              className="px-6 py-3 bg-white text-salesforce-blue rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-md"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-bold text-gray-800">
              Lens {currentLens + 1} of {LENSES.length}: {lens.name}
            </span>
            <span className="text-base font-semibold text-gray-600">
              Sub-lens {currentSubLens + 1} of {totalSubLenses}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-salesforce-blue h-3 rounded-full transition-all duration-500"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">All 9 Lenses</h3>
              <div className="space-y-3">
                {LENSES.map((l, idx) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setCurrentLens(idx);
                      setCurrentSubLens(0);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      idx === currentLens
                        ? 'bg-salesforce-blue-light border-2 border-salesforce-blue text-salesforce-blue shadow-sm'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {idx === currentLens ? (
                          <CheckCircle className="w-5 h-5 text-salesforce-blue" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <div className="font-bold text-base">{l.name}</div>
                          <div className="text-xs text-gray-500 font-medium">{l.category}</div>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded-lg">
                        {l.subLenses.length} sub
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Mode Toggle */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
              <div className="flex items-center gap-6 mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{lens.name} Lens</h2>
                  <p className="text-gray-600 mt-1 text-sm">{lens.description}</p>
                </div>
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: lens.color }}
                >
                  <Sliders className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setAssessmentMode('learn')}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                    assessmentMode === 'learn'
                      ? 'bg-salesforce-blue text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Learn Mode
                  </div>
                </button>
                <button
                  onClick={() => setAssessmentMode('assess')}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                    assessmentMode === 'assess'
                      ? 'bg-salesforce-blue text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-5 h-5" />
                    Assess Mode
                  </div>
                </button>
              </div>
            </div>

            {/* Sub-lens Content */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{subLens.name}</h3>
                <div className="flex flex-wrap gap-3">
                  {lens.subLenses.map((sl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSubLens(idx)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        idx === currentSubLens
                          ? 'bg-salesforce-blue text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {sl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Learning Mode */}
              {assessmentMode === 'learn' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-blue-900 mb-2">What is {subLens.name}?</h4>
                        <p className="text-blue-800 leading-relaxed mb-4">
                          This sub-lens evaluates your organization's capabilities and performance in {subLens.name.toLowerCase()}.
                          Understanding this area helps identify strengths and gaps that impact your overall {lens.name.toLowerCase()} effectiveness.
                        </p>
                        <h5 className="font-semibold text-blue-900 mb-2">Key Themes to Evaluate:</h5>
                        <ul className="space-y-2">
                          {subLens.themes.map((theme, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-blue-800">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                              <span>{theme}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
                    <h4 className="font-bold text-indigo-900 mb-3">Assessment Approach</h4>
                    <div className="space-y-3 text-indigo-800">
                      <p>
                        <strong>Quantitative Input:</strong> Rate each theme on a scale of 0-9, where:
                      </p>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="bg-red-100 p-3 rounded border border-red-300">
                          <div className="font-bold text-red-900">0-3: Weak</div>
                          <div className="text-red-700 text-xs">Needs immediate attention</div>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded border border-yellow-300">
                          <div className="font-bold text-yellow-900">4-6: Moderate</div>
                          <div className="text-yellow-700 text-xs">Room for improvement</div>
                        </div>
                        <div className="bg-green-100 p-3 rounded border border-green-300">
                          <div className="font-bold text-green-900">7-9: Strong</div>
                          <div className="text-green-700 text-xs">Performing well</div>
                        </div>
                      </div>
                      <p className="mt-3">
                        <strong>Qualitative Input:</strong> Provide context, examples, and insights that explain your rating.
                        Share specific observations, challenges, and opportunities you've identified.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Assessment Mode */}
              {assessmentMode === 'assess' && (
                <div className="space-y-6">
                  {subLens.themes.map((theme, idx) => {
                    const response = getResponseForTheme(theme);
                    return (
                      <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-4">{theme}</h4>

                        {/* Quantitative Input */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Rate this theme (0-9):
                          </label>
                          <div className="flex gap-2">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(score => (
                              <button
                                key={score}
                                onClick={() => handleQuantitativeResponse(theme, score)}
                                className={`flex-1 py-3 px-2 rounded-lg font-bold transition-all ${
                                  response.quantitative === score
                                    ? score >= 7
                                      ? 'bg-green-500 text-white ring-2 ring-green-600 scale-110'
                                      : score >= 4
                                      ? 'bg-yellow-500 text-white ring-2 ring-yellow-600 scale-110'
                                      : 'bg-red-500 text-white ring-2 ring-red-600 scale-110'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {score}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Qualitative Input */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <MessageSquare className="w-4 h-4" />
                            Provide context and insights:
                          </label>
                          <textarea
                            value={response.qualitative}
                            onChange={(e) => handleQualitativeResponse(theme, e.target.value)}
                            placeholder="Share your observations, specific examples, challenges, or opportunities related to this theme..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows={3}
                          />
                        </div>

                        {response.quantitative !== null && (
                          <div className="mt-3 text-sm text-gray-600">
                            Score: <strong className={`${
                              response.quantitative >= 7 ? 'text-green-700' :
                              response.quantitative >= 4 ? 'text-yellow-700' : 'text-red-700'
                            }`}>
                              {response.quantitative} - {
                                response.quantitative >= 7 ? 'Strong' :
                                response.quantitative >= 4 ? 'Moderate' : 'Weak'
                              }
                            </strong>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentLens === 0 && currentSubLens === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Previous
                </button>

                <div className="text-center">
                  <div className="text-base font-bold text-gray-700">
                    Progress: {Math.round(calculateProgress())}%
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentLens === LENSES.length - 1 && currentSubLens === totalSubLenses - 1}
                  className="flex items-center gap-2 px-6 py-3 bg-salesforce-blue text-white rounded-lg font-semibold hover:bg-salesforce-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
