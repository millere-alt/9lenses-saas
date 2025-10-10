import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Users, FileText, Brain, BarChart3, TrendingUp, CheckCircle, ArrowRight, Upload, MessageSquare, Lightbulb, Target, Award, Eye, BookOpen, Zap, AlertTriangle, Calendar, Download } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';

function CompleteSaaSDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < demoSteps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= demoSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 5000); // 5 seconds per step
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  // Progress bar animation
  useEffect(() => {
    setProgress(0);
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [currentStep, isPlaying]);

  const demoSteps = [
    {
      id: 0,
      title: 'Step 1: Assessment Intake',
      subtitle: 'Company launches organizational assessment',
      icon: FileText,
      color: 'primary',
      description: 'TechVentures Inc., a $50M B2B SaaS company, initiates a comprehensive 9Vectors assessment to identify growth opportunities and operational improvements.',
      data: {
        company: 'TechVentures Inc.',
        industry: 'B2B SaaS',
        revenue: '$50M ARR',
        employees: 250,
        assessmentType: 'Full 360° Review',
        participants: 24,
        timeline: '14 days'
      },
      visual: 'intake'
    },
    {
      id: 1,
      title: 'Step 2: Invite Stakeholders',
      subtitle: 'Multi-level participant engagement',
      icon: Users,
      color: 'green',
      description: '24 key stakeholders across all departments receive personalized invitations. Participants include C-suite executives, directors, managers, and subject matter experts.',
      data: {
        participants: [
          { role: 'C-Suite', count: 5, expertise: ['Strategy', 'Finance', 'Operations'] },
          { role: 'Directors', count: 8, expertise: ['Sales', 'Marketing', 'Product', 'Engineering'] },
          { role: 'Managers', count: 7, expertise: ['Customer Success', 'HR', 'Systems'] },
          { role: 'Experts', count: 4, expertise: ['Data Analytics', 'Security', 'Compliance'] }
        ],
        invitationsSent: 24,
        responseRate: '96%',
        avgResponseTime: '2.5 days'
      },
      visual: 'stakeholders'
    },
    {
      id: 2,
      title: 'Step 3: Expert Identification',
      subtitle: 'Participants identify expertise areas',
      icon: Award,
      color: 'secondary',
      description: 'Participants self-identify their expertise across the 9 lenses and 44 sub-lenses. Expert responses receive weighted scoring (1.5x) for more accurate assessments.',
      data: {
        expertiseDistribution: [
          { lens: 'Customers', experts: 6, proficient: 8, familiar: 10 },
          { lens: 'Financials', experts: 4, proficient: 6, familiar: 14 },
          { lens: 'Human Resources', experts: 5, proficient: 7, familiar: 12 },
          { lens: 'Strategy', experts: 8, proficient: 9, familiar: 7 },
          { lens: 'Sales & Marketing', experts: 7, proficient: 10, familiar: 7 },
          { lens: 'Operations', experts: 6, proficient: 11, familiar: 7 },
          { lens: 'Sustainability', experts: 3, proficient: 8, familiar: 13 },
          { lens: 'Systems & Processes', experts: 9, proficient: 8, familiar: 7 },
          { lens: 'Organizational', experts: 5, proficient: 9, familiar: 10 }
        ]
      },
      visual: 'expertise'
    },
    {
      id: 3,
      title: 'Step 4: Multi-Source Data Collection',
      subtitle: 'Aggregate data from multiple sources',
      icon: Upload,
      color: 'primary',
      description: 'System collects data from surveys, uploaded documents (financial reports, KPIs), integrated systems (CRM, ERP), and APIs (Salesforce, QuickBooks, Google Analytics).',
      data: {
        sources: [
          { type: 'Survey Responses', count: 23, confidence: 95 },
          { type: 'Financial Documents', count: 12, confidence: 98 },
          { type: 'CRM Data (Salesforce)', count: 1, confidence: 92 },
          { type: 'ERP System', count: 1, confidence: 94 },
          { type: 'Google Analytics', count: 1, confidence: 88 },
          { type: 'Customer Feedback', count: 450, confidence: 85 }
        ],
        totalDataPoints: 15847,
        processingTime: '47 seconds'
      },
      visual: 'data'
    },
    {
      id: 4,
      title: 'Step 5: AI Analysis & Processing',
      subtitle: 'Advanced AI analyzes all data sources',
      icon: Brain,
      color: 'green',
      description: 'AI engine processes 15,847 data points, applies expert weighting, identifies patterns, calculates cross-lens impacts, and generates insights using the patent-based metastructure framework.',
      data: {
        aiMetrics: {
          dataPointsProcessed: 15847,
          patternsIdentified: 127,
          crossLensImpacts: 72,
          anomaliesDetected: 8,
          confidenceScore: 94,
          processingTime: '47 seconds'
        },
        analysis: [
          'Applied 1.5x weighting to 48 expert responses',
          'Identified 23 high-impact improvement areas',
          'Calculated metastructure interconnections (9x9 matrix)',
          'Detected 8 critical risk patterns',
          'Generated 156 specific recommendations'
        ]
      },
      visual: 'ai'
    },
    {
      id: 5,
      title: 'Step 6: Scoring & Results',
      subtitle: 'Comprehensive scoring across all 9 lenses',
      icon: BarChart3,
      color: 'secondary',
      description: 'Each lens receives a score from 1-9 based on weighted participant responses and data analysis. Overall score: 6.8/9.0 (Good - needs strategic attention in key areas).',
      data: {
        overallScore: 6.8,
        scores: [
          { lens: 'Customers', score: 7.8, status: 'Excellent', trend: '+0.3' },
          { lens: 'Financials', score: 7.2, status: 'Good', trend: '+0.1' },
          { lens: 'Human Resources', score: 5.9, status: 'Needs Attention', trend: '-0.2' },
          { lens: 'Strategy', score: 7.5, status: 'Excellent', trend: '+0.5' },
          { lens: 'Sales & Marketing', score: 6.9, status: 'Good', trend: '+0.2' },
          { lens: 'Operations', score: 6.2, status: 'Needs Attention', trend: '0.0' },
          { lens: 'Sustainability', score: 5.4, status: 'Critical', trend: '-0.4' },
          { lens: 'Systems & Processes', score: 7.1, status: 'Good', trend: '+0.3' },
          { lens: 'Organizational', score: 6.3, status: 'Needs Attention', trend: '-0.1' }
        ]
      },
      visual: 'scores'
    },
    {
      id: 6,
      title: 'Step 7: AI-Powered Insights & Recommendations',
      subtitle: 'Strategic recommendations and action plans',
      icon: Lightbulb,
      color: 'primary',
      description: 'AI generates prioritized recommendations, 90-day action plans, predictive analytics, risk alerts, and competitive benchmarking insights.',
      data: {
        topRecommendations: [
          {
            priority: 'Critical',
            lens: 'Sustainability',
            title: 'Implement ESG Framework',
            impact: 'High',
            effort: 'Medium',
            timeline: '60 days',
            roi: '240%'
          },
          {
            priority: 'High',
            lens: 'Human Resources',
            title: 'Launch Leadership Development Program',
            impact: 'High',
            effort: 'Medium',
            timeline: '90 days',
            roi: '180%'
          },
          {
            priority: 'High',
            lens: 'Operations',
            title: 'Automate Key Workflows',
            impact: 'Medium',
            effort: 'Low',
            timeline: '45 days',
            roi: '320%'
          }
        ],
        predictions: [
          { metric: 'Revenue Growth', current: '+15%', projected: '+28%', timeframe: '12 months' },
          { metric: 'Customer Retention', current: '87%', projected: '94%', timeframe: '6 months' },
          { metric: 'Employee Satisfaction', current: '6.8/10', projected: '8.2/10', timeframe: '9 months' }
        ],
        risks: [
          { level: 'High', area: 'Talent Retention', probability: '68%', impact: 'Critical' },
          { level: 'Medium', area: 'Market Competition', probability: '45%', impact: 'High' }
        ]
      },
      visual: 'insights'
    },
    {
      id: 7,
      title: 'Step 8: Interactive Dashboards',
      subtitle: 'Real-time visualization and exploration',
      icon: Eye,
      color: 'green',
      description: 'Leadership team accesses interactive dashboards with drill-down capabilities, trend analysis, department comparisons, and exportable reports.',
      data: {
        dashboardFeatures: [
          'Real-time score updates',
          'Drill-down to sub-lens details',
          'Department-level comparisons',
          'Historical trend analysis',
          'Custom filters and views',
          'Export to PDF/Excel'
        ],
        usage: {
          activeUsers: 18,
          avgSessionTime: '23 minutes',
          reportsGenerated: 47,
          decisionsInfluenced: 12
        }
      },
      visual: 'dashboard'
    },
    {
      id: 8,
      title: 'Step 9: Outcomes & Business Impact',
      subtitle: 'Measurable results and transformation',
      icon: TrendingUp,
      color: 'secondary',
      description: 'After 6 months of implementing AI-recommended actions, TechVentures Inc. sees significant improvements across all key metrics and business outcomes.',
      data: {
        outcomes: [
          { metric: 'Overall Score', before: '6.8/9.0', after: '7.9/9.0', improvement: '+16%' },
          { metric: 'Revenue Growth', before: '+15% YoY', after: '+31% YoY', improvement: '+107%' },
          { metric: 'Customer Retention', before: '87%', after: '95%', improvement: '+9%' },
          { metric: 'Employee NPS', before: '42', after: '68', improvement: '+62%' },
          { metric: 'Operational Efficiency', before: '74%', after: '91%', improvement: '+23%' },
          { metric: 'Market Share', before: '12%', after: '17%', improvement: '+42%' }
        ],
        businessImpact: {
          revenueIncrease: '$8M ARR',
          costSavings: '$2.3M annually',
          timeToMarket: '-35%',
          customerSatisfaction: '+28 NPS points'
        }
      },
      visual: 'outcomes'
    }
  ];

  const currentStepData = demoSteps[currentStep];

  const playDemo = () => {
    setIsPlaying(true);
    if (currentStep >= demoSteps.length - 1) {
      setCurrentStep(0);
    }
  };

  const pauseDemo = () => {
    setIsPlaying(false);
  };

  const nextStep = () => {
    setIsPlaying(false);
    setCurrentStep(prev => Math.min(prev + 1, demoSteps.length - 1));
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const getStepColor = (color) => {
    const colors = {
      primary: 'bg-primary-600',
      green: 'bg-green-600',
      secondary: 'bg-secondary-600'
    };
    return colors[color] || 'bg-primary-600';
  };

  const renderVisual = () => {
    switch (currentStepData.visual) {
      case 'intake':
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-6">Assessment Setup</h4>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(currentStepData.data).map(([key, value]) => (
                <div key={key} className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4 border-2 border-primary-200">
                  <div className="text-sm text-gray-600 uppercase tracking-wide mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div className="text-2xl font-bold text-gray-900">{value}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'stakeholders':
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-6">Participant Distribution</h4>
            <div className="space-y-4 mb-6">
              {currentStepData.data.participants.map((p, idx) => (
                <div key={idx} className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">{p.role}</span>
                    <span className="text-2xl font-bold text-blue-600">{p.count}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.expertise.map((e, i) => (
                      <span key={i} className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">{e}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{currentStepData.data.invitationsSent}</div>
                <div className="text-sm text-gray-600">Invitations Sent</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{currentStepData.data.responseRate}</div>
                <div className="text-sm text-gray-600">Response Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{currentStepData.data.avgResponseTime}</div>
                <div className="text-sm text-gray-600">Avg Response</div>
              </div>
            </div>
          </div>
        );

      case 'expertise':
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-6">Expertise Distribution by Lens</h4>
            <div className="space-y-3">
              {currentStepData.data.expertiseDistribution.map((item, idx) => {
                const total = item.experts + item.proficient + item.familiar;
                const expertPct = (item.experts / total) * 100;
                const proficientPct = (item.proficient / total) * 100;
                const familiarPct = (item.familiar / total) * 100;

                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{item.lens}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-primary-600">🌟 {item.experts}</span>
                        <span className="text-blue-600">⭐ {item.proficient}</span>
                        <span className="text-secondary-600">✨ {item.familiar}</span>
                      </div>
                    </div>
                    <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
                      <div className="bg-primary-600" style={{ width: `${expertPct}%` }}></div>
                      <div className="bg-blue-500" style={{ width: `${proficientPct}%` }}></div>
                      <div className="bg-secondary-500" style={{ width: `${familiarPct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary-600 rounded"></div>
                <span>🌟 Expert (1.5x weight)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>⭐ Proficient (1.25x)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-secondary-500 rounded"></div>
                <span>✨ Familiar (1.1x)</span>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-6">Data Sources Collected</h4>
            <div className="space-y-3 mb-6">
              {currentStepData.data.sources.map((source, idx) => (
                <div key={idx} className="bg-secondary-50 rounded-lg p-4 border-l-4 border-secondary-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{source.type}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">{source.count} {source.count === 1 ? 'source' : 'items'}</span>
                      <span className="text-sm font-bold text-primary-600">{source.confidence}% confidence</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${source.confidence}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-4 text-white text-center">
                <div className="text-4xl font-bold">{currentStepData.data.totalDataPoints.toLocaleString()}</div>
                <div className="text-sm opacity-90">Total Data Points</div>
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-primary-600 rounded-lg p-4 text-white text-center">
                <div className="text-4xl font-bold">{currentStepData.data.processingTime}</div>
                <div className="text-sm opacity-90">Processing Time</div>
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-6">AI Processing Metrics</h4>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {Object.entries(currentStepData.data.aiMetrics).map(([key, value]) => (
                <div key={key} className="bg-gradient-to-br from-blue-50 to-primary-50 rounded-lg p-4 border-2 border-blue-200 text-center">
                  <div className="text-3xl font-bold text-blue-600">{typeof value === 'number' && value > 1000 ? value.toLocaleString() : value}</div>
                  <div className="text-xs text-gray-600 mt-1 uppercase tracking-wide">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                </div>
              ))}
            </div>
            <div className="bg-secondary-50 rounded-lg p-6 border-l-4 border-secondary-600">
              <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5 text-secondary-600" />
                AI Analysis Performed
              </h5>
              <ul className="space-y-2">
                {currentStepData.data.analysis.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'scores':
        const radarData = currentStepData.data.scores.map(s => ({
          lens: s.lens.split(' ')[0],
          score: s.score,
          target: 8.0
        }));

        return (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-gray-900">9Vectors Assessment Scores</h4>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600">{currentStepData.data.overallScore}</div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="lens" tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 9]} tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <Radar name="Current Score" dataKey="score" stroke="#059669" fill="#059669" fillOpacity={0.5} />
                    <Radar name="Target" dataKey="target" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {currentStepData.data.scores.map((item, idx) => {
                  const color = item.score >= 7.5 ? 'primary' : item.score >= 6.5 ? 'secondary' : item.score >= 5.5 ? 'blue' : 'red';
                  const colorClasses = {
                    primary: 'bg-primary-100 text-primary-700 border-primary-300',
                    secondary: 'bg-secondary-100 text-secondary-700 border-secondary-300',
                    blue: 'bg-blue-100 text-blue-700 border-blue-300',
                    red: 'bg-red-100 text-red-700 border-red-300'
                  };

                  return (
                    <div key={idx} className={`rounded-lg p-3 border-2 ${colorClasses[color]}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{item.lens}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{item.trend}</span>
                          <span className="font-bold text-lg">{item.score}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'insights':
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-6">AI-Generated Insights</h4>

            <div className="mb-6">
              <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" />
                Top Priority Recommendations
              </h5>
              <div className="space-y-3">
                {currentStepData.data.topRecommendations.map((rec, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-primary-50 to-green-50 rounded-lg p-4 border-l-4 border-primary-600">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${rec.priority === 'Critical' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
                          {rec.priority}
                        </span>
                        <span className="ml-2 text-xs text-gray-600">{rec.lens}</span>
                      </div>
                      <span className="text-sm font-bold text-primary-600">ROI: {rec.roi}</span>
                    </div>
                    <h6 className="font-bold text-gray-900 mb-1">{rec.title}</h6>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>Impact: {rec.impact}</span>
                      <span>•</span>
                      <span>Effort: {rec.effort}</span>
                      <span>•</span>
                      <span>Timeline: {rec.timeline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                  Predictive Analytics
                </h5>
                <div className="space-y-3">
                  {currentStepData.data.predictions.map((pred, idx) => (
                    <div key={idx} className="bg-secondary-50 rounded-lg p-3 border-2 border-secondary-200">
                      <div className="font-semibold text-gray-900 mb-1">{pred.metric}</div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Current: {pred.current}</span>
                        <ArrowRight className="w-4 h-4 text-primary-600" />
                        <span className="font-bold text-primary-600">Projected: {pred.projected}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{pred.timeframe}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                  Risk Alerts
                </h5>
                <div className="space-y-3">
                  {currentStepData.data.risks.map((risk, idx) => (
                    <div key={idx} className={`rounded-lg p-3 border-2 ${risk.level === 'High' ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-300'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900">{risk.area}</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${risk.level === 'High' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
                          {risk.level}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Probability: {risk.probability}</span>
                        <span>Impact: {risk.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-6">Interactive Dashboard Features</h4>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-6 border-2 border-primary-200">
                <h5 className="font-bold text-gray-900 mb-4">Available Features</h5>
                <div className="grid grid-cols-2 gap-3">
                  {currentStepData.data.dashboardFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-primary-50 rounded-lg p-6 border-2 border-blue-200">
                <h5 className="font-bold text-gray-900 mb-4">Usage Metrics</h5>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(currentStepData.data.usage).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{value}</div>
                      <div className="text-xs text-gray-600 uppercase tracking-wide mt-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-secondary-50 rounded-lg p-6 border-l-4 border-secondary-600">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-secondary-600" />
                <h5 className="font-bold text-gray-900">Real-Time Collaboration</h5>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Leadership team members can simultaneously view and interact with the dashboard, add comments, bookmark insights, and export customized reports. All actions are tracked and auditable for compliance.
              </p>
            </div>
          </div>
        );

      case 'outcomes':
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-6">Business Impact - 6 Month Results</h4>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {currentStepData.data.outcomes.map((outcome, idx) => (
                <div key={idx} className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4 border-2 border-primary-200">
                  <div className="text-sm text-gray-600 mb-1">{outcome.metric}</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Before: {outcome.before}</div>
                      <div className="text-lg font-bold text-primary-600">After: {outcome.after}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">{outcome.improvement}</div>
                      <div className="text-xs text-gray-600">improvement</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-600 via-primary-600 to-secondary-600 rounded-xl p-8 text-white">
              <h5 className="text-2xl font-bold mb-6 text-center">Overall Business Impact</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.entries(currentStepData.data.businessImpact).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-4xl font-bold mb-2">{value}</div>
                    <div className="text-sm opacity-90 uppercase tracking-wide">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const StepIcon = currentStepData.icon;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-700 via-green-600 to-secondary-700 rounded-3xl p-12 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="relative text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <Play className="w-5 h-5" />
            <span className="font-semibold">Complete SaaS Workflow Demo</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">From Intake to Impact</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Watch how organizations transform with 9Vectors - A complete journey through assessment, analysis, insights, and measurable business outcomes
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Demo Progress</h3>
          <span className="text-sm text-gray-600">Step {currentStep + 1} of {demoSteps.length}</span>
        </div>
        <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-600 via-green-600 to-secondary-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
          ></div>
          {isPlaying && (
            <div
              className="absolute top-0 h-full bg-white/30 transition-all duration-100"
              style={{
                left: `${((currentStep) / demoSteps.length) * 100}%`,
                width: `${(progress / demoSteps.length)}%`
              }}
            ></div>
          )}
        </div>

        {/* Timeline */}
        <div className="flex items-center justify-between">
          {demoSteps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === currentStep;
            const isComplete = idx < currentStep;
            const colorClass = getStepColor(step.color);

            return (
              <button
                key={idx}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep(idx);
                }}
                className="group relative flex flex-col items-center"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isActive ? `${colorClass} text-white shadow-lg scale-110` :
                  isComplete ? 'bg-primary-600 text-white' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {isComplete && !isActive ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <span className={`absolute -bottom-6 text-xs whitespace-nowrap ${
                  isActive ? 'font-bold text-gray-900' : 'text-gray-500'
                }`}>
                  Step {idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={resetDemo}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>

        {!isPlaying ? (
          <button
            onClick={playDemo}
            className="bg-gradient-to-r from-primary-600 to-green-600 hover:from-primary-700 hover:to-green-700 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-3 transition-all shadow-lg hover:shadow-xl"
          >
            <Play className="w-5 h-5" />
            {currentStep >= demoSteps.length - 1 ? 'Replay Demo' : 'Play Demo'}
          </button>
        ) : (
          <button
            onClick={pauseDemo}
            className="bg-gradient-to-r from-blue-600 to-secondary-600 hover:from-blue-700 hover:to-secondary-700 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-3 transition-all shadow-lg hover:shadow-xl"
          >
            <Pause className="w-5 h-5" />
            Pause
          </button>
        )}

        <button
          onClick={nextStep}
          disabled={currentStep >= demoSteps.length - 1}
          className={`font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg ${
            currentStep >= demoSteps.length - 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-secondary-600 hover:bg-secondary-700 text-white hover:shadow-xl'
          }`}
        >
          Next
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Current Step */}
      <div className="space-y-6">
        {/* Step Header */}
        <div className={`relative overflow-hidden ${getStepColor(currentStepData.color)} rounded-2xl p-8 text-white shadow-xl`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <StepIcon className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm opacity-90 mb-1">{currentStepData.subtitle}</div>
              <h2 className="text-3xl font-bold mb-2">{currentStepData.title}</h2>
              <p className="text-lg text-white/90">{currentStepData.description}</p>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {renderVisual()}
      </div>
    </div>
  );
}

export default CompleteSaaSDemo;
