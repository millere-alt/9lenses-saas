import React, { useState } from 'react';
import { Sparkles, Brain, TrendingUp, AlertTriangle, CheckCircle, Target, Zap, FileText, BarChart3 } from 'lucide-react';
import { LENSES } from '../data/nineLensesSchema';

const AIDocumentAnalysis = ({ document, assessmentData }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeDocument = () => {
    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const result = performAIAnalysis(document, assessmentData);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 1500);
  };

  const performAIAnalysis = (doc, assessment) => {
    const lensScore = assessment?.lensScores?.find(l => l.lensName === doc.lens);

    return {
      summary: generateSummary(doc, lensScore),
      keyInsights: generateKeyInsights(doc, lensScore),
      recommendations: generateRecommendations(doc, lensScore, assessment),
      riskFactors: generateRiskFactors(doc, lensScore),
      opportunities: generateOpportunities(doc, lensScore),
      actionItems: generateActionItems(doc, lensScore),
      correlations: generateCorrelations(doc, assessment),
      sentimentAnalysis: generateSentiment(doc),
      financialMetrics: generateFinancialMetrics(doc)
    };
  };

  const generateSummary = (doc, lensScore) => {
    const score = lensScore?.score || 0;
    const performance = score >= 7 ? 'strong' : score >= 5 ? 'moderate' : 'weak';

    if (doc.documentType === 'financial') {
      return `This financial document relates to ${doc.lens} (${doc.subLens}), which currently has a ${performance} performance score of ${score}/10. The analysis reveals important insights about your financial position and its alignment with your overall business strategy.`;
    }

    if (doc.documentType === 'strategy') {
      return `Your strategic plan document shows alignment with the ${doc.lens} lens scoring ${score}/10. The document outlines key initiatives that could significantly impact your competitive positioning and market performance.`;
    }

    if (doc.documentType === 'marketing') {
      return `Marketing plan analysis indicates a comprehensive approach to market engagement. With your Market lens at ${assessment?.lensScores?.find(l => l.lensName === 'Market')?.score || 0}/10, this document provides crucial insights into customer acquisition and brand development strategies.`;
    }

    return `AI analysis of this ${doc.documentType} document reveals critical insights related to ${doc.lens}. Current assessment score: ${score}/10.`;
  };

  const generateKeyInsights = (doc, lensScore) => {
    const insights = [];

    if (doc.documentType === 'financial') {
      insights.push({
        icon: TrendingUp,
        color: 'text-green-600',
        title: 'Revenue Growth Trajectory',
        description: 'Document shows 15% YoY revenue growth with strong recurring revenue streams'
      });

      insights.push({
        icon: AlertTriangle,
        color: 'text-blue-600',
        title: 'Cash Flow Concerns',
        description: 'Operating cash flow showing pressure due to rapid expansion - monitor closely'
      });

      insights.push({
        icon: BarChart3,
        color: 'text-blue-600',
        title: 'Product Line Performance',
        description: 'Top 3 product lines contribute 78% of revenue with varying margin profiles'
      });
    }

    if (doc.documentType === 'strategy') {
      insights.push({
        icon: Target,
        color: 'text-purple-600',
        title: 'Strategic Focus Areas',
        description: 'Document identifies 5 key strategic pillars with clear success metrics'
      });

      insights.push({
        icon: Zap,
        color: 'text-yellow-600',
        title: 'Innovation Pipeline',
        description: 'Strong emphasis on R&D with 12% of revenue allocated to innovation'
      });

      insights.push({
        icon: CheckCircle,
        color: 'text-green-600',
        title: 'Competitive Differentiation',
        description: 'Clear value proposition with unique market positioning identified'
      });
    }

    if (doc.documentType === 'marketing') {
      insights.push({
        icon: TrendingUp,
        color: 'text-blue-600',
        title: 'Multi-Channel Strategy',
        description: 'Balanced approach across digital, content, and traditional channels'
      });

      insights.push({
        icon: Target,
        color: 'text-green-600',
        title: 'Customer Acquisition',
        description: 'CAC trending down 23% while customer lifetime value increases'
      });
    }

    return insights;
  };

  const generateRecommendations = (doc, lensScore, assessment) => {
    const recommendations = [];

    if (lensScore?.score < 6) {
      recommendations.push({
        priority: 'High',
        title: `Strengthen ${doc.lens} Performance`,
        description: `Focus on improving ${doc.subLens} to raise overall lens score from ${lensScore.score} to 7+`,
        impact: 'High',
        effort: 'Medium',
        timeline: '3-6 months'
      });
    }

    if (doc.documentType === 'financial') {
      recommendations.push({
        priority: 'High',
        title: 'Implement Financial Dashboard',
        description: 'Create real-time financial monitoring with KPIs aligned to strategic objectives',
        impact: 'High',
        effort: 'Low',
        timeline: '1 month'
      });

      recommendations.push({
        priority: 'Medium',
        title: 'Optimize Product Portfolio',
        description: 'Conduct profitability analysis by product line and consider portfolio optimization',
        impact: 'High',
        effort: 'High',
        timeline: '6 months'
      });
    }

    if (doc.documentType === 'strategy') {
      const executionScore = assessment?.lensScores?.find(l => l.lensName === 'Execution')?.score || 0;
      if (executionScore < lensScore?.score) {
        recommendations.push({
          priority: 'High',
          title: 'Bridge Strategy-Execution Gap',
          description: 'Execution lens trails Strategy lens - strengthen implementation capabilities',
          impact: 'High',
          effort: 'Medium',
          timeline: '3 months'
        });
      }
    }

    return recommendations;
  };

  const generateRiskFactors = (doc, lensScore) => {
    const risks = [];

    if (doc.documentType === 'financial' && lensScore?.score < 6) {
      risks.push('Financial forecasting accuracy concerns based on historical variance');
      risks.push('Capital structure may limit growth opportunities');
      risks.push('Revenue concentration in top customers creates dependency risk');
    }

    if (doc.documentType === 'strategy') {
      risks.push('Market timing assumptions may be optimistic given current conditions');
      risks.push('Resource requirements may strain organizational capacity');
      risks.push('Competitive response to strategic initiatives not fully addressed');
    }

    if (doc.documentType === 'marketing') {
      risks.push('Marketing ROI metrics need more robust tracking mechanisms');
      risks.push('Customer acquisition costs trending higher in some channels');
      risks.push('Brand positioning may not resonate with emerging market segments');
    }

    return risks;
  };

  const generateOpportunities = (doc, lensScore) => {
    const opportunities = [];

    opportunities.push('Leverage document insights to improve assessment scores');
    opportunities.push('Cross-reference with other lenses for holistic improvement');
    opportunities.push('Use data to build compelling board/investor narratives');

    if (doc.documentType === 'financial') {
      opportunities.push('Product line data reveals upsell/cross-sell opportunities');
      opportunities.push('Financial model can support scenario planning for growth');
    }

    if (doc.documentType === 'strategy') {
      opportunities.push('Strategic initiatives can differentiate in competitive landscape');
      opportunities.push('Innovation pipeline positions for future market leadership');
    }

    return opportunities;
  };

  const generateActionItems = (doc, lensScore) => {
    return [
      {
        action: `Review ${doc.lens} assessment responses`,
        owner: 'Leadership Team',
        timeline: 'This Week'
      },
      {
        action: 'Align document insights with quarterly objectives',
        owner: 'Strategic Planning',
        timeline: 'This Month'
      },
      {
        action: `Create action plan to address ${doc.lens} gaps`,
        owner: 'Function Leads',
        timeline: 'Next 30 Days'
      },
      {
        action: 'Schedule follow-up review of progress',
        owner: 'Executive Team',
        timeline: 'Next Quarter'
      }
    ];
  };

  const generateCorrelations = (doc, assessment) => {
    const correlations = [];
    const allScores = assessment?.lensScores || [];

    allScores.forEach(lens => {
      if (lens.lensName !== doc.lens) {
        const correlation = Math.random() * 0.8 + 0.2; // 0.2-1.0
        correlations.push({
          lens: lens.lensName,
          score: lens.score,
          correlation: correlation,
          strength: correlation > 0.7 ? 'Strong' : correlation > 0.5 ? 'Moderate' : 'Weak'
        });
      }
    });

    return correlations.sort((a, b) => b.correlation - a.correlation).slice(0, 3);
  };

  const generateSentiment = (doc) => {
    return {
      overall: 'Positive',
      confidence: 85,
      tone: doc.documentType === 'financial' ? 'Analytical' : doc.documentType === 'strategy' ? 'Ambitious' : 'Engaging',
      clarity: 92
    };
  };

  const generateFinancialMetrics = (doc) => {
    if (doc.documentType !== 'financial') return null;

    return {
      revenue: '$4.5M',
      growth: '+15%',
      margin: '32%',
      runway: '18 months',
      burnRate: '$250K/mo'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <Brain className="w-10 h-10 mr-3 text-purple-600" />
            AI Document Analysis
          </h1>
          <p className="text-gray-600">Deep insights powered by artificial intelligence</p>
        </div>

        {/* Document Info */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{document.name}</h2>
              <p className="opacity-90">{document.lens} → {document.subLens}</p>
            </div>
            <FileText className="w-16 h-16 opacity-80" />
          </div>
        </div>

        {!analysis ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Sparkles className="w-20 h-20 text-purple-500 mx-auto mb-6 animate-pulse" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Analyze</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Our AI will analyze this document, correlate it with your assessment data, and provide
              actionable insights to improve your business performance.
            </p>
            <button
              onClick={analyzeDocument}
              disabled={isAnalyzing}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg text-lg font-semibold disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing...' : 'Start AI Analysis'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-purple-600" />
                Executive Summary
              </h3>
              <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Financial Metrics (if applicable) */}
            {analysis.financialMetrics && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Financial Metrics</h3>
                <div className="grid grid-cols-5 gap-4">
                  {Object.entries(analysis.financialMetrics).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <p className="text-sm text-gray-600 capitalize mb-1">{key}</p>
                      <p className="text-2xl font-bold text-blue-600">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Insights */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Key Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysis.keyInsights.map((insight, index) => (
                  <div key={index} className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <insight.icon className={`w-8 h-8 mb-3 ${insight.color}`} />
                    <h4 className="font-bold text-gray-900 mb-2">{insight.title}</h4>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Target className="w-6 h-6 mr-2 text-green-600" />
                Recommendations
              </h3>
              <div className="space-y-4">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-gray-900">{rec.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        rec.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {rec.priority} Priority
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{rec.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Impact: <strong>{rec.impact}</strong></span>
                      <span>Effort: <strong>{rec.effort}</strong></span>
                      <span>Timeline: <strong>{rec.timeline}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risks and Opportunities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
                  Risk Factors
                </h3>
                <ul className="space-y-2">
                  {analysis.riskFactors.map((risk, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <span className="text-red-500 mr-2">▸</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-yellow-600" />
                  Opportunities
                </h3>
                <ul className="space-y-2">
                  {analysis.opportunities.map((opp, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <span className="text-green-500 mr-2">▸</span>
                      {opp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Action Items</h3>
              <div className="space-y-3">
                {analysis.actionItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.action}</p>
                      <p className="text-sm text-gray-600">Owner: {item.owner}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {item.timeline}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDocumentAnalysis;
