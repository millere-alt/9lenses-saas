import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, TrendingUp, Users, FileText, Award, AlertCircle,
  Sparkles, Target, Zap, ArrowUp, ArrowDown, Download,
  Share2, RefreshCw, ChevronRight, TrendingDown, Activity, Info
} from 'lucide-react';
import PageInstructions from './PageInstructions';

function Dashboard() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [activeLens, setActiveLens] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const assessmentData = {
    name: 'Q1 2025 Strategic Review',
    company: 'Acme Corporation',
    overallScore: '6.8',
    participants: 12,
    completionRate: '92%',
  };

  const lensScores = [
    { name: 'Customers', score: 7.2, category: 'Assets', gradient: 'from-emerald-400 to-teal-500', icon: Users, change: +5 },
    { name: 'Financials', score: 5.8, category: 'Assets', gradient: 'from-emerald-500 to-emerald-600', icon: TrendingUp, change: -2 },
    { name: 'Human Resources', score: 6.5, category: 'Assets', gradient: 'from-teal-400 to-teal-500', icon: Users, change: +3 },
    { name: 'Strategy', score: 7.0, category: 'Processes', gradient: 'from-cyan-400 to-blue-500', icon: Target, change: +4 },
    { name: 'Sales & Marketing', score: 6.2, category: 'Processes', gradient: 'from-teal-500 to-blue-500', icon: Zap, change: 0 },
    { name: 'Operations', score: 6.5, category: 'Processes', gradient: 'from-blue-400 to-blue-500', icon: Activity, change: +1 },
    { name: 'Sustainability', score: 7.5, category: 'Structures', gradient: 'from-blue-500 to-indigo-500', icon: Award, change: +6 },
    { name: 'Systems & Processes', score: 7.8, category: 'Structures', gradient: 'from-indigo-400 to-purple-500', icon: BarChart3, change: +7 },
    { name: 'Organizational', score: 6.9, category: 'Structures', gradient: 'from-blue-600 to-indigo-600', icon: Users, change: +2 },
  ];

  const insights = [
    {
      type: 'Strength',
      title: 'Systems & Processes Excellence',
      description: 'Outstanding technology infrastructure and process documentation. Continue investing in automation and digital transformation.',
      score: 7.8,
      gradient: 'from-emerald-400 to-teal-500',
      icon: Award
    },
    {
      type: 'Strength',
      title: 'Sustainability Leadership',
      description: 'Industry-leading ESG practices and risk management frameworks. Strong stakeholder value creation.',
      score: 7.5,
      gradient: 'from-teal-400 to-cyan-500',
      icon: Sparkles
    },
    {
      type: 'Opportunity',
      title: 'Financial Optimization Required',
      description: 'Critical need to improve capital allocation, cash flow management, and financial planning processes.',
      score: 5.8,
      gradient: 'from-green-400 to-red-500',
      icon: AlertCircle
    },
  ];

  const getScoreColor = (score) => {
    if (score >= 7.5) return 'from-emerald-500 to-teal-600';
    if (score >= 6.5) return 'from-blue-500 to-indigo-600';
    if (score >= 5.5) return 'from-yellow-400 to-green-500';
    return 'from-green-500 to-red-600';
  };

  const stats = [
    {
      label: 'Overall Score',
      value: assessmentData.overallScore,
      subtitle: 'out of 9.0',
      icon: BarChart3,
      gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
      change: '+8% vs Q4'
    },
    {
      label: 'Participants',
      value: assessmentData.participants,
      subtitle: `${assessmentData.completionRate} complete`,
      icon: Users,
      gradient: 'from-blue-400 via-blue-500 to-indigo-500',
      change: '+3 participants'
    },
    {
      label: 'Highest Score',
      value: '7.8',
      subtitle: 'Systems & Processes',
      icon: TrendingUp,
      gradient: 'from-teal-400 via-cyan-500 to-blue-500',
      change: '+0.3 improvement'
    },
    {
      label: 'Priority Area',
      value: '5.8',
      subtitle: 'Financial',
      icon: AlertCircle,
      gradient: 'from-green-400 via-green-500 to-red-500',
      change: 'Needs attention'
    },
  ];

  return (
    <div className="relative">
      {/* Parallax Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-emerald-300/20 to-teal-400/20 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
        <div
          className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-gradient-to-tr from-blue-300/20 to-indigo-400/20 rounded-full blur-3xl"
          style={{ transform: `translateY(${-scrollY * 0.15}px)` }}
        />
      </div>

      <div className="space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-blue-50 px-4 py-2 rounded-full border-2 border-emerald-200 shadow-sm mb-4">
                <Sparkles size={16} className="text-emerald-600" />
                <span className="text-xs font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Live Assessment Results
                </span>
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-primary-600 via-secondary-600 to-green-600 bg-clip-text text-transparent mb-2">
                Results & Analytics
              </h1>
              <p className="text-xl text-gray-600 font-medium mb-3">
                {assessmentData.name} • {assessmentData.company}
              </p>
              {/* Simple Guide */}
              <div className="bg-secondary-50 border-l-4 border-secondary-500 rounded-lg p-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-secondary-600" />
                  <p className="text-sm text-secondary-800">
                    <span className="font-semibold">Your Overall Score: {assessmentData.overallScore}/9.0</span> - Scroll down to see scores for each lens and AI-powered insights
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="group flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-200 hover:border-emerald-300 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <Share2 className="w-5 h-5 text-gray-600 group-hover:text-emerald-600 transition-colors" />
                <span className="font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">Share</span>
              </button>
              <button className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Download className="w-5 h-5 text-white" />
                <span className="font-semibold text-white">Export Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats - Vibrant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                <div className="relative">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Stats */}
                  <p className="text-sm font-semibold text-gray-600 mb-2">{stat.label}</p>
                  <p className="text-5xl font-black bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">{stat.subtitle}</p>

                  {/* Change Indicator */}
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${stat.gradient} text-white`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 9 Lenses Breakdown - Interactive Chart */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              9 Lenses Breakdown
            </h2>
            <button className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-blue-50 hover:from-emerald-100 hover:to-blue-100 rounded-xl border-2 border-emerald-200 transition-all duration-300">
              <RefreshCw className="w-4 h-4 text-emerald-600 group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-sm font-bold text-emerald-700">Refresh Data</span>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {['Assets', 'Processes', 'Structures'].map((category, catIndex) => (
              <div key={catIndex} className="text-center">
                <div className="text-sm font-semibold text-gray-600 mb-2">{category}</div>
                <div className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  {(lensScores
                    .filter(l => l.category === category)
                    .reduce((sum, l) => sum + l.score, 0) /
                    lensScores.filter(l => l.category === category).length
                  ).toFixed(1)}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {lensScores.map((lens, index) => {
              const LensIcon = lens.icon;
              const isActive = activeLens === index;

              return (
                <div
                  key={index}
                  onMouseEnter={() => setActiveLens(index)}
                  onMouseLeave={() => setActiveLens(null)}
                  className={`group relative bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 transition-all duration-500 ${
                    isActive ? 'shadow-xl scale-105' : 'shadow-md hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Lens Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${lens.gradient} flex items-center justify-center shadow-md ${
                        isActive ? 'scale-110 rotate-6' : ''
                      } transition-all duration-500`}>
                        <LensIcon className="w-6 h-6 text-white" />
                      </div>

                      {/* Lens Info */}
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-black text-gray-800">{lens.name}</span>
                          <span className="text-xs font-semibold px-3 py-1 bg-white rounded-full text-gray-600 shadow-sm">
                            {lens.category}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {lens.change > 0 ? (
                            <ArrowUp className="w-4 h-4 text-emerald-600" />
                          ) : lens.change < 0 ? (
                            <ArrowDown className="w-4 h-4 text-red-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={`text-sm font-semibold ${
                            lens.change > 0 ? 'text-emerald-600' : lens.change < 0 ? 'text-red-600' : 'text-gray-400'
                          }`}>
                            {lens.change > 0 ? `+${lens.change}%` : lens.change < 0 ? `${lens.change}%` : 'No change'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Score Badge */}
                    <div className={`px-6 py-3 rounded-xl bg-gradient-to-br ${lens.gradient} shadow-lg`}>
                      <span className="text-3xl font-black text-white">{lens.score.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${lens.gradient} rounded-full transition-all duration-1000 ease-out shadow-md`}
                      style={{ width: isActive ? `${(lens.score / 9) * 100}%` : '0%' }}
                    />
                  </div>

                  {/* View Details Arrow */}
                  <ChevronRight className={`absolute top-1/2 right-6 transform -translate-y-1/2 w-6 h-6 text-gray-400 ${
                    isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  } transition-all duration-300`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Insights - Rich Cards */}
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Key Insights & Recommendations
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 hover:-translate-y-4"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${insight.gradient}`} />

                  {/* Content */}
                  <div className="relative p-8 text-white">
                    {/* Type Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm border border-white/40">
                        {insight.type.toUpperCase()}
                      </span>
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-6xl font-black mb-4">{insight.score.toFixed(1)}</div>

                    {/* Title */}
                    <h3 className="text-2xl font-black mb-4 leading-tight">{insight.title}</h3>

                    {/* Description */}
                    <p className="text-white/90 leading-relaxed mb-6">{insight.description}</p>

                    {/* Action Button */}
                    <button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-3 px-6 rounded-xl border-2 border-white/30 hover:border-white/50 transition-all duration-300 flex items-center justify-center space-x-2">
                      <span>View Details</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Help Instructions */}
      <PageInstructions
        title="Understanding Your Dashboard"
        steps={[
          "Review your Overall Score (out of 9.0) at the top - this is the average across all 9 lenses",
          "Check the 4 summary cards showing your overall score, number of participants, highest scoring lens, and priority area",
          "Scroll down to see individual scores for each of the 9 lenses organized by category (Assets, Processes, Structures)",
          "Look for green arrows (↑) showing improvements and red arrows (↓) showing areas that declined",
          "Read the Key Insights section to see AI-generated strengths and opportunities",
          "Click 'View AI Dashboard' to get detailed recommendations and predictive analytics"
        ]}
        tips={[
          "Scores of 7.5+ are excellent (green), 6.5-7.5 are good (blue), 5.5-6.5 need attention (yellow), below 5.5 are critical (red)",
          "Focus on your lowest-scoring lens first - improvements here will have the biggest impact",
          "Compare participant completion rate - higher participation gives more accurate results",
          "Click 'Export Report' to download a PDF summary for sharing with stakeholders",
          "Use the AI Dashboard for personalized action plans and strategic recommendations"
        ]}
      />
    </div>
  );
}

export default Dashboard;
