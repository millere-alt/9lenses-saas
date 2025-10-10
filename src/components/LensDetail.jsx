import React from 'react';
import { ArrowLeft, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const LensDetail = ({ lens, onBack }) => {
  const getScoreColor = (score) => {
    if (score >= 7) return '#10b981';
    if (score >= 4) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 7) return 'Strong';
    if (score >= 4) return 'Moderate';
    return 'Needs Attention';
  };

  const chartData = lens.subLensScores.map(sub => ({
    name: sub.name,
    score: sub.score,
    color: getScoreColor(sub.score)
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{lens.lensName} Lens</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: lens.color }}
                  />
                  <span className="text-gray-600">{getScoreLabel(lens.score)}</span>
                </div>
                <div className="text-gray-400">|</div>
                <div className="text-gray-600">{lens.subLensScores.length} Sub-lenses</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white min-w-[180px]">
              <div className="text-sm opacity-90 mb-1">Overall Score</div>
              <div className="text-5xl font-bold">{lens.score.toFixed(1)}</div>
              <div className="text-sm opacity-75 mt-1">out of 9.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Sub-lens Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Sub-lens Performance</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" domain={[0, 9]} />
              <YAxis type="category" dataKey="name" width={200} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value.toFixed(1)} / 9`, 'Score']}
              />
              <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sub-lenses Detail Cards */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Detailed Breakdown</h2>
          <div className="grid grid-cols-2 gap-6">
            {lens.subLensScores.map((subLens, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{subLens.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-gray-900">{subLens.score.toFixed(1)}</span>
                      <span className="text-gray-500">/ 9.0</span>
                    </div>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 mt-2"
                    style={{ backgroundColor: getScoreColor(subLens.score) }}
                  />
                </div>

                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  subLens.score >= 7
                    ? 'bg-green-100 text-green-700'
                    : subLens.score >= 4
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {getScoreLabel(subLens.score)}
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(subLens.score / 9) * 100}%`,
                        backgroundColor: getScoreColor(subLens.score)
                      }}
                    />
                  </div>
                </div>

                {subLens.score < 6 && (
                  <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      This area requires attention to improve overall {lens.lensName} lens performance.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Suggestions */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Next Steps for {lens.lensName}</h3>
              <p className="text-gray-700 mb-4">
                Focus on sub-lenses scoring below 6.0 for the greatest impact on overall performance.
              </p>
              <ul className="space-y-2">
                {lens.subLensScores
                  .filter(sub => sub.score < 6)
                  .sort((a, b) => a.score - b.score)
                  .map((sub, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-800">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span className="font-medium">{sub.name}</span>
                      <span className="text-gray-600">({sub.score.toFixed(1)})</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LensDetail;
