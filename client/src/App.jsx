import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ChatProvider } from './context/ChatContext';

import { Layout } from './components/common/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { PublicRoute } from './components/common/PublicRoute';
import { PageWrapper } from './components/common/PageWrapper';

// Lazy loaded page components
const DashboardPage = React.lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const SignUpPage = React.lazy(() => import('./pages/SignUpPage').then(module => ({ default: module.SignUpPage })));
const InterviewPage = React.lazy(() => import('./pages/InterviewPage').then(module => ({ default: module.InterviewPage })));
const CoachPage = React.lazy(() => import('./pages/CoachPage').then(module => ({ default: module.CoachPage })));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage').then(module => ({ default: module.AnalyticsPage })));

// Loading Spinner for Fallback
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Loading application...</p>
        </div>
    </div>
);

function App() {

    return (
        <UserProvider>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/login" element={
                            <PublicRoute>
                                <PageWrapper>
                                    <LoginPage />
                                </PageWrapper>
                            </PublicRoute>
                        } />
                        <Route path="/signup" element={
                            <PublicRoute>
                                <PageWrapper>
                                    <SignUpPage />
                                </PageWrapper>
                            </PublicRoute>
                        } />
                        <Route path="/*" element={
                            <ProtectedRoute>
                                <ChatProvider>
                                    <Layout>
                                        <Routes>
                                            <Route path="/" element={<PageWrapper><DashboardPage /></PageWrapper>} />
                                            <Route path="/coach" element={<PageWrapper><CoachPage /></PageWrapper>} />
                                            <Route path="/interview" element={<PageWrapper><InterviewPage /></PageWrapper>} />
                                            <Route path="/analytics" element={<PageWrapper><AnalyticsPage /></PageWrapper>} />
                                        </Routes>
                                    </Layout>
                                </ChatProvider>
                            </ProtectedRoute>
                        } />
                    </Routes>
                </Suspense>
            </GoogleOAuthProvider>
        </UserProvider >
    );
}

export default App;
