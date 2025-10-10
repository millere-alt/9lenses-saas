/**
 * 9Vectors Guided Tour Steps
 *
 * Comprehensive onboarding tour that explains the 9Vectors framework
 * and how to use the application, with AI coaching integration
 */

export const TOUR_TYPES = {
  FIRST_TIME: 'first_time',
  FRAMEWORK: 'framework',
  ASSESSMENT: 'assessment',
  DASHBOARD: 'dashboard',
  AI_FEATURES: 'ai_features'
};

/**
 * First-Time Visitor Tour
 * Introduces the platform and core concepts
 */
export const FIRST_TIME_TOUR = [
  {
    id: 'welcome',
    target: 'body',
    placement: 'center',
    title: '👋 Welcome to 9Vectors!',
    content: `I'm your AI guide, and I'll help you understand the 9Vectors framework and how to use this platform to transform your organization.

This tour will take about 3-5 minutes. Ready to get started?`,
    showAICoach: true,
    aiContext: {
      workflow: 'learning',
      message: 'Welcome! I\'m excited to guide you through the 9Vectors framework.'
    },
    actions: [
      { label: 'Start Tour', action: 'next', variant: 'primary' },
      { label: 'Skip for Now', action: 'skip', variant: 'secondary' }
    ]
  },
  {
    id: 'what-is-9Vectors',
    target: 'body',
    placement: 'center',
    title: '🎯 What is 9Vectors?',
    content: `9Vectors is a comprehensive business assessment framework that evaluates organizations across **9 interconnected dimensions**.

Think of it as a complete health check for your business - examining everything from your market position to your financial health, from your people to your operations.`,
    showAICoach: true,
    aiContext: {
      workflow: 'learning',
      userQuestion: 'Explain what the 9Vectors framework is and why it matters for organizations'
    },
    actions: [
      { label: 'Tell Me More', action: 'next', variant: 'primary' },
      { label: 'Back', action: 'prev', variant: 'secondary' }
    ]
  },
  {
    id: 'three-phases',
    target: '.framework-overview',
    placement: 'bottom',
    title: '📊 Three Phases, Nine Lenses',
    content: `The framework is organized into three phases:

**🔍 Assets** (Social Discovery)
- Market, People, Financial

**⚙️ Processes** (Social Design)
- Strategy, Operations, Execution

**🏛️ Structures** (Social Assurance)
- Expectations, Governance, Entity

Each phase builds on the previous one to create a complete picture of your organization.`,
    highlightElement: '.framework-overview',
    showAICoach: true,
    aiContext: {
      workflow: 'learning',
      userQuestion: 'Explain the three phases of the 9Vectors framework and how they relate to each other'
    },
    actions: [
      { label: 'Continue', action: 'next', variant: 'primary' },
      { label: 'Back', action: 'prev', variant: 'secondary' }
    ]
  },
  {
    id: 'ai-coach-intro',
    target: '[data-tour="ai-coach-button"]',
    placement: 'left',
    title: '🤖 Your AI Coach',
    content: `Meet your AI-powered coach! Click this button anytime to:

✓ Get explanations of any lens or theme
✓ Ask questions about your assessment
✓ Receive strategic recommendations
✓ Understand your results

**Try it now!** Click the AI coach and ask: "What should I focus on first?"`,
    highlightElement: '[data-tour="ai-coach-button"]',
    showAICoach: false, // Don't auto-open, encourage user to click
    pulseElement: true,
    waitForAction: 'ai-coach-opened',
    actions: [
      { label: 'I Opened the Coach', action: 'next', variant: 'primary' },
      { label: 'Skip This', action: 'next', variant: 'secondary' }
    ]
  },
  {
    id: 'navigation',
    target: 'nav',
    placement: 'bottom',
    title: '🧭 Navigate the Platform',
    content: `Use the navigation menu to explore:

**About** - Learn about the framework
**Resources** - Books and learning materials
**Dashboard** - View assessment results
**Assessment** - Take or create assessments

The AI coach is available everywhere to help guide you!`,
    highlightElement: 'nav',
    actions: [
      { label: 'Next', action: 'next', variant: 'primary' },
      { label: 'Back', action: 'prev', variant: 'secondary' }
    ]
  },
  {
    id: 'get-started',
    target: '[data-tour="cta-button"]',
    placement: 'top',
    title: '🚀 Ready to Begin?',
    content: `You're all set! Here's what you can do next:

1. **Take a Quick Tour** - Explore specific features
2. **Start an Assessment** - Evaluate your organization
3. **View Demo Dashboard** - See sample results
4. **Ask the AI Coach** - Get personalized guidance

Remember: The AI coach is always here to help. Just click the 🤖 button anytime!`,
    showAICoach: true,
    aiContext: {
      workflow: 'learning',
      userQuestion: 'Give me personalized next steps for getting started with 9Vectors'
    },
    actions: [
      { label: 'Start Assessment', action: 'navigate:/assessment/launch', variant: 'primary' },
      { label: 'View Demo', action: 'navigate:/dashboard', variant: 'secondary' },
      { label: 'Finish Tour', action: 'complete', variant: 'tertiary' }
    ]
  }
];

