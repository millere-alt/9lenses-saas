import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Target, TrendingUp, Zap, CheckCircle, BarChart3,
  Users, FileInput, Sparkles, Grid3x3, Lightbulb, Award, GraduationCap
} from 'lucide-react';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section - Compact */}
      <div className="relative overflow-hidden rounded-lg mb-8 shadow-lg">
        {/* Simplified gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700"></div>

        <div className="relative text-center py-8 px-4">
          {/* Badge */}
          <div className="inline-flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full mb-3 border border-blue-300/30">
            <Sparkles size={12} className="text-blue-200" />
            <span className="text-xs text-white font-medium">AI-Powered Business Intelligence</span>
          </div>

          {/* Main Heading - Smaller */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            9Vectors
          </h1>
          <div className="text-sm md:text-base text-blue-100 font-medium mb-4">
            Transform Your Organization Through Strategic Assessment
          </div>

          {/* Value Proposition - Condensed */}
          <p className="text-sm text-white/90 max-w-2xl mx-auto mb-5 leading-snug">
            Evaluate your business across <span className="font-semibold">9 critical dimensions</span> spanning
            Assets, Processes, and Structures. Get <span className="font-semibold">actionable insights</span> powered by data.
          </p>

          {/* CTAs - Compact */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
            <button
              onClick={() => navigate('/assessment/launch')}
              data-tour="cta-button"
              className="group bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-all flex items-center space-x-2 text-sm"
            >
              <Zap size={14} />
              <span>Launch Assessment</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => navigate('/about')}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium py-2 px-4 rounded-md border border-white/30 hover:border-white/50 transition-all flex items-center space-x-1.5 text-sm"
            >
              <Target size={14} />
              <span>Learn More</span>
            </button>
          </div>

          {/* Stats - Compact */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-300 mb-0.5">9</div>
              <div className="text-xs text-blue-100">Lenses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-200 mb-0.5">3</div>
              <div className="text-xs text-blue-100">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-100 mb-0.5">∞</div>
              <div className="text-xs text-blue-100">Insights</div>
            </div>
          </div>
        </div>
      </div>

      {/* The 9Vectors Framework */}
      <div className="mb-12" data-tour="framework-overview">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Three Categories. Nine Vectors. Complete Clarity.
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Every successful business transformation starts with comprehensive assessment.
            9Vectors analyzes your organization across three critical categories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Assets - Green */}
          <div className="group relative" data-tour="assets-section">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl opacity-25 group-hover:opacity-75 blur transition duration-500"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-primary-500">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl mb-5 shadow-lg">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Assets</h3>
              <p className="text-gray-600 mb-5 text-base leading-relaxed">
                Evaluate your organization's fundamental resources and capabilities.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-primary-600" />
                  <span>Customers</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-primary-600" />
                  <span>Financials</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-primary-600" />
                  <span>Human Resources</span>
                </div>
              </div>
            </div>
          </div>

          {/* Processes - Orange */}
          <div className="group relative" data-tour="processes-section">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl opacity-25 group-hover:opacity-75 blur transition duration-500"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-500">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-5 shadow-lg">
                <BarChart3 className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Processes</h3>
              <p className="text-gray-600 mb-5 text-base leading-relaxed">
                Assess operational efficiency and strategic execution.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-blue-600" />
                  <span>Strategy</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-blue-600" />
                  <span>Sales & Marketing</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-blue-600" />
                  <span>Operations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Structures - Blue */}
          <div className="group relative" data-tour="structures-section">
            <div className="absolute -inset-1 bg-gradient-to-r from-secondary-400 to-secondary-600 rounded-2xl opacity-25 group-hover:opacity-75 blur transition duration-500"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-secondary-500">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl mb-5 shadow-lg">
                <Grid3x3 className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Structures</h3>
              <p className="text-gray-600 mb-5 text-base leading-relaxed">
                Analyze organizational foundations and systems.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-secondary-600" />
                  <span>Sustainability</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-secondary-600" />
                  <span>Systems & Processes</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-secondary-600" />
                  <span>Organizational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            From assessment to insights in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 - Green */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-primary-200">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl mx-auto mb-6 shadow-lg">
                <FileInput className="text-white" size={32} />
              </div>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Launch Assessment</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed">
                Create a multi-participant assessment and invite stakeholders
              </p>
            </div>
          </div>

          {/* Step 2 - Orange */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-blue-200">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 shadow-lg">
                <Users className="text-white" size={32} />
              </div>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Gather Input</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed">
                Team members provide perspectives across all 9 lenses
              </p>
            </div>
          </div>

          {/* Step 3 - Blue */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-secondary-200">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-2xl mx-auto mb-6 shadow-lg">
                <Sparkles className="text-white" size={32} />
              </div>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-secondary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">AI Analysis</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed">
                Our system analyzes responses and identifies patterns
              </p>
            </div>
          </div>

          {/* Step 4 - Green/Orange Gradient */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-primary-200">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 via-blue-500 to-secondary-600 rounded-2xl mx-auto mb-6 shadow-lg">
                <Lightbulb className="text-white" size={32} />
              </div>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-600 to-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Get Insights</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed">
                Receive strategic recommendations for transformation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-blue-600 to-secondary-700 p-16 text-center shadow-2xl mb-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Organization?
          </h2>

          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join forward-thinking organizations using 9Vectors to drive strategic excellence
            and sustainable growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/assessment/launch')}
              className="group bg-white text-blue-700 font-bold py-5 px-10 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 flex items-center space-x-3 text-lg"
            >
              <Zap size={24} className="group-hover:text-blue-500 transition-colors" />
              <span>Start Assessment Now</span>
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/how-it-works')}
              className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold py-5 px-10 rounded-xl border-2 border-white/30 hover:border-white/60 transition-all duration-300 flex items-center space-x-2"
            >
              <Award size={20} />
              <span>Learn More</span>
            </button>
          </div>

          <div className="mt-12 pt-12 border-t border-white/20 text-white/80 text-sm">
            No credit card required • Free trial • Instant results
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
