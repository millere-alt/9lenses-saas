import React, { useState } from 'react';
import { Award, Star, CheckCircle, Info, Users, TrendingUp } from 'lucide-react';
import PageInstructions from './PageInstructions';

const ExpertIdentificationSystem = ({ participant, onSave }) => {
  const [selectedExpertise, setSelectedExpertise] = useState({});
  const [expertiseLevel, setExpertiseLevel] = useState({});

  const lensesWithSublenses = [
    {
      lens: 'Market',
      icon: '📊',
      category: 'Assets',
      color: 'primary',
      sublenses: [
        { id: 'market-characteristics', name: 'Market Characteristics', description: 'Market size, growth, trends, dynamics' },
        { id: 'competition', name: 'Competition', description: 'Competitive landscape, positioning, differentiation' },
        { id: 'customer', name: 'Customer', description: 'Customer segments, needs, behaviors, satisfaction' },
        { id: 'positioning', name: 'Positioning', description: 'Brand positioning, value proposition' },
        { id: 'timing', name: 'Timing', description: 'Market timing, windows of opportunity' }
      ]
    },
    {
      lens: 'People',
      icon: '👥',
      category: 'Assets',
      color: 'primary',
      sublenses: [
        { id: 'employee-characteristics', name: 'Employee Characteristics', description: 'Skills, capabilities, demographics' },
        { id: 'culture', name: 'Culture', description: 'Values, norms, behaviors, employee engagement' },
        { id: 'leadership', name: 'Leadership', description: 'Leadership quality, succession planning' },
        { id: 'organizational-design', name: 'Organizational Design', description: 'Structure, roles, reporting lines' }
      ]
    },
    {
      lens: 'Finance',
      icon: '💰',
      category: 'Assets',
      color: 'primary',
      sublenses: [
        { id: 'accounting', name: 'Accounting', description: 'Financial reporting, controls, compliance' },
        { id: 'capital-structure', name: 'Capital Structure', description: 'Debt, equity, funding sources' },
        { id: 'financial-model', name: 'Financial Model', description: 'Business model, unit economics, profitability' },
        { id: 'forecasting', name: 'Forecasting', description: 'Financial planning, budgeting, projections' },
        { id: 'historical-performance', name: 'Historical Performance', description: 'Past financial results, trends' }
      ]
    },
    {
      lens: 'Strategy',
      icon: '💡',
      category: 'Processes',
      color: 'orange',
      sublenses: [
        { id: 'delivery-outlets', name: 'Delivery Outlets', description: 'Channels, distribution, partnerships' },
        { id: 'general-strategy', name: 'General Strategy', description: 'Strategic direction, objectives, priorities' },
        { id: 'offerings', name: 'Offerings', description: 'Products, services, solutions' },
        { id: 'pricing', name: 'Pricing', description: 'Pricing strategy, models, optimization' },
        { id: 'promotion', name: 'Promotion', description: 'Marketing, advertising, brand building' }
      ]
    },
    {
      lens: 'Operations',
      icon: '⚙️',
      category: 'Processes',
      color: 'orange',
      sublenses: [
        { id: 'general-operations', name: 'General Operations', description: 'Day-to-day operations, efficiency' },
        { id: 'infrastructure', name: 'Infrastructure', description: 'Facilities, equipment, technology' },
        { id: 'processes', name: 'Processes', description: 'Workflows, procedures, documentation' },
        { id: 'systems', name: 'Systems', description: 'Software, tools, automation' }
      ]
    },
    {
      lens: 'Execution',
      icon: '📈',
      category: 'Processes',
      color: 'orange',
      sublenses: [
        { id: 'measurement', name: 'Measurement', description: 'KPIs, metrics, dashboards' },
        { id: 'performance-tracking', name: 'Performance Tracking', description: 'Monitoring, reporting, analysis' }
      ]
    },
    {
      lens: 'Expectation',
      icon: '💬',
      category: 'Structures',
      color: 'secondary',
      sublenses: [
        { id: 'stakeholder-management', name: 'Stakeholder Management', description: 'Stakeholder identification, engagement' },
        { id: 'communication', name: 'Communication', description: 'Communication strategies, channels, effectiveness' },
        { id: 'alignment', name: 'Alignment', description: 'Expectation setting, consensus building' }
      ]
    },
    {
      lens: 'Governance',
      icon: '🛡️',
      category: 'Structures',
      color: 'secondary',
      sublenses: [
        { id: 'principles', name: 'Principles', description: 'Governance principles, ethics, compliance' },
        { id: 'structure', name: 'Structure', description: 'Board structure, committees, oversight' },
        { id: 'practices', name: 'Practices', description: 'Governance practices, policies, procedures' }
      ]
    },
    {
      lens: 'Entity',
      icon: '🏢',
      category: 'Structures',
      color: 'secondary',
      sublenses: [
        { id: 'entity-characteristics', name: 'Entity Characteristics', description: 'Legal structure, incorporation, registration' },
        { id: 'contracts', name: 'Contracts', description: 'Contract management, key agreements' },
        { id: 'intellectual-property', name: 'Intellectual Property', description: 'IP protection, patents, trademarks' },
        { id: 'liability-risk', name: 'Liability and Risk', description: 'Risk management, insurance, liability protection' }
      ]
    }
  ];

  const expertiseLevels = [
    { value: 'expert', label: 'Expert', description: 'Deep expertise, 5+ years experience', weight: 1.5, icon: '🌟' },
    { value: 'proficient', label: 'Proficient', description: 'Strong knowledge, 2-5 years experience', weight: 1.25, icon: '⭐' },
    { value: 'familiar', label: 'Familiar', description: 'Working knowledge, 1-2 years experience', weight: 1.1, icon: '✨' },
    { value: 'basic', label: 'Basic', description: 'Basic understanding, learning', weight: 1.0, icon: '📚' }
  ];

  const toggleExpertise = (lensId, sublensId) => {
    const key = `${lensId}-${sublensId}`;
    setSelectedExpertise(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    if (!selectedExpertise[key]) {
      // Default to proficient level
      setExpertiseLevel(prev => ({
        ...prev,
        [key]: 'proficient'
      }));
    }
  };

  const setLevel = (lensId, sublensId, level) => {
    const key = `${lensId}-${sublensId}`;
    setExpertiseLevel(prev => ({
      ...prev,
      [key]: level
    }));
  };

  const getSelectedCount = () => {
    return Object.values(selectedExpertise).filter(Boolean).length;
  };

  const handleSave = () => {
    const expertiseProfile = Object.entries(selectedExpertise)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => {
        const [lensId, sublensId] = key.split('-', 2);
        return {
          lens: lensId,
          sublens: sublensId,
          level: expertiseLevel[key] || 'proficient',
          weight: expertiseLevels.find(l => l.value === (expertiseLevel[key] || 'proficient'))?.weight || 1.25
        };
      });

    if (onSave) {
      onSave(expertiseProfile);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-orange-600 bg-clip-text text-transparent mb-3">
          Identify Your Expertise
        </h1>
        <p className="text-lg text-neutral-600 mb-4">
          Help us understand where your expertise lies - your input will be weighted more heavily in these areas
        </p>

        {/* Quick Guide */}
        <div className="bg-gradient-to-r from-orange-50 to-primary-50 border-l-4 border-orange-500 rounded-lg p-4 max-w-4xl">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-orange-900 mb-1">Why This Matters:</h3>
              <p className="text-sm text-orange-800">
                <span className="font-semibold">Expert opinions are weighted more heavily!</span> If you're an expert in Finance, your Finance scores will count 1.5x more than non-experts. This ensures accurate, expertise-driven assessments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-600">Areas of Expertise Selected</p>
              <p className="text-4xl font-bold text-neutral-900">{getSelectedCount()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600 mb-2">Recommended: 2-4 areas</p>
            <p className="text-xs text-neutral-500">Select where you have the most experience</p>
          </div>
        </div>
      </div>

      {/* Expertise Level Guide */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {expertiseLevels.map(level => (
          <div key={level.value} className="bg-white rounded-xl p-4 shadow border-2 border-neutral-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{level.icon}</span>
              <div>
                <h4 className="font-bold text-neutral-900">{level.label}</h4>
                <p className="text-xs text-neutral-500">{level.weight}x weight</p>
              </div>
            </div>
            <p className="text-xs text-neutral-600">{level.description}</p>
          </div>
        ))}
      </div>

      {/* Lenses with Sublenses */}
      <div className="space-y-6">
        {lensesWithSublenses.map(lens => (
          <div key={lens.lens} className={`bg-white rounded-2xl shadow-lg border-2 border-${lens.color}-200 overflow-hidden`}>
            {/* Lens Header */}
            <div className={`bg-gradient-to-r from-${lens.color}-50 to-${lens.color}-100 p-6 border-b-2 border-${lens.color}-200`}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br from-${lens.color}-500 to-${lens.color}-600 rounded-xl flex items-center justify-center shadow-lg text-2xl`}>
                  {lens.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900">{lens.lens}</h3>
                  <p className="text-sm text-neutral-600">{lens.category} • {lens.sublenses.length} sublenses</p>
                </div>
              </div>
            </div>

            {/* Sublenses */}
            <div className="p-6 grid md:grid-cols-2 gap-4">
              {lens.sublenses.map(sublens => {
                const key = `${lens.lens}-${sublens.id}`;
                const isSelected = selectedExpertise[key];
                const level = expertiseLevel[key] || 'proficient';

                return (
                  <div
                    key={sublens.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `border-${lens.color}-500 bg-${lens.color}-50 shadow-md`
                        : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <button
                        onClick={() => toggleExpertise(lens.lens, sublens.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? `border-${lens.color}-600 bg-${lens.color}-600`
                            : 'border-neutral-300 bg-white'
                        }`}
                      >
                        {isSelected && <CheckCircle className="w-4 h-4 text-white" fill="currentColor" />}
                      </button>
                      <div className="flex-1">
                        <h4 className="font-bold text-neutral-900 mb-1">{sublens.name}</h4>
                        <p className="text-xs text-neutral-600">{sublens.description}</p>
                      </div>
                    </div>

                    {/* Expertise Level Selector */}
                    {isSelected && (
                      <div className="ml-9 pt-3 border-t border-neutral-200">
                        <p className="text-xs font-semibold text-neutral-600 mb-2">Your expertise level:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {expertiseLevels.map(lvl => (
                            <button
                              key={lvl.value}
                              onClick={() => setLevel(lens.lens, sublens.id, lvl.value)}
                              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                level === lvl.value
                                  ? `bg-${lens.color}-600 text-white shadow-md`
                                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                              }`}
                            >
                              {lvl.icon} {lvl.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4 pt-6 border-t-2 border-neutral-200">
        <button
          onClick={handleSave}
          disabled={getSelectedCount() === 0}
          className={`px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-all flex items-center gap-3 ${
            getSelectedCount() > 0
              ? 'bg-gradient-to-r from-primary-600 via-secondary-600 to-orange-600 text-white hover:shadow-2xl hover:scale-105'
              : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
          }`}
        >
          <Award className="w-6 h-6" />
          Save Expertise Profile ({getSelectedCount()} areas)
        </button>
      </div>

      {/* Help Instructions */}
      <PageInstructions
        title="Expertise Identification Guide"
        steps={[
          "Review all 9 lenses and their sublenses",
          "Select the specific sublenses where you have expertise or deep experience",
          "For each selected area, choose your expertise level (Expert, Proficient, Familiar, or Basic)",
          "Expert level (🌟) weights your input 1.5x, Proficient (⭐) 1.25x, Familiar (✨) 1.1x",
          "Aim to select 2-4 areas where you're truly an expert - quality over quantity",
          "Click 'Save Expertise Profile' when finished"
        ]}
        tips={[
          "Be honest about your expertise level - accurate weighting ensures better assessment results",
          "Expert = 5+ years of deep experience, not just familiarity",
          "You can select sublenses across multiple lenses (e.g., be a Finance expert AND Strategy expert)",
          "Your expertise profile is private and only used for weighting your responses",
          "Non-experts still provide valuable input - all perspectives matter!",
          "You can update your expertise profile anytime"
        ]}
      />
    </div>
  );
};

export default ExpertIdentificationSystem;