/**
 * Framework Deep Dive Tour
 * Detailed explanation of the 9Vectors framework
 */
export const FRAMEWORK_TOUR = [
  {
    id: 'framework-intro',
    target: 'body',
    placement: 'center',
    title: '🎓 Understanding 9Vectors',
    content: `Let's take a deeper look at the 9Vectors framework and how each lens provides unique insights into your organization.`,
    showAICoach: true,
    aiContext: {
      workflow: 'learning',
      userQuestion: 'Give me a comprehensive overview of all 9 lenses and what they assess'
    }
  },
  {
    id: 'assets-phase',
    target: '[data-tour="assets-section"]',
    placement: 'right',
    title: '🔍 Phase 1: Assets (Social Discovery)',
    content: `**Assets** represent what you HAVE:

**Market** - Your competitive landscape and opportunities
**People** - Your team, culture, and leadership
**Financial** - Your economic health and resources

These are the foundation of your organization.`,
    highlightElement: '[data-tour="assets-section"]',
    showAICoach: true,
    aiContext: {
      workflow: 'learning',
      userQuestion: 'Explain the Assets phase in detail with examples'
    }
  },
  {
    id: 'processes-phase',
    target: '[data-tour="processes-section"]',
    placement: 'right',
    title: '⚙️ Phase 2: Processes (Social Design)',
    content: `**Processes** represent what you DO:

**Strategy** - Your vision and go-to-market approach
**Operations** - How you execute day-to-day
**Execution** - How you measure and improve

These turn your assets into results.`,
    highlightElement: '[data-tour="processes-section"]',
    showAICoach: true,
    aiContext: {
      workflow: 'learning',
      userQuestion: 'Explain the Processes phase with real-world examples'
    }
  },
  {
    id: 'structures-phase',
    target: '[data-tour="structures-section"]',
    placement: 'right',
    title: '🏛️ Phase 3: Structures (Social Assurance)',
    content: `**Structures** represent how you're ORGANIZED:

**Expectations** - Stakeholder alignment
**Governance** - Principles and oversight
**Entity** - Legal structure and risk management

These ensure sustainability and compliance.`,
    highlightElement: '[data-tour="structures-section"]',
    showAICoach: true,
    aiContext: {
      workflow: 'learning',
      userQuestion: 'Explain the Structures phase and why governance matters'
    }
  },
  {
    id: 'interconnected',
    target: '[data-tour="lens-diagram"]',
    placement: 'bottom',
    title: '🔗 Everything Connects',
    content: `The power of 9Vectors is in how the lenses interconnect:

• Weak **People** affects **Operations**
• Poor **Strategy** impacts **Financial** results
• Strong **Governance** improves **Expectations**

The AI coach helps you understand these connections in your specific context.`,
    showAICoach: true,
    aiContext: {
      workflow: 'learning',
      userQuestion: 'Give examples of how the 9 lenses interconnect and influence each other'
    }
  }
];

/**
 * Assessment Process Tour
 * Guides users through taking an assessment
 */
