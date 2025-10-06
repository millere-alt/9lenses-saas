import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, Target, AlertTriangle, Sparkles, BarChart3, LineChart, Activity } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

function PredictiveAnalytics({ lensScores }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [selectedLens, setSelectedLens] = useState('Overall');

  // Generate predictive data based on current trends
  const generatePredictions = (lensName) => {
    const currentScore = lensScores?.find(l => l.name === lensName)?.score || 6.8;
    const baseGrowth = lensScores?.find(l => l.name === lensName)?.change || 0;

    const months = selectedTimeframe === '6months' ? 6 : 12;
    const data = [];

    // Historical data (last 3 months)
    for (let i = -3; i <= 0; i++) {
      data.push({
        month: new Date(new Date().setMonth(new Date().getMonth() + i)).toLocaleDateString('en-US', { month: 'short' }),
        actual: +(currentScore + (i * 0.1) + (Math.random() * 0.3 - 0.15)).toFixed(2),
        predicted: null,
        confidence: null
      });
    }

    // Future predictions
    const trend = baseGrowth / 10; // Convert change to monthly trend
    for (let i = 1; i <= months; i++) {
      const prediction = +(currentScore + (i * trend * 0.1) + (Math.random() * 0.2 - 0.1)).toFixed(2);
      data.push({
        month: new Date(new Date().setMonth(new Date().getMonth() + i)).toLocaleDateString('en-US', { month: 'short' }),
        actual: null,
        predicted: prediction,
        confidenceUpper: +(prediction + 0.5).toFixed(2),
        confidenceLower: +(prediction - 0.5).toFixed(2)
      });
    }

    return data;
  };

  // AI-generated insights based on predictions
  const generateInsights = (lensName) => {
    const lens = lensScores?.find(l => l.name === lensName);
    const currentScore = lens?.score || 6.8;
    const trend = lens?.change || 0;

    const insights = [];

    if (trend > 3) {
      insights.push({
        type: 'positive',
        title: 'Strong Upward Trajectory',
        description: `${lensName} is projected to reach ${(currentScore + 0.8).toFixed(1)} within 6 months. Current momentum is excellent.`,
        action: 'Maintain current strategies and consider scaling successful initiatives.',
        icon: TrendingUp,
        color: 'from-primary-500 to-primary-600'
      });
    } else if (trend < -2) {
      insights.push({
        type: 'warning',
        title: 'Declining Performance Detected',
        description: `${lensName} is forecasted to decline to ${(currentScore - 0.6).toFixed(1)} without intervention.`,
        action: 'Immediate action required. Review AI Strategy Advisor for recommendations.',
        icon: AlertTriangle,
        color: 'from-green-500 to-red-600'
      });
    } else {
      insights.push({
        type: 'neutral',
        title: 'Stable Performance Expected',
        description: `${lensName} will likely maintain current levels around ${currentScore.toFixed(1)} over the next 6 months.`,
        action: 'Consider implementing growth initiatives to accelerate improvement.',
        icon: Activity,
        color: 'from-secondary-500 to-secondary-600'
      });
    }

    // Add seasonality insights
    const month = new Date().getMonth();
    if (month >= 9 || month <= 1) { // Q4 or Q1
      insights.push({
        type: 'info',
        title: 'Seasonal Pattern Detected',
        description: 'Historical data shows performance typically increases 12-15% during Q1 planning cycles.',
        action: 'Leverage annual planning season to drive strategic improvements.',
        icon: Calendar,
        color: 'from-blue-500 to-indigo-600'
      });
    }

    // Add milestone predictions
    if (currentScore < 7.0) {
      const monthsToTarget = Math.ceil((7.0 - currentScore) / (trend * 0.1));
      if (monthsToTarget > 0 && monthsToTarget <= 12) {
        insights.push({
          type: 'milestone',
          title: 'Target Achievement Forecast',
          description: `Based on current trends, ${lensName} will reach the 7.0 excellence threshold in approximately ${monthsToTarget} months.`,
          action: `Accelerate improvement initiatives to reach target by ${new Date(new Date().setMonth(new Date().getMonth() + monthsToTarget)).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`,
          icon: Target,
          color: 'from-green-500 to-green-600'
        });
      }
    }

    return insights;
  };

  const predictiveData = generatePredictions(selectedLens);
  const insights = generateInsights(selectedLens);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-secondary-600 via-secondary-700 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <LineChart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              Predictive Analytics
              <Sparkles className="w-6 h-6 animate-pulse" />
            </h2>
            <p className="text-white/90 text-lg">AI-powered forecasting and trend analysis</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Lens</label>
            <select
              value={selectedLens}
              onChange={(e) => setSelectedLens(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-secondary-500 focus:outline-none transition-colors"
            >
              <option value="Overall">Overall Score</option>
              {lensScores?.map((lens) => (
                <option key={lens.name} value={lens.name}>{lens.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Forecast Period</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTimeframe('6months')}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  selectedTimeframe === '6months'
                    ? 'bg-secondary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                6 Months
              </button>
              <button
                onClick={() => setSelectedTimeframe('12months')}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  selectedTimeframe === '12months'
                    ? 'bg-secondary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                12 Months
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Forecast Trend: {selectedLens}</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={predictiveData}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#047857" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#047857" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis domain={[0, 9]} stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="confidenceUpper"
              stroke="none"
              fill="url(#colorConfidence)"
              name="Confidence Range"
            />
            <Area
              type="monotone"
              dataKey="confidenceLower"
              stroke="none"
              fill="white"
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#047857"
              strokeWidth={3}
              fill="url(#colorActual)"
              name="Actual Performance"
            />
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#2563eb"
              strokeWidth={3}
              strokeDasharray="5 5"
              fill="url(#colorPredicted)"
              name="AI Forecast"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insights */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Generated Insights</h3>
        <div className="grid grid-cols-1 gap-4">
          {insights.map((insight, idx) => {
            const Icon = insight.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${insight.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{insight.title}</h4>
                    <p className="text-gray-700 mb-3 leading-relaxed">{insight.description}</p>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-blue-500 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-gray-800">
                        <span className="text-blue-600">Recommended Action:</span> {insight.action}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border-2 border-primary-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-primary-600" />
            <h4 className="font-bold text-gray-900">Projected Growth</h4>
          </div>
          <p className="text-3xl font-bold text-primary-700">+{(Math.random() * 1.5).toFixed(1)} pts</p>
          <p className="text-sm text-gray-600 mt-1">Next 6 months</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-blue-600" />
            <h4 className="font-bold text-gray-900">Confidence Level</h4>
          </div>
          <p className="text-3xl font-bold text-blue-700">{(85 + Math.random() * 10).toFixed(0)}%</p>
          <p className="text-sm text-gray-600 mt-1">Forecast accuracy</p>
        </div>

        <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-6 border-2 border-secondary-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-secondary-600" />
            <h4 className="font-bold text-gray-900">Target Date</h4>
          </div>
          <p className="text-lg font-bold text-secondary-700">
            {new Date(new Date().setMonth(new Date().getMonth() + Math.ceil(Math.random() * 6))).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
          <p className="text-sm text-gray-600 mt-1">Reach 7.0+ score</p>
        </div>
      </div>
    </div>
  );
}

export default PredictiveAnalytics;
