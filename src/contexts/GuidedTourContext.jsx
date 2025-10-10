import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTourByType, TOUR_TYPES } from '../data/tourSteps';
import { useAICoaching } from './AICoachingContext';

const GuidedTourContext = createContext(null);

export const useGuidedTour = () => {
  const context = useContext(GuidedTourContext);
  if (!context) {
    throw new Error('useGuidedTour must be used within GuidedTourProvider');
  }
  return context;
};

export const GuidedTourProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentTourType, setCurrentTourType] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [tourSteps, setTourSteps] = useState([]);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [completedTours, setCompletedTours] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = useNavigate();
  const { showCoach, askQuestion, requestCoaching, hideCoach } = useAICoaching();

  // Load tour preferences from localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('9Vectors_tour_prefs');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setHasSeenWelcome(prefs.hasSeenWelcome || false);
      setCompletedTours(prefs.completedTours || []);
    }
  }, []);

  // Save preferences
  const savePreferences = useCallback((prefs) => {
    const current = JSON.parse(localStorage.getItem('9Vectors_tour_prefs') || '{}');
    const updated = { ...current, ...prefs };
    localStorage.setItem('9Vectors_tour_prefs', JSON.stringify(updated));
  }, []);

  // Start a tour
  const startTour = useCallback((tourType = TOUR_TYPES.FIRST_TIME) => {
    const steps = getTourByType(tourType);
    setTourSteps(steps);
    setCurrentTourType(tourType);
    setCurrentStepIndex(0);
    setIsActive(true);
    setIsTransitioning(false);

    // Mark as seen
    if (tourType === TOUR_TYPES.FIRST_TIME) {
      setHasSeenWelcome(true);
      savePreferences({ hasSeenWelcome: true });
    }
  }, [savePreferences]);

  // End tour
  const endTour = useCallback((completed = false) => {
    setIsActive(false);
    setIsTransitioning(false);
    hideCoach();

    if (completed && currentTourType) {
      const updated = [...completedTours, currentTourType];
      setCompletedTours(updated);
      savePreferences({ completedTours: updated });
    }

    // Reset after a delay to allow animations
    setTimeout(() => {
      setCurrentTourType(null);
      setCurrentStepIndex(0);
      setTourSteps([]);
    }, 300);
  }, [currentTourType, completedTours, savePreferences, hideCoach]);

  // Navigate to next step
  const nextStep = useCallback(async () => {
    const currentStep = tourSteps[currentStepIndex];

    // Trigger AI coaching if configured
    if (currentStep?.showAICoach && currentStep?.aiContext) {
      showCoach();
      if (currentStep.aiContext.userQuestion) {
        await askQuestion(currentStep.aiContext.userQuestion, currentStep.aiContext.workflow);
      } else if (currentStep.aiContext.message) {
        await requestCoaching({
          workflow: currentStep.aiContext.workflow || 'learning',
          mode: 'proactive'
        });
      }
    }

    if (currentStepIndex < tourSteps.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
        setIsTransitioning(false);

        // Scroll to highlighted element
        const nextStep = tourSteps[currentStepIndex + 1];
        if (nextStep?.target && nextStep.target !== 'body') {
          setTimeout(() => {
            const element = document.querySelector(nextStep.target);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        }
      }, 200);
    } else {
      endTour(true);
    }
  }, [currentStepIndex, tourSteps, showCoach, askQuestion, requestCoaching, endTour]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex - 1);
        setIsTransitioning(false);

        // Scroll to highlighted element
        const prevStepData = tourSteps[currentStepIndex - 1];
        if (prevStepData?.target && prevStepData.target !== 'body') {
          setTimeout(() => {
            const element = document.querySelector(prevStepData.target);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        }
      }, 200);
    }
  }, [currentStepIndex, tourSteps]);

  // Skip tour
  const skipTour = useCallback(() => {
    endTour(false);
  }, [endTour]);

  // Go to specific step
  const goToStep = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < tourSteps.length) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex(stepIndex);
        setIsTransitioning(false);
      }, 200);
    }
  }, [tourSteps]);

  // Handle tour actions
  const handleAction = useCallback(async (action) => {
    if (action.startsWith('navigate:')) {
      const path = action.split(':')[1];
      navigate(path);
      endTour(true);
    } else if (action === 'next') {
      await nextStep();
    } else if (action === 'prev') {
      prevStep();
    } else if (action === 'skip') {
      skipTour();
    } else if (action === 'complete') {
      endTour(true);
    } else if (action === 'ai-coach-opened') {
      // User performed the requested action
      await nextStep();
    }
  }, [navigate, nextStep, prevStep, skipTour, endTour]);

  // Reset tour progress (for testing)
  const resetTourProgress = useCallback(() => {
    setHasSeenWelcome(false);
    setCompletedTours([]);
    savePreferences({ hasSeenWelcome: false, completedTours: [] });
  }, [savePreferences]);

  // Check if should auto-start welcome tour
  useEffect(() => {
    if (!hasSeenWelcome && window.location.pathname === '/') {
      // Auto-start welcome tour after a short delay
      const timer = setTimeout(() => {
        startTour(TOUR_TYPES.FIRST_TIME);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenWelcome, startTour]);

  const currentStep = tourSteps[currentStepIndex];
  const progress = tourSteps.length > 0 ? ((currentStepIndex + 1) / tourSteps.length) * 100 : 0;

  const value = {
    // State
    isActive,
    currentTourType,
    currentStep,
    currentStepIndex,
    totalSteps: tourSteps.length,
    progress,
    hasSeenWelcome,
    completedTours,
    isTransitioning,

    // Actions
    startTour,
    endTour,
    nextStep,
    prevStep,
    skipTour,
    goToStep,
    handleAction,
    resetTourProgress
  };

  return (
    <GuidedTourContext.Provider value={value}>
      {children}
    </GuidedTourContext.Provider>
  );
};

export default GuidedTourContext;