export const ASSESSMENT_TOUR = [
  {
    id: 'assessment-intro',
    target: 'body',
    placement: 'center',
    title: '📝 Taking Your Assessment',
    content: `I'll guide you through the assessment process. This comprehensive evaluation will help you understand your organization's strengths and areas for improvement.

The assessment covers all 9 lenses, 44 sub-lenses, and 242+ themes.`,
    showAICoach: true,
    aiContext: {
      workflow: 'assessment',
      userQuestion: 'Help me prepare for taking a 9Vectors assessment. What should I know?'
    }
  },
  {
    id: 'rating-scale',
    target: '[data-tour="rating-slider"]',
    placement: 'top',
    title: '📊 Rating Scale (0-9)',
    content: `Rate each theme on a 0-9 scale:

🔴 **0-3: Weak** - Needs immediate attention
🟡 **4-6: Moderate** - Room for improvement
🟢 **7-9: Strong** - Performing well

Be honest and objective. The AI coach can provide examples for each rating.`,
    highlightElement: '[data-tour="rating-slider"]',
    showAICoach: true,
    pulseElement: true
  },
  {
    id: 'qualitative-input',
    target: '[data-tour="comment-field"]',
    placement: 'top',
    title: '💭 Add Context',
    content: `Don't just rate - explain WHY!

Add comments with:
• Specific examples
• Recent changes
• Data or metrics
• Stakeholder perspectives

Rich context leads to better insights.`,
    highlightElement: '[data-tour="comment-field"]'
  },
  {
    id: 'theme-help',
    target: '[data-tour="theme-help-button"]',
    placement: 'left',
    title: '❓ Get Help Anytime',
    content: `Not sure what a theme means? Click the help icon (?) next to any theme to get AI coaching specific to that topic.

The coach will explain what it means, provide examples, and help you rate accurately.`,
    highlightElement: '[data-tour="theme-help-button"]',
    pulseElement: true,
    showAICoach: true,
    aiContext: {
      workflow: 'assessment',
      currentLens: { id: 1, name: 'Market' }
    }
  },
  {
    id: 'progress-tracking',
    target: '[data-tour="progress-bar"]',
    placement: 'bottom',
    title: '📈 Track Your Progress',
    content: `The progress bar shows your completion status. You can:

• Save and return anytime
• Navigate between lenses freely
• Complete sections in any order

Take your time - thoroughness beats speed!`,
    highlightElement: '[data-tour="progress-bar"]'
  }
];

/**
 * Dashboard Tour
 * Understanding assessment results
 */
export const DASHBOARD_TOUR = [
  {
    id: 'dashboard-intro',
    target: 'body',
    placement: 'center',
    title: '📊 Your Assessment Results',
    content: `Welcome to your dashboard! Here you'll find comprehensive insights from your assessment, visualizations, and AI-powered recommendations.

Let me show you around.`,
    showAICoach: true,
    aiContext: {
      workflow: 'dashboard',
      userQuestion: 'Help me understand my dashboard and results'
    }
  },
  {
    id: 'radar-chart',
    target: '[data-tour="radar-chart"]',
    placement: 'right',
    title: '🎯 Radar Chart Overview',
    content: `This radar chart shows your scores across all 9 lenses at a glance.

• **Larger area** = Better overall performance
• **Balanced shape** = Well-rounded organization
• **Uneven shape** = Gaps to address

Click any lens for detailed insights.`,
    highlightElement: '[data-tour="radar-chart"]',
    showAICoach: true
  },
  {
    id: 'lens-cards',
    target: '[data-tour="lens-card"]',
    placement: 'top',
    title: '🃏 Lens Detail Cards',
    content: `Each card shows:

• Overall lens score with color coding
• Trend (improving/declining)
• Key insights
• Quick recommendations

Click "View Details" to see sub-lens breakdown.`,
    highlightElement: '[data-tour="lens-card"]'
  },
  {
    id: 'ai-insights',
    target: '[data-tour="ai-insights"]',
    placement: 'left',
    title: '🤖 AI-Powered Insights',
    content: `The AI analyzes your results to provide:

• **Strengths** to leverage
• **Weaknesses** to address
• **Priorities** for improvement
• **Connections** between lenses

Ask the AI coach for deeper analysis!`,
    highlightElement: '[data-tour="ai-insights"]',
    showAICoach: true,
    aiContext: {
      workflow: 'dashboard',
      userQuestion: 'Analyze my results and give me strategic recommendations'
    }
  }
];

