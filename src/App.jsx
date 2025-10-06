import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/AppLayout';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorPage from './components/ErrorPage';
import OnboardingTour from './components/OnboardingTour';
import AIHelpAgent from './components/AIHelpAgent';

// Pages
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import About9Lenses from './components/About9Lenses';
import HowItWorks from './components/HowItWorks';
import BooksPage from './components/BooksPage';
import Dashboard from './components/Dashboard';
import AIDashboard from './components/AIDashboard';
import NewMultiParticipantAssessment from './components/NewMultiParticipantAssessment';
import SurveyTakingPage from './components/SurveyTakingPage';
import CEOPortal from './components/CEOPortal';
import LaunchAssessment from './components/LaunchAssessment';
import CEODashboard from './components/CEODashboard';
import LearnNineLenses from './components/LearnNineLenses';
import AIOnboardingAssistant from './components/AIOnboardingAssistant';
import DataSourceManager from './components/DataSourceManager';
import ExpertIdentificationSystem from './components/ExpertIdentificationSystem';
import Review360Demo from './components/Review360Demo';
import CompleteSaaSDemo from './components/CompleteSaaSDemo';
import FullSaaSDemo from './components/FullSaaSDemo';
import DocumentHub from './components/DocumentHub';
import DocumentDissector from './components/DocumentDissector';
import SettingsPage from './components/SettingsPage';
import About9LensesSimple from './components/About9LensesSimple';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppLayout>
            <Routes>
              {/* Main Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<About9Lenses />} />
              <Route path="/what-is-9lenses" element={<About9LensesSimple />} />
              <Route path="/learn" element={<LearnNineLenses />} />
              <Route path="/ai-assistant" element={<AIOnboardingAssistant />} />
              <Route path="/demo" element={<Review360Demo />} />
              <Route path="/complete-demo" element={<CompleteSaaSDemo />} />
              <Route path="/full-demo" element={<FullSaaSDemo />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/resources" element={<BooksPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ai-dashboard" element={<AIDashboard />} />
              <Route path="/ceo-dashboard" element={<CEODashboard />} />
              <Route path="/settings" element={<SettingsPage />} />

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

              {/* Error Pages */}
              <Route path="/404" element={<ErrorPage code="404" />} />
              <Route path="/500" element={<ErrorPage code="500" />} />

              {/* Catch all - redirect to 404 */}
              <Route path="*" element={<ErrorPage code="404" />} />
            </Routes>
          </AppLayout>
          <OnboardingTour />
          <AIHelpAgent />
          <Toaster position="top-right" />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
