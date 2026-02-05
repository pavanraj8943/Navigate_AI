import React from 'react';
import { ChatInterface } from '../components/Chat/ChatInterface';
import { Sparkles } from 'lucide-react';

export function CoachPage() {
    return (
        <div className="h-[calc(100vh-120px)] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">AI Career Coach</h1>
                    <p className="text-slate-500 text-sm">Context-aware guidance based on your resume</p>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <ChatInterface />
            </div>
        </div>
    );
}
