import React from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { Layout } from './components/common/Layout';
import { InterviewPage } from './pages/InterviewPage';
import { Routes, Route } from 'react-router-dom';

function App() {

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/*" element={
                <Layout>
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/interview" element={<InterviewPage />} />
                    </Routes>
                </Layout>
            } />
        </Routes>
    );
}

export default App;
