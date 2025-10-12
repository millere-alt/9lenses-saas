import React, { useState } from 'react';
import { Home, X, Info, ChevronRight, ArrowLeft } from 'lucide-react';
import { LENSES } from '../data/nineVectorsSchema';

const definitions = {
  framework: {
    title: "9Vectors Framework",
    description: "The 9Vectors framework is a comprehensive business assessment methodology that evaluates organizations across 9 interconnected dimensions, organized into three strategic categories. Each lens provides unique insights into different aspects of organizational performance.",
    details: [
      "Three-phase cycle: Social Discovery, Social Design, and Social Assurance",
      "Enables comprehensive stakeholder alignment and gap analysis",
      "Drives measurable improvement through actionable insights",
      "Applicable to businesses of all sizes and industries"
    ]
  },
  categories: {
    Assets: {
      title: "Assets (Social Discovery Phase)",
      description: "The Assets category focuses on understanding and assessing your organization's fundamental resources and capabilities. This phase is about discovery - examining what you have to work with.",
      purpose: "Assess & Understand current state",
      lenses: ["Market", "People", "Financial"]
    },
    Processes: {
      title: "Processes (Social Design Phase)",
      description: "The Processes category evaluates how your organization operates and executes. This phase is about design - building and aligning your strategies and operations for optimal performance.",
      purpose: "Build & Align strategies",
      lenses: ["Strategy", "Operations", "Execution"]
    },
    Structures: {
      title: "Structures (Social Assurance Phase)",
      description: "The Structures category examines the frameworks that govern and protect your organization. This phase is about assurance - ensuring communication, compliance, and sustainability.",
      purpose: "Communicate & Ensure alignment",
      lenses: ["Expectations", "Governance", "Entity"]
    }
  },
  lenses: {
    1: {
      title: "Market Lens",
      description: "Understanding the market opportunity, competitive landscape, and positioning. This lens evaluates your organization's external environment and market dynamics.",
      keyQuestions: [
        "How well do we understand our target market?",
        "What is our competitive positioning?",
        "Are we aligned with market timing and customer needs?"
      ]
    },
    2: {
      title: "People Lens",
      description: "Evaluating your workforce capabilities, culture, leadership, and organizational design. This lens assesses your most valuable asset - your people.",
      keyQuestions: [
        "Do we have the right people in the right roles?",
        "Is our culture supporting our objectives?",
        "How effective is our leadership?"
      ]
    },
    3: {
      title: "Financial Lens",
      description: "Analyzing financial health, capital structure, business model, and performance. This lens examines the economic foundations of your organization.",
      keyQuestions: [
        "Is our financial model sustainable?",
        "Do we have adequate capital structure?",
        "Are we accurately forecasting performance?"
      ]
    },
    4: {
      title: "Strategy Lens",
      description: "Assessing your strategic direction, offerings, pricing, and go-to-market approach. This lens evaluates how you plan to win in your market.",
      keyQuestions: [
        "Is our strategy clearly defined and differentiated?",
        "Are our offerings aligned with customer needs?",
        "Is our go-to-market strategy effective?"
      ]
    },
    5: {
      title: "Operations Lens",
      description: "Evaluating operational efficiency, infrastructure, processes, and systems. This lens examines how well you execute day-to-day.",
      keyQuestions: [
        "Are our operations scalable and efficient?",
        "Do we have the right infrastructure and systems?",
        "Are our processes well-documented and followed?"
      ]
    },
    6: {
      title: "Execution Lens",
      description: "Measuring performance tracking, KPIs, and strategic execution. This lens assesses your ability to deliver on commitments.",
      keyQuestions: [
        "Do we measure what matters?",
        "Are we executing our strategy effectively?",
        "How well do we track and improve performance?"
      ]
    },
    7: {
      title: "Expectations Lens",
      description: "Managing expectations across all stakeholders - board, customers, employees, and partners. This lens evaluates alignment and communication.",
      keyQuestions: [
        "Are stakeholder expectations clearly set and managed?",
        "Do we have alignment across different groups?",
        "Are we communicating effectively?"
      ]
    },
    8: {
      title: "Governance Lens",
      description: "Examining governance principles, structure, and practices. This lens assesses your organizational controls and oversight.",
      keyQuestions: [
        "Do we have proper governance structures in place?",
        "Are our practices ethical and compliant?",
        "Is there adequate board oversight?"
      ]
    },
    9: {
      title: "Entity Lens",
      description: "Evaluating entity structure, contracts, intellectual property, and risk management. This lens examines legal and structural foundations.",
      keyQuestions: [
        "Is our legal structure appropriate?",
        "Are our contracts and IP protected?",
        "How well do we manage risk?"
      ]
    }
  }
};

