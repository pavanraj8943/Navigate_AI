import React from 'react';
import { InterviewSimulation } from '../components/interview/InterviewSimulation';
import { ArrowLeft } from 'lucide-react';

export function InterviewPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => window.history.back()}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Mock Interview Session</h1>
                    <p className="text-slate-500">Practice your soft skills with real-time feedback</p>
                </div>
            </div>

            {/* Main Content */}
            <InterviewSimulation />
        </div>
    );
}
