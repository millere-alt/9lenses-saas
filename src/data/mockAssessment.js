// Mock assessment data for demonstration
export const mockAssessmentData = {
  assessment: {
    id: 'a1b2c3d4',
    companyName: 'TechVenture Inc.',
    industry: 'Software & Technology',
    createdAt: '2025-09-15',
    participants: 45,
    completionRate: 92
  },

  lensScores: [
    {
      lensId: 1,
      lensName: 'Market',
      score: 6.5,
      color: '#f59e0b',
      subLensScores: [
        { id: '1.1', name: 'Market Characteristics', score: 7.2 },
        { id: '1.2', name: 'Competition', score: 6.8 },
        { id: '1.3', name: 'Customer', score: 6.5 },
        { id: '1.4', name: 'Market Positioning', score: 5.9 },
        { id: '1.5', name: 'Market Timing', score: 6.1 }
      ]
    },
    {
      lensId: 2,
      lensName: 'People',
      score: 7.3,
      color: '#10b981',
      subLensScores: [
        { id: '2.1', name: 'Employee Characteristics', score: 7.5 },
        { id: '2.2', name: 'Culture', score: 7.8 },
        { id: '2.3', name: 'Leadership', score: 6.9 },
        { id: '2.4', name: 'Organizational Design', score: 7.0 }
      ]
    },
    {
      lensId: 3,
      lensName: 'Financial',
      score: 5.7,
      color: '#f59e0b',
      subLensScores: [
        { id: '3.1', name: 'Accounting', score: 6.8 },
        { id: '3.2', name: 'Capital Structure', score: 5.5 },
        { id: '3.3', name: 'Financial Model', score: 5.2 },
        { id: '3.4', name: 'Forecasting', score: 5.4 },
        { id: '3.5', name: 'Historical Performance', score: 6.0 }
      ]
    },
    {
      lensId: 4,
      lensName: 'Strategy',
      score: 6.3,
      color: '#f59e0b',
      subLensScores: [
        { id: '4.1', name: 'Delivery Outlets', score: 6.1 },
        { id: '4.2', name: 'General Strategy', score: 6.8 },
        { id: '4.3', name: 'Offerings', score: 6.5 },
        { id: '4.4', name: 'Pricing Strategy', score: 5.9 },
        { id: '4.5', name: 'Promotion', score: 6.2 }
      ]
    },
    {
      lensId: 5,
      lensName: 'Operations',
      score: 6.1,
      color: '#f59e0b',
      subLensScores: [
        { id: '5.1', name: 'General Operations', score: 6.5 },
        { id: '5.2', name: 'Infrastructure', score: 6.3 },
        { id: '5.3', name: 'Processes', score: 5.8 },
        { id: '5.4', name: 'Systems', score: 5.9 }
      ]
    },
    {
      lensId: 6,
      lensName: 'Execution',
      score: 5.8,
      color: '#f59e0b',
      subLensScores: [
        { id: '6.1', name: 'Measurement', score: 6.2 },
        { id: '6.2', name: 'Performance', score: 5.4 }
      ]
    },
    {
      lensId: 7,
      lensName: 'Expectations',
      score: 7.1,
      color: '#10b981',
      subLensScores: [
        { id: '7.1', name: 'All Stakeholders', score: 7.3 },
        { id: '7.2', name: 'Board and Shareholders', score: 7.5 },
        { id: '7.3', name: 'Customers', score: 7.0 },
        { id: '7.4', name: 'Employees', score: 6.8 },
        { id: '7.5', name: 'Partners', score: 6.9 }
      ]
    },
    {
      lensId: 8,
      lensName: 'Governance',
      score: 6.0,
      color: '#f59e0b',
      subLensScores: [
        { id: '8.1', name: 'Practices', score: 6.5 },
        { id: '8.2', name: 'Principles', score: 6.2 },
        { id: '8.3', name: 'Structure', score: 5.3 }
      ]
    },
    {
      lensId: 9,
      lensName: 'Entity',
      score: 5.5,
      color: '#f59e0b',
      subLensScores: [
        { id: '9.1', name: 'Entity Characteristics', score: 6.8 },
        { id: '9.2', name: 'Contracts', score: 5.2 },
        { id: '9.3', name: 'Intellectual Property', score: 4.8 },
        { id: '9.4', name: 'Liability and Risk', score: 5.5 }
      ]
    }
  ],

  insights: {
    overallScore: 6.3,
    strengths: [
      { lens: 'People', score: 7.3, highlight: 'Strong culture and employee characteristics' },
      { lens: 'Expectations', score: 7.1, highlight: 'Well-aligned stakeholder expectations' }
    ],
    gaps: [
      { lens: 'Entity', score: 5.5, highlight: 'IP protection and contract management need improvement' },
      { lens: 'Financial', score: 5.7, highlight: 'Financial forecasting and capital structure concerns' },
      { lens: 'Execution', score: 5.8, highlight: 'Performance tracking and measurement systems need enhancement' }
    ],
    recommendations: [
      {
        priority: 'High',
        area: 'Intellectual Property',
        description: 'Develop comprehensive IP strategy and strengthen patent portfolio',
        impact: 'Protects competitive advantage and increases company valuation'
      },
      {
        priority: 'High',
        area: 'Financial Model',
        description: 'Refine revenue forecasting methodology and improve capital efficiency',
        impact: 'Better investor confidence and resource allocation'
      },
      {
        priority: 'Medium',
        area: 'Performance Measurement',
        description: 'Implement cross-functional KPI dashboard and real-time tracking',
        impact: 'Enhanced execution and strategic alignment'
      }
    ]
  },

  stakeholderComparison: {
    groups: ['Executives', 'Managers', 'Employees', 'Board'],
    data: [
      { lens: 'Market', Executives: 7.2, Managers: 6.5, Employees: 5.8, Board: 6.8 },
      { lens: 'People', Executives: 8.0, Managers: 6.2, Employees: 7.1, Board: 7.5 },
      { lens: 'Financial', Executives: 6.5, Managers: 5.9, Employees: 4.8, Board: 5.5 },
      { lens: 'Strategy', Executives: 7.5, Managers: 5.9, Employees: 5.2, Board: 6.8 },
      { lens: 'Operations', Executives: 6.8, Managers: 6.1, Employees: 5.8, Board: 6.0 },
      { lens: 'Execution', Executives: 6.2, Managers: 5.8, Employees: 5.1, Board: 6.0 },
      { lens: 'Expectations', Executives: 7.8, Managers: 7.1, Employees: 6.5, Board: 7.2 },
      { lens: 'Governance', Executives: 6.5, Managers: 6.0, Employees: 5.5, Board: 6.8 },
      { lens: 'Entity', Executives: 6.2, Managers: 5.5, Employees: 4.8, Board: 5.8 }
    ]
  },

  historicalTrends: [
    { period: 'Q1 2025', Market: 5.8, People: 6.5, Financial: 5.2, Strategy: 5.9, Operations: 5.5, Execution: 5.1, Expectations: 6.8, Governance: 5.5, Entity: 5.0 },
    { period: 'Q2 2025', Market: 6.1, People: 6.9, Financial: 5.5, Strategy: 6.0, Operations: 5.8, Execution: 5.4, Expectations: 7.0, Governance: 5.8, Entity: 5.2 },
    { period: 'Q3 2025', Market: 6.5, People: 7.3, Financial: 5.7, Strategy: 6.3, Operations: 6.1, Execution: 5.8, Expectations: 7.1, Governance: 6.0, Entity: 5.5 }
  ]
};
