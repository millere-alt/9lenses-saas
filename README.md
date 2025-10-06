# 9Lenses SaaS Platform

A comprehensive AI-powered strategic business assessment platform built with React, Node.js, and modern web technologies.

## 🌟 Features

### Core Functionality
- **Multi-Participant Assessments** - Create 360° assessments with multiple stakeholders
- **AI-Powered Insights** - GPT-4 powered strategy advisor and analytics
- **Document Analysis** - Upload and analyze documents with AI
- **Real-time Collaboration** - WebSocket-based real-time updates
- **Advanced Analytics** - Predictive analytics and trend analysis
- **Export Capabilities** - PDF and Excel export for reports

### AI Features
- **Strategy Advisor** - AI-generated strategic recommendations
- **Predictive Analytics** - 6-12 month forecasting
- **Action Plan Generator** - Automated 90-day roadmaps
- **AI Help Agent** - Floating conversational assistant across all pages
- **Risk Detection** - Pattern recognition and risk identification
- **Document Correlation** - AI-powered document insights

### User Experience
- **Onboarding Tour** - Interactive guided tour for new users
- **Dark Mode Support** - Theme switcher with light/dark modes
- **Mobile Responsive** - Optimized for all devices
- **Error Handling** - Comprehensive error boundaries and pages
- **Loading States** - Smooth loading indicators
- **Notifications** - Real-time notification system

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Frontend Setup

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
```

3. **Start development server**
```bash
npm run dev
```

App available at `http://localhost:5173`

### Backend Setup

See [server/README.md](server/README.md) for complete setup.

Quick start:
```bash
cd server
npm install
cp .env.example .env
npm run prisma:migrate
npm run dev
```

Backend runs on `http://localhost:3001`

## 🎨 Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS v4, Zustand, React Router, Recharts

**Backend:** Node.js, Express, Prisma, PostgreSQL, JWT, OpenAI, Stripe, Socket.IO

## 🔑 Key Features

- **AI Help Agent** - Floating assistant on every page with context-aware help
- **State Management** - Zustand stores for auth, theme, assessments, notifications
- **Export System** - PDF and Excel exports for assessments and reports
- **Error Handling** - Error boundaries, custom pages, API interceptors

## 💳 Subscription Tiers

- **FREE** - 5 users, 3 assessments, 100 AI requests/month
- **BASIC** - $49/month - 10 users, 10 assessments, 1,000 AI requests
- **PRO** - $149/month - 50 users, unlimited assessments, 10,000 AI requests
- **ENTERPRISE** - $499/month - Unlimited everything, dedicated support

## 📁 Project Structure

```
9lenses-saas/
├── src/
│   ├── components/     # React components
│   ├── store/          # Zustand state management
│   ├── services/       # API services
│   ├── utils/          # Utilities (export, etc.)
│   └── data/           # Mock data
├── server/             # Backend server
└── public/             # Static assets
```

## 🛠️ Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview build
```

## 📊 Demo Pages

- `/complete-demo` - Full workflow demonstration
- `/demo` - 360° Review multi-participant assessment
- `/full-demo` - Comprehensive feature showcase
- `/documents` - Document management

## 📧 Support

Email: support@9lenses.com

---

Built with ❤️ using React, Node.js, and AI
