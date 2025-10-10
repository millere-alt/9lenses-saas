import React from 'react';
import { ArrowLeft } from 'lucide-react';
import CompanyStrategy from './CompanyStrategy';

const StrategyPage = ({ onNavigateToHome }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Salesforce Header */}
      <header className="bg-salesforce-blue text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Company Strategy
          </h1>
          <p className="text-blue-100 mt-1">
            Define and manage your company's vision, mission, and strategic objectives
          </p>
        </div>
      </header>

      {/* Strategy Component */}
      <div className="py-8">
        <CompanyStrategy />
      </div>
    </div>
  );
};

export default StrategyPage;
