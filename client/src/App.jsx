import React from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { Layout } from './components/common/Layout';
import { InterviewPage } from './pages/InterviewPage';
import { Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/interview" element={<InterviewPage />} />
            </Routes>
        </Layout>
    );
}

export default App;
