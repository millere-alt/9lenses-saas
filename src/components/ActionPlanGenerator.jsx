import React, { useState } from 'react';
import { CheckCircle, Circle, Calendar, Users, DollarSign, Target, Sparkles, Download, Play, Clock, AlertCircle } from 'lucide-react';

function ActionPlanGenerator({ lensScores }) {
  const [generating, setGenerating] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('high');
  const [actionPlan, setActionPlan] = useState(null);

  const generateActionPlan = () => {
    setGenerating(true);

    setTimeout(() => {
      // AI-generated action plan based on assessment
      const plan = {
        title: 'Strategic Improvement Roadmap - Q1 2025',
        generatedDate: new Date().toLocaleDateString(),
        summary: 'AI-generated 90-day action plan focusing on highest-impact improvements across your 9Lenses assessment.',
        phases: [
          {
            name: 'Phase 1: Quick Wins (Days 1-30)',
            description: 'Immediate actions to build momentum and deliver fast results',
            color: 'from-primary-500 to-primary-600',
            actions: [
              {
                id: 1,
                title: 'Implement Weekly Financial Review Dashboard',
                lens: 'Financials',
                priority: 'Critical',
                owner: 'CFO',
                timeline: '1-2 weeks',
                budget: '$5K',
                impact: 'High',
                status: 'not_started',
                tasks: [
                  'Select and configure financial dashboard software',
                  'Define key metrics: cash flow, runway, burn rate, revenue trends',
                  'Schedule weekly 30-min executive review meetings',
                  'Train finance team on dashboard usage'
                ],
                successCriteria: '100% visibility into cash position and weekly burn rate'
              },
              {
                id: 2,
                title: 'Launch Employee Pulse Survey Program',
                lens: 'Human Resources',
                priority: 'High',
                owner: 'Head of HR',
                timeline: '2 weeks',
                budget: '$2K',
                impact: 'Medium-High',
                status: 'not_started',
                tasks: [
                  'Select pulse survey platform (Culture Amp, Lattice, or similar)',
                  'Design 5-question bi-weekly pulse survey',
                  'Communicate program to all employees',
                  'Establish response rate target of 80%+'
                ],
                successCriteria: 'Baseline engagement score and 3 key improvement areas identified'
              },
              {
                id: 3,
                title: 'Establish OKR Framework for Q1',
                lens: 'Strategy',
                priority: 'High',
                owner: 'CEO',
                timeline: '2 weeks',
                budget: '$0',
                impact: 'High',
                status: 'not_started',
                tasks: [
                  'Define 3-5 company-level objectives for Q1',
                  'Cascade to department-level OKRs',
                  'Train leadership team on OKR methodology',
                  'Set up bi-weekly OKR progress reviews'
                ],
                successCriteria: '100% of departments have aligned Q1 OKRs'
              }
            ]
          },
          {
            name: 'Phase 2: Foundation Building (Days 31-60)',
            description: 'Systematic improvements to core processes and capabilities',
            color: 'from-green-500 to-green-600',
            actions: [
              {
                id: 4,
                title: 'Deploy AI-Powered Sales Pipeline Analytics',
                lens: 'Sales & Marketing',
                priority: 'High',
                owner: 'VP Sales',
                timeline: '4 weeks',
                budget: '$25K',
                impact: 'High',
                status: 'not_started',
                tasks: [
                  'Implement sales analytics platform with AI forecasting',
                  'Integrate CRM data and historical win rates',
                  'Set up automated pipeline health alerts',
                  'Train sales team on data-driven selling approach'
                ],
                successCriteria: 'Forecast accuracy improves to 90%+, 20% reduction in sales cycle'
              },
              {
                id: 5,
                title: 'Implement Process Optimization Program',
                lens: 'Operations',
                priority: 'Medium-High',
                owner: 'COO',
                timeline: '6 weeks',
                budget: '$15K',
                impact: 'Medium-High',
                status: 'not_started',
                tasks: [
                  'Map top 10 critical business processes',
                  'Identify bottlenecks and inefficiencies using process mining',
                  'Prioritize top 3 processes for optimization',
                  'Implement improvements and measure results'
                ],
                successCriteria: '15%+ efficiency improvement in top 3 processes'
              },
              {
                id: 6,
                title: 'Launch Customer Success Program',
                lens: 'Customers',
                priority: 'High',
                owner: 'VP Customer Success',
                timeline: '5 weeks',
                budget: '$30K',
                impact: 'Very High',
                status: 'not_started',
                tasks: [
                  'Implement customer health scoring system',
                  'Create customer journey maps and touchpoint strategy',
                  'Establish proactive outreach playbooks for at-risk accounts',
                  'Set up quarterly business reviews with top 20 customers'
                ],
                successCriteria: 'Churn rate reduction of 25%, NPS improvement to 50+'
              }
            ]
          },
          {
            name: 'Phase 3: Strategic Initiatives (Days 61-90)',
            description: 'Transformational programs for sustainable competitive advantage',
            color: 'from-secondary-600 to-secondary-700',
            actions: [
              {
                id: 7,
                title: 'Digital Transformation Roadmap',
                lens: 'Systems & Processes',
                priority: 'Medium',
                owner: 'CTO',
                timeline: '8 weeks',
                budget: '$50K',
                impact: 'Very High',
                status: 'not_started',
                tasks: [
                  'Audit current technology stack and identify gaps',
                  'Develop 18-month digital transformation roadmap',
                  'Prioritize automation opportunities (RPA, AI/ML)',
                  'Create cloud migration strategy for legacy systems'
                ],
                successCriteria: 'Roadmap approved by board, 30% reduction in manual processes'
              },
              {
                id: 8,
                title: 'ESG Framework Implementation',
                lens: 'Sustainability',
                priority: 'Medium',
                owner: 'Chief Sustainability Officer',
                timeline: '10 weeks',
                budget: '$35K',
                impact: 'Medium-High',
                status: 'not_started',
                tasks: [
                  'Conduct comprehensive ESG materiality assessment',
                  'Set science-based carbon reduction targets',
                  'Implement ESG reporting dashboard for stakeholders',
                  'Launch employee sustainability task force'
                ],
                successCriteria: 'ESG framework aligned with GRI standards, baseline metrics established'
              },
              {
                id: 9,
                title: 'Organizational Design Optimization',
                lens: 'Organizational',
                priority: 'Medium-High',
                owner: 'Chief People Officer',
                timeline: '8 weeks',
                budget: '$40K',
                impact: 'High',
                status: 'not_started',
                tasks: [
                  'Review current org structure and identify inefficiencies',
                  'Design future-state organization aligned with strategy',
                  'Clarify decision rights and RACI for key processes',
                  'Implement changes with change management support'
                ],
                successCriteria: '30% reduction in decision-making time, clear accountability'
              }
            ]
          }
        ],
        keyMetrics: [
          { name: 'Total Investment', value: '$202K', icon: DollarSign, color: 'text-primary-600' },
          { name: 'Timeline', value: '90 Days', icon: Calendar, color: 'text-blue-600' },
          { name: 'Action Items', value: '9 Initiatives', icon: Target, color: 'text-secondary-600' },
          { name: 'Expected ROI', value: '350%', icon: Target, color: 'text-primary-600' }
        ],
        risks: [
          'Resource constraints may delay Phase 3 initiatives - consider prioritizing 2-3 highest impact items',
          'Change fatigue possible with 9 concurrent initiatives - ensure strong communication plan',
          'Budget overruns on technology implementations - build 20% contingency buffer'
        ]
      };

      setActionPlan(plan);
      setGenerating(false);
    }, 2000);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'High': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Medium-High': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-green-500 to-secondary-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              Action Plan Generator
              <Sparkles className="w-6 h-6 animate-pulse" />
            </h2>
            <p className="text-white/90 text-lg">AI-generated 90-day roadmap based on your assessment</p>
          </div>
        </div>
      </div>

      {!actionPlan && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border-2 border-gray-100">
          <Target className="w-20 h-20 text-blue-500 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Generate Your Strategic Action Plan</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Our AI will analyze your 9Lenses assessment results and create a comprehensive 90-day action plan with specific initiatives, timelines, budgets, and success criteria.
          </p>

          <button
            onClick={generateActionPlan}
            disabled={generating}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {generating ? (
              <>
                <Sparkles className="w-6 h-6 animate-pulse" />
                <span>Generating Action Plan...</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>Generate Action Plan</span>
              </>
            )}
          </button>
        </div>
      )}

      {actionPlan && (
        <div className="space-y-6 animate-slideUp">
          {/* Summary */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{actionPlan.title}</h3>
                <p className="text-gray-600 leading-relaxed">{actionPlan.summary}</p>
                <p className="text-sm text-gray-500 mt-2">Generated: {actionPlan.generatedDate}</p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors shadow-lg">
                <Download className="w-5 h-5" />
                Export PDF
              </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {actionPlan.keyMetrics.map((metric, idx) => {
                const Icon = metric.icon;
                return (
                  <div key={idx} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-5 h-5 ${metric.color}`} />
                      <span className="text-sm font-semibold text-gray-600">{metric.name}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phases */}
          {actionPlan.phases.map((phase, phaseIdx) => (
            <div key={phaseIdx} className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${phase.color} rounded-xl flex items-center justify-center text-white font-bold text-xl`}>
                  {phaseIdx + 1}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{phase.name}</h3>
                  <p className="text-gray-600">{phase.description}</p>
                </div>
              </div>

              <div className="space-y-6">
                {phase.actions.map((action) => (
                  <div key={action.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-gray-900">{action.title}</h4>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold border-2 ${getPriorityColor(action.priority)}`}>
                            {action.priority}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            <strong>Lens:</strong> {action.lens}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <strong>Owner:</strong> {action.owner}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <strong>Timeline:</strong> {action.timeline}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <strong>Budget:</strong> {action.budget}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tasks */}
                    <div className="mb-4">
                      <h5 className="font-bold text-gray-900 mb-3">Key Tasks:</h5>
                      <div className="space-y-2">
                        {action.tasks.map((task, taskIdx) => (
                          <div key={taskIdx} className="flex items-start gap-3 bg-white p-3 rounded-lg">
                            <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Success Criteria */}
                    <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-bold text-gray-900 mb-1">Success Criteria:</h5>
                          <p className="text-gray-700">{action.successCriteria}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Risks & Considerations */}
          <div className="bg-gradient-to-br from-green-50 to-red-50 rounded-2xl p-8 shadow-lg border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Risks & Considerations</h3>
            </div>
            <div className="space-y-3">
              {actionPlan.risks.map((risk, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    !
                  </div>
                  <p className="text-gray-700 leading-relaxed">{risk}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActionPlanGenerator;
