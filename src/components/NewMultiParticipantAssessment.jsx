import React, { useState } from 'react';
import {
  ArrowRight, Users, Mail, Plus, X, Upload, FileText, Target,
  Send, Copy, Check, ChevronRight, Layers, Save, Download
} from 'lucide-react';
import { LENSES } from '../data/nineLensesSchema';

const NewMultiParticipantAssessment = ({ onNavigateToHome, onNavigateToDashboard }) => {
  const [step, setStep] = useState(1); // 1: Create, 2: Invite, 3: Upload Files
  const [assessmentName, setAssessmentName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [invites, setInvites] = useState([{ email: '', role: '' }]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [selectedLens, setSelectedLens] = useState(null);
  const [selectedSubLens, setSelectedSubLens] = useState(null);

  const roles = [
    'CEO / Executive',
    'Board Member',
    'Manager',
    'Employee',
    'Customer',
    'Partner',
    'Advisor',
    'Other'
  ];

  const handleAddInvite = () => {
    setInvites([...invites, { email: '', role: '' }]);
  };

  const handleRemoveInvite = (index) => {
    setInvites(invites.filter((_, i) => i !== index));
  };

  const handleInviteChange = (index, field, value) => {
    const updated = [...invites];
    updated[index][field] = value;
    setInvites(updated);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://9Vectors.app/assessment/abc123');
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleSendInvites = () => {
    // In production, this would send emails via backend
    alert(`Sending invites to ${invites.length} participants!`);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-brand-green-50 to-brand-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-green-500 to-brand-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-green-600 to-brand-blue-600 bg-clip-text text-transparent">
                  Team Assessment
                </h1>
                <p className="text-sm text-gray-600">Multi-stakeholder evaluation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToDashboard}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={onNavigateToHome}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Home
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mt-6">
            <div className="flex items-center justify-center gap-4">
              {[
                { num: 1, label: 'Create Assessment' },
                { num: 2, label: 'Invite Participants' },
                { num: 3, label: 'Upload Documents' }
              ].map((s, idx) => (
                <div key={s.num} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step >= s.num
                        ? 'bg-gradient-to-br from-brand-green-500 to-brand-blue-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {s.num}
                    </div>
                    <span className={`text-sm font-medium ${step >= s.num ? 'text-gray-900' : 'text-gray-500'}`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < 2 && (
                    <ChevronRight className="w-5 h-5 text-gray-400 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Step 1: Create Assessment */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Assessment</h2>
              <p className="text-gray-600">Set up your 9Vectors team evaluation</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assessment Name *
                </label>
                <input
                  type="text"
                  value={assessmentName}
                  onChange={(e) => setAssessmentName(e.target.value)}
                  placeholder="e.g., Q1 2025 Strategic Review"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-green-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your organization name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-green-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the purpose of this assessment..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-green-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="bg-gradient-to-br from-brand-green-50 to-brand-blue-50 rounded-xl p-6 border border-brand-green-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-brand-green-600" />
                  What's included in this assessment?
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-brand-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>9 Lenses</strong> with 32 sub-lenses and 180+ themes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-brand-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Multi-stakeholder surveys</strong> with slider ratings (0-9) and rich comments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-brand-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Document uploads</strong> organized by lens and sub-lens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-brand-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Current vs Future state tracking</strong> for transformation planning</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-between items-center pt-6">
                <button
                  onClick={onNavigateToHome}
                  className="px-6 py-3 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!assessmentName || !companyName}
                  className="px-8 py-3 bg-gradient-to-r from-brand-green-500 to-brand-blue-600 text-white rounded-lg font-semibold hover:from-brand-green-600 hover:to-brand-blue-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Invites
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Invite Participants */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Invite Participants</h2>
                <p className="text-gray-600">Add team members and stakeholders to provide their assessment</p>
              </div>

              <div className="space-y-4 mb-6">
                {invites.map((invite, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <input
                        type="email"
                        value={invite.email}
                        onChange={(e) => handleInviteChange(index, 'email', e.target.value)}
                        placeholder="email@company.com"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-green-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="w-48">
                      <select
                        value={invite.role}
                        onChange={(e) => handleInviteChange(index, 'role', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-green-500 focus:outline-none transition-colors"
                      >
                        <option value="">Select role...</option>
                        {roles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    {invites.length > 1 && (
                      <button
                        onClick={() => handleRemoveInvite(index)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddInvite}
                className="px-6 py-3 border-2 border-dashed border-brand-green-300 text-brand-green-700 rounded-lg font-semibold hover:bg-brand-green-50 transition-colors flex items-center gap-2 w-full justify-center"
              >
                <Plus className="w-5 h-5" />
                Add Another Participant
              </button>

              <div className="mt-8 p-6 bg-gradient-to-br from-brand-blue-50 to-brand-teal-50 rounded-xl border border-brand-blue-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-brand-blue-600" />
                  Or share this link
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="https://9Vectors.app/assessment/abc123"
                    readOnly
                    className="flex-1 px-4 py-3 bg-white border-2 border-brand-blue-300 rounded-lg text-gray-700 font-mono text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-6 py-3 bg-white border-2 border-brand-blue-300 text-brand-blue-700 rounded-lg font-semibold hover:bg-brand-blue-50 transition-colors flex items-center gap-2"
                  >
                    {linkCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {linkCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">Anyone with this link can participate in the assessment</p>
              </div>

              <div className="flex justify-between items-center pt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSendInvites}
                  className="px-8 py-3 bg-gradient-to-r from-brand-green-500 to-brand-blue-600 text-white rounded-lg font-semibold hover:from-brand-green-600 hover:to-brand-blue-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Send className="w-5 h-5" />
                  Send Invitations
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Upload Documents */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Documents by Lens</h2>
                <p className="text-gray-600">Add financial statements, strategies, processes, and other artifacts</p>
              </div>

              {/* Lens Selection Grid */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {LENSES.map(lens => (
                  <button
                    key={lens.id}
                    onClick={() => {
                      setSelectedLens(lens);
                      setSelectedSubLens(null);
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedLens?.id === lens.id
                        ? 'border-brand-green-500 bg-brand-green-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: lens.color }}
                      />
                      <h3 className="font-bold text-gray-900">{lens.name}</h3>
                    </div>
                    <p className="text-xs text-gray-600">{lens.subLenses.length} sub-lenses</p>
                  </button>
                ))}
              </div>

              {/* Sub-Lens Selection */}
              {selectedLens && (
                <div className="bg-gradient-to-br from-gray-50 to-brand-green-50 rounded-xl p-6 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4">
                    {selectedLens.name} Sub-Lenses
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedLens.subLenses.map(subLens => (
                      <button
                        key={subLens.id}
                        onClick={() => setSelectedSubLens(subLens)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          selectedSubLens?.id === subLens.id
                            ? 'border-brand-blue-500 bg-white shadow-md'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900 mb-1">{subLens.name}</div>
                        <div className="text-xs text-gray-600">{subLens.themes.length} themes</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* File Upload Area */}
              {selectedSubLens && (
                <div className="border-2 border-dashed border-brand-green-300 rounded-xl p-12 bg-gradient-to-br from-brand-green-50 to-brand-blue-50">
                  <div className="text-center">
                    <Upload className="w-16 h-16 text-brand-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Upload files for: {selectedLens.name} → {selectedSubLens.name}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Drag and drop or click to browse. Supports PDF, Excel, Word, PowerPoint, and more.
                    </p>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-green-500 to-brand-blue-600 text-white rounded-lg font-semibold hover:from-brand-green-600 hover:to-brand-blue-700 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
                    >
                      <FileText className="w-5 h-5" />
                      Choose Files
                    </label>
                    <p className="text-sm text-gray-500 mt-4">
                      Files will be organized by lens and sub-lens automatically
                    </p>
                  </div>
                </div>
              )}

              {!selectedLens && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Select a lens above to start uploading documents</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-8">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
                >
                  Back
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => alert('Assessment saved!')}
                    className="px-6 py-3 border-2 border-brand-green-500 text-brand-green-700 rounded-lg font-semibold hover:bg-brand-green-50 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Draft
                  </button>
                  <button
                    onClick={onNavigateToDashboard}
                    className="px-8 py-3 bg-gradient-to-r from-brand-green-500 to-brand-blue-600 text-white rounded-lg font-semibold hover:from-brand-green-600 hover:to-brand-blue-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Check className="w-5 h-5" />
                    Complete & View Dashboard
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-brand-green-600" />
                  <span className="text-3xl font-bold text-gray-900">{invites.length}</span>
                </div>
                <p className="text-gray-600 font-medium">Invited Participants</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-8 h-8 text-brand-blue-600" />
                  <span className="text-3xl font-bold text-gray-900">0</span>
                </div>
                <p className="text-gray-600 font-medium">Documents Uploaded</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-8 h-8 text-brand-teal-600" />
                  <span className="text-3xl font-bold text-gray-900">9</span>
                </div>
                <p className="text-gray-600 font-medium">Lenses to Assess</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewMultiParticipantAssessment;
