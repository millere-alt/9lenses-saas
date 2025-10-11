import React, { useState } from 'react';
import { Sparkles, Brain, TrendingUp, Target, AlertTriangle, CheckCircle, ArrowRight, Lightbulb, Zap } from 'lucide-react';

function AIStrategyAdvisor({ assessmentData, lensScores }) {
  const [selectedLens, setSelectedLens] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Simulate AI-powered strategic recommendations
  const generateRecommendations = (lens) => {
    const recommendations = {
      'Customers': {
        priority: 'High',
        timeframe: '30-60 days',
        recommendations: [
          'Implement AI-powered customer sentiment analysis across all touchpoints',
          'Develop personalized customer journey mapping using predictive analytics',
          'Launch Voice of Customer (VoC) program with real-time feedback loops',
          'Establish customer success metrics dashboard with leading indicators'
        ],
        quickWins: [
          'Deploy NPS surveys across customer base this week',
          'Create customer advisory board with top 10 accounts',
          'Implement automated customer health scoring'
        ],
        impact: 'High - Expected 15-20% improvement in customer retention',
        resources: '$50K-$75K budget, 2-3 FTE, 90-day timeline'
      },
      'Financials': {
        priority: 'Critical',
        timeframe: 'Immediate (0-30 days)',
        recommendations: [
          'Implement zero-based budgeting framework for all departments',
          'Deploy AI-driven cash flow forecasting with 90-day rolling projections',
          'Establish real-time financial dashboard for C-suite with KPIs',
          'Optimize working capital through automated AR/AP management'
        ],
        quickWins: [
          'Conduct immediate expense audit and identify 10% cost reduction',
          'Renegotiate top 5 vendor contracts',
          'Implement weekly cash flow reviews'
        ],
        impact: 'Critical - Projected $500K+ annual savings, improved cash position',
        resources: 'CFO + Finance team, financial planning software, 60-day initiative'
      },
      'Human Resources': {
        priority: 'Medium-High',
        timeframe: '60-90 days',
        recommendations: [
          'Launch AI-powered talent analytics and succession planning platform',
          'Implement skills gap analysis and personalized learning paths',
          'Deploy employee engagement platform with pulse surveys',
          'Create leadership development program for high-potential employees'
        ],
        quickWins: [
          'Conduct organization-wide skills assessment',
          'Launch monthly all-hands meetings with Q&A',
          'Implement peer recognition program'
        ],
        impact: 'Medium-High - Expected 25% improvement in employee retention',
        resources: '$30K-$50K budget, HR team + external consultant, 6-month program'
      },
      'Strategy': {
        priority: 'High',
        timeframe: '30-90 days',
        recommendations: [
          'Conduct comprehensive SWOT analysis with market intelligence',
          'Develop 3-year strategic roadmap with quarterly milestones',
          'Implement OKR framework across all departments',
          'Create competitive intelligence system with AI-powered monitoring'
        ],
        quickWins: [
          'Define top 3 strategic priorities for next 12 months',
          'Align leadership team on vision and mission',
          'Launch monthly strategy review meetings'
        ],
        impact: 'High - Clear strategic direction, 30% faster decision-making',
        resources: 'Strategy team, market research budget $25K, 90-day planning cycle'
      },
      'Sales & Marketing': {
        priority: 'Medium-High',
        timeframe: '30-60 days',
        recommendations: [
          'Implement AI-powered lead scoring and pipeline management',
          'Deploy marketing automation platform with personalization engine',
          'Create content marketing strategy with SEO optimization',
          'Launch account-based marketing (ABM) for enterprise segment'
        ],
        quickWins: [
          'Optimize sales process and reduce friction points',
          'Implement CRM hygiene and data quality standards',
          'Launch referral program with incentives'
        ],
        impact: 'Medium-High - 20-30% increase in qualified pipeline',
        resources: '$40K-$60K marketing tech stack, 3-4 FTE, 90-day ramp'
      },
      'Operations': {
        priority: 'Medium',
        timeframe: '60-120 days',
        recommendations: [
          'Implement lean operations methodology across all processes',
          'Deploy process mining AI to identify bottlenecks and inefficiencies',
          'Create operations dashboard with real-time KPIs and SLAs',
          'Establish continuous improvement culture with Six Sigma training'
        ],
        quickWins: [
          'Map top 5 critical processes and identify waste',
          'Implement weekly operations review meetings',
          'Create standard operating procedures (SOPs) library'
        ],
        impact: 'Medium - 15-20% operational efficiency improvement',
        resources: 'Operations team, process improvement tools $20K, 6-month initiative'
      },
      'Sustainability': {
        priority: 'Medium',
        timeframe: '90-180 days',
        recommendations: [
          'Develop comprehensive ESG framework aligned with industry standards',
          'Implement carbon footprint tracking and reduction program',
          'Create stakeholder engagement strategy for sustainability initiatives',
          'Establish ESG reporting dashboard for board and investors'
        ],
        quickWins: [
          'Conduct sustainability materiality assessment',
          'Launch employee sustainability task force',
          'Implement basic recycling and energy efficiency programs'
        ],
        impact: 'Medium - Enhanced brand reputation, investor appeal, compliance',
        resources: 'Sustainability lead, ESG software $15K, external consultant'
      },
      'Systems & Processes': {
        priority: 'Low-Medium',
        timeframe: '90-180 days',
        recommendations: [
          'Continue digital transformation with cloud-first strategy',
          'Implement enterprise architecture framework for system integration',
          'Deploy robotic process automation (RPA) for repetitive tasks',
          'Establish IT governance framework and cybersecurity standards'
        ],
        quickWins: [
          'Document current technology stack and dependencies',
          'Implement single sign-on (SSO) across all systems',
          'Launch IT service desk with ticketing system'
        ],
        impact: 'Low-Medium - Maintain excellence, 10% productivity gains',
        resources: 'IT team, automation tools $30K, ongoing optimization'
      },
      'Organizational': {
        priority: 'Medium',
        timeframe: '60-120 days',
        recommendations: [
          'Conduct organizational design review and optimize structure',
          'Implement clear RACI matrix for all key processes and decisions',
          'Create cross-functional collaboration frameworks and rituals',
          'Establish governance model with decision rights and escalation paths'
        ],
        quickWins: [
          'Clarify reporting lines and eliminate matrix confusion',
          'Launch bi-weekly cross-functional leadership meetings',
          'Document decision-making authority levels'
        ],
        impact: 'Medium - 25% faster decision-making, reduced silos',
        resources: 'HR + Strategy teams, org design consultant $20K, 90-day project'
      }
    };

    return recommendations[lens] || recommendations['Strategy'];
  };

  const handleGenerateAdvice = (lens) => {
    setIsGenerating(true);
    setSelectedLens(lens);

    // Simulate AI processing time
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const getPriorityColor = (priority) => {
    if (priority === 'Critical') return 'from-red-500 to-red-600';
    if (priority === 'High') return 'from-orange-500 to-orange-600';
    if (priority === 'Medium-High') return 'from-orange-400 to-yellow-500';
    if (priority === 'Medium') return 'from-yellow-400 to-yellow-500';
    return 'from-primary-500 to-primary-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-orange-500 to-secondary-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              AI Strategy Advisor
              <Sparkles className="w-6 h-6 animate-pulse" />
            </h2>
            <p className="text-white/90 text-lg">GPT-powered strategic recommendations for your organization</p>
          </div>
        </div>
      </div>

      {/* Lens Selection */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Select a Lens for AI Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lensScores?.map((lens) => (
            <button
              key={lens.name}
              onClick={() => handleGenerateAdvice(lens.name)}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                selectedLens === lens.name
                  ? 'border-orange-500 bg-orange-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{lens.name}</h4>
                  <p className="text-sm text-gray-500">{lens.category}</p>
                </div>
                <div className={`text-2xl font-bold bg-gradient-to-r ${lens.gradient} bg-clip-text text-transparent`}>
                  {lens.score}
                </div>
              </div>
              <ArrowRight className={`w-5 h-5 ${selectedLens === lens.name ? 'text-orange-600' : 'text-gray-400 group-hover:text-orange-500'} transition-colors`} />
            </button>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      {selectedLens && (
        <div className="space-y-6 animate-slideUp">
          {isGenerating ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-secondary-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <p className="text-xl font-semibold text-gray-900">AI analyzing {selectedLens}...</p>
              <p className="text-gray-600 mt-2">Generating strategic recommendations</p>
            </div>
          ) : (
            <>
              {(() => {
                const advice = generateRecommendations(selectedLens);
                return (
                  <>
                    {/* Priority & Timeframe */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                          <AlertTriangle className="w-6 h-6 text-orange-600" />
                          <h4 className="font-bold text-gray-900">Priority Level</h4>
                        </div>
                        <div className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${getPriorityColor(advice.priority)} text-white font-bold`}>
                          {advice.priority}
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                          <Target className="w-6 h-6 text-secondary-600" />
                          <h4 className="font-bold text-gray-900">Timeframe</h4>
                        </div>
                        <p className="text-lg font-semibold text-gray-700">{advice.timeframe}</p>
                      </div>

                      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                          <TrendingUp className="w-6 h-6 text-primary-600" />
                          <h4 className="font-bold text-gray-900">Expected Impact</h4>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{advice.impact}</p>
                      </div>
                    </div>

                    {/* Strategic Recommendations */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 shadow-lg border-2 border-orange-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                          <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Strategic Recommendations</h3>
                      </div>
                      <div className="space-y-3">
                        {advice.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl">
                            <div className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">
                              {idx + 1}
                            </div>
                            <p className="text-gray-800 leading-relaxed">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Wins */}
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 shadow-lg border-2 border-primary-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Quick Wins (Start Today)</h3>
                      </div>
                      <div className="space-y-3">
                        {advice.quickWins.map((win, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl">
                            <CheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-800 leading-relaxed">{win}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resources Required */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-secondary-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Target className="w-6 h-6 text-secondary-600" />
                        <h4 className="font-bold text-gray-900 text-lg">Resources Required</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{advice.resources}</p>
                    </div>
                  </>
                );
              })()}
            </>
          )}
        </div>
      )}

      {!selectedLens && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-600">Select a lens above to receive AI-powered strategic advice</p>
        </div>
      )}
    </div>
  );
}

export default AIStrategyAdvisor;
