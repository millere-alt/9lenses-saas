import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { aiCoach } from '../services/aiCoachingAgent';

const AICoachingContext = createContext(null);

export const useAICoaching = () => {
  const context = useContext(AICoachingContext);
  if (!context) {
    throw new Error('useAICoaching must be used within AICoachingProvider');
  }
  return context;
};

export const AICoachingProvider = ({ children }) => {
  const [isCoachVisible, setIsCoachVisible] = useState(false);
  const [coachingMessage, setCoachingMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coachPosition, setCoachPosition] = useState('bottom-right'); // 'bottom-right', 'sidebar', 'inline'
  const [assessmentContext, setAssessmentContext] = useState(null);
  const [userScores, setUserScores] = useState(null);

  /**
   * Request coaching for current context
   */
  const requestCoaching = useCallback(async (context) => {
    setIsLoading(true);
    try {
      const response = await aiCoach.getCoachingForContext({
        ...context,
        assessmentData: assessmentContext,
        userScores: userScores
      });

      setCoachingMessage(response);
      setIsCoachVisible(true);
      return response;
    } catch (error) {
      console.error('Coaching request failed:', error);
      setCoachingMessage({
        message: 'I\'m having trouble connecting right now. Please try again in a moment.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [assessmentContext, userScores]);

  /**
   * Get proactive coaching for a lens
   */
  const getCoachingForLens = useCallback(async (lensId) => {
    const lens = await import('../data/nineLensesSchema').then(module =>
      module.LENSES.find(l => l.id === lensId)
    );

    return requestCoaching({
      workflow: 'assessment',
      currentLens: lens,
      mode: 'proactive'
    });
  }, [requestCoaching]);

  /**
   * Get coaching for a specific theme
   */
  const getCoachingForTheme = useCallback(async (lensId, subLensId, themeName) => {
    const lens = await import('../data/nineLensesSchema').then(module =>
      module.LENSES.find(l => l.id === lensId)
    );
    const subLens = lens?.subLenses.find(sl => sl.id === subLensId);

    return requestCoaching({
      workflow: 'assessment',
      currentLens: lens,
      currentSubLens: subLens,
      specificTheme: themeName,
      mode: 'proactive'
    });
  }, [requestCoaching]);

  /**
   * Ask a specific question to the coach
   */
  const askQuestion = useCallback(async (question, workflow = 'assessment') => {
    return requestCoaching({
      workflow,
      userQuestion: question,
      mode: 'reactive'
    });
  }, [requestCoaching]);

  /**
   * Get coaching for dashboard view
   */
  const getDashboardCoaching = useCallback(async (focusLens = null) => {
    return requestCoaching({
      workflow: 'dashboard',
      currentLens: focusLens,
      mode: 'proactive'
    });
  }, [requestCoaching]);

  /**
   * Get strategic coaching
   */
  const getStrategyCoaching = useCallback(async (focus = null) => {
    return requestCoaching({
      workflow: 'strategy',
      currentLens: focus,
      mode: 'proactive'
    });
  }, [requestCoaching]);

  /**
   * Toggle coach visibility
   */
  const toggleCoach = useCallback(() => {
    setIsCoachVisible(prev => !prev);
  }, []);

  /**
   * Hide coach
   */
  const hideCoach = useCallback(() => {
    setIsCoachVisible(false);
  }, []);

  /**
   * Show coach
   */
  const showCoach = useCallback(() => {
    setIsCoachVisible(true);
  }, []);

  /**
   * Update assessment context (call this when user's assessment data changes)
   */
  const updateAssessmentContext = useCallback((newContext) => {
    setAssessmentContext(newContext);
  }, []);

  /**
   * Update user scores (call this when scores are calculated)
   */
  const updateUserScores = useCallback((scores) => {
    setUserScores(scores);
  }, []);

  /**
   * Reset coaching session
   */
  const resetCoaching = useCallback(() => {
    aiCoach.resetConversation();
    setCoachingMessage(null);
  }, []);

  /**
   * Change coach position
   */
  const setPosition = useCallback((position) => {
    setCoachPosition(position);
  }, []);

  const value = {
    // State
    isCoachVisible,
    coachingMessage,
    isLoading,
    coachPosition,
    assessmentContext,
    userScores,

    // Actions
    requestCoaching,
    getCoachingForLens,
    getCoachingForTheme,
    askQuestion,
    getDashboardCoaching,
    getStrategyCoaching,
    toggleCoach,
    hideCoach,
    showCoach,
    updateAssessmentContext,
    updateUserScores,
    resetCoaching,
    setPosition
  };

  return (
    <AICoachingContext.Provider value={value}>
      {children}
    </AICoachingContext.Provider>
  );
};

export default AICoachingContext;
