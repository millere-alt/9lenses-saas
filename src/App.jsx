import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
// Uncomment to use Auth0:
// import { Auth0ProviderWithConfig } from './contexts/Auth0Context';
import AppLayout from './components/AppLayout';

// Pages
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import About9Vectors from './components/About9Vectors';
import HowItWorks from './components/HowItWorks';
import BooksPage from './components/BooksPage';
import Dashboard from './components/Dashboard';
import AIDashboard from './components/AIDashboard';
import NewMultiParticipantAssessment from './components/NewMultiParticipantAssessment';
import SurveyTakingPage from './components/SurveyTakingPage';
import CEOPortal from './components/CEOPortal';
import LaunchAssessment from './components/LaunchAssessment';
import CEODashboard from './components/CEODashboard';
import LearnNineVectors from './components/LearnNineVectors';
import AIOnboardingAssistant from './components/AIOnboardingAssistant';
import DataSourceManager from './components/DataSourceManager';
import ExpertIdentificationSystem from './components/ExpertIdentificationSystem';
import Review360Demo from './components/Review360Demo';
import CompleteSaaSDemo from './components/CompleteSaaSDemo';
import FullSaaSDemo from './components/FullSaaSDemo';
import DocumentHub from './components/DocumentHub';
import DocumentDissector from './components/DocumentDissector';
import BillingPage from './components/BillingPage';
import PricingPlans from './components/PricingPlans';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About9Vectors />} />
            <Route path="/learn" element={<LearnNineVectors />} />
            <Route path="/ai-assistant" element={<AIOnboardingAssistant />} />
            <Route path="/demo" element={<Review360Demo />} />
            <Route path="/complete-demo" element={<CompleteSaaSDemo />} />
            <Route path="/full-demo" element={<FullSaaSDemo />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/resources" element={<BooksPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-dashboard" element={<AIDashboard />} />
            <Route path="/ceo-dashboard" element={<CEODashboard />} />

            {/* Assessment Routes */}
            <Route path="/assessment/launch" element={<LaunchAssessment />} />
            <Route path="/assessment/create" element={<NewMultiParticipantAssessment />} />
            <Route path="/assessment/take/:id" element={<SurveyTakingPage />} />
            <Route path="/assessment/take" element={<SurveyTakingPage />} />
            <Route path="/assessment/data-sources" element={<DataSourceManager />} />
            <Route path="/assessment/expertise" element={<ExpertIdentificationSystem />} />

            {/* Upload Portal */}
            <Route path="/upload" element={<CEOPortal />} />

            {/* Document Management Routes */}
            <Route path="/documents" element={<DocumentHub />} />
            <Route path="/documents/dissect" element={<DocumentDissector />} />

            {/* Billing Routes */}
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/billing/success" element={<BillingPage />} />
            <Route path="/billing/canceled" element={<BillingPage />} />
            <Route path="/pricing" element={<PricingPlans />} />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
