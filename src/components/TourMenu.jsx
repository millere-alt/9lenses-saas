import React, { useState } from 'react';
import {
  Play,
  GraduationCap,
  X,
  Clock,
  CheckCircle,
  Circle,
  Info
} from 'lucide-react';
import { useGuidedTour } from '../contexts/GuidedTourContext';
import { AVAILABLE_TOURS } from '../data/tourSteps';

/**
 * Tour Menu Component
 * Allows users to select and start different tours
 */
const TourMenu = ({ isOpen, onClose }) => {
  const { startTour, completedTours, resetTourProgress } = useGuidedTour();

  const handleStartTour = (tourId) => {
    startTour(tourId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Guided Tours</h2>
                <p className="text-white/90 text-sm">
                  Learn about 9Lenses with interactive walkthroughs
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tours List */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {AVAILABLE_TOURS.map((tour) => {
              const isCompleted = completedTours.includes(tour.id);

              return (
                <div
                  key={tour.id}
                  className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 hover:border-indigo-300 rounded-xl p-5 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {tour.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            {tour.name}
                            {isCompleted && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {tour.description}
                          </p>
                        </div>
                      </div>

                      {/* Meta info */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{tour.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Circle className="w-4 h-4" />
                          <span>{tour.steps} steps</span>
                        </div>
                      </div>

                      {/* Start button */}
                      <button
                        onClick={() => handleStartTour(tour.id)}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <Play className="w-4 h-4" />
                        {isCompleted ? 'Take Again' : 'Start Tour'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Help section */}
          <div className="mt-6 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-indigo-900 mb-1">
                  Tours include AI coaching
                </p>
                <p className="text-indigo-700">
                  Each tour is enhanced with contextual AI guidance. The AI coach
                  will provide additional insights and answer questions as you progress.
                </p>
              </div>
            </div>
          </div>

          {/* Reset button (for testing) */}
          {completedTours.length > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  if (confirm('Reset all tour progress? This will allow you to see welcome tours again.')) {
                    resetTourProgress();
                  }
                }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Reset all tour progress
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Tour Menu Trigger Button
 */
export const TourMenuButton = ({ variant = 'button', className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={() => setIsMenuOpen(true)}
          className={`p-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-lg transition-all ${className}`}
          aria-label="Open guided tours"
        >
          <GraduationCap className="w-5 h-5" />
        </button>
        <TourMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsMenuOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${className}`}
      >
        <GraduationCap className="w-5 h-5" />
        Guided Tours
      </button>
      <TourMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default TourMenu;
