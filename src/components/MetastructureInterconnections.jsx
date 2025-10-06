import React, { useState, useMemo } from 'react';
import { Network, TrendingUp, Zap, Target, AlertTriangle, ArrowRight, Info } from 'lucide-react';
import { LensInterconnectionMatrix, CrossLensImpactCalculator, MetastructureOptimizer } from '../engine/MetastructureEngine';

const MetastructureInterconnections = ({ lensScores = [] }) => {
  const [selectedLens, setSelectedLens] = useState(null);
  const [simulationDelta, setSimulationDelta] = useState(1.0);
  const [showImpacts, setShowImpacts] = useState(false);

  // Convert lensScores array to object for easier lookup
  const scoresMap = useMemo(() => {
    const map = {};
    lensScores.forEach(lens => {
      map[lens.name] = lens.score;
    });
    return map;
  }, [lensScores]);

  // All 9 lenses in the system
  const allLenses = [
    'Market', 'People', 'Finance', 'Strategy',
    'Operations', 'Execution', 'Expectation',
    'Governance', 'Entity'
  ];

  // Calculate cross-lens impacts when a lens changes
  const calculateImpacts = (sourceLens, delta) => {
    const impacts = [];
    const sourceScore = scoresMap[sourceLens] || 5.0;

    allLenses.forEach(targetLens => {
      if (targetLens !== sourceLens) {
        const impact = CrossLensImpactCalculator.calculateImpact(
          sourceLens,
          targetLens,
          sourceScore,
          delta
        );
        impacts.push({
          lens: targetLens,
          impact: impact,
          currentScore: scoresMap[targetLens] || 5.0,
          projectedScore: Math.min(9, Math.max(1, (scoresMap[targetLens] || 5.0) + impact))
        });
      }
    });

    return impacts.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  };

  // Get optimal improvement sequence
  const optimalPath = useMemo(() => {
    if (Object.keys(scoresMap).length === 0) return [];
    return MetastructureOptimizer.findOptimalImprovementPath(scoresMap, 5);
  }, [scoresMap]);

  // Get color for connection strength
  const getConnectionColor = (strength) => {
    if (strength >= 0.8) return 'bg-primary-600';
    if (strength >= 0.6) return 'bg-primary-500';
    if (strength >= 0.4) return 'bg-blue-500';
    if (strength >= 0.2) return 'bg-secondary-400';
    return 'bg-neutral-300';
  };

  // Get color for impact
  const getImpactColor = (impact) => {
    const absImpact = Math.abs(impact);
    if (absImpact >= 0.5) return impact > 0 ? 'text-primary-600' : 'text-red-600';
    if (absImpact >= 0.3) return impact > 0 ? 'text-primary-500' : 'text-blue-600';
    return 'text-neutral-500';
  };

  // Handle lens selection and simulation
  const handleLensClick = (lens) => {
    setSelectedLens(lens);
    setShowImpacts(true);
  };

  const impacts = selectedLens ? calculateImpacts(selectedLens, simulationDelta) : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-secondary-600 to-green-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Network className="w-8 h-8" />
          <h2 className="text-3xl font-display font-bold">Metastructure Interconnections</h2>
        </div>
        <p className="text-white/90 text-lg max-w-3xl">
          Explore the interconnected relationships between all 9 lenses using our patented mathematical framework.
          Visualize how improvements in one area create ripple effects across your entire organization.
        </p>
      </div>

      {/* Interconnection Matrix Heatmap */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Network className="w-6 h-6 text-primary-600" />
          <h3 className="text-2xl font-display font-bold text-neutral-900">
            Lens Interconnection Matrix
          </h3>
        </div>

        <div className="mb-6 p-4 bg-secondary-50 rounded-lg border-l-4 border-secondary-500">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-secondary-600 mt-0.5" />
            <p className="text-sm text-neutral-700">
              This matrix shows the correlation strength between each pair of lenses.
              Darker colors indicate stronger mathematical connections. Click any lens to simulate improvements.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-xs font-semibold text-neutral-600 border border-neutral-200"></th>
                {allLenses.map(lens => (
                  <th key={lens} className="p-2 text-xs font-semibold text-neutral-600 border border-neutral-200 transform -rotate-45 h-24">
                    <div className="w-20">{lens}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allLenses.map(rowLens => (
                <tr key={rowLens}>
                  <td className="p-2 text-xs font-semibold text-neutral-700 border border-neutral-200 whitespace-nowrap">
                    {rowLens}
                  </td>
                  {allLenses.map(colLens => {
                    const strength = LensInterconnectionMatrix[rowLens]?.[colLens] || 0;
                    const isSelected = selectedLens === rowLens || selectedLens === colLens;
                    return (
                      <td
                        key={colLens}
                        className={`p-2 border border-neutral-200 text-center cursor-pointer transition-all ${
                          isSelected ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => handleLensClick(rowLens)}
                      >
                        <div className={`w-12 h-12 mx-auto rounded ${getConnectionColor(strength)} flex items-center justify-center`}>
                          <span className="text-xs font-semibold text-white">
                            {strength.toFixed(2)}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 justify-center flex-wrap">
          <span className="text-sm font-medium text-neutral-600">Connection Strength:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary-600"></div>
            <span className="text-xs text-neutral-600">Very Strong (0.8+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary-500"></div>
            <span className="text-xs text-neutral-600">Strong (0.6-0.8)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span className="text-xs text-neutral-600">Moderate (0.4-0.6)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-secondary-400"></div>
            <span className="text-xs text-neutral-600">Weak (0.2-0.4)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-neutral-300"></div>
            <span className="text-xs text-neutral-600">Minimal (0.0-0.2)</span>
          </div>
        </div>
      </div>

      {/* Impact Simulator */}
      {showImpacts && selectedLens && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-display font-bold text-neutral-900">
              Cross-Lens Impact Simulation
            </h3>
          </div>

          <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-primary-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-neutral-600 mb-1">Selected Lens</p>
                <p className="text-2xl font-display font-bold text-neutral-900">{selectedLens}</p>
                <p className="text-sm text-neutral-600 mt-1">
                  Current Score: <span className="font-semibold">{(scoresMap[selectedLens] || 5.0).toFixed(1)}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-neutral-600 mb-2">Improvement Amount</p>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={simulationDelta}
                    onChange={(e) => setSimulationDelta(parseFloat(e.target.value))}
                    className="w-40"
                  />
                  <span className="text-2xl font-bold text-blue-600">+{simulationDelta.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-neutral-700 mb-4">Projected Ripple Effects Across All Lenses:</h4>
            {impacts.map(({ lens, impact, currentScore, projectedScore }) => (
              <div key={lens} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-32">
                    <p className="font-semibold text-neutral-900">{lens}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-neutral-600">
                        Current: <span className="font-semibold">{currentScore.toFixed(2)}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400" />
                      <div className="text-sm text-neutral-900">
                        Projected: <span className="font-bold">{projectedScore.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-right min-w-24 font-bold text-lg ${getImpactColor(impact)}`}>
                    {impact > 0 ? '+' : ''}{impact.toFixed(3)}
                  </div>
                </div>
                <div className="ml-4">
                  {Math.abs(impact) >= 0.5 ? (
                    <AlertTriangle className="w-5 h-5 text-blue-500" />
                  ) : Math.abs(impact) >= 0.3 ? (
                    <TrendingUp className={`w-5 h-5 ${impact > 0 ? 'text-primary-500' : 'text-blue-500'}`} />
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-secondary-50 rounded-lg border-l-4 border-secondary-500">
            <p className="text-sm text-neutral-700">
              <span className="font-semibold">Patent-Based Calculation:</span> Impact = ConnectionStrength × ΔScore × (1 - SourceScore/9)
              <br />
              <span className="text-xs text-neutral-600 mt-1 block">
                US Patent 9,489,419 B2 - System and Method for Optimizing Business Performance with Automated Social Discovery
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Optimal Improvement Path */}
      {optimalPath.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-primary-600" />
            <h3 className="text-2xl font-display font-bold text-neutral-900">
              Optimal Improvement Sequence
            </h3>
          </div>

          <div className="mb-6 p-4 bg-primary-50 rounded-lg border-l-4 border-primary-500">
            <p className="text-sm text-neutral-700">
              Based on your current scores and the metastructure interconnections,
              this is the mathematically optimal sequence to maximize organizational impact.
            </p>
          </div>

          <div className="space-y-4">
            {optimalPath.map((step, index) => (
              <div key={index} className="relative">
                {index < optimalPath.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-primary-400 to-green-400"></div>
                )}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1 p-6 bg-gradient-to-r from-neutral-50 to-white rounded-xl border border-neutral-200 hover:border-primary-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-display font-bold text-neutral-900">{step.lens}</h4>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-neutral-600">
                          Current: <span className="font-semibold">{step.currentScore.toFixed(1)}</span>
                        </div>
                        <div className="text-sm text-primary-600">
                          ROI Score: <span className="font-bold">{step.impactScore.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600">
                      {step.reason}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary-500" />
                      <span className="text-xs font-medium text-primary-600">
                        Estimated Organization-Wide Impact: {(step.impactScore * 1.5).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-primary-600 via-secondary-600 to-green-600 rounded-xl text-white">
            <h4 className="font-display font-bold text-xl mb-3">Strategic Implementation Roadmap</h4>
            <p className="text-white/90 text-sm mb-4">
              Following this sequence leverages the metastructure's interconnections to create
              cascading improvements. Each step amplifies the next through cross-lens synergies.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Info className="w-4 h-4" />
              <span className="text-white/80">
                Recommended timeline: {optimalPath.length * 30} days ({optimalPath.length} phases × 30 days each)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetastructureInterconnections;
