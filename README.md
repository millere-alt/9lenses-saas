# 9Lenses SaaS Assessment Platform

A comprehensive React-based SaaS application for conducting organizational assessments using the 9Lenses framework. This platform enables companies to evaluate their performance across 9 interconnected business dimensions and gain actionable insights.

## 🎯 What is 9Lenses?

The 9Lenses framework is a comprehensive business assessment methodology that evaluates organizations across 9 interconnected dimensions (lenses), organized into three categories:

### **Assets** (Social Discovery Phase)
- **Market**: Market characteristics, competition, customer, positioning, and timing
- **People**: Employee characteristics, culture, leadership, and organizational design
- **Financial**: Accounting, capital structure, financial model, forecasting, and historical performance

### **Processes** (Social Design Phase)
- **Strategy**: Delivery outlets, general strategy, offerings, pricing, and promotion
- **Operations**: General operations, infrastructure, processes, and systems
- **Execution**: Measurement and performance tracking

### **Structures** (Social Assurance Phase)
- **Expectations**: Managing expectations of all stakeholders (board, customers, employees, partners)
- **Governance**: Principles, structure, and practices
- **Entity**: Entity characteristics, contracts, intellectual property, liability and risk

## ✨ Features

### 🤖 NEW: AI Coaching System (Agentic AI)
- **Contextual Intelligence**: AI coach understands all 9 lenses, 44 sub-lenses, and 242+ themes
- **Proactive Coaching**: Automatic guidance as users navigate assessments
- **Natural Language Q&A**: Ask questions and get intelligent, specific answers
- **Multiple Integration Points**: Floating widget, inline coaching, trigger buttons
- **Workflow-Aware**: Adapts responses based on context (assessment, dashboard, strategy)
- **Powered by Claude AI**: Using Anthropic's latest Claude 3.5 Sonnet model
- **Mock Mode**: Works without API key for testing and demos
- See [AI_COACHING_GUIDE.md](AI_COACHING_GUIDE.md) for detailed documentation

### 🏠 Landing Page
- **Hero Section**: Professional landing page with gradient design and book showcase
- **Book Banner**: Featured 9Lenses and Snapshot9 book covers (placeholder gradients, ready for real images)
- **Framework Overview**: Clear explanation of the three-phase methodology
- **Feature Highlights**: Why choose 9Lenses with visual cards
- **Quantitative/Qualitative Approach**: Highlighted dual-input methodology in banner
- **Call-to-Action**: Multiple entry points to assessment and demo dashboard

### 📝 Solo Assessment & Learning Page
- **Dual Mode Interface**: Toggle between Learn Mode and Assess Mode
- **Learn Mode**:
  - Comprehensive education about each lens and sub-lens
  - Key themes explained with context
  - Assessment methodology guidance
  - Scoring rubric visualization (Red 0-3, Yellow 4-6, Green 7-9)
- **Assess Mode**:
  - **Quantitative Input**: 0-9 rating scale for each theme with visual feedback
  - **Qualitative Input**: Text area for detailed context, examples, and insights
  - Real-time response tracking and validation
- **Progress Tracking**: Visual progress bar showing completion across all 9 lenses
- **Smart Navigation**:
  - Sidebar with all 9 lenses for quick jumping
  - Sub-lens tabs within each lens
  - Previous/Next buttons with state management
- **Complete Coverage**: All 9 lenses, 44 sub-lenses, and 242+ themes

### 👥 Multi-Participant Assessment Platform (NEW!)
- **Setup Phase**:
  - Company information capture
  - Leader profile setup
  - Unlimited participant addition with role/department tracking
  - Clean, intuitive participant management interface
- **Dual Role System**:
  - **Leader Mode**: Full access to initiate and manage assessment
  - **Participant Mode**: Individual assessment completion for team members
- **Slider-Based Assessment**:
  - Smooth 0-9 slider for each theme (0.5 increments)
  - Real-time color-coded feedback (Red/Yellow/Green)
  - Visual gradient showing score distribution
  - Large, interactive slider thumb with hover effects