/**
 * AI Features Tour
 * Showcasing AI coaching capabilities
 */
export const AI_FEATURES_TOUR = [
  {
    id: 'ai-intro',
    target: '[data-tour="ai-coach-button"]',
    placement: 'left',
    title: '🤖 AI Coach Capabilities',
    content: `Your AI coach is powered by Claude and understands the entire 9Vectors framework. Let me show you what it can do!`,
    highlightElement: '[data-tour="ai-coach-button"]',
    pulseElement: true
  },
  {
    id: 'contextual-help',
    target: 'body',
    placement: 'center',
    title: '🎯 Context-Aware Coaching',
    content: `The AI coach knows:

• **Where you are** in the app
• **What you're working on**
• **Your assessment data**
• **Your scores and trends**

This means every answer is personalized to YOUR situation.`,
    showAICoach: true,
    aiContext: {
      workflow: 'learning',
      userQuestion: 'What makes AI coaching context-aware and personalized?'
    }
  },
  {
    id: 'ask-anything',
    target: 'body',
    placement: 'center',
    title: '💬 Ask Anything',
    content: `Try these questions:

• "What does Market Timing mean?"
• "How can I improve my People score?"
• "What are industry benchmarks for Financial?"
• "Give me quick wins for Operations"
• "Explain the connection between Strategy and Execution"

The AI understands natural language!`,
    showAICoach: true,
    aiContext: {
      mode: 'reactive',
      userQuestion: 'Show me examples of questions I can ask'
    }
  },
  {
    id: 'proactive-coaching',
    target: 'body',
    placement: 'center',
    title: '👁️ Proactive Guidance',
    content: `The AI doesn't just answer questions - it proactively offers help:

• Explains sections as you navigate
• Provides examples for rating themes
• Suggests next steps based on progress
• Identifies patterns in your data

It's like having an expert consultant available 24/7!`,
    showAICoach: true
  }
];

/**
 * Get tour by type
 */
export function getTourByType(type) {
  switch (type) {
    case TOUR_TYPES.FIRST_TIME:
      return FIRST_TIME_TOUR;
    case TOUR_TYPES.FRAMEWORK:
      return FRAMEWORK_TOUR;
    case TOUR_TYPES.ASSESSMENT:
      return ASSESSMENT_TOUR;
    case TOUR_TYPES.DASHBOARD:
      return DASHBOARD_TOUR;
    case TOUR_TYPES.AI_FEATURES:
      return AI_FEATURES_TOUR;
    default:
      return FIRST_TIME_TOUR;
  }
}

/**
 * Get all available tours
 */
export const AVAILABLE_TOURS = [
  {
    id: TOUR_TYPES.FIRST_TIME,
    name: 'Welcome Tour',
    description: 'First-time visitor introduction',
    duration: '3-5 min',
    icon: '👋',
    steps: FIRST_TIME_TOUR.length
  },
  {
    id: TOUR_TYPES.FRAMEWORK,
    name: 'Framework Deep Dive',
    description: 'Learn about the 9Vectors in detail',
    duration: '5-7 min',
    icon: '🎓',
    steps: FRAMEWORK_TOUR.length
  },
  {
    id: TOUR_TYPES.ASSESSMENT,
    name: 'Assessment Guide',
    description: 'How to complete an assessment',
    duration: '3-4 min',
    icon: '📝',
    steps: ASSESSMENT_TOUR.length
  },
  {
    id: TOUR_TYPES.DASHBOARD,
    name: 'Dashboard Walkthrough',
    description: 'Understanding your results',
    duration: '3-4 min',
    icon: '📊',
    steps: DASHBOARD_TOUR.length
  },
  {
    id: TOUR_TYPES.AI_FEATURES,
    name: 'AI Coach Tour',
    description: 'Explore AI coaching features',
    duration: '2-3 min',
    icon: '🤖',
    steps: AI_FEATURES_TOUR.length
  }
];
