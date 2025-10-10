import React, { useState } from 'react';
import { FileText, Upload, Link2, Brain, Plus, Search, TrendingUp, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentManagement from './DocumentManagement';
import DocumentCorrelation from './DocumentCorrelation';
import AIDocumentAnalysis from './AIDocumentAnalysis';
import { mockAssessmentData } from '../data/mockAssessment';

const DocumentHub = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manage');
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const tabs = [
    {
      id: 'manage',
      label: 'Document Library',
      icon: FileText,
      description: 'Upload and organize your business documents'
    },
    {
      id: 'correlate',
      label: 'Correlate with Assessment',
      icon: Link2,
      description: 'Link documents to assessment results'
    },
    {
      id: 'analyze',
      label: 'AI Analysis',
      icon: Brain,
      description: 'Get AI-powered insights from your documents'
    }
  ];

  const handleDocumentsUpdate = (newDocuments) => {
    setDocuments(newDocuments);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-5xl font-bold mb-4">Document Intelligence Center</h1>
              <p className="text-xl opacity-90 max-w-3xl">
                Upload financial statements, strategy documents, marketing plans, and operational manuals.
                Automatically correlate with your 9Vectors assessment for powerful insights.
              </p>
            </div>
            <button
              onClick={() => navigate('/documents/dissect')}
              className="bg-white text-indigo-600 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 flex items-center space-x-3"
            >
              <Layers className="w-6 h-6" />
              <span>9-Lens Dissector</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Documents</p>
                  <p className="text-3xl font-bold">{documents.length}</p>
                </div>
                <FileText className="w-10 h-10 opacity-80" />
              </div>
            </div>

            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Categorized</p>
                  <p className="text-3xl font-bold">
                    {documents.filter(d => d.lens).length}
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 opacity-80" />
              </div>
            </div>

            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Correlated</p>
                  <p className="text-3xl font-bold">
                    {documents.filter(d => d.correlations?.length > 0).length}
                  </p>
                </div>
                <Link2 className="w-10 h-10 opacity-80" />
              </div>
            </div>

            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">AI Analyzed</p>
                  <p className="text-3xl font-bold">
                    {documents.filter(d => d.aiAnalyzed).length}
                  </p>
                </div>
                <Brain className="w-10 h-10 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <div className="bg-white rounded-lg shadow-lg p-2 flex space-x-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-lg
                  font-semibold transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'manage' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <DocumentManagement
              documents={documents}
              onDocumentsUpdate={handleDocumentsUpdate}
            />
          </div>
        )}

        {activeTab === 'correlate' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <DocumentCorrelation
              documents={documents}
              assessmentData={mockAssessmentData}
            />
          </div>
        )}

        {activeTab === 'analyze' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {documents.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Documents to Analyze</h3>
                <p className="text-gray-600 mb-6">Upload documents first to enable AI analysis</p>
                <button
                  onClick={() => setActiveTab('manage')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Document Library
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Select a Document to Analyze</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {documents.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDocument(doc)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedDocument?.id === doc.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <FileText className="w-8 h-8 text-blue-600 mb-2" />
                      <p className="font-semibold text-gray-900 truncate">{doc.name}</p>
                      <p className="text-sm text-gray-600">{doc.lens || 'Uncategorized'}</p>
                    </button>
                  ))}
                </div>

                {selectedDocument && (
                  <AIDocumentAnalysis
                    document={selectedDocument}
                    assessmentData={mockAssessmentData}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">How Document Intelligence Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Upload className="w-6 h-6" />
                <h4 className="font-bold text-lg">1. Upload Documents</h4>
              </div>
              <p className="opacity-90">
                Upload financials (by product line), strategy docs, marketing plans, operations manuals,
                and any other business documents.
              </p>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Link2 className="w-6 h-6" />
                <h4 className="font-bold text-lg">2. Categorize & Correlate</h4>
              </div>
              <p className="opacity-90">
                Tag documents by lens and sub-lens. Our system automatically correlates them with your
                9Vectors assessment scores.
              </p>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-6 h-6" />
                <h4 className="font-bold text-lg">3. Get AI Insights</h4>
              </div>
              <p className="opacity-90">
                AI analyzes your documents to identify gaps, opportunities, risks, and actionable
                recommendations aligned with your assessment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentHub;
