import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CustomRadarChart = ({ data, onLensClick }) => {
  const radarData = data.map(lens => ({
    lens: lens.lensName,
    score: lens.score,
    fullMark: 9
  }));

  return (
    <ResponsiveContainer width="100%" height={500}>
      <RadarChart data={radarData}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="lens"
          tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }}
          onClick={(data) => onLensClick && onLensClick(data)}
          style={{ cursor: 'pointer' }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 9]}
          tick={{ fill: '#6b7280', fontSize: 10 }}
          tickCount={10}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.5}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px 12px'
          }}
          formatter={(value) => [`${value.toFixed(1)} / 9`, 'Score']}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default CustomRadarChart;
