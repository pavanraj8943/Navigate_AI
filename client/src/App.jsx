import React from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { Layout } from './components/common/Layout';
import { InterviewPage } from './pages/InterviewPage';
import { CoachPage } from './pages/CoachPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';


import { ChatProvider } from './context/ChatContext';

import { PublicRoute } from './components/common/PublicRoute';
import { PageWrapper } from './components/common/PageWrapper';

function App() {

    return (
        <UserProvider>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
            </GoogleOAuthProvider>
        </UserProvider >
    );
}

export default App;
