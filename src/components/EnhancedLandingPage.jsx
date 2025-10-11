import React, { useState } from 'react';
import {
  ArrowRight, BookOpen, Users, Target, Zap, ClipboardList,
  Grid3x3, LogIn, UserPlus, Menu, X, ExternalLink, FileText,
  TrendingUp, Shield, Award, Check, Compass, Home, Sparkles, Eye, BarChart3, LineChart
} from 'lucide-react';

const EnhancedLandingPage = ({
  onNavigateToDashboard,
  onNavigateToAssessment,
  onNavigateToMultiAssessment,
  onNavigateToMetaStructure,
  onNavigateToCEOPortal,
  onNavigateToBooks,
  onNavigateToAbout,
  onNavigateToStrategy,
  onNavigateToExplore,
  onOpenAuth
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation - Clean White */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">9L</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">9Vectors</h1>
                <p className="text-xs text-gray-500">Business Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-5 py-2.5 text-gray-700 hover:text-blue-600 font-semibold transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Bold Blue */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-400 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/30">
              <Sparkles size={20} className="text-emerald-300" />
              <span className="text-white font-semibold text-lg">Enterprise Business Assessment Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight leading-none">
              Transform Your Business
              <span className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-green-300">
                Through 9 Strategic Lenses
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-2xl text-blue-100 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
              Evaluate 9 interconnected dimensions with 242+ assessment themes.
              Align your entire organization and drive measurable results with data-driven insights.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <button
                onClick={onNavigateToMultiAssessment}
                className="group bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-5 px-12 rounded-2xl shadow-2xl hover:shadow-emerald-500/50 transition-all text-xl flex items-center space-x-3"
              >
                <Users size={28} />
                <span>Start Free Assessment</span>
                <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button
                onClick={onNavigateToMetaStructure}
                className="group bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold py-5 px-12 rounded-2xl border-2 border-white/40 hover:border-white/60 transition-all text-xl flex items-center space-x-3"
              >
                <Eye size={28} />
                <span>Explore Framework</span>
              </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto pt-12 border-t border-white/30">
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-3">9</div>
                <div className="text-blue-200 font-semibold text-lg">Strategic Lenses</div>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-3">242+</div>
                <div className="text-blue-200 font-semibold text-lg">Assessment Themes</div>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-3">∞</div>
                <div className="text-blue-200 font-semibold text-lg">Team Members</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features - White with Colored Cards */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Powerful Tools for Leaders
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to assess, analyze, and transform your organization
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CEO Portal - Blue */}
            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all border-2 border-blue-200 hover:border-blue-400">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">CEO Portal</h3>
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                Executive dashboard with strategic priorities, key insights, and actionable recommendations across all 9 dimensions.
              </p>
              <button
                onClick={onNavigateToCEOPortal}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl text-lg"
              >
                <span>Launch Portal</span>
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Framework Explorer - Green */}
            <div className="group bg-gradient-to-br from-emerald-50 to-green-100 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all border-2 border-emerald-200 hover:border-emerald-400">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl">
                <Grid3x3 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Framework Explorer</h3>
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                Deep dive into 9 Vectors, 44 sub-lenses, and 242+ themes. Understand the complete assessment framework.
              </p>
              <button
                onClick={onNavigateToMetaStructure}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl text-lg"
              >
                <span>Explore Now</span>
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Analytics Dashboard - Blue-Green Gradient */}
            <div className="group bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all border-2 border-cyan-200 hover:border-cyan-400">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-cyan-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Analytics Dashboard</h3>
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                Powerful visualizations, stakeholder comparisons, and trend analysis for data-driven decision making.
              </p>
              <button
                onClick={onNavigateToDashboard}
                className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 hover:from-blue-700 hover:via-cyan-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl text-lg"
              >
                <span>View Dashboard</span>
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section - Alternating Blue/Green */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Why 9Vectors?
            </h2>
            <p className="text-2xl text-gray-600">The complete platform for business transformation</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Blue Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-10 text-center shadow-2xl">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-5">Comprehensive</h3>
              <p className="text-blue-100 leading-relaxed text-xl">
                242+ assessment themes across 9 interconnected strategic dimensions for complete visibility
              </p>
            </div>

            {/* Green Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-3xl p-10 text-center shadow-2xl">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-5">Collaborative</h3>
              <p className="text-emerald-100 leading-relaxed text-xl">
                Unlimited participants ensure every stakeholder voice is heard and aligned toward common goals
              </p>
            </div>

            {/* Blue Card */}
            <div className="bg-gradient-to-br from-blue-700 to-cyan-600 rounded-3xl p-10 text-center shadow-2xl">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                <LineChart className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-5">Data-Driven</h3>
              <p className="text-blue-100 leading-relaxed text-xl">
                Transform qualitative insights into quantitative strategies that deliver measurable results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Green Gradient */}
      <section className="relative bg-gradient-to-br from-emerald-700 via-green-600 to-emerald-800 overflow-hidden py-28">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-400 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-8">
            Ready to Transform?
          </h2>
          <p className="text-3xl text-emerald-100 mb-14 max-w-4xl mx-auto font-light">
            Join organizations worldwide using 9Vectors to drive excellence, alignment, and growth
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <button
              onClick={onNavigateToMultiAssessment}
              className="group bg-white hover:bg-gray-50 text-emerald-700 font-bold py-6 px-14 rounded-2xl shadow-2xl hover:shadow-white/20 transition-all text-2xl flex items-center justify-center gap-4"
            >
              <Users size={32} />
              <span>Start Free Assessment</span>
              <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button
              onClick={onNavigateToBooks}
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold py-6 px-14 rounded-2xl border-2 border-white/40 hover:border-white/60 transition-all text-2xl flex items-center justify-center gap-4"
            >
              <BookOpen size={32} />
              <span>Learn More</span>
            </button>
          </div>

          <p className="text-emerald-200 text-lg">No credit card required • Free forever plan available</p>
        </div>
      </section>

      {/* Footer Navigation */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <button
              onClick={onNavigateToStrategy}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-3 text-lg"
            >
              <Zap size={24} />
              Strategy
            </button>
            <button
              onClick={onNavigateToExplore}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-3 text-lg"
            >
              <Compass size={24} />
              Explore
            </button>
            <button
              onClick={onNavigateToBooks}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-3 text-lg"
            >
              <BookOpen size={24} />
              Books
            </button>
            <button
              onClick={onNavigateToAbout}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-3 text-lg"
            >
              <Shield size={24} />
              About
            </button>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">9L</span>
              </div>
              <span className="text-2xl font-bold text-white">9Vectors</span>
            </div>
            <p className="text-gray-400 text-lg">© 2025 9Vectors. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EnhancedLandingPage;
