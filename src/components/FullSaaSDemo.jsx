import React, { useState } from 'react';
import {
  ChevronRight, ChevronLeft, Play, Upload, Users, FileText, Brain,
  BarChart3, Target, TrendingUp, CheckCircle, Sparkles, Award,
  DollarSign, Link2, Eye, Zap, MessageCircle, Settings, X
} from 'lucide-react';

const FullSaaSDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    {
      id: 0,
      title: "Welcome to 9Vectors Complete SaaS Platform",
      subtitle: "Your End-to-End Business Intelligence Solution",
      icon: Award,
      color: "from-purple-600 to-blue-600",
      content: (
        <div className="text-center py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              The Complete 9Vectors Journey
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover how organizations transform their business using our comprehensive
              platform. This demo walks you through every feature from initial assessment
              to actionable insights and measurable ROI.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div className="text-4xl font-bold text-green-600 mb-2">10+</div>
                <div className="text-sm text-gray-700">Key Features</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="text-4xl font-bold text-blue-600 mb-2">9</div>
                <div className="text-sm text-gray-700">Business Lenses</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="text-4xl font-bold text-purple-600 mb-2">∞</div>
                <div className="text-sm text-gray-700">Strategic Insights</div>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <p className="text-lg text-gray-700">
                <strong>What you'll see:</strong> Assessment creation • Multi-participant surveys •
                Document uploads • AI analysis • Predictive analytics • Action planning •
                ROI tracking • And much more!
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Step 1: Launch Assessment",
      subtitle: "Create and Configure Your Organization's Assessment",
      icon: Settings,
      color: "from-blue-600 to-cyan-600",
      content: (
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Setup Process</h3>
              <ul className="space-y-4 mb-6">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong>Company Profile:</strong> Enter basic information about your organization
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong>Assessment Type:</strong> Choose from 360° Review, Strategic Planning, or Custom
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong>Timeframe:</strong> Set duration and milestones for completion
                  </div>
                </li>
              </ul>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Pro Tip:</strong> Start with a 360° review to get comprehensive insights
                  across all 9 lenses from multiple stakeholder perspectives.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl border-2 border-blue-200">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h4 className="font-bold text-lg mb-4">Assessment Configuration</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="TechVenture Inc." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option>Software & Technology</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Type</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option>360° Comprehensive Review</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Step 2: Invite Participants",
      subtitle: "Multi-Stakeholder Input for Comprehensive Insights",
      icon: Users,
      color: "from-green-600 to-emerald-600",
      content: (
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">360° Perspective</h3>
              <p className="text-gray-600 mb-6">
                Invite stakeholders from different levels and functions to provide diverse perspectives.
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">C-Suite Executives</div>
                      <div className="text-sm text-gray-600">Strategic vision & direction</div>
                    </div>
                    <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      5 invited
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Middle Management</div>
                      <div className="text-sm text-gray-600">Operational execution</div>
                    </div>
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      12 invited
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Team Members</div>
                      <div className="text-sm text-gray-600">Day-to-day operations</div>
                    </div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      28 invited
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Board Members</div>
                      <div className="text-sm text-gray-600">Governance & oversight</div>
                    </div>
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      3 invited
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl border-2 border-green-200">
              <h4 className="font-bold text-lg mb-4">Participation Rate</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Overall Response Rate</span>
                    <span className="text-sm font-bold text-green-600">94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" style={{width: '94%'}}></div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 mt-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">45/48</div>
                  <div className="text-sm text-gray-600">Participants Completed</div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-gray-700">
                    <strong>Automated Reminders:</strong> Our system automatically sends reminders
                    to non-respondents, ensuring high participation rates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Step 3: Document Upload & Data Integration",
      subtitle: "Enrich Assessment with Real Business Documents",
      icon: Upload,
      color: "from-green-600 to-amber-600",
      content: (
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Supporting Documents</h3>
              <p className="text-gray-600 mb-6">
                Upload financial statements, strategy documents, marketing plans, and more.
                Our AI correlates these with your assessment for deeper insights.
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Financial Statements</div>
                    <div className="text-xs text-gray-600">P&L by product line • Balance sheet • Cash flow</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>

                <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Target className="w-8 h-8 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Strategic Plan 2025</div>
                    <div className="text-xs text-gray-600">Vision • Objectives • Market strategy</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>

                <div className="flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Marketing Budget & ROI</div>
                    <div className="text-xs text-gray-600">Channel performance • CAC • LTV</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>

                <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Operations Manual</div>
                    <div className="text-xs text-gray-600">Processes • Systems • Procedures</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-amber-50 p-8 rounded-xl border-2 border-blue-200">
              <h4 className="font-bold text-lg mb-4">Automatic Categorization</h4>

              <div className="bg-white rounded-lg p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">Documents by Lens</span>
                  <span className="text-sm text-gray-600">23 total</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Financial</span>
                    <span className="font-bold">8 docs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '35%'}}></div>
                  </div>

                  <div className="flex justify-between text-sm mt-3">
                    <span>Strategy</span>
                    <span className="font-bold">6 docs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '26%'}}></div>
                  </div>

                  <div className="flex justify-between text-sm mt-3">
                    <span>Operations</span>
                    <span className="font-bold">5 docs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '22%'}}></div>
                  </div>

                  <div className="flex justify-between text-sm mt-3">
                    <span>Other Lenses</span>
                    <span className="font-bold">4 docs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '17%'}}></div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Link2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <p className="text-sm text-gray-700">
                    AI automatically correlates documents with assessment responses to identify
                    gaps between stated capabilities and documented evidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Step 4: Assessment Results & Scoring",
      subtitle: "See Your Organization Through 9 Lenses",
      icon: BarChart3,
      color: "from-purple-600 to-pink-600",
      content: (
        <div className="py-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Overall Assessment Score</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="text-5xl font-bold mb-2">6.3</div>
                <div className="text-sm opacity-90">Overall Score (out of 10)</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                <div className="text-5xl font-bold mb-2">2</div>
                <div className="text-sm opacity-90">Strong Areas (7+ score)</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-red-600 rounded-xl p-6 text-white">
                <div className="text-5xl font-bold mb-2">4</div>
                <div className="text-sm opacity-90">Areas for Improvement</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-lg mb-4">Top Performing Lenses</h4>
              <div className="space-y-3">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">People</span>
                    <span className="text-2xl font-bold text-green-600">7.3</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '73%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Strong culture and employee characteristics</p>
                </div>

                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Expectations</span>
                    <span className="text-2xl font-bold text-green-600">7.1</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '71%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Well-aligned stakeholder expectations</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Areas Needing Attention</h4>
              <div className="space-y-3">
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Entity</span>
                    <span className="text-2xl font-bold text-red-600">5.5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: '55%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">IP protection and contract management gaps</p>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Financial</span>
                    <span className="text-2xl font-bold text-blue-600">5.7</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '57%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Forecasting and capital structure concerns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Step 5: AI-Powered Analysis & Insights",
      subtitle: "Deep Intelligence from Your Data",
      icon: Brain,
      color: "from-indigo-600 to-purple-600",
      content: (
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Insights</h3>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-5">
                  <div className="flex items-start space-x-3">
                    <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-purple-900 mb-2">Strategic Alignment Gap</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Your Strategy lens (6.3) outperforms Execution (5.8), indicating a gap between
                        planning and implementation. This is a common challenge in growth-stage companies.
                      </p>
                      <div className="bg-white rounded p-3 text-xs">
                        <strong>Recommendation:</strong> Implement OKR framework and strengthen
                        cross-functional accountability.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-5">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-blue-900 mb-2">Document Correlation Alert</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Your financial documents show 15% revenue growth, but Execution scores suggest
                        process bottlenecks may limit scaling. Address operational constraints now.
                      </p>
                      <div className="bg-white rounded p-3 text-xs">
                        <strong>Action:</strong> Review operations manual against actual workflows
                        to identify inefficiencies.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-5">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-green-900 mb-2">Strength to Leverage</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Your People lens (7.3) is a key differentiator. Use this cultural strength
                        to attract top talent and accelerate growth initiatives.
                      </p>
                      <div className="bg-white rounded p-3 text-xs">
                        <strong>Opportunity:</strong> Highlight culture in employer branding and
                        recruitment marketing.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl border-2 border-indigo-200">
              <h4 className="font-bold text-lg mb-6">Predictive Analytics</h4>

              <div className="bg-white rounded-lg p-6 mb-4">
                <h5 className="font-semibold mb-4">6-Month Forecast</h5>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>If current trajectory continues...</span>
                      <span className="font-bold text-blue-600">5.9</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-500 h-3 rounded-full" style={{width: '59%'}}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>With recommended actions...</span>
                      <span className="font-bold text-green-600">7.2</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{width: '72%'}}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Best-case scenario...</span>
                      <span className="font-bold text-blue-600">7.8</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-500 h-3 rounded-full" style={{width: '78%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-100 border border-indigo-300 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Brain className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
                  <p className="text-sm text-gray-800">
                    Our AI analyzes patterns across 10,000+ assessments to predict your organization's
                    likely trajectory and optimal improvement path.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Step 6: Action Plan Generator",
      subtitle: "90-Day Roadmap for Transformation",
      icon: Target,
      color: "from-emerald-600 to-teal-600",
      content: (
        <div className="py-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Automated 90-Day Action Plan</h3>
            <p className="text-gray-600">
              Based on your assessment results and AI analysis, here's your prioritized roadmap to improvement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-green-50 border-2 border-red-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-lg">Days 1-30</h4>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">HIGH PRIORITY</span>
              </div>

              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 border-l-4 border-red-500">
                  <div className="font-semibold text-sm mb-1">IP Strategy Development</div>
                  <div className="text-xs text-gray-600 mb-2">Target: Entity Lens → 6.5+</div>
                  <div className="text-xs">
                    <strong>Owner:</strong> Legal Team<br/>
                    <strong>Budget:</strong> $15K
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 border-l-4 border-blue-500">
                  <div className="font-semibold text-sm mb-1">Financial Dashboard</div>
                  <div className="text-xs text-gray-600 mb-2">Target: Financial Lens → 6.2+</div>
                  <div className="text-xs">
                    <strong>Owner:</strong> CFO<br/>
                    <strong>Budget:</strong> $8K
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-lg">Days 31-60</h4>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">MEDIUM</span>
              </div>

              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 border-l-4 border-yellow-500">
                  <div className="font-semibold text-sm mb-1">Process Optimization</div>
                  <div className="text-xs text-gray-600 mb-2">Target: Operations Lens → 6.8+</div>
                  <div className="text-xs">
                    <strong>Owner:</strong> COO<br/>
                    <strong>Budget:</strong> $12K
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 border-l-4 border-amber-500">
                  <div className="font-semibold text-sm mb-1">KPI Dashboard Launch</div>
                  <div className="text-xs text-gray-600 mb-2">Target: Execution Lens → 6.5+</div>
                  <div className="text-xs">
                    <strong>Owner:</strong> Strategy Team<br/>
                    <strong>Budget:</strong> $6K
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-lg">Days 61-90</h4>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">STRATEGIC</span>
              </div>

              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 border-l-4 border-green-500">
                  <div className="font-semibold text-sm mb-1">Market Expansion Plan</div>
                  <div className="text-xs text-gray-600 mb-2">Target: Market Lens → 7.0+</div>
                  <div className="text-xs">
                    <strong>Owner:</strong> CMO<br/>
                    <strong>Budget:</strong> $25K
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 border-l-4 border-teal-500">
                  <div className="font-semibold text-sm mb-1">Culture Amplification</div>
                  <div className="text-xs text-gray-600 mb-2">Target: People Lens → 8.0+</div>
                  <div className="text-xs">
                    <strong>Owner:</strong> CHRO<br/>
                    <strong>Budget:</strong> $10K
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Zap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-blue-900 mb-2">Total Investment Required</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">$76K</div>
                    <div className="text-sm text-gray-600">90-Day Budget</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">$1.2M</div>
                    <div className="text-sm text-gray-600">Projected ROI (12mo)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">15.8x</div>
                    <div className="text-sm text-gray-600">Return Multiple</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Step 7: Competitive Benchmarking",
      subtitle: "See How You Stack Up Against Industry Peers",
      icon: TrendingUp,
      color: "from-cyan-600 to-blue-600",
      content: (
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Industry Comparison</h3>
              <p className="text-gray-600 mb-6">
                Compare your scores against anonymized data from similar organizations in your industry.
              </p>

              <div className="space-y-4">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Overall Performance</span>
                    <span className="text-sm text-green-600 font-bold">Top 35%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="text-gray-600">Your Score</div>
                      <div className="text-lg font-bold text-blue-600">6.3</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Industry Avg</div>
                      <div className="text-lg font-bold text-gray-600">5.8</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Top Quartile</div>
                      <div className="text-lg font-bold text-green-600">7.5</div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">You Lead In:</span>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span>People & Culture</span>
                      <span className="font-bold text-green-600">Top 15%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Expectations Management</span>
                      <span className="font-bold text-green-600">Top 20%</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Improvement Opportunities:</span>
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span>Entity & IP Protection</span>
                      <span className="font-bold text-blue-600">Bottom 40%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Financial Forecasting</span>
                      <span className="font-bold text-blue-600">Bottom 35%</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-xl border-2 border-cyan-200">
              <h4 className="font-bold text-lg mb-6">Competitive Positioning</h4>

              <div className="space-y-6">
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-sm mb-3">Market Position Analysis</h5>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Market Leaders</span>
                        <span className="font-bold">7.8 - 8.5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>You (Strong Performer)</span>
                        <span className="font-bold text-blue-600">6.3</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 relative">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{width: '63%'}}></div>
                        <div className="absolute top-0 h-2 w-1 bg-red-500" style={{left: '63%'}}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Industry Average</span>
                        <span className="font-bold">5.8</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-gray-400 to-gray-600 h-2 rounded-full" style={{width: '58%'}}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Below Average</span>
                        <span className="font-bold">4.2 - 5.7</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-red-600 h-2 rounded-full" style={{width: '50%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                  <p className="text-sm text-gray-800">
                    <strong>Key Insight:</strong> You're outperforming 65% of peers in your industry.
                    Addressing Entity and Financial gaps could move you into the top 20% within 6 months.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "Step 8: Ongoing Monitoring & Support",
      subtitle: "Track Progress and Get Continuous Guidance",
      icon: Eye,
      color: "from-pink-600 to-rose-600",
      content: (
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Dashboard</h3>
              <p className="text-gray-600 mb-6">
                Monitor your improvement journey with live updates, trend analysis, and milestone tracking.
              </p>

              <div className="space-y-4">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold mb-3">Progress Tracking</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>90-Day Plan Completion</span>
                        <span className="font-bold text-green-600">67%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" style={{width: '67%'}}></div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">12 of 18 initiatives completed</div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Score Improvement</span>
                        <span className="font-bold text-blue-600">+0.8</span>
                      </div>
                      <div className="text-xs text-gray-600">6.3 → 7.1 (Target: 7.2)</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-5">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-purple-600" />
                    AI Assistant Available 24/7
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Get instant answers to questions about your assessment, implementation guidance,
                    and personalized recommendations.
                  </p>
                  <div className="bg-white rounded-lg p-3 text-xs border border-purple-200">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs">AI</span>
                      </div>
                      <div>
                        <p className="text-gray-700 italic">
                          "I notice you're ahead of schedule on your IP strategy initiative. Would you
                          like me to suggest next steps for trademark registration?"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-xl border-2 border-pink-200">
              <h4 className="font-bold text-lg mb-6">Smart Notifications</h4>

              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">🎉 Milestone Achieved!</div>
                      <div className="text-xs text-gray-700">
                        Financial lens improved from 5.7 to 6.2. You're now above industry average!
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">2h ago</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">📊 Quarterly Review Due</div>
                      <div className="text-xs text-gray-700">
                        Time to reassess! Schedule your Q2 assessment to track continued progress.
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">1d ago</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">⚠️ Risk Alert</div>
                      <div className="text-xs text-gray-700">
                        Operations initiative is 15% behind schedule. AI suggests reallocating resources.
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">3d ago</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">💡 New Recommendation</div>
                      <div className="text-xs text-gray-700">
                        Based on your progress, consider adding "Brand Positioning" to your next sprint.
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">5d ago</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-r from-pink-100 to-rose-100 border border-pink-300 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-800 font-semibold mb-1">Personalized for Leaders</p>
                    <p className="text-xs text-gray-700">
                      Executives, managers, and board members each receive tailored notifications
                      relevant to their role and responsibilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: "Ready to Transform Your Organization?",
      subtitle: "Start Your 9Vectors Journey Today",
      icon: Zap,
      color: "from-green-600 to-red-600",
      content: (
        <div className="text-center py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for Business Excellence
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Join hundreds of organizations using 9Vectors to drive strategic transformation,
              improve performance, and achieve measurable results.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-blue-50 rounded-xl p-6">
                <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <div className="font-bold text-lg mb-1">360° Assessments</div>
                <div className="text-sm text-gray-600">Multi-stakeholder input</div>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <Brain className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <div className="font-bold text-lg mb-1">AI Analysis</div>
                <div className="text-sm text-gray-600">Deep insights & predictions</div>
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <Target className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <div className="font-bold text-lg mb-1">Action Plans</div>
                <div className="text-sm text-gray-600">90-day roadmaps</div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <div className="font-bold text-lg mb-1">ROI Tracking</div>
                <div className="text-sm text-gray-600">Measurable results</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-red-600 rounded-2xl p-12 text-white mb-8">
              <h3 className="text-3xl font-bold mb-4">Special Launch Offer</h3>
              <p className="text-xl mb-6 opacity-90">
                First 100 organizations get lifetime access to all premium features
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="bg-white text-blue-600 font-bold py-4 px-10 rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 text-lg">
                  Start Free Assessment
                </button>
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-4 px-10 rounded-xl border-2 border-white/50 transition-all text-lg">
                  Schedule Demo Call
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">No Credit Card</div>
                <div className="text-sm text-gray-600">Free to start</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">24/7 Support</div>
                <div className="text-sm text-gray-600">AI + human experts</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">Instant Access</div>
                <div className="text-sm text-gray-600">Start in minutes</div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (index) => {
    setCurrentStep(index);
  };

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${currentStepData.color} text-white py-8 px-6`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <StepIcon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{currentStepData.title}</h1>
                <p className="text-white/90">{currentStepData.subtitle}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-80">Step {currentStep + 1} of {steps.length}</div>
              <div className="text-2xl font-bold">{Math.round((currentStep / (steps.length - 1)) * 100)}% Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{width: `${((currentStep + 1) / steps.length) * 100}%`}}
            ></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {currentStepData.content}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-blue-600 w-8'
                    : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                }`}
                title={step.title}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-semibold">
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next Step'}
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    index === currentStep
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : index < currentStep
                        ? 'bg-green-50 border-2 border-green-200 hover:border-green-400'
                        : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-bold">Step {index + 1}</span>
                  </div>
                  <div className="text-xs opacity-90 line-clamp-2">{step.title}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullSaaSDemo;
