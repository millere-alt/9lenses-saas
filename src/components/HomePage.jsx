import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Target, TrendingUp, Zap, CheckCircle, BarChart3,
  Users, FileInput, Sparkles, Grid3x3, Lightbulb, Award, Bot, MessageCircle, Eye, Play, BookOpen, MonitorPlay
} from 'lucide-react';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl mb-12 shadow-2xl">
        {/* Animated gradient background with orange */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-secondary-600 to-orange-600"></div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-500 rounded-full opacity-15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>

        <div className="relative text-center py-20 px-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-orange-300/30">
            <Sparkles size={16} className="text-orange-200" />
            <span className="text-sm text-white font-medium">AI-Powered Business Intelligence</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-4 tracking-tight">
            9Lenses
          </h1>
          <div className="text-xl md:text-2xl text-teal-100 font-medium mb-8">
            Transform Your Organization Through Strategic Assessment
          </div>

          {/* Value Proposition */}
          <p className="text-lg text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed">
            Evaluate your business across <span className="font-bold text-primary-200">9 critical dimensions</span> spanning
            Assets, Processes, and Structures. Get <span className="font-bold text-orange-200">actionable insights</span> powered by data and expert analysis.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/full-demo')}
              className="group relative overflow-hidden bg-white text-primary-700 font-bold py-4 px-8 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center space-x-3 animate-pulse"
            >
              <MonitorPlay size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-lg">Watch Full Platform Demo</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/assessment/launch')}
              className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center space-x-3"
            >
              <Zap size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-lg">Launch Assessment</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/learn')}
              className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-xl border-2 border-white/30 hover:border-white/50 transition-all duration-300 flex items-center space-x-2"
            >
              <Target size={20} />
              <span>Learn About 9Lenses</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12 pt-12 border-t border-white/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-300 mb-1">9</div>
              <div className="text-sm text-orange-100">Critical Lenses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-300 mb-1">3</div>
              <div className="text-sm text-primary-100">Core Categories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary-300 mb-1">∞</div>
              <div className="text-sm text-secondary-100">Strategic Insights</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Banners */}
      <div className="mb-12 space-y-6">
        {/* Complete SaaS Demo Banner - TOP PRIORITY */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary-700 via-orange-700 to-secondary-700 rounded-2xl p-10 shadow-2xl border-4 border-orange-400">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          <div className="relative">
            {/* Featured Badge */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
              ⭐ FEATURED DEMO ⭐
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                  <MonitorPlay className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-display font-bold text-white mb-2">
                    Complete SaaS Workflow Demo
                  </h3>
                  <p className="text-white/90 text-xl mb-1">
                    Watch the entire journey: Intake → Analysis → Insights → Business Impact
                  </p>
                  <p className="text-white/80 text-sm">
                    9 interactive steps • Real company data • Measurable ROI outcomes
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/complete-demo')}
                className="bg-white hover:bg-orange-50 text-orange-700 font-bold py-5 px-10 rounded-xl shadow-2xl hover:shadow-3xl transition-all flex items-center gap-3 group hover:scale-105"
              >
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-lg">Watch Full Demo</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Books & Resources Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-secondary-700 via-primary-700 to-orange-700 rounded-2xl p-8 shadow-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  9Lenses Books & Resources
                </h3>
                <p className="text-white/90 text-lg">
                  Get the complete 9Lenses methodology book and Snapshot9 business model guide
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/resources')}
              className="bg-white hover:bg-neutral-100 text-secondary-700 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transition-all flex items-center gap-3 group"
            >
              <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>View Books</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 360 Demo Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-primary-600 to-secondary-600 rounded-2xl p-8 shadow-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                <Eye className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  See 360° Review in Action
                </h3>
                <p className="text-white/90 text-lg">
                  Watch a complete workflow demo - from setup to results in 8 interactive steps
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/demo')}
              className="bg-white hover:bg-neutral-100 text-orange-700 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transition-all flex items-center gap-3 group"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Watch Demo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* AI Assistant Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-secondary-600 to-orange-600 rounded-2xl p-8 shadow-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  Need Help Getting Started?
                </h3>
                <p className="text-white/90 text-lg">
                  Chat with our AI Assistant for a guided tour and personalized help
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/ai-assistant')}
              className="bg-white hover:bg-neutral-100 text-primary-700 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transition-all flex items-center gap-3 group"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Chat with AI Assistant</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* The 9Lenses Framework */}
      <div className="mb-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Three Categories. Nine Lenses. Complete Clarity.
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Every successful business transformation starts with comprehensive assessment.
            9Lenses analyzes your organization across three critical categories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Assets - Green */}
          <div className="group relative">
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
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl opacity-25 group-hover:opacity-75 blur transition duration-500"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-orange-500">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mb-5 shadow-lg">
                <BarChart3 className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Processes</h3>
              <p className="text-gray-600 mb-5 text-base leading-relaxed">
                Assess operational efficiency and strategic execution.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-orange-600" />
                  <span>Strategy</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-orange-600" />
                  <span>Sales & Marketing</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-orange-600" />
                  <span>Operations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Structures - Blue */}
          <div className="group relative">
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
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-orange-200">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mx-auto mb-6 shadow-lg">
                <Users className="text-white" size={32} />
              </div>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
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
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 via-orange-500 to-secondary-600 rounded-2xl mx-auto mb-6 shadow-lg">
                <Lightbulb className="text-white" size={32} />
              </div>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-600 to-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-orange-600 to-secondary-700 p-16 text-center shadow-2xl mb-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Organization?
          </h2>

          <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join forward-thinking organizations using 9Lenses to drive strategic excellence
            and sustainable growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/assessment/launch')}
              className="group bg-white text-orange-700 font-bold py-5 px-10 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 flex items-center space-x-3 text-lg"
            >
              <Zap size={24} className="group-hover:text-orange-500 transition-colors" />
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
