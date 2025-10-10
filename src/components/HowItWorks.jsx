import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, FileInput, BarChart3, Lightbulb, ArrowRight, Sparkles,
  Mail, CheckCircle2, TrendingUp, Rocket, Clock, Target,
  Eye, Play, Shield, Zap
} from 'lucide-react';

function HowItWorks() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      number: 1,
      title: 'Invite Team',
      subtitle: 'Collaborate Across Your Organization',
      icon: Users,
      gradient: 'from-emerald-400 via-emerald-500 to-teal-500',
      color: 'emerald',
      description: 'Invite stakeholders to participate in the comprehensive assessment',
      details: [
        'Send email invitations to key stakeholders',
        'Each participant receives a unique secure link',
        'Track invitation status and responses in real-time',
        'Customize assessment permissions by role'
      ],
      features: [
        { icon: Mail, text: 'Email invitations with tracking' },
        { icon: Shield, text: 'Secure unique access links' },
        { icon: Users, text: 'Multi-stakeholder collaboration' }
      ]
    },
    {
      number: 2,
      title: 'Assess',
      subtitle: 'Evaluate Your Organization',
      icon: FileInput,
      gradient: 'from-teal-400 via-cyan-500 to-blue-500',
      color: 'teal',
      description: 'Rate each theme from 0-9 and provide qualitative feedback',
      details: [
        'Evaluate 180+ themes across 9 critical lenses',
        'Rate on a 0-9 scale with contextual guidance',
        'Add qualitative comments and insights',
        'Save progress and resume anytime'
      ],
      features: [
        { icon: Target, text: '180+ assessment themes' },
        { icon: BarChart3, text: '0-9 rating scale' },
        { icon: CheckCircle2, text: 'Save & resume progress' }
      ]
    },
    {
      number: 3,
      title: 'Analyze',
      subtitle: 'Discover Insights & Patterns',
      icon: BarChart3,
      gradient: 'from-blue-400 via-blue-500 to-indigo-500',
      color: 'blue',
      description: 'View aggregated scores and identify strengths and gaps',
      details: [
        'Interactive dashboards with real-time data',
        'Compare perspectives across stakeholders',
        'Identify consensus areas and divergence',
        'Export comprehensive reports and analytics'
      ],
      features: [
        { icon: Eye, text: 'Visual analytics dashboard' },
        { icon: TrendingUp, text: 'Trend analysis & benchmarks' },
        { icon: Users, text: 'Stakeholder comparison' }
      ]
    },
    {
      number: 4,
      title: 'Transform',
      subtitle: 'Take Action & Grow',
      icon: Lightbulb,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      color: 'emerald',
      description: 'Execute strategic initiatives to improve organizational health',
      details: [
        'AI-powered recommendations for improvement',
        'Prioritized action plans by impact',
        'Track progress with follow-up assessments',
        'Measure ROI and transformation metrics'
      ],
      features: [
        { icon: Lightbulb, text: 'Strategic recommendations' },
        { icon: Rocket, text: 'Prioritized action plans' },
        { icon: TrendingUp, text: 'Progress tracking' }
      ]
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'Fast Setup',
      description: 'Launch in minutes, not days'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level data encryption'
    },
    {
      icon: Users,
      title: 'Unlimited Participants',
      description: 'Scale across your organization'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Analytics',
      description: 'Live dashboards and insights'
    }
  ];

  return (
    <div className="relative">
      {/* Parallax Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-teal-300/30 to-blue-400/30 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
        <div
          className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-300/30 to-cyan-400/30 rounded-full blur-3xl"
          style={{ transform: `translateY(${-scrollY * 0.15}px)` }}
        />
      </div>

      <div className="max-w-7xl mx-auto space-y-20">
        {/* Hero Header */}
        <div className="text-center relative">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-50 to-blue-50 px-6 py-3 rounded-full border-2 border-teal-200 shadow-lg mb-8">
            <Sparkles size={20} className="text-teal-600" />
            <span className="text-sm font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Simple Process, Powerful Results
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight">
            How It Works
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto font-medium leading-relaxed">
            From assessment to action in
            <span className="block mt-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent font-bold">
              Four Simple Steps
            </span>
          </p>
        </div>

        {/* Timeline - Visual Progress Flow */}
        <div className="relative">
          {/* Progress Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-emerald-200 via-teal-300 via-blue-300 to-emerald-200 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-full transition-all duration-1000"
              style={{ width: `${((activeStep + 1) / 4) * 100}%` }}
            />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;

              return (
                <div
                  key={index}
                  className={`relative transition-all duration-700 ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                  onMouseEnter={() => setActiveStep(index)}
                >
                  {/* Step Card */}
                  <div className={`relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 ${
                    isActive ? `border-${step.color}-300` : 'border-gray-100'
                  } overflow-hidden`}>
                    {/* Background Gradient on Active */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} ${
                      isActive ? 'opacity-10' : 'opacity-0'
                    } transition-opacity duration-500`} />

                    {/* Step Number Badge */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className={`w-14 h-14 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center shadow-2xl ${
                        isActive ? 'scale-125' : 'scale-100'
                      } transition-transform duration-500`}>
                        <span className="text-white font-black text-xl">{step.number}</span>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="relative mt-8 mb-6">
                      <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mx-auto shadow-lg ${
                        isActive ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
                      } transition-all duration-500`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-black text-gray-800 mb-2 text-center">
                      {step.title}
                    </h3>
                    <p className={`text-sm font-semibold text-${step.color}-600 mb-4 text-center`}>
                      {step.subtitle}
                    </p>
                    <p className="text-gray-600 text-center mb-4 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1.5 bg-gradient-to-r from-transparent via-current to-transparent rounded-t-full" style={{ color: `var(--${step.color}-500)` }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Step Breakdown */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-16 shadow-2xl">
          <h2 className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-12 text-center">
            Detailed Process
          </h2>

          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                >
                  <div className="flex gap-6">
                    {/* Icon & Number */}
                    <div className="flex-shrink-0">
                      <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center shadow-md`}>
                          <span className="text-white font-black text-lg">{step.number}</span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-800 group-hover:text-teal-600 transition-colors">
                          {step.title}
                        </h3>
                      </div>

                      <p className="text-lg text-gray-600 mb-6 font-medium">
                        {step.subtitle}
                      </p>

                      {/* Details List */}
                      <div className="grid md:grid-cols-2 gap-3 mb-6">
                        {step.details.map((detail, didx) => (
                          <div key={didx} className="flex items-start space-x-3">
                            <CheckCircle2 className={`w-5 h-5 text-${step.color}-500 mt-0.5 flex-shrink-0`} />
                            <span className="text-gray-700 text-sm">{detail}</span>
                          </div>
                        ))}
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-4">
                        {step.features.map((feature, fidx) => {
                          const FeatureIcon = feature.icon;
                          return (
                            <div
                              key={fidx}
                              className={`flex items-center space-x-2 bg-gradient-to-r ${step.gradient} bg-opacity-10 px-4 py-2 rounded-xl`}
                            >
                              <FeatureIcon className={`w-4 h-4 text-${step.color}-600`} />
                              <span className="text-sm font-semibold text-gray-700">{feature.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-700" />

          {/* Animated Orbs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-teal-400 rounded-full opacity-30 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full opacity-30 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

          <div className="relative p-16 text-center">
            <Rocket className="w-16 h-16 text-white mx-auto mb-6 animate-bounce" />

            <h2 className="text-5xl font-black text-white mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-2xl text-teal-100 mb-10 max-w-3xl mx-auto">
              Launch your 9Lenses assessment today and start transforming your organization
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => navigate('/assessment/launch')}
                className="group relative overflow-hidden bg-white text-teal-700 font-black py-6 px-12 rounded-2xl shadow-2xl hover:shadow-white/50 transition-all duration-500 hover:scale-110 flex items-center justify-center space-x-3 text-xl"
              >
                <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <span>Launch Assessment</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-6 px-12 rounded-2xl border-2 border-white/30 hover:border-white/60 transition-all duration-300 flex items-center justify-center space-x-3 text-xl"
              >
                <Play className="w-6 h-6" />
                <span>View Demo</span>
              </button>
            </div>

            <div className="mt-12 pt-12 border-t border-white/30 flex items-center justify-center space-x-8 text-white/90">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-teal-300" />
                <span>Quick 5-minute setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-teal-300" />
                <span>No credit card needed</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-teal-300" />
                <span>Free trial included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
