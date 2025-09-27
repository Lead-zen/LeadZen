import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './components/Sidebar/Sidebar';
import PageWrapper from './components/PageWrapper/PageWrapper';
import HomePage from './pages/HomePage/HomePage';
import ChatPage from './pages/ChatPage/ChatPage';
import AboutPage from './pages/AboutPage/AboutPage';
import BlogPage from './pages/BlogPage/BlogPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import AuthPage from './components/Auth/AuthPage';
import GoogleCallback from './components/Auth/GoogleCallback';
import ProtectedRoute from './components/RouteGuards/ProtectedRoute';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="app">
      {!isDashboard && <Sidebar />}
      <main className="main-content">
            <PageWrapper>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<ChatPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/google/callback" element={<GoogleCallback />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback route */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </PageWrapper>
          </main>
        </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