- **Qualitative Insights**:
  - Expandable text areas for each theme
  - Optional context, examples, and observations
  - Toggle visibility to reduce clutter
- **Document Upload**:
  - File upload capability for each lens/sub-lens
  - Support for multiple document types
  - Contextual file mapping to 9Lenses meta-structure
  - Visual file management with remove capability
- **Progress Management**:
  - Real-time progress tracking across all 9 lenses
  - Save progress functionality
  - Navigate between lenses and sub-lenses freely
- **Complete Stakeholder View**: Designed for executives, managers, employees, board members, and partners

### 📊 Interactive Dashboard
- **Radar Chart Visualization**: See all 9 lenses at a glance with color-coded scoring
- **Category Summaries**: View aggregate scores for Assets, Processes, and Structures
- **Key Insights**: Automated identification of strengths and gaps
- **Detailed Lens Cards**: Click any lens to drill down into sub-lenses and themes

### 🔍 Lens Detail Views
- **Sub-lens Breakdown**: Bar charts showing performance across all sub-lenses
- **Score Distribution**: Visual indicators (Green 7-9, Yellow 4-6, Red 0-3)
- **Improvement Recommendations**: Targeted suggestions for low-scoring areas
- **Progress Tracking**: Monitor progress over time

### 👥 Stakeholder Alignment
- **Multi-group Comparison**: Compare perspectives between Executives, Managers, Employees, and Board
- **Divergence Detection**: Automatic flagging of alignment issues (>2 point differences)
- **Detailed Score Tables**: Comprehensive breakdown of all stakeholder responses
- **Alignment Insights**: Understand where perception gaps exist

### 📈 Trend Analysis
- **Historical Tracking**: Monitor lens performance across multiple assessment periods
- **Trend Classification**: Identify improving, stable, and declining lenses
- **Visual Charts**: Line graphs showing evolution over time
- **Performance Indicators**: Percentage change and absolute score differences

