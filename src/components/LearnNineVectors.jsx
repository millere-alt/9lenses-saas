import React, { useState } from 'react';
import { BookOpen, Target, Users, DollarSign, Lightbulb, Cog, TrendingUp, MessageSquare, Shield, Building, ChevronDown, ChevronUp, Home, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearnNineVectors = () => {
  const [expandedLens, setExpandedLens] = useState(null);

  const categories = [
    {
      name: 'Assets',
      description: 'Social Discovery Phase',
      purpose: 'Assess & Understand',
      color: 'from-primary-500 to-primary-600',
      borderColor: 'border-primary-500',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-900',
      icon: Target,
      lenses: [
        {
          id: 1,
          name: 'Market',
          icon: Target,
          tagline: 'Understanding Your Market Opportunity',
          description: 'The Market lens evaluates your organization\'s understanding of the external environment, competitive landscape, and market positioning.',
          keyAreas: [
            'Target market identification and segmentation',
            'Competitive analysis and positioning',
            'Market timing and trend analysis',
            'Customer needs and pain points',
            'Market size and growth potential',
            'Barriers to entry and competitive advantages'
          ],
          criticalQuestions: [
            'How well do we understand our target market and customer segments?',
            'What is our unique value proposition compared to competitors?',
            'Are we entering the market at the right time?',
            'How large is our addressable market and growth opportunity?',
            'What are the key market trends affecting our business?'
          ],
          impact: 'A strong Market lens ensures your organization is pursuing the right opportunities with the right timing and positioning to win.'
        },
        {
          id: 2,
          name: 'People',
          icon: Users,
          tagline: 'Your Most Valuable Asset',
          description: 'The People lens assesses your workforce capabilities, organizational culture, leadership effectiveness, and talent management.',
          keyAreas: [
            'Leadership quality and effectiveness',
            'Organizational culture and values',
            'Talent acquisition and retention',
            'Skills and competency gaps',
            'Team structure and collaboration',
            'Employee engagement and satisfaction'
          ],
          criticalQuestions: [
            'Do we have the right people in the right roles?',
            'Is our culture supporting our strategic objectives?',
            'How effective is our leadership team?',
            'Are we attracting and retaining top talent?',
            'What skill gaps exist in our organization?'
          ],
          impact: 'Strong People capabilities enable execution excellence, innovation, and sustained competitive advantage through human capital.'
        },
        {
          id: 3,
          name: 'Finance',
          icon: DollarSign,
          tagline: 'Financial Health & Sustainability',
          description: 'The Finance lens examines your financial model, capital structure, performance metrics, and economic sustainability.',
          keyAreas: [
            'Business model and revenue streams',
            'Capital structure and funding',
            'Financial planning and forecasting',
            'Profitability and unit economics',
            'Cash flow management',
            'Financial controls and reporting'
          ],
          criticalQuestions: [
            'Is our business model economically viable and scalable?',
            'Do we have adequate capital to execute our strategy?',
            'Are our financial forecasts accurate and realistic?',
            'What are our unit economics and path to profitability?',
            'How healthy is our cash flow and runway?'
          ],
          impact: 'Sound Finance fundamentals ensure long-term sustainability and provide the resources needed to execute your strategy.'
        }
      ]
    },
    {
      name: 'Processes',
      description: 'Social Design Phase',
      purpose: 'Build & Align',
      color: 'from-green-500 to-green-600',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-900',
      icon: Cog,
      lenses: [
        {
          id: 4,
          name: 'Strategy',
          icon: Lightbulb,
          tagline: 'Your Plan to Win',
          description: 'The Strategy lens evaluates your strategic direction, product/service offerings, pricing, and go-to-market approach.',
          keyAreas: [
            'Strategic vision and direction',
            'Product and service offerings',
            'Pricing strategy and models',
            'Go-to-market strategy',
            'Competitive differentiation',
            'Strategic priorities and focus'
          ],
          criticalQuestions: [
            'Is our strategy clearly defined and differentiated?',
            'Are our offerings aligned with market needs?',
            'Is our pricing strategy optimized for value capture?',
            'Do we have an effective go-to-market approach?',
            'What makes us uniquely positioned to win?'
          ],
          impact: 'A clear and differentiated Strategy provides direction, focus, and a roadmap for sustainable competitive advantage.'
        },
        {
          id: 5,
          name: 'Operations',
          icon: Cog,
          tagline: 'Executing with Excellence',
          description: 'The Operations lens assesses operational efficiency, infrastructure, processes, systems, and scalability.',
          keyAreas: [
            'Operational processes and workflows',
            'Technology infrastructure and systems',
            'Scalability and capacity planning',
            'Quality control and standards',
            'Supply chain and vendor management',
            'Operational efficiency and productivity'
          ],
          criticalQuestions: [
            'Are our operations scalable and efficient?',
            'Do we have the right infrastructure and systems?',
            'Are our processes well-documented and optimized?',
            'How well do we manage quality and consistency?',
            'Can our operations support our growth plans?'
          ],
          impact: 'Strong Operations enable consistent delivery, scalability, and cost-effective execution of your business model.'
        },
        {
          id: 6,
          name: 'Execution',
          icon: TrendingUp,
          tagline: 'Delivering Results',
          description: 'The Execution lens measures your ability to track performance, manage KPIs, and deliver on commitments.',
          keyAreas: [
            'KPI definition and tracking',
            'Performance management systems',
            'Goal setting and accountability',
            'Strategic plan execution',
            'Progress monitoring and reporting',
            'Continuous improvement culture'
          ],
          criticalQuestions: [
            'Do we measure what truly matters?',
            'Are we executing our strategy effectively?',
            'How well do we track and improve performance?',
            'Is there clear accountability for results?',
            'Do we have a culture of continuous improvement?'
          ],
          impact: 'Excellent Execution capability ensures strategies translate into results and the organization delivers on commitments.'
        }
      ]
    },
    {
      name: 'Structures',
      description: 'Social Assurance Phase',
      purpose: 'Communicate & Ensure',
      color: 'from-secondary-500 to-secondary-600',
      borderColor: 'border-secondary-500',
      bgColor: 'bg-secondary-50',
      textColor: 'text-secondary-900',
      icon: Shield,
      lenses: [
        {
          id: 7,
          name: 'Expectation',
          icon: MessageSquare,
          tagline: 'Aligning Stakeholders',
          description: 'The Expectation lens evaluates how well you manage expectations across all stakeholders including board, customers, employees, and partners.',
          keyAreas: [
            'Stakeholder identification and mapping',
            'Expectation setting and management',
            'Communication strategies and cadence',
            'Transparency and trust building',
            'Feedback loops and listening',
            'Alignment across stakeholder groups'
          ],
          criticalQuestions: [
            'Are stakeholder expectations clearly set and managed?',
            'Do we have alignment across different stakeholder groups?',
            'How effective is our communication?',
            'Are we transparent and building trust?',
            'Do we actively seek and incorporate stakeholder feedback?'
          ],
          impact: 'Effective Expectation management creates alignment, builds trust, and reduces friction across the organization.'
        },
        {
          id: 8,
          name: 'Governance',
          icon: Shield,
          tagline: 'Controls & Oversight',
          description: 'The Governance lens examines your governance principles, structure, board effectiveness, and organizational controls.',
          keyAreas: [
            'Board composition and effectiveness',
            'Governance policies and principles',
            'Decision-making frameworks',
            'Compliance and regulatory adherence',
            'Ethics and integrity standards',
            'Oversight and accountability mechanisms'
          ],
          criticalQuestions: [
            'Do we have proper governance structures in place?',
            'Is our board providing effective oversight?',
            'Are our practices ethical and compliant?',
            'How clear are our decision-making frameworks?',
            'Do we have adequate controls and accountability?'
          ],
          impact: 'Strong Governance ensures responsible stewardship, risk management, and long-term organizational health.'
        },
        {
          id: 9,
          name: 'Entity',
          icon: Building,
          tagline: 'Legal & Structural Foundation',
          description: 'The Entity lens evaluates your legal structure, contracts, intellectual property, risk management, and organizational design.',
          keyAreas: [
            'Legal entity structure and optimization',
            'Contracts and agreements management',
            'Intellectual property protection',
            'Risk identification and mitigation',
            'Insurance and liability coverage',
            'Corporate structure and subsidiaries'
          ],
          criticalQuestions: [
            'Is our legal structure appropriate for our business?',
            'Are our contracts and IP adequately protected?',
            'How well do we identify and manage risks?',
            'Do we have proper insurance coverage?',
            'Is our entity structure optimized for growth?'
          ],
          impact: 'A solid Entity foundation protects the organization, manages risks, and enables strategic flexibility.'
        }
      ]
    }
  ];

  const toggleLens = (lensId) => {
    setExpandedLens(expandedLens === lensId ? null : lensId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">Home</span>
              </Link>
              <div className="h-6 w-px bg-neutral-300"></div>
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary-600" />
                <div>
                  <h1 className="text-2xl font-display font-bold text-neutral-900">Learn About 9Vectors</h1>
                  <p className="text-sm text-neutral-600">Comprehensive Business Assessment Framework</p>
                </div>
              </div>
            </div>
            <Link
              to="/assessment"
              className="px-6 py-2 bg-gradient-to-r from-primary-600 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              Start Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-primary-600 via-secondary-600 to-green-600 rounded-3xl p-12 text-white shadow-2xl mb-12">
          <div className="max-w-4xl">
            <h2 className="text-5xl font-display font-bold mb-6">
              The 9Vectors Framework
            </h2>
            <p className="text-2xl text-white/90 mb-6 leading-relaxed">
              A comprehensive methodology for assessing and optimizing organizational performance across 9 interconnected dimensions.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20">
                <p className="text-4xl font-bold mb-2">9</p>
                <p className="text-white/80">Core Lenses</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20">
                <p className="text-4xl font-bold mb-2">3</p>
                <p className="text-white/80">Strategic Phases</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20">
                <p className="text-4xl font-bold mb-2">∞</p>
                <p className="text-white/80">Improvement Opportunities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Three Categories Overview */}
        <div className="mb-16">
          <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4 text-center">
            Three Strategic Phases
          </h2>
          <p className="text-xl text-neutral-600 text-center mb-12 max-w-3xl mx-auto">
            The 9Vectors framework is organized into three interconnected phases, each containing three lenses that work together to drive organizational excellence.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category, idx) => {
              const CategoryIcon = category.icon;
              return (
                <div key={idx} className={`bg-gradient-to-br ${category.color} rounded-2xl p-8 text-white shadow-xl`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <CategoryIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold">{category.name}</h3>
                      <p className="text-white/80 text-sm">{category.description}</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold mb-4 text-white/90">
                    Purpose: {category.purpose}
                  </p>
                  <div className="space-y-2">
                    {category.lenses.map(lens => (
                      <div key={lens.id} className="flex items-center gap-2 text-white/90">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span className="font-medium">{lens.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Lens Information */}
        {categories.map((category, catIdx) => (
          <div key={catIdx} className="mb-16">
            <div className={`flex items-center gap-4 mb-8 pb-4 border-b-4 ${category.borderColor}`}>
              <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center`}>
                <category.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-display font-bold text-neutral-900">{category.name}</h2>
                <p className="text-lg text-neutral-600">{category.description} • {category.purpose}</p>
              </div>
            </div>

            <div className="space-y-6">
              {category.lenses.map(lens => {
                const LensIcon = lens.icon;
                const isExpanded = expandedLens === lens.id;

                return (
                  <div key={lens.id} className="bg-white rounded-2xl shadow-lg border-2 border-neutral-200 overflow-hidden">
                    {/* Lens Header */}
                    <button
                      onClick={() => toggleLens(lens.id)}
                      className="w-full p-6 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg`}>
                            <LensIcon className="w-10 h-10 text-white" />
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-3xl font-display font-bold text-neutral-900">
                                {lens.id}. {lens.name}
                              </h3>
                            </div>
                            <p className="text-lg font-semibold text-neutral-600 mb-2">{lens.tagline}</p>
                            <p className="text-neutral-600">{lens.description}</p>
                          </div>
                        </div>
                        <div>
                          {isExpanded ? (
                            <ChevronUp className="w-8 h-8 text-neutral-400" />
                          ) : (
                            <ChevronDown className="w-8 h-8 text-neutral-400" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className={`border-t-2 border-neutral-200 ${category.bgColor} p-8`}>
                        <div className="grid md:grid-cols-2 gap-8">
                          {/* Key Areas */}
                          <div>
                            <h4 className={`text-xl font-display font-bold ${category.textColor} mb-4`}>
                              Key Areas of Focus
                            </h4>
                            <ul className="space-y-3">
                              {lens.keyAreas.map((area, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <div className={`w-6 h-6 bg-gradient-to-br ${category.color} rounded flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                    <span className="text-white text-xs font-bold">{idx + 1}</span>
                                  </div>
                                  <span className="text-neutral-700">{area}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Critical Questions */}
                          <div>
                            <h4 className={`text-xl font-display font-bold ${category.textColor} mb-4`}>
                              Critical Questions
                            </h4>
                            <ul className="space-y-3">
                              {lens.criticalQuestions.map((question, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <div className="w-2 h-2 bg-neutral-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-neutral-700 italic">{question}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Impact Statement */}
                        <div className={`mt-8 p-6 bg-white rounded-xl border-l-4 ${category.borderColor}`}>
                          <h4 className={`font-display font-bold ${category.textColor} mb-2`}>
                            Strategic Impact
                          </h4>
                          <p className="text-neutral-700 leading-relaxed">{lens.impact}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Interconnected Framework */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-12 text-white shadow-2xl">
          <h2 className="text-4xl font-display font-bold mb-6 text-center">
            A Holistic, Interconnected Framework
          </h2>
          <p className="text-xl text-white/90 leading-relaxed text-center max-w-4xl mx-auto mb-8">
            The power of 9Vectors lies in the interconnections between all 9 dimensions. Using our patented mathematical framework
            (US Patent 9,489,419 B2), we analyze how improvements in one lens create ripple effects across your entire organization.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20">
              <h4 className="text-xl font-bold mb-3">Social Discovery</h4>
              <p className="text-white/80">Understand your current state across all dimensions with comprehensive stakeholder input.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20">
              <h4 className="text-xl font-bold mb-3">Social Design</h4>
              <p className="text-white/80">Build aligned strategies and optimize operations based on data-driven insights.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20">
              <h4 className="text-xl font-bold mb-3">Social Assurance</h4>
              <p className="text-white/80">Ensure continuous communication, governance, and sustainable organizational health.</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/assessment"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-green-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
            >
              Start Your 9Vectors Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnNineVectors;
