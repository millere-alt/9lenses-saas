import React from 'react';
import { useNavigate } from 'react-router-dom';

function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About 9Vectors
          </h1>
          <p className="text-2xl text-gray-600">
            A comprehensive framework for business assessment
          </p>
        </div>

        {/* Overview */}
        <div className="mb-16">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What is 9Vectors?</h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              9Vectors is a comprehensive business assessment framework that evaluates organizations
              across <strong>9 critical dimensions</strong>, organized into <strong>3 strategic phases</strong>.
              It combines quantitative scoring (0-9 ratings) with qualitative insights (comments)
              to provide a complete picture of organizational health.
            </p>
          </div>
        </div>

        {/* The 3 Phases */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">
            The 3 Strategic Phases
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Phase 1 */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-blue-700 mb-6">PHASE 1: ASSETS</h3>
              <p className="text-base text-gray-700 mb-6">Foundation of your business</p>
              <ul className="space-y-4">
                <li className="border-b border-blue-200 pb-3">
                  <div className="font-bold text-lg text-gray-900">Market</div>
                  <p className="text-sm text-gray-600">Market opportunity and competitive landscape</p>
                </li>
                <li className="border-b border-blue-200 pb-3">
                  <div className="font-bold text-lg text-gray-900">People</div>
                  <p className="text-sm text-gray-600">Human capital and organizational culture</p>
                </li>
                <li>
                  <div className="font-bold text-lg text-gray-900">Financial</div>
                  <p className="text-sm text-gray-600">Financial resources and stability</p>
                </li>
              </ul>
            </div>

            {/* Phase 2 */}
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-green-700 mb-6">PHASE 2: PROCESSES</h3>
              <p className="text-base text-gray-700 mb-6">How you operate</p>
              <ul className="space-y-4">
                <li className="border-b border-green-200 pb-3">
                  <div className="font-bold text-lg text-gray-900">Strategy</div>
                  <p className="text-sm text-gray-600">Strategic planning and direction</p>
                </li>
                <li className="border-b border-green-200 pb-3">
                  <div className="font-bold text-lg text-gray-900">Operations</div>
                  <p className="text-sm text-gray-600">Operational efficiency and effectiveness</p>
                </li>
                <li>
                  <div className="font-bold text-lg text-gray-900">Execution</div>
                  <p className="text-sm text-gray-600">Implementation and delivery</p>
                </li>
              </ul>
            </div>

            {/* Phase 3 */}
            <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-purple-700 mb-6">PHASE 3: STRUCTURES</h3>
              <p className="text-base text-gray-700 mb-6">Governance and compliance</p>
              <ul className="space-y-4">
                <li className="border-b border-purple-200 pb-3">
                  <div className="font-bold text-lg text-gray-900">Expectations</div>
                  <p className="text-sm text-gray-600">Stakeholder expectations and alignment</p>
                </li>
                <li className="border-b border-purple-200 pb-3">
                  <div className="font-bold text-lg text-gray-900">Governance</div>
                  <p className="text-sm text-gray-600">Leadership and decision-making</p>
                </li>
                <li>
                  <div className="font-bold text-lg text-gray-900">Entity</div>
                  <p className="text-sm text-gray-600">Organizational structure and legal framework</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">
            How 9Vectors Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Invite</h3>
              <p className="text-base text-gray-600">Invite stakeholders to participate</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Assess</h3>
              <p className="text-base text-gray-600">Rate themes 0-9 with comments</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Analyze</h3>
              <p className="text-base text-gray-600">Review insights and gaps</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Act</h3>
              <p className="text-base text-gray-600">Create action plans</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate('/assessment/launch')}
            className="px-16 py-6 bg-blue-600 text-white rounded-lg font-bold text-2xl hover:bg-blue-700 shadow-lg"
          >
            Launch Your First Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
