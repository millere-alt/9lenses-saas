import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TrendAnalysis = ({ data }) => {
  // Calculate trends
  const calculateTrend = (lensName) => {
    const firstScore = data[0][lensName];
    const lastScore = data[data.length - 1][lensName];
    const change = lastScore - firstScore;
    const percentChange = ((change / firstScore) * 100).toFixed(1);

    return {
      change: change.toFixed(1),
      percentChange,
      direction: change > 0.3 ? 'up' : change < -0.3 ? 'down' : 'stable'
    };
  };

  const lenses = ['Market', 'People', 'Financial', 'Strategy', 'Operations', 'Execution', 'Expectations', 'Governance', 'Entity'];
  const trends = lenses.map(lens => ({
    name: lens,
    ...calculateTrend(lens),
    currentScore: data[data.length - 1][lens]
  }));

  const improvingLenses = trends.filter(t => t.direction === 'up').sort((a, b) => parseFloat(b.change) - parseFloat(a.change));
  const decliningLenses = trends.filter(t => t.direction === 'down').sort((a, b) => parseFloat(a.change) - parseFloat(b.change));

  return (
    <div>
      {/* Trend Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-bold text-green-900">Improving</h3>
          </div>
          <div className="text-3xl font-bold text-green-700 mb-2">{improvingLenses.length}</div>
          <div className="text-sm text-green-700">lenses showing improvement</div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Minus className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-bold text-gray-900">Stable</h3>
          </div>
          <div className="text-3xl font-bold text-gray-700 mb-2">
            {trends.filter(t => t.direction === 'stable').length}
          </div>
          <div className="text-sm text-gray-700">lenses remaining stable</div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-bold text-red-900">Declining</h3>
          </div>
          <div className="text-3xl font-bold text-red-700 mb-2">{decliningLenses.length}</div>
          <div className="text-sm text-red-700">lenses showing decline</div>
        </div>
      </div>

      {/* Historical Trend Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Historical Trend Analysis</h2>
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="period" />
            <YAxis domain={[0, 9]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="Market" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="People" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Financial" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Strategy" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Operations" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Execution" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Expectations" stroke="#84cc16" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Governance" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Entity" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Improving Lenses */}
      {improvingLenses.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Improving Lenses</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {improvingLenses.map((lens, idx) => (
              <div key={idx} className="border border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{lens.name}</h3>
                    <div className="text-sm text-gray-600">Current: {lens.currentScore.toFixed(1)}</div>
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-green-700">+{lens.change}</span>
                  <span className="text-sm text-green-600">({lens.percentChange}%)</span>
                </div>

                <div className="mt-3 w-full bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((parseFloat(lens.change) / 3) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Declining Lenses */}
      {decliningLenses.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingDown className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-800">Areas Requiring Attention</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {decliningLenses.map((lens, idx) => (
              <div key={idx} className="border border-red-200 bg-red-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{lens.name}</h3>
                    <div className="text-sm text-gray-600">Current: {lens.currentScore.toFixed(1)}</div>
                  </div>
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-red-700">{lens.change}</span>
                  <span className="text-sm text-red-600">({lens.percentChange}%)</span>
                </div>

                <div className="mt-3 p-3 bg-red-100 rounded text-sm text-red-800">
                  This lens has declined and requires immediate attention to reverse the trend.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-3">Trend Insights</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
            <span>
              Tracking trends over multiple assessment periods helps identify what's working and what needs adjustment.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
            <span>
              Declining lenses should be prioritized for action planning and resource allocation.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
            <span>
              Improving lenses indicate successful strategies that can be applied to other areas.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TrendAnalysis;
