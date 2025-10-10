import React, { useState } from 'react';
import { AlertTriangle, Shield, TrendingDown, Users, DollarSign, Target, Sparkles, Bell, CheckCircle, XCircle, Clock } from 'lucide-react';

function RiskDetection({ lensScores, assessmentData }) {
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  // AI-powered risk detection
  const detectRisks = () => {
    const risks = [];

    lensScores?.forEach(lens => {
      // Critical score threshold
      if (lens.score < 5.5) {
        risks.push({
          id: `critical-${lens.name}`,
          severity: 'critical',
          category: 'Performance',
          title: `Critical ${lens.name} Performance`,
          description: `${lens.name} score of ${lens.score} is significantly below acceptable threshold (6.0). Immediate action required to prevent business impact.`,
          impact: 'Very High',
          probability: '95%',
          timeframe: 'Immediate',
          affected: lens.category,
          recommendations: [
            'Escalate to executive leadership immediately',
            'Form crisis response team',
            'Implement emergency improvement plan',
            'Review root causes with stakeholders'
          ],
          relatedLenses: lensScores?.filter(l => l.category === lens.category && l.name !== lens.name).map(l => l.name) || []
        });
      }

      // Declining trend risk
      if (lens.change < -3) {
        risks.push({
          id: `declining-${lens.name}`,
          severity: 'high',
          category: 'Trend',
          title: `Declining ${lens.name} Trajectory`,
          description: `${lens.name} has declined ${Math.abs(lens.change)}% recently. Without intervention, could reach critical levels within 2-3 months.`,
          impact: 'High',
          probability: '80%',
          timeframe: '60-90 days',
          affected: lens.category,
          recommendations: [
            'Conduct root cause analysis',
            'Review recent changes impacting this lens',
            'Implement corrective action plan',
            'Increase monitoring frequency'
          ],
          relatedLenses: []
        });
      }

      // Stagnation risk
      if (lens.score < 6.5 && Math.abs(lens.change) < 1) {
        risks.push({
          id: `stagnant-${lens.name}`,
          severity: 'medium',
          category: 'Stagnation',
          title: `${lens.name} Improvement Stagnation`,
          description: `${lens.name} showing minimal progress (${lens.change}% change). May indicate lack of focus or ineffective initiatives.`,
          impact: 'Medium',
          probability: '65%',
          timeframe: '3-6 months',
          affected: lens.category,
          recommendations: [
            'Review current improvement initiatives',
            'Allocate additional resources if needed',
            'Set aggressive quarterly targets',
            'Consider external expertise or consulting'
          ],
          relatedLenses: []
        });
      }
    });

    // Cross-lens pattern risks
    const lowAssets = lensScores?.filter(l => l.category === 'Assets' && l.score < 6.0).length || 0;
    if (lowAssets >= 2) {
      risks.push({
        id: 'assets-pattern',
        severity: 'high',
        category: 'Pattern',
        title: 'Multiple Asset Weaknesses Detected',
        description: `${lowAssets} of 3 Asset lenses are underperforming. This pattern suggests fundamental resource constraints that could limit growth.`,
        impact: 'Very High',
        probability: '85%',
        timeframe: '30-60 days',
        affected: 'Assets',
        recommendations: [
          'Conduct comprehensive asset health assessment',
          'Prioritize highest-impact asset improvement',
          'Consider strategic resource reallocation',
          'Review talent acquisition and retention strategies'
        ],
        relatedLenses: lensScores?.filter(l => l.category === 'Assets').map(l => l.name) || []
      });
    }

    // Financial + operational risk combination
    const financialLens = lensScores?.find(l => l.name === 'Financials');
    const operationsLens = lensScores?.find(l => l.name === 'Operations');
    if (financialLens && operationsLens && financialLens.score < 6.0 && operationsLens.score < 6.5) {
      risks.push({
        id: 'financial-ops-risk',
        severity: 'critical',
        category: 'Combined',
        title: 'Financial + Operational Vulnerability',
        description: 'Combined weakness in Financials and Operations creates compounding risk. Poor operational efficiency is likely impacting financial performance.',
        impact: 'Critical',
        probability: '90%',
        timeframe: 'Immediate',
        affected: 'Company-wide',
        recommendations: [
          'Immediate expense reduction initiative',
          'Process optimization to reduce operating costs',
          'Cash flow management and preservation plan',
          'Review pricing and revenue optimization'
        ],
        relatedLenses: ['Financials', 'Operations']
      });
    }

    // Participation risk
    if (assessmentData?.completionRate && parseInt(assessmentData.completionRate) < 75) {
      risks.push({
        id: 'participation-risk',
        severity: 'medium',
        category: 'Data Quality',
        title: 'Low Assessment Participation Rate',
        description: `Only ${assessmentData.completionRate} of invited participants have completed the assessment. Low participation may skew results and miss critical perspectives.`,
        impact: 'Medium',
        probability: '70%',
        timeframe: 'Ongoing',
        affected: 'Assessment Validity',
        recommendations: [
          'Send reminder to non-participants',
          'Executive communication on importance',
          'Extend deadline if needed',
          'Review barriers to participation'
        ],
        relatedLenses: []
      });
    }

    return risks;
  };

  const risks = detectRisks();

  const severityLevels = [
    { value: 'all', label: 'All Risks', count: risks.length },
    { value: 'critical', label: 'Critical', count: risks.filter(r => r.severity === 'critical').length },
    { value: 'high', label: 'High', count: risks.filter(r => r.severity === 'high').length },
    { value: 'medium', label: 'Medium', count: risks.filter(r => r.severity === 'medium').length }
  ];

  const filteredRisks = selectedSeverity === 'all'
    ? risks
    : risks.filter(r => r.severity === selectedSeverity);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return { bg: 'from-red-500 to-red-600', text: 'text-red-700', badge: 'bg-red-100 text-red-700 border-red-300' };
      case 'high': return { bg: 'from-green-500 to-green-600', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700 border-blue-300' };
      case 'medium': return { bg: 'from-yellow-500 to-yellow-600', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
      default: return { bg: 'from-blue-500 to-blue-600', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700 border-blue-300' };
    }
  };

  const riskSummary = {
    total: risks.length,
    critical: risks.filter(r => r.severity === 'critical').length,
    high: risks.filter(r => r.severity === 'high').length,
    medium: risks.filter(r => r.severity === 'medium').length,
    riskScore: Math.min(100, (risks.filter(r => r.severity === 'critical').length * 30 + risks.filter(r => r.severity === 'high').length * 20 + risks.filter(r => r.severity === 'medium').length * 10))
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 via-green-600 to-yellow-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              AI Risk Detection
              <Sparkles className="w-6 h-6 animate-pulse" />
            </h2>
            <p className="text-white/90 text-lg">Pattern recognition and early warning system</p>
          </div>
        </div>
      </div>

      {/* Risk Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-6 h-6 text-gray-600" />
            <h4 className="font-bold text-gray-900">Total Risks</h4>
          </div>
          <p className="text-3xl font-bold text-gray-700">{riskSummary.total}</p>
          <p className="text-sm text-gray-600 mt-1">Identified patterns</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border-2 border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-6 h-6 text-red-600" />
            <h4 className="font-bold text-gray-900">Critical</h4>
          </div>
          <p className="text-3xl font-bold text-red-700">{riskSummary.critical}</p>
          <p className="text-sm text-gray-600 mt-1">Immediate action</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-6 h-6 text-blue-600" />
            <h4 className="font-bold text-gray-900">High Priority</h4>
          </div>
          <p className="text-3xl font-bold text-blue-700">{riskSummary.high}</p>
          <p className="text-sm text-gray-600 mt-1">60-90 day focus</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border-2 border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-yellow-600" />
            <h4 className="font-bold text-gray-900">Risk Score</h4>
          </div>
          <p className="text-3xl font-bold text-yellow-700">{riskSummary.riskScore}/100</p>
          <p className="text-sm text-gray-600 mt-1">Overall exposure</p>
        </div>
      </div>

      {/* Severity Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
        <div className="flex flex-wrap gap-3">
          {severityLevels.map(level => (
            <button
              key={level.value}
              onClick={() => setSelectedSeverity(level.value)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedSeverity === level.value
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {level.label} ({level.count})
            </button>
          ))}
        </div>
      </div>

      {/* Risk List */}
      <div className="space-y-4">
        {filteredRisks.length === 0 ? (
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-12 text-center border-2 border-primary-200">
            <CheckCircle className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No {selectedSeverity !== 'all' ? selectedSeverity : ''} Risks Detected</h3>
            <p className="text-gray-600">Your organization is performing well in this category.</p>
          </div>
        ) : (
          filteredRisks.map((risk, idx) => {
            const colors = getSeverityColor(risk.severity);
            return (
              <div key={risk.id} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{risk.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold border-2 ${colors.badge} uppercase`}>
                            {risk.severity}
                          </span>
                          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">
                            {risk.category}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-600">
                            <Clock className="w-3 h-3" />
                            {risk.timeframe}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-4">{risk.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-xl p-3 border-2 border-gray-200">
                        <p className="text-xs font-semibold text-gray-600 mb-1">Impact</p>
                        <p className="font-bold text-gray-900">{risk.impact}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 border-2 border-gray-200">
                        <p className="text-xs font-semibold text-gray-600 mb-1">Probability</p>
                        <p className="font-bold text-gray-900">{risk.probability}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 border-2 border-gray-200">
                        <p className="text-xs font-semibold text-gray-600 mb-1">Affected Area</p>
                        <p className="font-bold text-gray-900">{risk.affected}</p>
                      </div>
                    </div>

                    {risk.relatedLenses.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Related Lenses:</p>
                        <div className="flex flex-wrap gap-2">
                          {risk.relatedLenses.map(lens => (
                            <span key={lens} className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-lg text-xs font-semibold">
                              {lens}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        Recommended Actions:
                      </h4>
                      <ul className="space-y-1">
                        {risk.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default RiskDetection;
