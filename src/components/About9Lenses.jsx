import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target, BarChart3, Zap, ArrowRight, Users, DollarSign,
  TrendingUp, Cog, Building2, Shield, Lightbulb, Globe,
  Sparkles, CheckCircle2, Eye, Rocket
} from 'lucide-react';

function About9Lenses() {
  const navigate = useNavigate();
  const [activePhase, setActivePhase] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const phases = [
    {
      title: 'Assets',
      description: 'The foundational resources that power your business',
      icon: Target,
      color: 'emerald',
      gradient: 'from-emerald-400 via-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      lenses: [
        {
          number: 1,
          title: 'Customers',
          icon: Users,
          description: 'Understanding customer needs, satisfaction, and loyalty',
          keywords: ['Customer Satisfaction', 'Market Share', 'Customer Retention', 'NPS Score']
        },
        {
          number: 2,
          title: 'Financials',
          icon: DollarSign,
          description: 'Analyzing financial health, resources, and stability',
          keywords: ['Revenue Growth', 'Profitability', 'Cash Flow', 'Financial Ratios']
        },
        {
          number: 3,
          title: 'Human Resources',
          icon: Users,
          description: 'Evaluating talent, culture, and organizational capability',
          keywords: ['Talent Acquisition', 'Employee Engagement', 'Skills Gap', 'Culture']
        }
      ]
    },
    {
      title: 'Processes',
      description: 'How you execute and deliver value',
      icon: Zap,
      color: 'teal',
      gradient: 'from-teal-400 via-cyan-500 to-blue-500',
      bgGradient: 'from-teal-50 to-cyan-50',
      lenses: [
        {
          number: 4,
          title: 'Strategy',
          icon: Lightbulb,
          description: 'Strategic direction, planning, and competitive positioning',
          keywords: ['Vision & Mission', 'Strategic Goals', 'Competitive Analysis', 'Market Position']
        },
        {
          number: 5,
          title: 'Sales & Marketing',
          icon: TrendingUp,
          description: 'Go-to-market effectiveness and revenue generation',
          keywords: ['Lead Generation', 'Conversion Rates', 'Brand Awareness', 'Sales Pipeline']
        },
        {
          number: 6,
          title: 'Operations',
          icon: Cog,
          description: 'Operational efficiency, quality, and delivery excellence',
          keywords: ['Process Efficiency', 'Quality Control', 'Supply Chain', 'Productivity']
        }
      ]
    },
    {
      title: 'Structures',
      description: 'The frameworks that guide your organization',
      icon: BarChart3,
      color: 'blue',
      gradient: 'from-blue-400 via-blue-500 to-indigo-500',
      bgGradient: 'from-blue-50 to-indigo-50',
      lenses: [
        {
          number: 7,
          title: 'Sustainability',
          icon: Globe,
          description: 'Long-term viability, social impact, and environmental responsibility',
          keywords: ['ESG Practices', 'Risk Management', 'Compliance', 'Stakeholder Value']
        },
        {
          number: 8,
          title: 'Systems & Processes',
          icon: Shield,
          description: 'Technology infrastructure, systems integration, and process maturity',
          keywords: ['IT Systems', 'Automation', 'Data Management', 'Process Documentation']
        },
        {
          number: 9,
          title: 'Organizational',
          icon: Building2,
          description: 'Organizational structure, governance, and decision-making',
          keywords: ['Org Structure', 'Leadership', 'Decision Rights', 'Accountability']
        }
      ]
    }
  ];

  const benefits = [
    {
      icon: Eye,
      title: 'Comprehensive Visibility',
      description: '360-degree view of organizational health across all critical dimensions'
    },
    {
      icon: TrendingUp,
      title: 'Data-Driven Decisions',
      description: 'Actionable insights backed by quantitative and qualitative analysis'
    },
    {
      icon: Users,
      title: 'Stakeholder Alignment',
      description: 'Compare perspectives across teams, departments, and leadership'
    },
    {
      icon: Rocket,
      title: 'Strategic Roadmap',
      description: 'Prioritized recommendations for transformational growth'
    }
  ];

  return (
    <div className="relative">
      {/* Parallax Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-emerald-300/30 to-teal-400/30 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
        <div
          className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-gradient-to-tr from-blue-300/30 to-indigo-400/30 rounded-full blur-3xl"
          style={{ transform: `translateY(${-scrollY * 0.15}px)` }}
        />
      </div>

      <div className="max-w-7xl mx-auto space-y-20">
        {/* Hero Header */}
        <div className="text-center relative">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-blue-50 px-6 py-3 rounded-full border-2 border-emerald-200 shadow-lg mb-8">
            <Sparkles size={20} className="text-emerald-600" />
            <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              The Complete Assessment Framework
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight">
            About 9Lenses
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto font-medium leading-relaxed">
            A comprehensive framework for evaluating organizational health across
            <span className="block mt-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent font-bold">
              Three Strategic Phases & Nine Critical Lenses
            </span>
          </p>
        </div>

        {/* Interactive Phase Selector */}
        <div className="flex justify-center gap-4 mb-12">
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <button
                key={index}
                onClick={() => setActivePhase(index)}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 ${
                  activePhase === index ? 'scale-110 shadow-2xl' : 'scale-100 shadow-lg hover:scale-105'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${phase.gradient} ${
                  activePhase === index ? 'opacity-100' : 'opacity-70 group-hover:opacity-90'
                } transition-opacity`} />

                <div className="relative px-8 py-6 text-white">
                  <Icon className="w-8 h-8 mb-2 mx-auto" />
                  <div className="font-bold text-lg">{phase.title}</div>
                </div>

                {activePhase === index && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1.5 bg-white rounded-t-full"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Phase Details - Animated */}
        <div className="relative min-h-[600px]">
          {phases.map((phase, phaseIndex) => (
            <div
              key={phaseIndex}
              className={`absolute inset-0 transition-all duration-700 ${
                activePhase === phaseIndex
                  ? 'opacity-100 translate-x-0'
                  : activePhase > phaseIndex
                  ? 'opacity-0 -translate-x-full'
                  : 'opacity-0 translate-x-full'
              }`}
            >
              {/* Phase Header */}
              <div className={`bg-gradient-to-r ${phase.bgGradient} rounded-3xl p-12 mb-8 shadow-xl`}>
                <div className="flex items-center justify-center mb-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${phase.gradient} flex items-center justify-center shadow-2xl`}>
                    {React.createElement(phase.icon, { className: 'w-10 h-10 text-white' })}
                  </div>
                </div>
                <h2 className={`text-5xl font-black text-center mb-4 text-${phase.color}-700`}>
                  {phase.title}
                </h2>
                <p className="text-xl text-gray-700 text-center max-w-2xl mx-auto font-medium">
                  {phase.description}
                </p>
              </div>

              {/* Lenses Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {phase.lenses.map((lens, lensIndex) => {
                  const LensIcon = lens.icon;
                  return (
                    <div
                      key={lensIndex}
                      className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-gray-100 overflow-hidden"
                      style={{ animationDelay: `${lensIndex * 100}ms` }}
                    >
                      {/* Gradient Background on Hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${phase.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                      {/* Lens Number Badge */}
                      <div className="absolute top-6 right-6">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${phase.gradient} flex items-center justify-center shadow-lg`}>
                          <span className="text-white font-black text-lg">{lens.number}</span>
                        </div>
                      </div>

                      {/* Icon */}
                      <div className="relative mb-6">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${phase.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                          <LensIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className={`text-2xl font-black text-gray-800 mb-3 group-hover:text-${phase.color}-600 transition-colors`}>
                        {lens.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {lens.description}
                      </p>

                      {/* Keywords */}
                      <div className="space-y-2">
                        {lens.keywords.map((keyword, kidx) => (
                          <div key={kidx} className="flex items-center space-x-2">
                            <CheckCircle2 className={`w-4 h-4 text-${phase.color}-500`} />
                            <span className="text-sm text-gray-600">{keyword}</span>
                          </div>
                        ))}
                      </div>

                      {/* Hover Arrow */}
                      <ArrowRight className={`absolute bottom-8 right-8 w-6 h-6 text-${phase.color}-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500`} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-16 shadow-2xl">
          <h2 className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4 text-center">
            Why Use 9Lenses?
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Transform your organization with comprehensive insights and actionable intelligence
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-700" />

          {/* Animated Orbs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400 rounded-full opacity-30 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full opacity-30 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

          <div className="relative p-16 text-center">
            <Rocket className="w-16 h-16 text-white mx-auto mb-6 animate-bounce" />

            <h2 className="text-5xl font-black text-white mb-6">
              Ready to Transform Your Organization?
            </h2>
            <p className="text-2xl text-emerald-100 mb-10 max-w-3xl mx-auto">
              Launch your comprehensive 9Lenses assessment and unlock strategic insights for sustainable excellence
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => navigate('/ceo-dashboard')}
                className="group relative overflow-hidden bg-white text-emerald-700 font-black py-6 px-12 rounded-2xl shadow-2xl hover:shadow-white/50 transition-all duration-500 hover:scale-110 flex items-center justify-center space-x-3 text-xl"
              >
                <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <span>Start Assessment</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/how-it-works')}
                className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-6 px-12 rounded-2xl border-2 border-white/30 hover:border-white/60 transition-all duration-300 flex items-center justify-center space-x-3 text-xl"
              >
                <Lightbulb className="w-6 h-6" />
                <span>How It Works</span>
              </button>
            </div>

            <div className="mt-12 pt-12 border-t border-white/30 flex items-center justify-center space-x-8 text-white/90">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span>180+ assessment themes</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span>Expert support included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About9Lenses;