### 🎨 Modern UI/UX
- Built with React and TailwindCSS
- Responsive design for desktop and mobile
- Interactive charts using Recharts
- Clean, professional interface with intuitive navigation

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure AI Coaching (Optional)**

   To enable real AI coaching with Claude:
   ```bash
   # Copy the example env file
   cp .env.example .env

   # Edit .env and add your Anthropic API key
   # Get one at: https://console.anthropic.com/
   VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

   **Note**: The app works without an API key using mock responses for testing.

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Quick Start with AI Coaching

Once running, try these features:

1. **Click the AI Coach button** (bottom-right) on any page
2. **Start an assessment** and get real-time coaching for each section
3. **Ask questions** like "What are my biggest strengths?" or "How can I improve Operations?"
4. **View the enhanced survey** at `/assessment/take` with inline coaching

See [AI_COACHING_GUIDE.md](AI_COACHING_GUIDE.md) for detailed usage and integration examples.

## 📁 Project Structure

```
9lenses-saas/
├── src/
│   ├── components/
│   │   ├── AICoach.jsx                      # 🆕 Floating AI coach widget
│   │   ├── CoachingTrigger.jsx              # 🆕 Coaching activation components
│   │   ├── EnhancedSurveyWithCoaching.jsx   # 🆕 Assessment with AI coaching
│   │   ├── HomePage.jsx                     # Landing page
│   │   ├── Dashboard.jsx                    # Main dashboard
│   │   ├── SurveyTakingPage.jsx            # Survey interface
│   │   ├── RadarChart.jsx                  # 9-lens radar visualization
│   │   └── ... (30+ other components)
│   ├── contexts/
│   │   ├── AICoachingContext.jsx            # 🆕 AI coaching state management
│   │   └── AuthContext.jsx                  # Authentication context
│   ├── services/
│   │   └── aiCoachingAgent.js               # 🆕 AI agent with Claude integration
│   ├── data/
│   │   ├── nineLensesSchema.js             # Complete 9Lenses structure
│   │   └── mockAssessment.js               # Sample assessment data
│   ├── App.jsx                             # Root component with AI provider
│   └── main.jsx                            # Entry point
├── public/
│   └── books/                              # Book cover images
├── .env.example                             # 🆕 Environment variable template
├── .env                                     # 🆕 Your API keys (gitignored)
├── AI_COACHING_GUIDE.md                     # 🆕 Comprehensive AI coaching docs
├── README.md                                # This file
├── index.html                              # HTML entry point
├── vite.config.js                          # Vite configuration
├── tailwind.config.js                      # Tailwind configuration
└── package.json                            # Dependencies (includes @anthropic-ai/sdk)
```

## 🎨 Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: Anthropic Claude 3.5 Sonnet (via @anthropic-ai/sdk)
- **Language**: JavaScript (ES6+)

## 📊 Data Schema

### Lens Structure
Each lens contains:
- **id**: Unique identifier (1-9)
- **name**: Lens name (e.g., "Market", "People")
- **category**: Assets, Processes, or Structures
- **description**: Brief explanation
- **color**: Visual identifier
- **subLenses**: Array of sub-lenses

### Sub-lens Structure
Each sub-lens contains:
- **id**: Hierarchical ID (e.g., "1.1", "1.2")
- **name**: Sub-lens name
- **themes**: Array of theme names
- **score**: Calculated average (0-9 scale)

### Scoring System
- **Green (7-9)**: Strong performance
- **Yellow (4-6)**: Moderate performance, needs attention
- **Red (0-3)**: Weak performance, requires immediate action

## 🛠️ Customization

### Adding New Assessment Data

Edit `src/data/mockAssessment.js` to update:
- Company information
- Lens scores
- Sub-lens scores
- Stakeholder comparison data
- Historical trends
- Recommendations

### Modifying the Schema

Edit `src/data/nineLensesSchema.js` to:
- Add/remove sub-lenses
- Update themes
- Modify scoring thresholds
- Change color schemes

## 🔄 Next Steps for Full Implementation

This is a frontend demonstration of the 9Lenses platform. To build a complete SaaS solution, you would add:

### Backend Development
- **API Layer**: RESTful API or GraphQL for data management
- **Database**: PostgreSQL/MongoDB for storing assessments
- **Authentication**: User management and role-based access control
- **Survey Engine**: Question bank and response collection

### AI/ML Integration
- **Document Analysis**: Parse uploaded company documents (financials, strategy docs, etc.)
- **Auto-scoring**: AI-assisted scoring based on document content
- **Recommendation Engine**: Generate personalized improvement suggestions
- **Sentiment Analysis**: Analyze qualitative survey responses

### Advanced Features
- **Multi-tenant Architecture**: Support multiple companies
- **Benchmarking**: Compare against industry standards
- **Action Planning**: Track improvement initiatives
- **Collaboration Tools**: Comments, discussions, task assignments
- **Export/Reporting**: PDF reports, Excel exports
- **White-labeling**: Customizable branding

### Integrations
- **Financial Systems**: QuickBooks, Xero, SAP
- **HR Platforms**: Workday, BambooHR
- **CRM Systems**: Salesforce, HubSpot
- **Project Management**: Jira, Asana

## 📚 9Lenses Methodology

The assessment follows a three-phase cycle:

1. **Social Discovery** (Assets): Assess and understand current state
2. **Social Design** (Processes): Build and align strategies
3. **Social Assurance** (Structures): Communicate and ensure compliance

Each phase feeds into the next, creating a continuous improvement loop.

## 🤝 Contributing

This is a demonstration project based on the 9Lenses framework created by Edwin Miller. For production use, ensure you have appropriate licensing and permissions.

## 📄 License

This project is for demonstration purposes. The 9Lenses framework is proprietary.

## 📞 Support

For questions about the 9Lenses methodology or licensing, please contact the framework creators.

---

**Built with ❤️ using React, TailwindCSS, and the 9Lenses Framework**
