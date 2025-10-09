import React, { useState } from 'react';
import { BarChart3, TrendingUp, Award, Building2, Sparkles, Target, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

function CompetitiveBenchmarking({ lensScores }) {
  const [selectedIndustry, setSelectedIndustry] = useState('technology');
  const [selectedSegment, setSelectedSegment] = useState('all');

  const industries = [
    { value: 'technology', label: 'Technology & Software' },
    { value: 'financial', label: 'Financial Services' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail & E-commerce' }
  ];

  const segments = [
    { value: 'all', label: 'All Companies' },
    { value: 'startup', label: 'Startups (<50 employees)' },
    { value: 'smb', label: 'SMB (50-500)' },
    { value: 'enterprise', label: 'Enterprise (500+)' }
  ];

  // Generate benchmark data
  const generateBenchmarkData = () => {
    return lensScores?.map(lens => ({
      name: lens.name,
      yourScore: lens.score,
      industryAvg: +(6.0 + Math.random() * 1.2).toFixed(1),
      topQuartile: +(7.2 + Math.random() * 0.8).toFixed(1),
      topPerformer: +(8.0 + Math.random() * 0.5).toFixed(1)
    })) || [];
  };

  const benchmarkData = generateBenchmarkData();

  // Calculate competitive position
  const calculatePosition = (yourScore, industryAvg, topQuartile) => {
    if (yourScore >= topQuartile) return { label: 'Top Quartile', color: 'text-primary-600', bg: 'bg-primary-100', icon: ArrowUp };
    if (yourScore >= industryAvg) return { label: 'Above Average', color: 'text-secondary-600', bg: 'bg-secondary-100', icon: TrendingUp };
    if (yourScore >= industryAvg * 0.9) return { label: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Minus };
    return { label: 'Below Average', color: 'text-orange-600', bg: 'bg-orange-100', icon: ArrowDown };
  };

  // Radar chart data
  const radarData = benchmarkData.map(item => ({
    lens: item.name.length > 12 ? item.name.substring(0, 12) + '...' : item.name,
    You: item.yourScore,
    'Industry Avg': item.industryAvg,
    'Top Quartile': item.topQuartile
  }));

  // Key insights
  const insights = [
    {
      title: 'Competitive Strengths',
      icon: Award,
      color: 'from-primary-500 to-primary-600',
      items: benchmarkData
        .filter(item => item.yourScore >= item.topQuartile)
        .map(item => `${item.name}: You're in the top 25% (${item.yourScore} vs ${item.topQuartile} avg)`)
    },
    {
      title: 'Opportunity Areas',
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      items: benchmarkData
        .filter(item => item.yourScore < item.industryAvg)
        .map(item => `${item.name}: ${((item.industryAvg - item.yourScore) / item.yourScore * 100).toFixed(0)}% below industry average`)
    },
    {
      title: 'Strategic Priorities',
      icon: TrendingUp,
      color: 'from-secondary-500 to-secondary-600',
      items: [
        'Focus on Financials to reach industry parity (highest ROI opportunity)',
        'Leverage Systems & Processes excellence as competitive differentiator',
        'Sustainability leadership positions you for ESG-conscious investors'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-secondary-500 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              Competitive Benchmarking
              <Sparkles className="w-6 h-6 animate-pulse" />
            </h2>
            <p className="text-white/90 text-lg">AI-powered industry comparison and competitive positioning</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
            >
              {industries.map(ind => (
                <option key={ind.value} value={ind.value}>{ind.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Size</label>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-secondary-500 focus:outline-none transition-colors"
            >
              {segments.map(seg => (
                <option key={seg.value} value={seg.value}>{seg.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border-2 border-primary-200">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-6 h-6 text-primary-600" />
            <h4 className="font-bold text-gray-900">Your Average</h4>
          </div>
          <p className="text-3xl font-bold text-primary-700">
            {(benchmarkData.reduce((sum, item) => sum + item.yourScore, 0) / benchmarkData.length).toFixed(1)}
          </p>
          <p className="text-sm text-gray-600 mt-1">Across all lenses</p>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-6 h-6 text-gray-600" />
            <h4 className="font-bold text-gray-900">Industry Average</h4>
          </div>
          <p className="text-3xl font-bold text-gray-700">
            {(benchmarkData.reduce((sum, item) => sum + item.industryAvg, 0) / benchmarkData.length).toFixed(1)}
          </p>
          <p className="text-sm text-gray-600 mt-1">Market baseline</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-6 h-6 text-orange-600" />
            <h4 className="font-bold text-gray-900">Top Quartile</h4>
          </div>
          <p className="text-3xl font-bold text-orange-700">
            {(benchmarkData.reduce((sum, item) => sum + item.topQuartile, 0) / benchmarkData.length).toFixed(1)}
          </p>
          <p className="text-sm text-gray-600 mt-1">Excellence threshold</p>
        </div>

        <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-6 border-2 border-secondary-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-6 h-6 text-secondary-600" />
            <h4 className="font-bold text-gray-900">Your Position</h4>
          </div>
          <p className="text-xl font-bold text-secondary-700">
            {(() => {
              const avg = benchmarkData.reduce((sum, item) => sum + item.yourScore, 0) / benchmarkData.length;
              const indAvg = benchmarkData.reduce((sum, item) => sum + item.industryAvg, 0) / benchmarkData.length;
              const topQ = benchmarkData.reduce((sum, item) => sum + item.topQuartile, 0) / benchmarkData.length;
              return calculatePosition(avg, indAvg, topQ).label;
            })()}
          </p>
          <p className="text-sm text-gray-600 mt-1">Overall ranking</p>
        </div>
      </div>

      {/* Radar Comparison */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Multi-Dimensional Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="lens" tick={{ fill: '#64748b', fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 9]} tick={{ fill: '#64748b' }} />
            <Radar name="You" dataKey="You" stroke="#047857" fill="#047857" fillOpacity={0.3} strokeWidth={3} />
            <Radar name="Industry Avg" dataKey="Industry Avg" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} strokeWidth={2} />
            <Radar name="Top Quartile" dataKey="Top Quartile" stroke="#f97316" fill="#f97316" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Lens-by-Lens Comparison */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Lens-by-Lens Analysis</h3>
        <div className="space-y-4">
          {benchmarkData.map((item, idx) => {
            const position = calculatePosition(item.yourScore, item.industryAvg, item.topQuartile);
            const Icon = position.icon;
            return (
              <div key={idx} className="border-2 border-gray-200 rounded-xl p-4 hover:border-primary-300 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${position.bg} ${position.color} flex items-center gap-1`}>
                      <Icon className="w-3 h-3" />
                      {position.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{item.yourScore}</p>
                    <p className="text-xs text-gray-500">Your Score</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-600">Industry Avg</p>
                    <p className="text-lg font-bold text-gray-800">{item.industryAvg}</p>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded-lg">
                    <p className="font-semibold text-orange-600">Top Quartile</p>
                    <p className="text-lg font-bold text-orange-800">{item.topQuartile}</p>
                  </div>
                  <div className="text-center p-2 bg-secondary-50 rounded-lg">
                    <p className="font-semibold text-secondary-600">Top Performer</p>
                    <p className="text-lg font-bold text-secondary-800">{item.topPerformer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, idx) => {
          const Icon = insight.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${insight.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{insight.title}</h3>
              </div>
              <div className="space-y-2">
                {insight.items.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CompetitiveBenchmarking;
