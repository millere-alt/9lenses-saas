import React, { useState } from 'react';
import { Link2, TrendingUp, AlertCircle, CheckCircle, Sparkles, BarChart3, FileText, Target } from 'lucide-react';
import { LENSES } from '../data/nineLensesSchema';

const DocumentCorrelation = ({ documents, assessmentData }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [correlations, setCorrelations] = useState([]);

  // Analyze document and correlate with assessment
  const analyzeDocument = (doc) => {
    setSelectedDocument(doc);

    // Find matching lens/sublens from document categorization
    const matchingLens = LENSES.find(l => l.name === doc.lens);
    const matchingSubLens = matchingLens?.subLenses.find(sl => sl.name === doc.subLens);

    // Get assessment scores for this area
    const lensScore = assessmentData?.lensScores?.find(ls => ls.lensName === doc.lens);
    const subLensScore = lensScore?.subLensScores?.find(sls => sls.name === doc.subLens);

    // Generate AI insights based on document type and scores
    const insights = generateInsights(doc, lensScore, subLensScore);

    setCorrelations(insights);
  };

  const generateInsights = (doc, lensScore, subLensScore) => {
    const insights = [];
    const docType = doc.documentType;

    // Financial Document Correlations
    if (docType === 'financial' && doc.lens === 'Financial') {
      if (subLensScore?.score < 6) {
        insights.push({
          type: 'gap',
          severity: 'high',
          title: 'Financial Performance Gap Identified',
          description: `Your ${doc.subLens} scored ${subLensScore.score}/10 in the assessment. Review this document for improvement opportunities.`,
          recommendations: [
            'Compare projected vs actual financials',
            'Identify variance drivers',
            'Develop action plan to close gaps'
          ]
        });
      } else {
        insights.push({
          type: 'strength',
          severity: 'low',
          title: 'Strong Financial Foundation',
          description: `Your ${doc.subLens} scored ${subLensScore.score}/10. This document supports your strong performance.`,
          recommendations: [
            'Use as benchmark for other areas',
            'Share best practices across organization'
          ]
        });
      }
    }

    // Strategy Document Correlations
    if (docType === 'strategy' && doc.lens === 'Strategy') {
      insights.push({
        type: 'alignment',
        severity: 'medium',
        title: 'Strategy-Execution Alignment Check',
        description: `Cross-reference this strategy document with Execution lens (current score: ${assessmentData?.lensScores?.find(l => l.lensName === 'Execution')?.score}/10)`,
        recommendations: [
          'Verify strategic initiatives are measurable',
          'Ensure KPIs align with strategic goals',
          'Check resource allocation matches priorities'
        ]
      });
    }

    // Marketing Document Correlations
    if (docType === 'marketing') {
      const marketLens = assessmentData?.lensScores?.find(l => l.lensName === 'Market');
      insights.push({
        type: 'correlation',
        severity: 'medium',
        title: 'Market Performance vs Marketing Investment',
        description: `Market lens score: ${marketLens?.score}/10. Analyze marketing spend effectiveness.`,
        recommendations: [
          'Calculate marketing ROI by channel',
          'Compare market share trends vs spend',
          'Identify high-performing campaigns'
        ]
      });
    }

    // Operations Document Correlations
    if (docType === 'operations' && doc.lens === 'Operations') {
      const operationsScore = lensScore?.score;
      insights.push({
        type: operationsScore >= 7 ? 'strength' : 'gap',
        severity: operationsScore >= 7 ? 'low' : 'high',
        title: 'Operational Efficiency Analysis',
        description: `Operations scored ${operationsScore}/10. ${operationsScore >= 7 ? 'Strong operational foundation.' : 'Opportunities for improvement exist.'}`,
        recommendations: [
          'Map current processes vs documented procedures',
          'Identify bottlenecks and inefficiencies',
          'Implement process optimization initiatives'
        ]
      });
    }

    // Cross-Lens Correlations
    if (doc.lens && lensScore) {
      const relatedLenses = getRelatedLenses(doc.lens);
      relatedLenses.forEach(relatedLensName => {
        const relatedScore = assessmentData?.lensScores?.find(l => l.lensName === relatedLensName);
        if (relatedScore) {
          insights.push({
            type: 'cross-lens',
            severity: 'medium',
            title: `${doc.lens} ↔ ${relatedLensName} Connection`,
            description: `Consider how this document impacts ${relatedLensName} (score: ${relatedScore.score}/10)`,
            recommendations: [
              `Review interdependencies between ${doc.lens} and ${relatedLensName}`,
              'Ensure alignment across lenses',
              'Address any conflicts or gaps'
            ]
          });
        }
      });
    }

    // Product Line Analysis (if financial by product line)
    if (doc.name.toLowerCase().includes('product') && docType === 'financial') {
      insights.push({
        type: 'deep-dive',
        severity: 'medium',
        title: 'Product Line Performance Analysis',
        description: 'Product-level financial data can reveal portfolio optimization opportunities',
        recommendations: [
          'Compare profitability across product lines',
          'Identify underperforming products for improvement or sunset',
          'Analyze resource allocation efficiency',
          'Evaluate cross-sell and upsell opportunities'
        ]
      });
    }

    return insights;
  };

  const getRelatedLenses = (lensName) => {
    const relationships = {
      'Market': ['Strategy', 'Financial', 'Execution'],
      'People': ['Culture', 'Expectations', 'Governance'],
      'Financial': ['Strategy', 'Operations', 'Market'],
      'Strategy': ['Market', 'Execution', 'Financial'],
      'Operations': ['Financial', 'Execution', 'People'],
      'Execution': ['Strategy', 'Operations', 'People'],
      'Expectations': ['People', 'Governance', 'Strategy'],
      'Governance': ['Expectations', 'Entity', 'People'],
      'Entity': ['Governance', 'Financial', 'Operations']
    };

    return relationships[lensName] || [];
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'gap': return <AlertCircle className="w-6 h-6" />;
      case 'strength': return <CheckCircle className="w-6 h-6" />;
      case 'alignment': return <Target className="w-6 h-6" />;
      case 'correlation': return <BarChart3 className="w-6 h-6" />;
      case 'cross-lens': return <Link2 className="w-6 h-6" />;
      case 'deep-dive': return <TrendingUp className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Document-Assessment Correlation</h1>
          <p className="text-gray-600">AI-powered insights linking your documents to assessment results</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select Document</h2>

              <div className="space-y-3">
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No documents uploaded</p>
                  </div>
                ) : (
                  documents.map(doc => {
                    const lensInfo = LENSES.find(l => l.name === doc.lens);

                    return (
                      <button
                        key={doc.id}
                        onClick={() => analyzeDocument(doc)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedDocument?.id === doc.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 bg-white'
                        }`}
                      >
                        <div className="font-semibold text-gray-900 truncate">{doc.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {doc.lens && (
                            <span
                              className="inline-block px-2 py-1 rounded text-xs font-medium mr-2"
                              style={{
                                backgroundColor: lensInfo?.color + '20',
                                color: lensInfo?.color
                              }}
                            >
                              {doc.lens}
                            </span>
                          )}
                          {doc.documentType}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Correlation Results */}
          <div className="lg:col-span-2">
            {!selectedDocument ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Correlation Engine</h3>
                <p className="text-gray-600">Select a document to see intelligent correlations with your assessment</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Selected Document Info */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{selectedDocument.name}</h3>
                      <p className="opacity-90">
                        {selectedDocument.lens && `${selectedDocument.lens} → ${selectedDocument.subLens}`}
                      </p>
                    </div>
                    <Sparkles className="w-12 h-12 opacity-80" />
                  </div>
                </div>

                {/* Correlation Insights */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
                    Correlation Insights ({correlations.length})
                  </h3>

                  {correlations.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No correlations found</p>
                  ) : (
                    <div className="space-y-4">
                      {correlations.map((insight, index) => (
                        <div
                          key={index}
                          className={`border-2 rounded-lg p-5 ${getSeverityColor(insight.severity)}`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="mt-1">{getTypeIcon(insight.type)}</div>

                            <div className="flex-1">
                              <h4 className="font-bold text-lg mb-2">{insight.title}</h4>
                              <p className="mb-4 opacity-90">{insight.description}</p>

                              {insight.recommendations && (
                                <div>
                                  <p className="font-semibold mb-2">Recommendations:</p>
                                  <ul className="list-disc list-inside space-y-1 opacity-90">
                                    {insight.recommendations.map((rec, idx) => (
                                      <li key={idx}>{rec}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCorrelation;
