import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, AlertTriangle } from 'lucide-react';

const StakeholderComparison = ({ data }) => {
  const { groups, data: comparisonData } = data;

  // Find alignment issues (divergence > 2 points)
  const alignmentIssues = comparisonData
    .map(lens => {
      const scores = groups.map(group => lens[group]);
      const max = Math.max(...scores);
      const min = Math.min(...scores);
      const divergence = max - min;

      return {
        lens: lens.lens,
        divergence,
        hasIssue: divergence > 2,
        max,
        min
      };
    })
    .filter(item => item.hasIssue)
    .sort((a, b) => b.divergence - a.divergence);

  return (
    <div>
      {/* Alignment Issues Alert */}
      {alignmentIssues.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-orange-900 mb-2">Alignment Issues Detected</h3>
              <p className="text-orange-800 mb-4">
                The following lenses show significant divergence (&gt;2 points) between stakeholder groups, indicating potential misalignment:
              </p>
              <div className="grid grid-cols-2 gap-4">
                {alignmentIssues.map((issue, idx) => (
                  <div key={idx} className="bg-white rounded p-4 border border-orange-300">
                    <div className="font-semibold text-gray-900 mb-1">{issue.lens}</div>
                    <div className="text-sm text-gray-700">
                      Divergence: <span className="font-bold text-orange-700">{issue.divergence.toFixed(1)}</span> points
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Range: {issue.min.toFixed(1)} - {issue.max.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stakeholder Comparison Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Stakeholder Group Comparison</h2>
        </div>

        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="lens" />
            <YAxis domain={[0, 9]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="Executives" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Managers" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Employees" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Board" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Comparison Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Detailed Score Breakdown</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Lens</th>
                {groups.map(group => (
                  <th key={group} className="text-center py-3 px-4 font-semibold text-gray-700">{group}</th>
                ))}
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Divergence</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((lens, idx) => {
                const scores = groups.map(group => lens[group]);
                const max = Math.max(...scores);
                const min = Math.min(...scores);
                const divergence = max - min;
                const hasIssue = divergence > 2;

                return (
                  <tr
                    key={idx}
                    className={`border-b border-gray-200 ${hasIssue ? 'bg-orange-50' : ''}`}
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">{lens.lens}</td>
                    {groups.map(group => (
                      <td key={group} className="text-center py-3 px-4">
                        <span className={`inline-block px-3 py-1 rounded font-semibold ${
                          lens[group] >= 7
                            ? 'bg-green-100 text-green-700'
                            : lens[group] >= 4
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {lens[group].toFixed(1)}
                        </span>
                      </td>
                    ))}
                    <td className="text-center py-3 px-4">
                      <span className={`inline-block px-3 py-1 rounded font-semibold ${
                        hasIssue
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {divergence.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-3">Alignment Insights</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
            <span>
              <strong>Low divergence (0-1 points)</strong>: Strong alignment across stakeholder groups
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
            <span>
              <strong>Moderate divergence (1-2 points)</strong>: Minor perspective differences, worth monitoring
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
            <span>
              <strong>High divergence (&gt;2 points)</strong>: Significant misalignment requiring attention
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StakeholderComparison;
