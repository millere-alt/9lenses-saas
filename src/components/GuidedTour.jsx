import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Bot,
  Sparkles,
  SkipForward,
  Check
} from 'lucide-react';
import { useGuidedTour } from '../contexts/GuidedTourContext';

/**
 * Guided Tour Overlay Component
 * Shows the current tour step with spotlight and guidance
 */
const GuidedTour = () => {
  const {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    progress,
    handleAction,
    skipTour,
    isTransitioning
  } = useGuidedTour();

  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [spotlightPosition, setSpotlightPosition] = useState(null);
  const tooltipRef = useRef(null);

  // Calculate positions for tooltip and spotlight
  useEffect(() => {
    if (!isActive || !currentStep) return;

    const calculatePositions = () => {
      if (currentStep.target === 'body' || currentStep.placement === 'center') {
        // Center positioning
        setSpotlightPosition(null);
        setTooltipPosition({ centered: true });
        return;
      }

      const targetElement = document.querySelector(currentStep.target);
      if (!targetElement) {
        setSpotlightPosition(null);
        setTooltipPosition({ centered: true });
        return;
      }

      const targetRect = targetElement.getBoundingClientRect();
      const padding = 8;

      // Spotlight position
      setSpotlightPosition({
        top: targetRect.top - padding,
        left: targetRect.left - padding,
        width: targetRect.width + padding * 2,
        height: targetRect.height + padding * 2
      });

      // Tooltip position based on placement
      const tooltipElement = tooltipRef.current;
      if (!tooltipElement) return;

      const tooltipRect = tooltipElement.getBoundingClientRect();
      const gap = 16;

      let top, left;

      switch (currentStep.placement) {
        case 'top':
          top = targetRect.top - tooltipRect.height - gap;
          left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          break;
        case 'bottom':
          top = targetRect.bottom + gap;
          left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          break;
        case 'left':
          top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          left = targetRect.left - tooltipRect.width - gap;
          break;
        case 'right':
          top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          left = targetRect.right + gap;
          break;
        default:
          top = targetRect.bottom + gap;
          left = targetRect.left;
      }

      // Keep tooltip in viewport
      const margin = 16;
      if (left < margin) left = margin;
      if (left + tooltipRect.width > window.innerWidth - margin) {
        left = window.innerWidth - tooltipRect.width - margin;
      }
      if (top < margin) top = targetRect.bottom + gap;
      if (top + tooltipRect.height > window.innerHeight - margin) {
        top = targetRect.top - tooltipRect.height - gap;
      }

      setTooltipPosition({ top, left });
    };

    calculatePositions();
    window.addEventListener('resize', calculatePositions);
    window.addEventListener('scroll', calculatePositions);

    return () => {
      window.removeEventListener('resize', calculatePositions);
      window.removeEventListener('scroll', calculatePositions);
    };
  }, [isActive, currentStep, currentStepIndex]);

  // Add pulse animation to highlighted element
  useEffect(() => {
    if (!currentStep?.pulseElement || !currentStep.highlightElement) return;

    const element = document.querySelector(currentStep.highlightElement);
    if (element) {
      element.classList.add('tour-pulse');
      return () => element.classList.remove('tour-pulse');
    }
  }, [currentStep]);

  if (!isActive || !currentStep) return null;

  return (
    <>
      {/* Overlay with spotlight */}
      <div className="fixed inset-0 z-[9998] pointer-events-none">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Spotlight hole */}
        {spotlightPosition && (
          <div
            className="absolute bg-transparent border-4 border-white/20 rounded-xl shadow-2xl transition-all duration-300"
            style={{
              top: spotlightPosition.top,
              left: spotlightPosition.left,
              width: spotlightPosition.width,
              height: spotlightPosition.height,
              boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.6),
                          0 0 20px rgba(99, 102, 241, 0.3),
                          inset 0 0 20px rgba(99, 102, 241, 0.1)`
            }}
          />
        )}
      </div>

      {/* Tooltip/Card */}
      <div
        ref={tooltipRef}
        className={`fixed z-[9999] pointer-events-auto transition-opacity duration-300 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        style={
          tooltipPosition.centered
            ? {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }
            : {
                top: tooltipPosition.top,
                left: tooltipPosition.left
              }
        }
      >
        <TourTooltip
          step={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          progress={progress}
          onAction={handleAction}
          onSkip={skipTour}
        />
      </div>

      {/* Add pulse animation styles */}
      <style jsx>{`
        @keyframes tour-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
          }
        }
        .tour-pulse {
          animation: tour-pulse 2s infinite;
        }
      `}</style>
    </>
  );
};

/**
 * Tour Tooltip Component
 */
const TourTooltip = ({ step, currentStepIndex, totalSteps, progress, onAction, onSkip }) => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-indigo-200 max-w-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 text-white">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-xl font-bold flex items-center gap-2">
              {step.title}
              {step.showAICoach && (
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              )}
            </h3>
          </div>
          <button
            onClick={onSkip}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Skip tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 text-sm text-white/90">
          <div className="flex-1 bg-white/20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-medium whitespace-nowrap">
            {currentStepIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="prose prose-sm max-w-none text-gray-700 mb-6">
          {step.content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-3 last:mb-0 leading-relaxed">
              {paragraph.split('**').map((part, j) =>
                j % 2 === 0 ? (
                  part
                ) : (
                  <strong key={j} className="font-semibold text-gray-900">
                    {part}
                  </strong>
                )
              )}
            </p>
          ))}
        </div>

        {/* Actions */}
        {step.actions && step.actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {step.actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => onAction(action.action)}
                className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                  action.variant === 'primary'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                    : action.variant === 'secondary'
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-600'
                } flex items-center justify-center gap-2`}
              >
                {action.label}
                {action.action === 'next' && <ChevronRight className="w-4 h-4" />}
                {action.action === 'prev' && <ChevronLeft className="w-4 h-4" />}
                {action.action === 'skip' && <SkipForward className="w-4 h-4" />}
                {action.action === 'complete' && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        )}

        {/* AI Coach indicator */}
        {step.showAICoach && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-indigo-600">
              <Bot className="w-4 h-4" />
              <span className="font-medium">AI Coach is ready to help with this topic</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuidedTour;
