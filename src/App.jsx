import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/AppLayout';

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

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About9Lenses />} />
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

            {/* Upload Portal */}
            <Route path="/upload" element={<CEOPortal />} />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
