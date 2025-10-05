import React from 'react';
import { ArrowLeft, Target, Grid3x3, TrendingUp, ArrowRight } from 'lucide-react';

const ExplorePage = ({ onNavigateToHome, onNavigateToCEOPortal, onNavigateToMetaStructure, onNavigateToDashboard }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Salesforce Header */}
      <header className="bg-salesforce-blue text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Explore the Platform
            </h1>
            <p className="text-blue-100 mt-1">
              Access powerful tools for business assessment and strategic insights
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* CEO Portal */}
            <button
              onClick={onNavigateToCEOPortal}
              className="group bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:border-salesforce-blue hover:shadow-md transition-all text-left"
            >
              <div className="w-12 h-12 bg-salesforce-blue rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">CEO Portal</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Executive overview of all 9 Lenses with priority areas and actionable insights
              </p>
              <div className="flex items-center gap-2 text-salesforce-blue font-semibold">
                View Portal
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Meta-Structure */}
            <button
              onClick={onNavigateToMetaStructure}
              className="group bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:border-salesforce-blue hover:shadow-md transition-all text-left"
            >
              <div className="w-12 h-12 bg-salesforce-blue rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Grid3x3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Framework Explorer</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Dive deep into 9 Lenses, 44 sub-lenses, and 242+ themes for comprehensive analysis
              </p>
              <div className="flex items-center gap-2 text-salesforce-blue font-semibold">
                Explore Framework
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* View Dashboard */}
            <button
              onClick={onNavigateToDashboard}
              className="group bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:border-salesforce-blue hover:shadow-md transition-all text-left"
            >
              <div className="w-12 h-12 bg-salesforce-blue rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics Dashboard</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Interactive visualizations, stakeholder comparisons, and trend analysis
              </p>
              <div className="flex items-center gap-2 text-salesforce-blue font-semibold">
                View Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;
