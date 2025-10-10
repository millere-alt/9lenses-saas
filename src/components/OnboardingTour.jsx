import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useUIStore } from '../store/useStore';

const OnboardingTour = () => {
  const { onboardingComplete, setOnboardingComplete } = useUIStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show tour for new users
    if (!onboardingComplete) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, [onboardingComplete]);

  const steps = [
    {
      title: 'Welcome to 9Vectors! 🎉',
      description: 'Let\'s take a quick tour to help you get started with our platform.',
      action: 'Start Tour',
      highlight: null
    },
    {
      title: 'Explore the Dashboard',
      description: 'Your dashboard provides an overview of all your assessments, insights, and key metrics at a glance.',
      action: 'Next',
      highlight: '.dashboard'
    },
    {
      title: 'AI-Powered Insights',
      description: 'Access AI-powered strategy recommendations, predictive analytics, and automated action plans to guide your decisions.',
      action: 'Next',
      highlight: '.ai-features'
    },
    {
      title: 'Multi-Participant Assessments',
      description: 'Create comprehensive assessments with multiple participants to get a 360-degree view of your organization.',
      action: 'Next',
      highlight: '.assessments'
    },
    {
      title: 'Document Analysis',
      description: 'Upload and analyze documents with AI to extract insights, correlate data, and identify patterns.',
      action: 'Next',
      highlight: '.documents'
    },
    {
      title: 'You\'re All Set! ✨',
      description: 'You\'re ready to start using 9Vectors. Explore the platform and discover powerful insights about your organization.',
      action: 'Get Started',
      highlight: null
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setOnboardingComplete(true);
    localStorage.setItem('onboardingComplete', 'true');
  };

  const handleSkip = () => {
    setIsVisible(false);
    setOnboardingComplete(true);
    localStorage.setItem('onboardingComplete', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Skip Tour
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {currentStepData.title}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {currentStepData.description}
          </p>
        </div>

        {/* Visual indicator for current step */}
        {currentStep === 0 && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                9L
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">9Vectors Platform</h3>
                <p className="text-sm text-gray-600">Strategic Business Assessment Tool</p>
              </div>
            </div>
          </div>
        )}

        {/* Step-specific illustrations */}
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="mb-8 bg-gray-50 rounded-xl p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Feature Highlight</p>
            </div>
          </div>
        )}

        {currentStep === steps.length - 1 && (
          <div className="mb-8 bg-gradient-to-r from-blue-600 to-green-600 p-8 rounded-xl text-white text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium">Ready to transform your business insights!</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            {currentStepData.action}
            {currentStep < steps.length - 1 && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
