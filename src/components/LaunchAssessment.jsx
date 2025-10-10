import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Plus, X, Send, Info, Upload, Award } from 'lucide-react';
import PageInstructions from './PageInstructions';

function LaunchAssessment() {
  const navigate = useNavigate();
  const [assessmentName, setAssessmentName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState([{ name: '', email: '', role: 'Employee' }]);

  const roles = [
    'CEO / Executive',
    'Board Member',
    'Senior Leadership',
    'Manager',
    'Employee',
    'Customer',
    'Partner',
    'Consultant/Advisor',
    'Investor',
    'Other'
  ];

  const handleAddParticipant = () => {
    setParticipants([...participants, { name: '', email: '', role: 'Employee' }]);
  };

  const handleRemoveParticipant = (index) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  const handleParticipantChange = (index, field, value) => {
    const updated = [...participants];
    updated[index][field] = value;
    setParticipants(updated);
  };

  const handleLaunch = () => {
    const assessmentId = Math.random().toString(36).substring(2, 15);

    const assessment = {
      id: assessmentId,
      name: assessmentName,
      company: companyName,
      description,
      participants,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
    assessments.push(assessment);
    localStorage.setItem('assessments', JSON.stringify(assessments));

    alert('Assessment launched! Invitations will be sent to participants.');
    navigate('/ceo-dashboard');
  };

  const canLaunch = assessmentName && companyName && participants.some(p => p.email);

  return (
    <div className="space-y-8">
      {/* Floating gradient orbs background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-300/20 to-teal-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-gradient-to-tr from-blue-300/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div>
        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-primary-600 via-secondary-600 to-green-600 bg-clip-text text-transparent mb-3">
          Launch New Assessment
        </h1>
        <p className="text-lg text-gray-600 mb-4">Create and send a 9Vectors assessment to your team</p>

        {/* Quick Guide */}
        <div className="bg-gradient-to-r from-secondary-50 to-primary-50 border-l-4 border-secondary-500 rounded-lg p-4 max-w-4xl">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-secondary-900 mb-1">Quick Start Guide:</h3>
              <p className="text-sm text-secondary-800">
                <span className="font-semibold">1.</span> Name your assessment (e.g., "Q1 2025 Review")
                <span className="mx-2">•</span>
                <span className="font-semibold">2.</span> Enter your company name
                <span className="mx-2">•</span>
                <span className="font-semibold">3.</span> Add team members with their emails
                <span className="mx-2">•</span>
                <span className="font-semibold">4.</span> Click Launch!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-10 space-y-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">Assessment Details</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Assessment Name *
              </label>
              <input
                type="text"
                value={assessmentName}
                onChange={(e) => setAssessmentName(e.target.value)}
                placeholder="e.g., Q1 2025 Strategic Review"
                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Company/Organization *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your company name"
                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-lg font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose and goals..."
                rows={4}
                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg font-medium"
              />
            </div>
          </div>
        </div>

        <div className="border-t-2 border-gray-100 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Invite Participants</h2>
            <button
              onClick={handleAddParticipant}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span className="font-semibold">Add Person</span>
            </button>
          </div>

          <div className="space-y-4">
            {participants.map((participant, index) => (
              <div key={index} className="group flex gap-4 items-start p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl hover:shadow-md transition-all">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={participant.name}
                    onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                    className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  />
                  <input
                    type="email"
                    placeholder="Email address *"
                    value={participant.email}
                    onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                    className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                  />
                  <select
                    value={participant.role}
                    onChange={(e) => handleParticipantChange(index, 'role', e.target.value)}
                    className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                {participants.length > 1 && (
                  <button
                    onClick={() => handleRemoveParticipant(index)}
                    className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition-all hover:scale-110"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Features */}
        <div className="border-t-2 border-gray-100 pt-8">
          <h3 className="text-2xl font-bold text-neutral-900 mb-4">Optional: Enhanced Data Collection</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/assessment/data-sources"
              className="group p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border-2 border-primary-200 hover:border-primary-400 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 mb-1">Add Data Sources</h4>
                  <p className="text-sm text-neutral-600">
                    Upload documents, connect databases, or integrate APIs for richer insights
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/assessment/expertise"
              className="group p-6 bg-gradient-to-br from-green-50 to-primary-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 mb-1">Identify Experts</h4>
                  <p className="text-sm text-neutral-600">
                    Tag participants as experts in specific lenses for weighted scoring
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t-2 border-gray-100">
          <button
            onClick={handleLaunch}
            disabled={!canLaunch}
            className={`group flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg shadow-xl transition-all ${
              canLaunch
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white hover:from-emerald-700 hover:via-teal-700 hover:to-blue-700 hover:scale-105 hover:shadow-2xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className={`w-6 h-6 ${canLaunch ? 'group-hover:translate-x-1 group-hover:-translate-y-1' : ''} transition-transform`} />
            Launch Assessment
          </button>
        </div>
      </div>

      {/* Help Instructions */}
      <PageInstructions
        title="How to Launch an Assessment"
        steps={[
          "Give your assessment a clear name that describes its purpose (e.g., 'Q1 2025 Strategic Review' or 'Annual Performance Assessment')",
          "Enter your company or organization name",
          "Add participants by clicking 'Add Person' - you need at least one email address to launch",
          "For each participant, enter their name (optional), email address (required), and select their role from the dropdown",
          "Review all information and click 'Launch Assessment' when ready",
          "Participants will receive an email invitation with a link to complete the assessment"
        ]}
        tips={[
          "Include diverse perspectives: Add participants from different departments and levels",
          "Choose roles carefully: Role selection helps us weight responses appropriately",
          "You can add as many participants as needed - just click 'Add Person' for each one",
          "The description field is optional but helps participants understand the assessment's context",
          "After launching, you'll be taken to the CEO Dashboard to monitor progress"
        ]}
      />
    </div>
  );
}

export default LaunchAssessment;
