import React, { useState, useEffect } from 'react';
import { Lightbulb, Edit2, Check, X, Target, Compass, TrendingUp } from 'lucide-react';

const CompanyStrategy = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [strategy, setStrategy] = useState({
    vision: '',
    mission: '',
    objectives: ''
  });

  const [editedStrategy, setEditedStrategy] = useState(strategy);

  // Load strategy from localStorage on mount
  useEffect(() => {
    const savedStrategy = localStorage.getItem('companyStrategy');
    if (savedStrategy) {
      const parsed = JSON.parse(savedStrategy);
      setStrategy(parsed);
      setEditedStrategy(parsed);
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedStrategy(strategy);
  };

  const handleSave = () => {
    setStrategy(editedStrategy);
    localStorage.setItem('companyStrategy', JSON.stringify(editedStrategy));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedStrategy(strategy);
    setIsEditing(false);
  };

  const hasStrategy = strategy.vision || strategy.mission || strategy.objectives;

  return (
    <section className="max-w-7xl mx-auto px-6">
      {!hasStrategy && !isEditing ? (
        // Empty state - show prompt to add strategy
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-lg p-12 border border-gray-200 shadow-sm">
            <Lightbulb className="w-16 h-16 mx-auto mb-6 text-salesforce-blue" />
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Set Your Strategic Direction</h3>
            <p className="text-gray-600 mb-8 text-base max-w-2xl mx-auto">
              Define your company's vision, mission, and objectives to align your team and guide decision-making across all 9 Vectors.
            </p>
            <button
              onClick={handleEdit}
              className="px-8 py-3 bg-salesforce-blue text-white rounded-lg font-semibold hover:bg-salesforce-blue-dark transition-all shadow-sm flex items-center gap-2 mx-auto"
            >
              <Edit2 className="w-5 h-5" />
              Add Company Strategy
            </button>
          </div>
        </div>
      ) : isEditing ? (
        // Edit mode
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
            <div className="space-y-6">
              {/* Vision */}
              <div>
                <label className="flex items-center gap-2 text-base font-bold text-gray-900 mb-3">
                  <Compass className="w-5 h-5 text-salesforce-blue" />
                  Vision
                </label>
                <textarea
                  value={editedStrategy.vision}
                  onChange={(e) => setEditedStrategy({ ...editedStrategy, vision: e.target.value })}
                  placeholder="Where do you see your company in the future? (e.g., To be the leading provider of innovative solutions in our industry)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-salesforce-blue focus:border-salesforce-blue min-h-[100px]"
                  rows="3"
                />
              </div>

              {/* Mission */}
              <div>
                <label className="flex items-center gap-2 text-base font-bold text-gray-900 mb-3">
                  <Target className="w-5 h-5 text-salesforce-blue" />
                  Mission
                </label>
                <textarea
                  value={editedStrategy.mission}
                  onChange={(e) => setEditedStrategy({ ...editedStrategy, mission: e.target.value })}
                  placeholder="What is your company's purpose? (e.g., To deliver exceptional value to our customers through innovative products and outstanding service)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-salesforce-blue focus:border-salesforce-blue min-h-[100px]"
                  rows="3"
                />
              </div>

              {/* Strategic Objectives */}
              <div>
                <label className="flex items-center gap-2 text-base font-bold text-gray-900 mb-3">
                  <TrendingUp className="w-5 h-5 text-salesforce-blue" />
                  Strategic Objectives
                </label>
                <textarea
                  value={editedStrategy.objectives}
                  onChange={(e) => setEditedStrategy({ ...editedStrategy, objectives: e.target.value })}
                  placeholder="What are your key strategic goals? (e.g., 1. Achieve 30% market share by 2026, 2. Expand into 3 new markets, 3. Reach $50M ARR)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-salesforce-blue focus:border-salesforce-blue min-h-[120px]"
                  rows="4"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-salesforce-blue text-white rounded-lg font-semibold hover:bg-salesforce-blue-dark transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Save Strategy
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-100 border border-gray-300 rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Display mode
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
            <div className="space-y-8">
              {/* Vision */}
              {strategy.vision && (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Compass className="w-6 h-6 text-salesforce-blue" />
                    <h3 className="text-xl font-bold text-gray-900">Vision</h3>
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed pl-9">{strategy.vision}</p>
                </div>
              )}

              {/* Mission */}
              {strategy.mission && (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="w-6 h-6 text-salesforce-blue" />
                    <h3 className="text-xl font-bold text-gray-900">Mission</h3>
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed pl-9">{strategy.mission}</p>
                </div>
              )}

              {/* Strategic Objectives */}
              {strategy.objectives && (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-6 h-6 text-salesforce-blue" />
                    <h3 className="text-xl font-bold text-gray-900">Strategic Objectives</h3>
                  </div>
                  <div className="text-base text-gray-700 leading-relaxed pl-9 whitespace-pre-wrap">
                    {strategy.objectives}
                  </div>
                </div>
              )}
            </div>

            {/* Edit button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleEdit}
                className="px-6 py-3 bg-gray-100 border border-gray-300 rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                <Edit2 className="w-5 h-5" />
                Edit Strategy
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CompanyStrategy;
