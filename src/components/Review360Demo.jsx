import React, { useState } from 'react';
import {
  Play, CheckCircle, Users, FileText, Award, TrendingUp,
  BarChart3, MessageCircle, ArrowRight, ChevronRight, Star,
  Target, Sparkles, Download, Share2, Eye, Clock, Info
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import PageInstructions from './PageInstructions';

const Review360Demo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Demo workflow steps
  const workflowSteps = [
    {
      id: 0,
      title: 'Setup: Launch 360 Review',
      description: 'CEO initiates a comprehensive 360-degree organizational review',
      icon: Target,
      color: 'primary',
      details: [
        'Assessment Name: "Q1 2025 Strategic 360 Review"',
        'Company: TechVentures Inc.',
        'Review Type: Full organizational assessment',
        'Timeline: 2 weeks for completion'
      ],
      participants: [
        { role: 'CEO', name: 'Sarah Chen', expertise: ['Strategy', 'Finance'] },
        { role: 'CFO', name: 'Michael Rodriguez', expertise: ['Finance', 'Operations'] },
        { role: 'CTO', name: 'James Kim', expertise: ['Operations', 'People'] },
        { role: 'VP Sales', name: 'Lisa Thompson', expertise: ['Market', 'Strategy'] },
        { role: 'VP Marketing', name: 'David Park', expertise: ['Market', 'Expectation'] },
        { role: 'Board Member', name: 'Robert Johnson', expertise: ['Governance', 'Strategy'] },
        { role: 'Employee', name: '8 Team Members', expertise: ['Various'] }
      ]
    },
    {
      id: 1,
      title: 'Data Collection: Multi-Source Input',
      description: 'Gathering data from documents, surveys, and systems',
      icon: FileText,
      color: 'secondary',
      dataSources: [
        { type: 'Documents', count: 12, examples: ['Financial statements', 'Strategic plan', 'HR reports'] },
        { type: 'Surveys', count: 14, examples: ['All 14 participants complete assessments'] },
        { type: 'Database', count: 3, examples: ['Salesforce CRM', 'QuickBooks', 'Google Analytics'] },
        { type: 'Interviews', count: 6, examples: ['Leadership 1-on-1s with facilitator'] }
      ],
      aiProcessing: [
        'Documents analyzed and mapped to lenses (95% confidence)',
        'CRM data extracted for Market lens',
        'Financial data auto-populated Finance lens',
        'Survey responses collected from all participants'
      ]
    },
    {
      id: 2,
      title: 'Expert Identification',
      description: 'Participants identify their areas of expertise',
      icon: Award,
      color: 'green',
      expertBreakdown: [
        { lens: 'Market', experts: 2, proficient: 3, weight: '1.35x avg' },
        { lens: 'People', experts: 1, proficient: 4, weight: '1.25x avg' },
        { lens: 'Finance', experts: 2, proficient: 2, weight: '1.40x avg' },
        { lens: 'Strategy', experts: 3, proficient: 4, weight: '1.38x avg' },
        { lens: 'Operations', experts: 2, proficient: 5, weight: '1.30x avg' },
        { lens: 'Execution', experts: 1, proficient: 6, weight: '1.20x avg' },
        { lens: 'Expectation', experts: 1, proficient: 3, weight: '1.22x avg' },
        { lens: 'Governance', experts: 1, proficient: 2, weight: '1.28x avg' },
        { lens: 'Entity', experts: 1, proficient: 2, weight: '1.25x avg' }
      ]
    },
    {
      id: 3,
      title: 'Assessment Completion',
      description: 'All participants complete their assessments',
      icon: Users,
      color: 'primary',
      completionStats: {
        total: 14,
        completed: 14,
        rate: '100%',
        avgTime: '45 min',
        timeline: [
          { day: 'Day 1-3', completed: 6, label: 'Leadership team' },
          { day: 'Day 4-7', completed: 5, label: 'Management' },
          { day: 'Day 8-10', completed: 3, label: 'Team members' }
        ]
      }
    },
    {
      id: 4,
      title: 'AI Analysis & Scoring',
      description: 'AI processes all inputs with expert weighting',
      icon: Sparkles,
      color: 'secondary',
      aiAnalysis: [
        'Combined 12 documents + 14 surveys + 3 databases',
        'Applied expert weighting (1.0x to 1.5x)',
        'Cross-referenced data sources for validation',
        'Identified patterns and anomalies',
        'Generated confidence scores per lens',
        'Calculated weighted averages'
      ],
      processingMetrics: {
        dataPoints: '2,847',
        confidence: '94%',
        processingTime: '2.3 seconds',
        insights: '47'
      }
    },
    {
      id: 5,
      title: 'Results: 360-Degree View',
      description: 'Comprehensive results across all 9 lenses',
      icon: BarChart3,
      color: 'green',
      scores: [
        { lens: 'Market', score: 7.2, change: +5, category: 'Assets' },
        { lens: 'People', score: 6.5, change: +3, category: 'Assets' },
        { lens: 'Finance', score: 5.8, change: -2, category: 'Assets' },
        { lens: 'Strategy', score: 7.8, change: +8, category: 'Processes' },
        { lens: 'Operations', score: 6.9, change: +2, category: 'Processes' },
        { lens: 'Execution', score: 6.2, change: 0, category: 'Processes' },
        { lens: 'Expectation', score: 7.5, change: +6, category: 'Structures' },
        { lens: 'Governance', score: 7.9, change: +7, category: 'Structures' },
        { lens: 'Entity', score: 7.1, change: +4, category: 'Structures' }
      ],
      overallScore: 7.0
    },
    {
      id: 6,
      title: 'Insights & Recommendations',
      description: 'AI-powered strategic insights and action plans',
      icon: TrendingUp,
      color: 'primary',
      insights: [
        {
          type: 'Strength',
          title: 'Governance & Strategy Excellence',
          lenses: ['Governance: 7.9', 'Strategy: 7.8'],
          description: 'Outstanding board oversight and strategic clarity. Continue leveraging these as competitive advantages.'
        },
        {
          type: 'Opportunity',
          title: 'Finance Optimization Needed',
          lenses: ['Finance: 5.8'],
          description: 'Critical need for improved financial planning and cash flow management. Priority #1 for next quarter.'
        },
        {
          type: 'Trend',
          title: 'Strong Upward Momentum',
          lenses: ['Average change: +3.7 points'],
          description: 'Organization improving across nearly all dimensions. Strategy and Governance showing exceptional growth.'
        }
      ],
      recommendations: [
        { priority: 'High', area: 'Finance', action: 'Hire VP Finance, implement new FP&A process', timeline: '30 days' },
        { priority: 'Medium', area: 'Execution', action: 'Deploy new KPI dashboard, quarterly reviews', timeline: '60 days' },
        { priority: 'Low', area: 'People', action: 'Leadership development program', timeline: '90 days' }
      ]
    },
    {
      id: 7,
      title: 'Stakeholder Reports',
      description: 'Customized reports for different audiences',
      icon: Share2,
      color: 'secondary',
      reports: [
        { audience: 'Board of Directors', format: 'Executive Summary', pages: 8, focus: 'Strategic overview, governance, risks' },
        { audience: 'Leadership Team', format: 'Detailed Analysis', pages: 24, focus: 'All lenses, action plans, metrics' },
        { audience: 'Department Heads', format: 'Functional View', pages: 12, focus: 'Relevant lenses, team-specific insights' },
        { audience: 'All Employees', format: 'Company Update', pages: 4, focus: 'High-level results, next steps' }
      ]
    }
  ];

  // Sample radar chart data
  const radarData = workflowSteps[5]?.scores.map(s => ({
    lens: s.lens,
    score: s.score,
    target: 8.0
  })) || [];

  const nextStep = () => {
    if (currentStep < workflowSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const playDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= workflowSteps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 4000);
  };

  const step = workflowSteps[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-secondary-600 to-green-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Eye className="w-10 h-10" />
                <h1 className="text-4xl font-display font-bold">360° Review Demo</h1>
              </div>
              <p className="text-xl text-white/90">
                See how TechVentures Inc. conducted a complete organizational assessment using 9Lenses
              </p>
            </div>
            <button
              onClick={playDemo}
              disabled={isPlaying}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-all ${
                isPlaying
                  ? 'bg-white/20 cursor-not-allowed'
                  : 'bg-white text-primary-700 hover:shadow-2xl hover:scale-105'
              }`}
            >
              <Play className="w-6 h-6" />
              {isPlaying ? 'Playing...' : 'Auto-Play Demo'}
            </button>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center gap-2">
            {workflowSteps.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => !isPlaying && setCurrentStep(idx)}
                disabled={isPlaying}
                className={`flex-1 h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? 'bg-white shadow-lg'
                    : idx < currentStep
                    ? 'bg-white/60'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0 || isPlaying}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              currentStep === 0 || isPlaying
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
            }`}
          >
            ← Previous
          </button>

          <div className="text-center">
            <p className="text-sm font-semibold text-neutral-600">
              Step {currentStep + 1} of {workflowSteps.length}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {isPlaying && <Clock className="w-3 h-3 inline mr-1 animate-pulse" />}
              {isPlaying ? 'Auto-advancing in 4s...' : 'Click next or use auto-play'}
            </p>
          </div>

          <button
            onClick={nextStep}
            disabled={currentStep === workflowSteps.length - 1 || isPlaying}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              currentStep === workflowSteps.length - 1 || isPlaying
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-600 to-green-600 text-white hover:shadow-lg'
            }`}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-neutral-200 overflow-hidden">
        {/* Step Header */}
        <div className={`bg-gradient-to-r from-${step.color}-50 to-${step.color}-100 border-b-2 border-${step.color}-200 p-8`}>
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 bg-gradient-to-br from-${step.color}-600 to-${step.color}-700 rounded-2xl flex items-center justify-center shadow-lg`}>
              <StepIcon className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">{step.title}</h2>
              <p className="text-lg text-neutral-700">{step.description}</p>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-8">
          {/* Step 0: Setup */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">Assessment Details</h3>
                  <div className="space-y-3">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">Participants ({step.participants.length})</h3>
                  <div className="space-y-2">
                    {step.participants.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-neutral-900">{p.name}</p>
                          <p className="text-sm text-neutral-600">{p.role}</p>
                        </div>
                        <div className="flex gap-1">
                          {p.expertise.slice(0, 2).map((exp, i) => (
                            <span key={i} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Data Collection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Data Sources</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {step.dataSources.map((source, idx) => (
                  <div key={idx} className="p-6 bg-gradient-to-br from-secondary-50 to-primary-50 rounded-xl border-2 border-secondary-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-neutral-900">{source.type}</h4>
                      <span className="px-3 py-1 bg-secondary-600 text-white rounded-full text-sm font-bold">
                        {source.count}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {source.examples.map((ex, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-neutral-700">
                          <div className="w-1.5 h-1.5 bg-secondary-600 rounded-full"></div>
                          <span>{ex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-primary-50 to-green-50 rounded-xl border-l-4 border-primary-600">
                <h4 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  AI Processing
                </h4>
                <div className="space-y-2">
                  {step.aiProcessing.map((process, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-neutral-700">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                      <span>{process}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Expert Identification */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Expert Distribution by Lens</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {step.expertBreakdown.map((lens, idx) => (
                  <div key={idx} className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                    <h4 className="font-bold text-neutral-900 mb-3">{lens.lens}</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">🌟 Experts:</span>
                        <span className="font-bold text-neutral-900">{lens.experts}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">⭐ Proficient:</span>
                        <span className="font-bold text-neutral-900">{lens.proficient}</span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-blue-300">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-600">Avg Weight:</span>
                          <span className="font-bold text-blue-700">{lens.weight}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Completion Stats */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-6 bg-primary-50 rounded-xl border-2 border-primary-200 text-center">
                  <p className="text-sm font-semibold text-neutral-600 mb-2">Total Participants</p>
                  <p className="text-4xl font-bold text-primary-700">{step.completionStats.total}</p>
                </div>
                <div className="p-6 bg-green-50 rounded-xl border-2 border-green-200 text-center">
                  <p className="text-sm font-semibold text-neutral-600 mb-2">Completed</p>
                  <p className="text-4xl font-bold text-green-700">{step.completionStats.completed}</p>
                </div>
                <div className="p-6 bg-secondary-50 rounded-xl border-2 border-secondary-200 text-center">
                  <p className="text-sm font-semibold text-neutral-600 mb-2">Completion Rate</p>
                  <p className="text-4xl font-bold text-secondary-700">{step.completionStats.rate}</p>
                </div>
                <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200 text-center">
                  <p className="text-sm font-semibold text-neutral-600 mb-2">Avg Time</p>
                  <p className="text-4xl font-bold text-blue-700">{step.completionStats.avgTime}</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-neutral-900 mb-4">Completion Timeline</h3>
              <div className="space-y-3">
                {step.completionStats.timeline.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                    <div className="w-24 font-semibold text-neutral-700">{t.day}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-neutral-200 rounded-full h-4">
                          <div
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-4 rounded-full flex items-center justify-center"
                            style={{ width: `${(t.completed / step.completionStats.total) * 100}%` }}
                          >
                            <span className="text-xs font-bold text-white">{t.completed}</span>
                          </div>
                        </div>
                        <span className="text-sm text-neutral-600 w-32">{t.label}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: AI Analysis */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                {Object.entries(step.processingMetrics).map(([key, value]) => (
                  <div key={key} className="p-6 bg-gradient-to-br from-secondary-50 to-primary-50 rounded-xl border-2 border-secondary-200 text-center">
                    <p className="text-sm font-semibold text-neutral-600 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-3xl font-bold text-secondary-700">{value}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gradient-to-r from-primary-50 to-green-50 rounded-xl border-l-4 border-primary-600">
                <h4 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  AI Processing Steps
                </h4>
                <div className="space-y-3">
                  {step.aiAnalysis.map((analysis, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-neutral-700 pt-1">{analysis}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Results */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-sm font-semibold text-neutral-600 mb-2">Overall Score</p>
                <p className="text-6xl font-bold bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
                  {step.overallScore.toFixed(1)}
                </p>
                <p className="text-neutral-600">out of 9.0</p>
              </div>

              {/* Radar Chart */}
              <div className="bg-neutral-50 rounded-xl p-6">
                <h4 className="font-bold text-neutral-900 mb-4 text-center">360° Performance View</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="lens" tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 9]} tick={{ fill: '#6b7280' }} />
                    <Radar name="Current Score" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Radar name="Target" dataKey="target" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Scores Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                {step.scores.map((score, idx) => (
                  <div key={idx} className={`p-4 bg-${score.category === 'Assets' ? 'primary' : score.category === 'Processes' ? 'green' : 'secondary'}-50 rounded-lg border-2 border-${score.category === 'Assets' ? 'primary' : score.category === 'Processes' ? 'green' : 'secondary'}-200`}>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-neutral-900">{score.lens}</h5>
                      <span className={`flex items-center gap-1 text-sm font-bold ${score.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {score.change >= 0 ? '↑' : '↓'} {Math.abs(score.change)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-neutral-200 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r from-${score.category === 'Assets' ? 'primary' : score.category === 'Processes' ? 'green' : 'secondary'}-500 to-${score.category === 'Assets' ? 'primary' : score.category === 'Processes' ? 'green' : 'secondary'}-600 h-2 rounded-full`}
                          style={{ width: `${(score.score / 9) * 100}%` }}
                        />
                      </div>
                      <span className="font-bold text-neutral-900 text-lg">{score.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Insights */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Key Insights</h3>
              <div className="space-y-4">
                {step.insights.map((insight, idx) => (
                  <div key={idx} className={`p-6 rounded-xl border-2 ${
                    insight.type === 'Strength' ? 'bg-green-50 border-green-200' :
                    insight.type === 'Opportunity' ? 'bg-blue-50 border-blue-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        insight.type === 'Strength' ? 'bg-green-600' :
                        insight.type === 'Opportunity' ? 'bg-blue-600' :
                        'bg-blue-600'
                      }`}>
                        {insight.type === 'Strength' ? <Star className="w-6 h-6 text-white" /> :
                         insight.type === 'Opportunity' ? <Target className="w-6 h-6 text-white" /> :
                         <TrendingUp className="w-6 h-6 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            insight.type === 'Strength' ? 'bg-green-600 text-white' :
                            insight.type === 'Opportunity' ? 'bg-blue-600 text-white' :
                            'bg-blue-600 text-white'
                          }`}>
                            {insight.type}
                          </span>
                          <h4 className="font-bold text-neutral-900 text-lg">{insight.title}</h4>
                        </div>
                        <p className="text-sm text-neutral-700 mb-2">{insight.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {insight.lenses.map((lens, i) => (
                            <span key={i} className="px-2 py-1 bg-white border border-neutral-300 rounded text-xs font-medium text-neutral-700">
                              {lens}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-neutral-900 mb-4 mt-8">Recommended Actions</h3>
              <div className="space-y-3">
                {step.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg border-2 border-neutral-200">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      rec.priority === 'High' ? 'bg-red-600 text-white' :
                      rec.priority === 'Medium' ? 'bg-blue-600 text-white' :
                      'bg-blue-600 text-white'
                    }`}>
                      {rec.priority}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900">{rec.area}</p>
                      <p className="text-sm text-neutral-600">{rec.action}</p>
                    </div>
                    <span className="text-sm font-medium text-neutral-600">{rec.timeline}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Reports */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Stakeholder Reports Generated</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {step.reports.map((report, idx) => (
                  <div key={idx} className="p-6 bg-gradient-to-br from-neutral-50 to-secondary-50 rounded-xl border-2 border-secondary-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-neutral-900 text-lg mb-1">{report.audience}</h4>
                        <p className="text-sm text-neutral-600">{report.format}</p>
                      </div>
                      <span className="px-3 py-1 bg-secondary-600 text-white rounded-full text-sm font-bold">
                        {report.pages} pages
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700 mb-4">{report.focus}</p>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      <Download className="w-4 h-4" />
                      Download Report
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-primary-600 via-secondary-600 to-green-600 rounded-xl text-white">
                <h4 className="text-2xl font-bold mb-3">✅ 360° Review Complete!</h4>
                <p className="text-lg text-white/90 mb-4">
                  TechVentures Inc. now has a comprehensive view of their organization across all 9 dimensions, with:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>14 participants contributed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>12 documents analyzed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>3 systems integrated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>47 insights generated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Expert-weighted scoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Customized reports for all stakeholders</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Instructions */}
      <PageInstructions
        title="360° Review Demo Guide"
        steps={[
          "Click 'Auto-Play Demo' to watch the entire workflow automatically (4 seconds per step)",
          "Or use 'Previous' and 'Next' buttons to navigate at your own pace",
          "Click on the progress bars at the top to jump to any step",
          "Step 1: See how the assessment is set up with 14 participants",
          "Step 2: See multi-source data collection (documents, surveys, databases)",
          "Step 3: Learn how participants identify their expertise areas",
          "Step 4: Watch participants complete the assessment",
          "Step 5: See AI process all data with expert weighting",
          "Step 6: View comprehensive 360° results across all 9 lenses",
          "Step 7: Explore AI-generated insights and recommendations",
          "Step 8: See customized reports for different stakeholders"
        ]}
        tips={[
          "This demo shows a real-world use case with actual workflow and outcomes",
          "Notice how expert weighting (1.5x) improves accuracy - CFO's Finance input counts more",
          "Multi-source input (docs + surveys + databases) gives richer insights",
          "The 360° approach captures perspectives from all levels (Board to employees)",
          "AI automatically maps documents to lenses - no manual data entry needed",
          "Results show both scores AND trends (↑↓) for actionable insights",
          "Different reports for different audiences - Board gets executive summary, team gets details"
        ]}
      />
    </div>
  );
};

export default Review360Demo;
