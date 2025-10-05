import React from 'react';
import { ChevronRight } from 'lucide-react';

const LensCard = ({ lens, onClick }) => {
  const getScoreColor = (score) => {
    if (score >= 7) return 'bg-green-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreTextColor = (score) => {
    if (score >= 7) return 'text-green-700';
    if (score >= 4) return 'text-yellow-700';
    return 'text-red-700';
  };

  const getScoreBgColor = (score) => {
    if (score >= 7) return 'bg-green-50';
    if (score >= 4) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const getScoreLabel = (score) => {
    if (score >= 7) return 'Strong';
    if (score >= 4) return 'Moderate';
    return 'Needs Attention';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${getScoreColor(lens.score)}`} />
            <h3 className="text-lg font-semibold text-gray-800">{lens.lensName}</h3>
          </div>

          <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getScoreBgColor(lens.score)} ${getScoreTextColor(lens.score)} mb-3`}>
            {getScoreLabel(lens.score)}
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-bold text-gray-900">{lens.score.toFixed(1)}</span>
            <span className="text-sm text-gray-500">/ 9.0</span>
          </div>

          <div className="text-sm text-gray-600">
            {lens.subLensScores.length} sub-lenses assessed
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400 mt-2" />
      </div>
    </div>
  );
};

export default LensCard;
