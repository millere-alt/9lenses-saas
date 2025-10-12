import React, { useState } from 'react';
import {
  Upload, FileText, Zap, Brain, Target, TrendingUp, AlertCircle,
  CheckCircle, Layers, Eye, Download, Share2, Sparkles, BarChart3,
  DollarSign, Users, Shield, Briefcase, Settings, Scale, ChevronRight
} from 'lucide-react';
import { LENSES } from '../data/nineVectorsSchema';

const DocumentDissector = () => {
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [isDissecting, setIsDissecting] = useState(false);
  const [dissectionResults, setDissectionResults] = useState(null);
  const [selectedLens, setSelectedLens] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedDocument({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        uploadedAt: new Date().toISOString()
      });
      setDissectionResults(null);
    }
  };

  const dissectDocument = () => {
    setIsDissecting(true);

    // Simulate AI dissection process
    setTimeout(() => {
      const results = performDissection(uploadedDocument);
      setDissectionResults(results);
      setIsDissecting(false);
    }, 2500);
  };

  const performDissection = (doc) => {
    const isFinancial = doc.name.toLowerCase().includes('financial') ||
                        doc.name.toLowerCase().includes('budget') ||
                        doc.name.toLowerCase().includes('p&l');

    const isStrategy = doc.name.toLowerCase().includes('strategy') ||
                       doc.name.toLowerCase().includes('strategic') ||
                       doc.name.toLowerCase().includes('plan');

    const isMarketing = doc.name.toLowerCase().includes('marketing') ||
                        doc.name.toLowerCase().includes('market');

    // AI extracts content and maps to 9 lenses
    const lensMapping = [
      {
        lens: LENSES[0], // Market
        relevance: isMarketing ? 95 : isStrategy ? 75 : 45,
        extractedContent: [
          { type: 'insight', text: 'Target market identified as mid-market B2B SaaS companies', confidence: 92 },
          { type: 'insight', text: 'Market size estimated at $2.4B with 12% annual growth', confidence: 88 },
          { type: 'gap', text: 'Limited geographic expansion strategy mentioned', confidence: 75 }
        ],
        subLensBreakdown: [
          { id: '1.1', name: 'Market Characteristics', coverage: 85, insights: 4 },
          { id: '1.2', name: 'Competition', coverage: 60, insights: 2 },
          { id: '1.3', name: 'Customer', coverage: 70, insights: 3 },
          { id: '1.4', name: 'Market Positioning', coverage: 55, insights: 2 },
          { id: '1.5', name: 'Market Timing', coverage: 40, insights: 1 }
        ],
        recommendations: [
          'Develop detailed competitive analysis section',
          'Include customer segmentation data',
          'Add market entry timeline and milestones'
        ]
      },
      {
        lens: LENSES[1], // People
        relevance: isStrategy ? 65 : 35,
        extractedContent: [
          { type: 'insight', text: 'Team structure shows 45 employees across 5 departments', confidence: 90 },
          { type: 'gap', text: 'Limited information on employee development programs', confidence: 80 },
          { type: 'strength', text: 'Strong emphasis on company culture and values', confidence: 85 }
        ],
        subLensBreakdown: [
          { id: '2.1', name: 'Employee Characteristics', coverage: 50, insights: 2 },
          { id: '2.2', name: 'Culture', coverage: 70, insights: 3 },
          { id: '2.3', name: 'Leadership', coverage: 45, insights: 2 },
          { id: '2.4', name: 'Organizational Design', coverage: 65, insights: 3 }
        ],
        recommendations: [
          'Add leadership team bios and qualifications',
          'Include retention and satisfaction metrics',
          'Document training and development initiatives'
        ]
      },
      {
        lens: LENSES[2], // Financial
        relevance: isFinancial ? 98 : isStrategy ? 70 : 40,
        extractedContent: [
          { type: 'insight', text: 'Revenue: $4.5M with 35% gross margin', confidence: 95 },
          { type: 'insight', text: 'Burn rate: $250K/month with 18 months runway', confidence: 93 },
          { type: 'insight', text: 'Product line A contributes 60% of revenue at 42% margin', confidence: 88 },
          { type: 'strength', text: 'Strong unit economics with LTV/CAC ratio of 3.5:1', confidence: 90 },
          { type: 'gap', text: 'Limited detail on capital structure and future funding needs', confidence: 85 }
        ],
        subLensBreakdown: [
          { id: '3.1', name: 'Accounting', coverage: 80, insights: 5 },
          { id: '3.2', name: 'Capital Structure', coverage: 45, insights: 2 },
          { id: '3.3', name: 'Financial Model', coverage: 90, insights: 8 },
          { id: '3.4', name: 'Forecasting', coverage: 75, insights: 4 },
          { id: '3.5', name: 'Historical Performance', coverage: 85, insights: 6 }
        ],
        recommendations: [
          'Add detailed cap table and ownership structure',
          'Include 3-year financial projections',
          'Provide variance analysis vs. plan'
        ]
      },
      {
        lens: LENSES[3], // Strategy
        relevance: isStrategy ? 95 : isMarketing ? 70 : 50,
        extractedContent: [
          { type: 'insight', text: 'Clear differentiation strategy based on AI-powered analytics', confidence: 92 },
          { type: 'insight', text: 'Three-year vision to become category leader', confidence: 88 },
          { type: 'strength', text: 'Strong value proposition aligned with customer pain points', confidence: 90 },
          { type: 'gap', text: 'Pricing strategy lacks competitive positioning details', confidence: 75 }
        ],
        subLensBreakdown: [
          { id: '4.1', name: 'Delivery Outlets', coverage: 60, insights: 3 },
          { id: '4.2', name: 'General Strategy', coverage: 85, insights: 7 },
          { id: '4.3', name: 'Offerings', coverage: 75, insights: 5 },
          { id: '4.4', name: 'Pricing Strategy', coverage: 50, insights: 2 },
          { id: '4.5', name: 'Promotion', coverage: 70, insights: 4 }
        ],
        recommendations: [
          'Detail go-to-market strategy by segment',
          'Include pricing tiers and packaging strategy',
          'Add strategic partnership roadmap'
        ]
      },
      {
        lens: LENSES[4], // Operations
        relevance: isStrategy ? 55 : 30,
        extractedContent: [
          { type: 'insight', text: 'Cloud-based infrastructure with 99.9% uptime SLA', confidence: 85 },
          { type: 'gap', text: 'Limited documentation of operational processes', confidence: 80 }
        ],
        subLensBreakdown: [
          { id: '5.1', name: 'General Operations', coverage: 45, insights: 2 },
          { id: '5.2', name: 'Infrastructure', coverage: 70, insights: 3 },
          { id: '5.3', name: 'Processes', coverage: 35, insights: 1 },
          { id: '5.4', name: 'Systems', coverage: 65, insights: 3 }
        ],
        recommendations: [
          'Document key operational processes',
          'Include capacity planning details',
          'Add technology stack overview'
        ]
      },
      {
        lens: LENSES[5], // Execution
        relevance: isStrategy ? 60 : 25,
        extractedContent: [
          { type: 'insight', text: 'OKR framework in place with quarterly reviews', confidence: 82 },
          { type: 'gap', text: 'Limited KPIs and performance metrics documented', confidence: 78 }
        ],
        subLensBreakdown: [
          { id: '6.1', name: 'Measurement', coverage: 50, insights: 2 },
          { id: '6.2', name: 'Performance', coverage: 55, insights: 3 }
        ],
        recommendations: [
          'Define comprehensive KPI dashboard',
          'Include historical performance trends',
          'Add benchmarking against industry standards'
        ]
      },
      {
        lens: LENSES[6], // Expectations
        relevance: isStrategy ? 50 : 20,
        extractedContent: [
          { type: 'insight', text: 'Board meets quarterly with clear governance structure', confidence: 80 },
          { type: 'gap', text: 'Stakeholder expectation management process unclear', confidence: 70 }
        ],
        subLensBreakdown: [
          { id: '7.1', name: 'All Stakeholders', coverage: 40, insights: 2 },
          { id: '7.2', name: 'Board and Shareholders', coverage: 65, insights: 3 },
          { id: '7.3', name: 'Customers', coverage: 55, insights: 2 },
          { id: '7.4', name: 'Employees', coverage: 45, insights: 2 },
          { id: '7.5', name: 'Partners', coverage: 30, insights: 1 }
        ],
        recommendations: [
          'Document stakeholder communication cadence',
          'Include customer satisfaction metrics',
          'Add employee engagement scores'
        ]
      },
      {
        lens: LENSES[7], // Governance
        relevance: isStrategy ? 45 : isFinancial ? 55 : 25,
        extractedContent: [
          { type: 'insight', text: 'Documented policies for data privacy and security compliance', confidence: 85 },
          { type: 'gap', text: 'Board committee structure not fully detailed', confidence: 75 }
        ],
        subLensBreakdown: [
          { id: '8.1', name: 'Practices', coverage: 60, insights: 3 },
          { id: '8.2', name: 'Principles', coverage: 50, insights: 2 },
          { id: '8.3', name: 'Structure', coverage: 40, insights: 2 }
        ],
        recommendations: [
          'Detail board composition and expertise',
          'Include audit and compliance framework',
          'Add risk management policies'
        ]
      },
      {
        lens: LENSES[8], // Entity
        relevance: isFinancial ? 50 : 30,
        extractedContent: [
          { type: 'insight', text: 'Delaware C-Corp with standard governance documents', confidence: 88 },
          { type: 'gap', text: 'IP portfolio and protection strategy not detailed', confidence: 80 },
          { type: 'gap', text: 'Insurance coverage and risk mitigation incomplete', confidence: 75 }
        ],
        subLensBreakdown: [
          { id: '9.1', name: 'Entity Characteristics', coverage: 70, insights: 3 },
          { id: '9.2', name: 'Contracts', coverage: 45, insights: 2 },
          { id: '9.3', name: 'Intellectual Property', coverage: 35, insights: 1 },
          { id: '9.4', name: 'Liability and Risk', coverage: 40, insights: 2 }
        ],
        recommendations: [
          'Document IP portfolio and filing strategy',
          'Include key customer and vendor contracts',
          'Add insurance coverage summary'
        ]
      }
    ];

    // Sort by relevance
    lensMapping.sort((a, b) => b.relevance - a.relevance);

    return {
      summary: {
        totalInsights: lensMapping.reduce((sum, l) => sum + l.extractedContent.length, 0),
        lensesCovered: lensMapping.filter(l => l.relevance > 40).length,
        overallCompleteness: Math.round(lensMapping.reduce((sum, l) => sum + l.relevance, 0) / 9),
        strongestLenses: lensMapping.slice(0, 3).map(l => l.lens.name),
        weakestLenses: lensMapping.slice(-3).map(l => l.lens.name)
      },
      lensMapping,
      documentType: isFinancial ? 'Financial Statement' : isStrategy ? 'Strategic Plan' : isMarketing ? 'Marketing Document' : 'General Business Document',
      extractionQuality: 92
    };
  };

  const getLensIcon = (lensName) => {
    const icons = {
      'Market': TrendingUp,
      'People': Users,
      'Financial': DollarSign,
      'Strategy': Target,
      'Operations': Settings,
      'Execution': Zap,
      'Expectations': Eye,
      'Governance': Shield,
      'Entity': Scale
    };
    return icons[lensName] || Briefcase;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <Layers className="w-10 h-10 mr-3 text-indigo-600" />
            9Vectors Document Dissector
          </h1>
          <p className="text-gray-600 text-lg">
            Upload any business document and our AI will analyze it through all 9 lenses,
            extracting insights and identifying gaps in your business documentation.
          </p>
        </div>

        {/* Upload Section */}
        {!uploadedDocument ? (
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="text-center">
              <Upload className="w-20 h-20 text-indigo-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Document for Analysis</h2>
              <p className="text-gray-600 mb-8">
                Supported: Financial statements, Strategic plans, Marketing documents, Operations manuals,
                and any business document
              </p>

              <label className="cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt"
                />
                <div className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105">
                  Choose File to Dissect
                </div>
              </label>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-sm">AI-Powered</div>
                  <div className="text-xs text-gray-600">Deep learning analysis</div>
                </div>
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <Layers className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold text-sm">9-Lens Framework</div>
                  <div className="text-xs text-gray-600">Comprehensive coverage</div>
                </div>
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                  <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-semibold text-sm">Instant Insights</div>
                  <div className="text-xs text-gray-600">Results in seconds</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Document Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FileText className="w-12 h-12 text-indigo-600" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{uploadedDocument.name}</h3>
                    <p className="text-sm text-gray-600">{formatFileSize(uploadedDocument.size)}</p>
                  </div>
                </div>

                {!dissectionResults && !isDissecting && (
                  <button
                    onClick={dissectDocument}
                    className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105"
                  >
                    <Brain className="w-5 h-5" />
                    <span>Dissect with AI</span>
                  </button>
                )}

                {isDissecting && (
                  <div className="flex items-center space-x-3 text-indigo-600">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="font-semibold">Analyzing document...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dissection Results */}
            {dissectionResults && (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="text-4xl font-bold mb-2">{dissectionResults.summary.totalInsights}</div>
                    <div className="text-sm opacity-90">Insights Extracted</div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="text-4xl font-bold mb-2">{dissectionResults.summary.lensesCovered}/9</div>
                    <div className="text-sm opacity-90">Lenses Covered</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="text-4xl font-bold mb-2">{dissectionResults.summary.overallCompleteness}%</div>
                    <div className="text-sm opacity-90">Overall Completeness</div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="text-4xl font-bold mb-2">{dissectionResults.extractionQuality}%</div>
                    <div className="text-sm opacity-90">Extraction Quality</div>
                  </div>
                </div>

                {/* Document Type & Summary */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Document Analysis Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <span className="text-sm text-gray-600">Document Type:</span>
                        <div className="text-lg font-bold text-indigo-600">{dissectionResults.documentType}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 block mb-2">Strongest Lenses:</span>
                        <div className="flex flex-wrap gap-2">
                          {dissectionResults.summary.strongestLenses.map(lens => (
                            <span key={lens} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                              {lens}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-600 block mb-2">Needs More Coverage:</span>
                      <div className="flex flex-wrap gap-2">
                        {dissectionResults.summary.weakestLenses.map(lens => (
                          <span key={lens} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {lens}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lens-by-Lens Breakdown */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">9-Lens Dissection Results</h3>

                  <div className="space-y-4">
                    {dissectionResults.lensMapping.map((lensData, index) => {
                      const LensIcon = getLensIcon(lensData.lens.name);
                      const isSelected = selectedLens === index;

                      return (
                        <div key={index} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-indigo-300 transition-colors">
                          <button
                            onClick={() => setSelectedLens(isSelected ? null : index)}
                            className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center space-x-4 flex-1">
                              <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: lensData.lens.color + '20' }}
                              >
                                <LensIcon className="w-6 h-6" style={{ color: lensData.lens.color }} />
                              </div>

                              <div className="flex-1 text-left">
                                <div className="font-bold text-lg text-gray-900">{lensData.lens.name}</div>
                                <div className="text-sm text-gray-600">{lensData.extractedContent.length} insights found</div>
                              </div>

                              <div className="text-right">
                                <div className="text-2xl font-bold" style={{ color: lensData.lens.color }}>
                                  {lensData.relevance}%
                                </div>
                                <div className="text-xs text-gray-600">Relevance</div>
                              </div>
                            </div>

                            <div className={`ml-4 transform transition-transform ${isSelected ? 'rotate-90' : ''}`}>
                              <ChevronRight className="w-6 h-6 text-gray-400" />
                            </div>
                          </button>

                          {isSelected && (
                            <div className="border-t-2 border-gray-200 p-6 bg-gray-50">
                              {/* Extracted Content */}
                              <div className="mb-6">
                                <h4 className="font-bold text-gray-900 mb-3">Extracted Insights:</h4>
                                <div className="space-y-3">
                                  {lensData.extractedContent.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className={`p-4 rounded-lg border-l-4 ${
                                        item.type === 'strength'
                                          ? 'bg-green-50 border-green-500'
                                          : item.type === 'gap'
                                            ? 'bg-blue-50 border-blue-500'
                                            : 'bg-blue-50 border-blue-500'
                                      }`}
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-2 flex-1">
                                          {item.type === 'strength' && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
                                          {item.type === 'gap' && <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />}
                                          {item.type === 'insight' && <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />}
                                          <span className="text-sm text-gray-800">{item.text}</span>
                                        </div>
                                        <span className="text-xs text-gray-500 ml-3">{item.confidence}% confidence</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Sub-Lens Breakdown */}
                              <div className="mb-6">
                                <h4 className="font-bold text-gray-900 mb-3">Sub-Lens Coverage:</h4>
                                <div className="space-y-2">
                                  {lensData.subLensBreakdown.map((subLens, idx) => (
                                    <div key={idx} className="bg-white rounded-lg p-3">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-700">{subLens.name}</span>
                                        <div className="flex items-center space-x-3">
                                          <span className="text-xs text-gray-600">{subLens.insights} insights</span>
                                          <span className="text-sm font-bold" style={{ color: lensData.lens.color }}>
                                            {subLens.coverage}%
                                          </span>
                                        </div>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                          className="h-2 rounded-full"
                                          style={{
                                            width: `${subLens.coverage}%`,
                                            backgroundColor: lensData.lens.color
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Recommendations */}
                              <div>
                                <h4 className="font-bold text-gray-900 mb-3">Recommendations to Strengthen:</h4>
                                <ul className="space-y-2">
                                  {lensData.recommendations.map((rec, idx) => (
                                    <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                                      <Target className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                  <button className="flex items-center space-x-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:border-gray-400 transition-all">
                    <Download className="w-5 h-5" />
                    <span>Download Report</span>
                  </button>

                  <button className="flex items-center space-x-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:border-gray-400 transition-all">
                    <Share2 className="w-5 h-5" />
                    <span>Share Results</span>
                  </button>

                  <button
                    onClick={() => {
                      setUploadedDocument(null);
                      setDissectionResults(null);
                      setSelectedLens(null);
                    }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Analyze Another Document</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentDissector;
