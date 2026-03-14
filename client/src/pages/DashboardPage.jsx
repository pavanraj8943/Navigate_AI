import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { ResumeUpload } from '../components/resume/ResumeUpload';
import { ResumeParsing } from '../components/resume/ResumeParsing';
import { ResumePreview } from '../components/resume/ResumePreview';
import { ChatInterface } from '../components/Chat/ChatInterface';
import { BarChart3, TrendingUp, CheckCircle2, LogOut, Loader2, Edit2, CheckCircle, XCircle, BrainCircuit } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

export function DashboardPage() {
    const navigate = useNavigate();
    const { user, logout, setUser } = useUserContext();
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isParsing, setIsParsing] = useState(false);
    const [parsedData, setParsedData] = useState(null);
    const [resumeId, setResumeId] = useState(null);

    // Target Role State
    const [isEditingRole, setIsEditingRole] = useState(false);
    const [tempRole, setTempRole] = useState('');
    const [isSavingRole, setIsSavingRole] = useState(false);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const res = await api.get('/resume');
                if (res.success && res.data && res.data.length > 0) {
                    const latestResume = res.data[0];
                    setParsedData(latestResume.parsed);
                    setResumeId(latestResume._id);
                    // Mock file object to trigger view state
                    setUploadedFile({
                        name: latestResume.originalName,
                        filename: latestResume.filename,
                        size: latestResume.size,
                        type: latestResume.mimeType
                    });
                }
            } catch (error) {
                console.error('Error fetching resume:', error);
            }
        };
        fetchResume();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await analyticsService.getDashboardStats();
                setStats(data.data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setStatsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleFileUpload = async (file) => {
        setUploadedFile(file);
        setIsParsing(true);
        setParsedData(null);

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const data = await api.upload('/resume/upload', formData);
            if (data.success && data.data?.parsed) {
                setParsedData(data.data.parsed);
                setResumeId(data.data._id);
            }
        } catch (error) {
            console.error('Error uploading resume:', error);
            setIsParsing(false); // Stop parsing on error
            setUploadedFile(null); // Reset file on error
            // Ideally show a toast here
        }
    };

    const handleDeleteResume = async () => {
        if (!resumeId) {
            setUploadedFile(null);
            setParsedData(null);
            setIsParsing(false);
            return;
        }

        try {
            await api.delete(`/resume/${resumeId}`);
            setUploadedFile(null);
            setParsedData(null);
            setParsedData(null);
            setIsParsing(false);
            setResumeId(null);
        } catch (error) {
            console.error('Error deleting resume:', error);
        }
    };

    const handleParsingComplete = () => {
        setIsParsing(false);
    };

    const handleUpdateRole = async () => {
        if (!tempRole.trim()) return;
        setIsSavingRole(true);
        try {
            const res = await api.updateProfile({ targetRole: tempRole });
            if (res.success) {
                // Update local user context
                setUser({ ...user, targetRole: res.data.targetRole });
                setIsEditingRole(false);
            }
        } catch (error) {
            console.error('Failed to update role:', error);
        } finally {
            setIsSavingRole(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 transition-colors">Hello, {user?.name || 'User'}!</h1>
                    <p className="text-slate-500 mt-1 transition-colors">Ready to ace your next interview? Here's your progress.</p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-colors">
                        <span>Target Role:</span>
                        {isEditingRole ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={tempRole}
                                    onChange={(e) => setTempRole(e.target.value)}
                                    className="border border-slate-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Frontend Developer"
                                    autoFocus
                                />
                                <button
                                    onClick={handleUpdateRole}
                                    disabled={isSavingRole}
                                    className="text-green-600 hover:text-green-700"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIsEditingRole(false)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <XCircle className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded ${user?.targetRole ? 'text-blue-600 bg-blue-50' : 'text-slate-400 bg-slate-50 italic'}`}>
                                    {user?.targetRole || 'Not Set'}
                                </span>
                                <button
                                    onClick={() => {
                                        setTempRole(user?.targetRole || '');
                                        setIsEditingRole(true);
                                    }}
                                    className="text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                    <Edit2 className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>


                </div>
            </div>

            {/* Alignment Analysis Modal/Panel */}


            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Mock Interviews', value: stats?.totalSessions || '0', trend: 'Total sessions', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Average Score', value: `${stats?.averageScore || '0'}/10`, trend: 'AI Evaluation', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Skills Analyzed', value: stats?.skillsAnalyzed || '0', trend: 'From resume', icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                        {statsLoading ? (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                            </div>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                ))}
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

                <div className="space-y-6 lg:col-span-1">
                    {!uploadedFile ? (
                        <ResumeUpload onFileUpload={handleFileUpload} />
                    ) : isParsing ? (
                        <ResumeParsing onComplete={handleParsingComplete} />
                    ) : (
                        <ResumePreview
                            file={uploadedFile}
                            data={parsedData}
                            onDelete={handleDeleteResume}
                            resumeId={resumeId}
                        />
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