const MetaStructureExplorer = ({ onNavigateToHome, onNavigateToDashboard }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedLens, setExpandedLens] = useState(null);

  const handleClose = () => {
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onNavigateToHome}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">Home</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">9Vectors Meta-Structure</h1>
                <p className="text-sm text-gray-600">Complete framework hierarchy and definitions</p>
              </div>
            </div>
            <button
              onClick={onNavigateToDashboard}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Framework Overview */}
        <button
          onClick={() => setSelectedItem({ type: 'framework', data: definitions.framework })}
          className="w-full mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-3">9Vectors Meta-Structure Framework</h2>
              <p className="text-blue-100 text-lg mb-4">
                9 Lenses • 44 Sub-lenses • 242+ Themes
              </p>
              <p className="text-blue-200">
                Click to learn about the complete framework methodology
              </p>
            </div>
            <Info className="w-12 h-12 text-blue-200 group-hover:text-white transition-colors" />
          </div>
        </button>

        {/* Three Categories */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {['Assets', 'Processes', 'Structures'].map((category, idx) => {
            const categoryData = definitions.categories[category];
            const colors = {
              Assets: 'from-green-500 to-emerald-600',
              Processes: 'from-blue-500 to-indigo-600',
              Structures: 'from-purple-500 to-pink-600'
            };

            return (
              <button
                key={category}
                onClick={() => setSelectedItem({ type: 'category', data: categoryData })}
                className={`bg-gradient-to-br ${colors[category]} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 text-left group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-2xl font-bold">
                    {idx + 1}
                  </div>
                  <Info className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{category}</h3>
                <p className="text-white/90 text-sm mb-3">{categoryData.purpose}</p>
                <div className="text-xs text-white/75">
                  {categoryData.lenses.length} Lenses
                </div>
              </button>
            );
          })}
        </div>

        {/* All 9 Lenses */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">All 9 Lenses in Detail</h2>

          <div className="space-y-6">
            {LENSES.map((lens, idx) => {
              const isExpanded = expandedLens === lens.id;
              const lensDefinition = definitions.lenses[lens.id];

              return (
                <div key={lens.id} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
                  {/* Lens Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedLens(isExpanded ? null : lens.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                          style={{ backgroundColor: lens.color }}
                        >
                          {lens.id}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">{lens.name}</h3>
                          <p className="text-gray-600">{lens.category} • {lens.subLenses.length} Sub-lenses</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem({ type: 'lens', data: lensDefinition });
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Info className="w-6 h-6" />
                        </button>
                        <ChevronRight
                          className={`w-6 h-6 text-gray-400 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Sub-lenses */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                      <div className="mb-4">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Sub-lenses</h4>
                        <p className="text-gray-600 text-sm">{lens.description}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {lens.subLenses.map((subLens, subIdx) => (
                          <div
                            key={subIdx}
                            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h5 className="font-semibold text-gray-900">{subLens.name}</h5>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {subLens.themes.length} themes
                              </span>
                            </div>
                            <div className="space-y-1">
                              {subLens.themes.map((theme, themeIdx) => (
                                <div key={themeIdx} className="flex items-start gap-2 text-sm text-gray-600">
                                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
                                  <span>{theme}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Definition Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{selectedItem.data.title}</h2>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {selectedItem.data.description}
              </p>

              {selectedItem.type === 'framework' && selectedItem.data.details && (
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="font-bold text-blue-900 mb-3">Key Characteristics:</h3>
                  <ul className="space-y-2">
                    {selectedItem.data.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-blue-800">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedItem.type === 'category' && selectedItem.data.lenses && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Includes {selectedItem.data.lenses.length} Lenses:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.data.lenses.map((lensName, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700"
                      >
                        {lensName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.type === 'lens' && selectedItem.data.keyQuestions && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                  <h3 className="font-bold text-blue-900 mb-4">Key Questions to Ask:</h3>
                  <ul className="space-y-3">
                    {selectedItem.data.keyQuestions.map((question, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-blue-800">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                          {idx + 1}
                        </div>
                        <span className="pt-0.5">{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetaStructureExplorer;
