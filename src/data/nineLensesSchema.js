// 9Lenses Complete Schema
export const LENS_CATEGORIES = {
  ASSETS: 'Assets',
  PROCESSES: 'Processes',
  STRUCTURES: 'Structures'
};

export const LENSES = [
  {
    id: 1,
    name: 'Market',
    category: LENS_CATEGORIES.ASSETS,
    description: 'Understanding the market, opportunity, and competitive landscape',
    color: '#10b981',
    subLenses: [
      { id: '1.1', name: 'Market Characteristics', themes: ['Market Size', 'Market Trends and Sustainability', 'Market Regulations', 'Market Entry Barriers', 'Market Volatility', 'Geography Footprint'] },
      { id: '1.2', name: 'Competition', themes: ['Market Share', 'Competitive Landscape', 'Leadership %', 'Competitive Forecast'] },
      { id: '1.3', name: 'Customer', themes: ['Demographics', 'Adoption Curve', 'Loyalty / NPS', 'Purchasing Pattern', 'Purchasing Power', 'Relationships', 'Buyer-User-Consumer Harmony'] },
      { id: '1.4', name: 'Market Positioning', themes: ['Brand Image / Perception', 'Brand Awareness', 'Industry Influence', 'Target Market', 'Threats'] },
      { id: '1.5', name: 'Market Timing', themes: ['Government Influence', 'Market Cycles & Trends', 'Demand', 'Adoption Curve', 'Customer Readiness', 'Exit Paths'] }
    ]
  },
  {
    id: 2,
    name: 'People',
    category: LENS_CATEGORIES.ASSETS,
    description: 'Employee characteristics, culture, leadership, and organizational design',
    color: '#3b82f6',
    subLenses: [
      { id: '2.1', name: 'Employee Characteristics', themes: ['Employee Strengths', 'Employee Skills', 'Employee Values', 'Employee Experience & Training'] },
      { id: '2.2', name: 'Culture', themes: ['Attitudes', 'Values', 'Teamwork', 'Cultural Unity and Diversity', 'Reputation'] },
      { id: '2.3', name: 'Leadership', themes: ['Leadership Skills', 'Leadership Style', 'M13 Attributes'] },
      { id: '2.4', name: 'Organizational Design', themes: ['Organizational Chart', 'Functional Alignment', 'Key Employees', 'Roles'] }
    ]
  },
  {
    id: 3,
    name: 'Financial',
    category: LENS_CATEGORIES.ASSETS,
    description: 'Accounting, capital structure, financial model, and performance',
    color: '#8b5cf6',
    subLenses: [
      { id: '3.1', name: 'Accounting', themes: ['Accounting Cycle', 'Audits', 'Statements and Reporting', 'Billing and Collections', 'Compliance'] },
      { id: '3.2', name: 'Capital Structure', themes: ['Capital Requirements', 'Rights', 'Cost of Capital', 'Cap Structure'] },
      { id: '3.3', name: 'Financial Model', themes: ['P&L', 'Revenue Model', 'Touch (Snapshot9)', 'Volume (Snapshot9)', 'Margin (Snapshot9)'] },
      { id: '3.4', name: 'Forecasting', themes: ['Pro Forma', 'Resources', 'Predictability', 'Churn', 'MRR/ARR'] },
      { id: '3.5', name: 'Historical Performance', themes: ['Balance Sheet', 'Use of Cash', 'Statement of Cash Flows'] }
    ]
  },
  {
    id: 4,
    name: 'Strategy',
    category: LENS_CATEGORIES.PROCESSES,
    description: 'Vision, mission, offerings, pricing, and go-to-market strategy',
    color: '#f59e0b',
    subLenses: [
      { id: '4.1', name: 'Delivery Outlets', themes: ['Direct Sales', 'Distributors & Resellers', 'Partnerships & Alliances', 'Licensing'] },
      { id: '4.2', name: 'General Strategy', themes: ['Mission, Vision, Objectives', 'Corporate Strategy', 'Differentiation Strategy', 'Value Proposition', 'Innovation'] },
      { id: '4.3', name: 'Offerings', themes: ['Services', 'Products', 'Complexity'] },
      { id: '4.4', name: 'Pricing Strategy', themes: ['Current Pricing', 'Future Offering Practices'] },
      { id: '4.5', name: 'Promotion', themes: ['Go To Market Strategy', 'Promotional Media', 'Shows and Events', 'Social Media'] }
    ]
  },
  {
    id: 5,
    name: 'Operations',
    category: LENS_CATEGORIES.PROCESSES,
    description: 'Infrastructure, processes, systems, and operational efficiency',
    color: '#06b6d4',
    subLenses: [
      { id: '5.1', name: 'General Operations', themes: ['Functional Operations', 'Cross Function Alignment'] },
      { id: '5.2', name: 'Infrastructure', themes: ['Capacity', 'Physical Infrastructure', 'Security'] },
      { id: '5.3', name: 'Processes', themes: ['Methodologies & Best Practices', 'Internal Function Processes', 'Process Planning', 'Process Evaluation'] },
      { id: '5.4', name: 'Systems', themes: ['Private Online Systems', 'Hybrid Online Systems', 'Public Cloud Systems', 'Back Office Systems', 'Front Office Systems'] }
    ]
  },
  {
    id: 6,
    name: 'Execution',
    category: LENS_CATEGORIES.PROCESSES,
    description: 'Measurement, performance, and strategic execution',
    color: '#ec4899',
    subLenses: [
      { id: '6.1', name: 'Measurement', themes: ['Function Metrics', 'Cross-Function Metrics', 'Metric Characteristics', 'Impacts', 'Deployment'] },
      { id: '6.2', name: 'Performance', themes: ['Function Performance', 'Cross-Function Performance', 'Communication', 'Benchmarking'] }
    ]
  },
  {
    id: 7,
    name: 'Expectations',
    category: LENS_CATEGORIES.STRUCTURES,
    description: 'Managing expectations of all stakeholders',
    color: '#84cc16',
    subLenses: [
      { id: '7.1', name: 'All Stakeholders', themes: ['Owner Expectations', 'Leader Engagement', 'Current Ownership', 'Self-Awareness', 'Alignment'] },
      { id: '7.2', name: 'Board and Shareholders', themes: ['Expectation Setting', 'Goals and Objectives', 'Self-Awareness'] },
      { id: '7.3', name: 'Customers', themes: ['Expectation Setting', 'Addressing Expectations', 'Performance'] },
      { id: '7.4', name: 'Employees', themes: ['Expectation Setting', 'Addressing Expectations', 'Compensation and Benefits', 'Leadership', 'Environment and Values'] },
      { id: '7.5', name: 'Partners', themes: ['Expectation Setting', 'Partnership Characteristics', 'Formality'] }
    ]
  },
  {
    id: 8,
    name: 'Governance',
    category: LENS_CATEGORIES.STRUCTURES,
    description: 'Principles, structure, and practices of corporate governance',
    color: '#6366f1',
    subLenses: [
      { id: '8.1', name: 'Practices', themes: ['Corporate Social Responsibility', 'Document Storage', 'Legal Compliance', 'Transparency', 'Policies'] },
      { id: '8.2', name: 'Principles', themes: ['Internal Codes', 'Use of Assets', 'Media Relations', 'Core Values', 'Hiring and Compensation'] },
      { id: '8.3', name: 'Structure', themes: ['Board Composition', 'Board Engagement', 'Board Committees', 'Outside Legal Counsel', 'Third Party Audits'] }
    ]
  },
  {
    id: 9,
    name: 'Entity',
    category: LENS_CATEGORIES.STRUCTURES,
    description: 'Legal entity structure, contracts, IP, and risk management',
    color: '#ef4444',
    subLenses: [
      { id: '9.1', name: 'Entity Characteristics', themes: ['Type of Entity', 'Regulation', 'Domicile'] },
      { id: '9.2', name: 'Contracts', themes: ['Employee Contracts', 'Vendor Contracts', 'Customer Contracts', 'Partners and Alliances'] },
      { id: '9.3', name: 'Intellectual Property', themes: ['Trademark and Service Mark', 'Copyrights', 'Patents', 'Trade Secrets'] },
      { id: '9.4', name: 'Liability and Risk', themes: ['Insurance', 'Risk Communication', 'Litigation', 'Risk Management'] }
    ]
  }
];

export const getScoreColor = (score) => {
  if (score >= 7) return '#10b981'; // green
  if (score >= 4) return '#f59e0b'; // yellow
  return '#ef4444'; // red
};

export const getScoreLabel = (score) => {
  if (score >= 7) return 'Strong';
  if (score >= 4) return 'Moderate';
  return 'Weak';
};
