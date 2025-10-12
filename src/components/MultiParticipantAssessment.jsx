import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Users, Upload, FileText, Plus, X, Home, Save, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { LENSES } from '../data/nineVectorsSchema';

const MultiParticipantAssessment = ({ onNavigateToHome, onNavigateToDashboard }) => {
  const [assessmentMode, setAssessmentMode] = useState('setup'); // 'setup', 'leader', 'participant'
  const [assessmentData, setAssessmentData] = useState({
    companyName: '',
    industry: '',
    assessmentName: '',
    leader: { name: '', email: '', role: '' },
    participants: []
  });
  const [currentParticipant, setCurrentParticipant] = useState(null);
  const [currentLens, setCurrentLens] = useState(0);
  const [currentSubLens, setCurrentSubLens] = useState(0);
  const [responses, setResponses] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [expandedQualitative, setExpandedQualitative] = useState({});

  // Setup Phase
  const handleAddParticipant = () => {
    const newParticipant = {
      id: Date.now(),
      name: '',
      email: '',
      role: '',
      department: ''
    };
    setAssessmentData({
      ...assessmentData,
      participants: [...assessmentData.participants, newParticipant]
    });
  };

  const handleRemoveParticipant = (id) => {
    setAssessmentData({
      ...assessmentData,
      participants: assessmentData.participants.filter(p => p.id !== id)
    });
  };

  const handleParticipantChange = (id, field, value) => {
    setAssessmentData({
      ...assessmentData,
      participants: assessmentData.participants.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    });
  };

  const handleFileUpload = (event, lensId, subLensId) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      lensId,
      subLensId,
      uploadedAt: new Date().toISOString()
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
  };

  // Assessment Phase
  const handleSliderChange = (themeId, value) => {
    const participantId = currentParticipant?.id || 'leader';
    const key = `${participantId}.${currentLens}.${currentSubLens}.${themeId}`;
    setResponses({
      ...responses,
      [key]: {
        ...responses[key],
        quantitative: value
      }
    });
  };

  const handleQualitativeChange = (themeId, value) => {
    const participantId = currentParticipant?.id || 'leader';
    const key = `${participantId}.${currentLens}.${currentSubLens}.${themeId}`;
    setResponses({
      ...responses,
      [key]: {
        ...responses[key],
        qualitative: value
      }
    });
  };

  const getResponse = (themeId) => {
    const participantId = currentParticipant?.id || 'leader';
    const key = `${participantId}.${currentLens}.${currentSubLens}.${themeId}`;
    return responses[key] || { quantitative: 5, qualitative: '' };
  };

  const toggleQualitative = (themeId) => {
    setExpandedQualitative({
      ...expandedQualitative,
      [themeId]: !expandedQualitative[themeId]
    });
  };

  const lens = LENSES[currentLens];
  const subLens = lens.subLenses[currentSubLens];

  const handleNext = () => {
    if (currentSubLens < lens.subLenses.length - 1) {
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

  const calculateProgress = () => {
    const totalSubLenses = LENSES.reduce((sum, l) => sum + l.subLenses.length, 0);
    const currentPosition = LENSES.slice(0, currentLens).reduce((sum, l) => sum + l.subLenses.length, 0) + currentSubLens + 1;
    return (currentPosition / totalSubLenses) * 100;
  };

  const getSliderColor = (value) => {
    if (value >= 7) return 'from-green-500 to-green-600';
    if (value >= 4) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getValueColor = (value) => {
    if (value >= 7) return 'text-green-700 bg-green-100';
    if (value >= 4) return 'text-yellow-700 bg-yellow-100';
    return 'text-red-700 bg-red-100';
  };

  // Setup View
  if (assessmentMode === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={onNavigateToHome}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">Home</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Setup 9Vectors Assessment</h1>
              <div className="w-24"></div>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">Multi-Participant Assessment Setup</h2>
              </div>
              <p className="text-gray-600">
                Create a collaborative assessment with multiple stakeholders. Gather quantitative ratings and qualitative insights
                from your team to build a comprehensive organizational view.
              </p>
            </div>

            {/* Company Information */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Company Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={assessmentData.companyName}
                    onChange={(e) => setAssessmentData({ ...assessmentData, companyName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., TechVenture Inc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                  <input
                    type="text"
                    value={assessmentData.industry}
                    onChange={(e) => setAssessmentData({ ...assessmentData, industry: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Software & Technology"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Name *</label>
                <input
                  type="text"
                  value={assessmentData.assessmentName}
                  onChange={(e) => setAssessmentData({ ...assessmentData, assessmentName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Q4 2025 Strategic Assessment"
                />
              </div>
            </div>

            {/* Leader Information */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Assessment Leader</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={assessmentData.leader.name}
                    onChange={(e) => setAssessmentData({ ...assessmentData, leader: { ...assessmentData.leader, name: e.target.value } })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={assessmentData.leader.email}
                    onChange={(e) => setAssessmentData({ ...assessmentData, leader: { ...assessmentData.leader, email: e.target.value } })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your.email@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                  <input
                    type="text"
                    value={assessmentData.leader.role}
                    onChange={(e) => setAssessmentData({ ...assessmentData, leader: { ...assessmentData.leader, role: e.target.value } })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., CEO, CFO"
                  />
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Participants ({assessmentData.participants.length})</h3>
                <button
                  onClick={handleAddParticipant}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Participant
                </button>
              </div>

              {assessmentData.participants.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No participants added yet</p>
                  <button
                    onClick={handleAddParticipant}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Add First Participant
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {assessmentData.participants.map((participant, idx) => (
                    <div key={participant.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                          {idx + 1}
                        </div>
                        <div className="flex-1 grid md:grid-cols-4 gap-3">
                          <input
                            type="text"
                            value={participant.name}
                            onChange={(e) => handleParticipantChange(participant.id, 'name', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Name"
                          />
                          <input
                            type="email"
                            value={participant.email}
                            onChange={(e) => handleParticipantChange(participant.id, 'email', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Email"
                          />
                          <input
                            type="text"
                            value={participant.role}
                            onChange={(e) => handleParticipantChange(participant.id, 'role', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Role"
                          />
                          <input
                            type="text"
                            value={participant.department}
                            onChange={(e) => handleParticipantChange(participant.id, 'department', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Department"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveParticipant(participant.id)}
                          className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setAssessmentMode('leader');
                  setCurrentParticipant(null);
                }}
                disabled={!assessmentData.companyName || !assessmentData.leader.name}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
              >
                Start Assessment as Leader
              </button>
              {assessmentData.participants.length > 0 && (
                <button
                  onClick={() => {
                    setAssessmentMode('participant');
                    setCurrentParticipant(assessmentData.participants[0]);
                  }}
                  className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-colors shadow-lg"
                >
                  Start as Participant
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Assessment View (Leader or Participant)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAssessmentMode('setup')}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back to Setup</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{assessmentData.companyName}</h1>
                <p className="text-sm text-gray-600">
                  {assessmentMode === 'leader' ? `Leader: ${assessmentData.leader.name}` : `Participant: ${currentParticipant?.name}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToDashboard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {lens.name} Lens - {subLens.name}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(calculateProgress())}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">9 Lenses</h3>
              <div className="space-y-2">
                {LENSES.map((l, idx) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setCurrentLens(idx);
                      setCurrentSubLens(0);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      idx === currentLens
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-900 font-semibold'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent text-gray-700'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>

              {/* File Upload Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Documents
                </h4>
                <label className="block">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e, currentLens, currentSubLens)}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">
                      Upload files for this lens
                    </p>
                  </div>
                </label>
                {uploadedFiles.filter(f => f.lensId === currentLens && f.subLensId === currentSubLens).length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles
                      .filter(f => f.lensId === currentLens && f.subLensId === currentSubLens)
                      .map(file => (
                        <div key={file.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded text-xs">
                          <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="flex-1 truncate text-gray-700">{file.name}</span>
                          <button
                            onClick={() => handleRemoveFile(file.id)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{subLens.name}</h2>
                    <p className="text-gray-600">{lens.name} Lens • {lens.category}</p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: lens.color }}
                  >
                    <span className="text-white font-bold">{currentLens + 1}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {lens.subLenses.map((sl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSubLens(idx)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        idx === currentSubLens
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {sl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Themes with Sliders */}
              <div className="space-y-6">
                {subLens.themes.map((theme, idx) => {
                  const response = getResponse(idx);
                  const isExpanded = expandedQualitative[idx];

                  return (
                    <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                      <h4 className="font-semibold text-gray-900 mb-4">{theme}</h4>

                      {/* Slider */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-gray-700">
                            Rate this theme:
                          </label>
                          <div className={`px-4 py-2 rounded-lg font-bold ${getValueColor(response.quantitative)}`}>
                            {response.quantitative} / 9
                          </div>
                        </div>

                        <div className="relative">
                          <input
                            type="range"
                            min="0"
                            max="9"
                            step="0.5"
                            value={response.quantitative}
                            onChange={(e) => handleSliderChange(idx, parseFloat(e.target.value))}
                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                            style={{
                              background: `linear-gradient(to right,
                                ${response.quantitative >= 7 ? '#10b981' :
                                  response.quantitative >= 4 ? '#f59e0b' : '#ef4444'} 0%,
                                ${response.quantitative >= 7 ? '#10b981' :
                                  response.quantitative >= 4 ? '#f59e0b' : '#ef4444'} ${(response.quantitative / 9) * 100}%,
                                #e5e7eb ${(response.quantitative / 9) * 100}%,
                                #e5e7eb 100%)`
                            }}
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>0 - Weak</span>
                            <span>4-6 - Moderate</span>
                            <span>9 - Strong</span>
                          </div>
                        </div>
                      </div>

                      {/* Qualitative Input Toggle */}
                      <button
                        onClick={() => toggleQualitative(idx)}
                        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 mb-3"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        Add Context & Insights (Optional)
                      </button>

                      {isExpanded && (
                        <div className="mt-3">
                          <textarea
                            value={response.qualitative}
                            onChange={(e) => handleQualitativeChange(idx, e.target.value)}
                            placeholder="Provide context, examples, observations, or insights that support your rating..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows={4}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentLens === 0 && currentSubLens === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Previous
                </button>

                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                    <Save className="w-5 h-5" />
                    Save Progress
                  </button>
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentLens === LENSES.length - 1 && currentSubLens === lens.subLenses.length - 1}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
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

export default MultiParticipantAssessment;
