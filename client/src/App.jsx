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

function App() {

    return (
        <UserProvider>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/*" element={
                        <ProtectedRoute>
                            <ChatProvider>
                                <Layout>
                                    <Routes>
                                        <Route path="/" element={<DashboardPage />} />
                                        <Route path="/coach" element={<CoachPage />} />
                                        <Route path="/interview" element={<InterviewPage />} />
                                        <Route path="/analytics" element={<AnalyticsPage />} />
                                    </Routes>
                                </Layout>
                            </ChatProvider>
                        </ProtectedRoute>
                    } />
                </Routes>
            </GoogleOAuthProvider>
        </UserProvider>
    );
}

export default App;
