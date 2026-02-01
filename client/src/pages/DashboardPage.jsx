import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResumeUpload } from '../components/resume/ResumeUpload';
import { ResumeParsing } from '../components/resume/ResumeParsing';
import { ResumePreview } from '../components/resume/ResumePreview';
import { ChatInterface } from '../components/Chat/ChatInterface';
import { BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';

export function DashboardPage() {
    const navigate = useNavigate();
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isParsing, setIsParsing] = useState(false);
    const [parsedData, setParsedData] = useState(null);

    const handleFileUpload = (file) => {
        setUploadedFile(file);
        setIsParsing(true);
        setParsedData(null);
    };

    const handleParsingComplete = () => {
        setIsParsing(false);
        setParsedData({ status: 'success' }); // Mock data presence
    };

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 transition-colors">Good Morning, Alex!</h1>
                    <p className="text-slate-500 mt-1 transition-colors">Ready to ace your next interview? Here's your progress.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-colors">
                    <span>Target Role:</span>
                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Senior Frontend Engineer</span>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Mock Interviews', value: '12', trend: '+2 this week', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Average Score', value: '8.5/10', trend: 'Top 10%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Skills Mastered', value: '24', trend: '3 remaining', icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
                            </div>
                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-xs font-medium text-slate-400 mt-4 flex items-center gap-1">
                            <span className="text-green-500">{stat.trend}</span>
                        </p>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Left Column: Context & Upload */}
                <div className="space-y-6 lg:col-span-1">
                    {!uploadedFile ? (
                        <ResumeUpload onFileUpload={handleFileUpload} />
                    ) : isParsing ? (
                        <ResumeParsing onComplete={handleParsingComplete} />
                    ) : (
                        <ResumePreview file={uploadedFile} data={parsedData} />
                    )}

                    <div className="bg-blue-600 rounded-xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-500/20">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-2">Daily Tip</h3>
                            <p className="text-blue-100 text-sm leading-relaxed">
                                "When answering behavioral questions, remember to focus on your specific contribution, not just what the team did."
                            </p>
                            <button
                                onClick={() => navigate('/interview')}
                                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
                            >
                                Practice Behavioral
                            </button>
                        </div>
                        {/* Decorative background circles */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/50 rounded-full -ml-12 -mb-12 blur-xl"></div>
                    </div>
                </div>

                {/* Right Column: Chat Interface */}
                <div className="lg:col-span-2">
                    <ChatInterface />
                </div>
            </div>
        </div>
    );
}
