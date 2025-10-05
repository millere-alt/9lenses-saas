import React, { useState } from 'react';
import { Brain, Sparkles, TrendingUp, Target, Shield, Bell, MessageCircle, BarChart3, Network, Info } from 'lucide-react';
import AIStrategyAdvisor from './AIStrategyAdvisor';
import PredictiveAnalytics from './PredictiveAnalytics';
import ActionPlanGenerator from './ActionPlanGenerator';
import AIAssistant from './AIAssistant';
import CompetitiveBenchmarking from './CompetitiveBenchmarking';
import RiskDetection from './RiskDetection';
import SmartNotifications from './SmartNotifications';
import MetastructureInterconnections from './MetastructureInterconnections';
import PageInstructions from './PageInstructions';

function AIDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data - in production this would come from props/API
  const assessmentData = {
    name: 'Q1 2025 Strategic Review',
    company: 'Acme Corporation',
    overallScore: '6.8',
    participants: 12,
    completionRate: '92%',
  };

  const lensScores = [
    { name: 'Customers', score: 7.2, category: 'Assets', gradient: 'from-primary-400 to-primary-500', change: 5 },
    { name: 'Financials', score: 5.8, category: 'Assets', gradient: 'from-primary-500 to-primary-600', change: -2 },
    { name: 'Human Resources', score: 6.5, category: 'Assets', gradient: 'from-primary-400 to-primary-500', change: 3 },
    { name: 'Strategy', score: 7.0, category: 'Processes', gradient: 'from-orange-400 to-orange-500', change: 4 },
    { name: 'Sales & Marketing', score: 6.2, category: 'Processes', gradient: 'from-orange-500 to-orange-600', change: 0 },
    { name: 'Operations', score: 6.5, category: 'Processes', gradient: 'from-orange-400 to-orange-500', change: 1 },
    { name: 'Sustainability', score: 7.5, category: 'Structures', gradient: 'from-secondary-500 to-secondary-600', change: 6 },
    { name: 'Systems & Processes', score: 7.8, category: 'Structures', gradient: 'from-secondary-400 to-secondary-500', change: 7 },
    { name: 'Organizational', score: 6.9, category: 'Structures', gradient: 'from-secondary-600 to-secondary-700', change: 2 },
  ];

  const tabs = [
    { id: 'overview', label: 'AI Overview', icon: Sparkles },
    { id: 'advisor', label: 'Strategy Advisor', icon: Brain },
    { id: 'predictions', label: 'Predictive Analytics', icon: TrendingUp },
    { id: 'actions', label: 'Action Plans', icon: Target },
    { id: 'assistant', label: 'AI Assistant', icon: MessageCircle },
    { id: 'benchmark', label: 'Benchmarking', icon: BarChart3 },
    { id: 'risks', label: 'Risk Detection', icon: Shield },
    { id: 'notifications', label: 'Smart Alerts', icon: Bell },
    { id: 'metastructure', label: 'Metastructure', icon: Network }
  ];

  const aiFeatures = [
    {
      id: 'advisor',
      title: 'AI Strategy Advisor',
      description: 'Get GPT-powered strategic recommendations for each lens with specific action items, timelines, and expected outcomes.',
      icon: Brain,
      color: 'from-primary-500 to-primary-600',
      stats: { label: 'Recommendations', value: '27+' }
    },
    {
      id: 'predictions',
      title: 'Predictive Analytics',
      description: 'AI-powered forecasting shows where your organization is headed over the next 6-12 months with confidence intervals.',
      icon: TrendingUp,
      color: 'from-secondary-500 to-secondary-600',
      stats: { label: 'Forecast Accuracy', value: '87%' }
    },
    {
      id: 'actions',
      title: 'Action Plan Generator',
      description: 'Automatically generate comprehensive 90-day roadmaps with specific initiatives, budgets, timelines, and success criteria.',
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      stats: { label: 'Action Items', value: '9' }
    },
    {
      id: 'assistant',
      title: 'AI Assistant',
      description: 'Conversational AI that answers questions about your assessment, provides insights, and guides you through improvements.',
      icon: MessageCircle,
      color: 'from-secondary-600 to-indigo-600',
      stats: { label: 'Available 24/7', value: '∞' }
    },
    {
      id: 'benchmark',
      title: 'Competitive Benchmarking',
      description: 'Compare your performance against industry peers, identify competitive advantages, and spot opportunity areas.',
      icon: BarChart3,
      color: 'from-primary-600 to-secondary-500',
      stats: { label: 'Companies Analyzed', value: '500+' }
    },
    {
      id: 'risks',
      title: 'Risk Detection',
      description: 'AI pattern recognition identifies potential risks early, categorizes by severity, and provides mitigation strategies.',
      icon: Shield,
      color: 'from-red-500 to-orange-600',
      stats: { label: 'Risks Monitored', value: '15+' }
    },
    {
      id: 'notifications',
      title: 'Smart Notifications',
      description: 'Intelligent alerts notify you of critical issues, opportunities, milestones, and trends that require attention.',
      icon: Bell,
      color: 'from-orange-500 to-yellow-500',
      stats: { label: 'Active Alerts', value: notifications.length }
    },
    {
      id: 'metastructure',
      title: 'Metastructure Interconnections',
      description: 'Visualize the patented mathematical framework showing how all 9 lenses interconnect and influence each other.',
      icon: Network,
      color: 'from-primary-600 to-secondary-600',
      stats: { label: 'Connections', value: '81' }
    }
  ];

  // Generate notifications for the badge
  const notifications = [
    { type: 'critical', count: lensScores.filter(l => l.score < 5.5).length },
    { type: 'warning', count: lensScores.filter(l => l.change < -3).length }
  ];
  const notificationCount = notifications.reduce((sum, n) => sum + n.count, 0) + 3;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-orange-500 to-secondary-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                AI-Powered Intelligence
                <Sparkles className="w-8 h-8 animate-pulse" />
              </h1>
              <p className="text-xl text-white/90 mt-1 mb-3">
                Advanced analytics and strategic guidance for {assessmentData.company}
              </p>
              {/* Quick Guide */}
              <div className="bg-white/10 backdrop-blur-sm border-l-4 border-white rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-white" />
                  <p className="text-sm text-white/90">
                    <span className="font-semibold">Choose a tab below</span> to access different AI features - each provides unique insights and recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20">
              <p className="text-white/70 text-sm font-semibold mb-1">AI Features</p>
              <p className="text-3xl font-bold">{aiFeatures.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20">
              <p className="text-white/70 text-sm font-semibold mb-1">Recommendations</p>
              <p className="text-3xl font-bold">27+</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20">
              <p className="text-white/70 text-sm font-semibold mb-1">Insights Generated</p>
              <p className="text-3xl font-bold">45+</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20">
              <p className="text-white/70 text-sm font-semibold mb-1">Active Alerts</p>
              <p className="text-3xl font-bold">{notificationCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100">
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                {tab.id === 'notifications' && notificationCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="animate-fadeIn">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your AI Intelligence Suite</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Leverage cutting-edge AI to transform your 9Lenses assessment into actionable strategic intelligence.
                Our AI suite provides predictive insights, risk detection, competitive benchmarking, and personalized recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <button
                    key={feature.id}
                    onClick={() => setActiveTab(feature.id)}
                    className="group bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-orange-300 hover:shadow-2xl transition-all duration-300 text-left"
                  >
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="bg-gray-100 px-4 py-2 rounded-lg">
                            <p className="text-xs font-semibold text-gray-600">{feature.stats.label}</p>
                            <p className="text-lg font-bold text-gray-900">{feature.stats.value}</p>
                          </div>
                          <span className="text-orange-600 font-semibold group-hover:translate-x-2 transition-transform">
                            Explore →
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'advisor' && <AIStrategyAdvisor lensScores={lensScores} />}
        {activeTab === 'predictions' && <PredictiveAnalytics lensScores={lensScores} />}
        {activeTab === 'actions' && <ActionPlanGenerator lensScores={lensScores} />}
        {activeTab === 'assistant' && <AIAssistant assessmentData={assessmentData} lensScores={lensScores} />}
        {activeTab === 'benchmark' && <CompetitiveBenchmarking lensScores={lensScores} />}
        {activeTab === 'risks' && <RiskDetection lensScores={lensScores} assessmentData={assessmentData} />}
        {activeTab === 'notifications' && <SmartNotifications lensScores={lensScores} assessmentData={assessmentData} />}
        {activeTab === 'metastructure' && <MetastructureInterconnections lensScores={lensScores} />}
      </div>

      {/* Help Instructions */}
      <PageInstructions
        title="AI Dashboard Guide"
        steps={[
          "Start with the 'AI Overview' tab to see all 8 AI features available to you",
          "Click on any feature card or tab to explore that specific AI capability",
          "Strategy Advisor provides GPT-powered recommendations for each lens",
          "Predictive Analytics shows 6-12 month forecasts for your scores",
          "Action Plans generates comprehensive 90-day roadmaps with specific initiatives",
          "AI Assistant lets you ask questions in natural language about your assessment",
          "Benchmarking compares your performance against industry peers",
          "Risk Detection identifies potential issues early with AI pattern recognition",
          "Smart Notifications shows priority alerts and opportunities",
          "Metastructure shows how the 9 lenses interconnect (based on US Patent 9,489,419 B2)"
        ]}
        tips={[
          "Each feature uses your actual assessment data to generate personalized insights",
          "Start with Strategy Advisor for quick wins and immediate action items",
          "Use Predictive Analytics to forecast where you'll be in 6-12 months",
          "Action Plans are perfect for planning quarterly initiatives",
          "The AI Assistant can answer questions like 'What's my weakest area?' or 'How do I improve Finance?'",
          "Metastructure visualization shows how improving one lens affects others"
        ]}
      />
    </div>
  );
}

export default AIDashboard;
