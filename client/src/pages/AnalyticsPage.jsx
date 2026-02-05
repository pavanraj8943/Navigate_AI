import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Award, Clock, ChevronRight } from 'lucide-react';
import { interviewService } from '../services/interviewService';

export function AnalyticsPage() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await interviewService.getSessions();
                setSessions(response.data);
            } catch (error) {
                console.error('Failed to fetch sessions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const averageScore = sessions.length > 0
        ? (sessions.reduce((acc, s) => {
            const sessionScore = s.questions.reduce((qAcc, q) => qAcc + (q.aiEvaluation?.score || 0), 0) / (s.questions.length || 1);
            return acc + sessionScore;
        }, 0) / sessions.length).toFixed(1)
        : 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Performance Analytics</h1>
                <p className="text-slate-500">Track your progress and identify areas for improvement</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<BarChart3 className="w-5 h-5" />}
                    label="Total Sessions"
                    value={sessions.length}
                    color="blue"
                />
                <StatCard
                    icon={<TrendingUp className="w-5 h-5" />}
                    label="Average Score"
                    value={`${averageScore}/10`}
                    color="green"
                />
                <StatCard
                    icon={<Award className="w-5 h-5" />}
                    label="Skills Mastered"
                    value="12"
                    color="purple"
                />
                <StatCard
                    icon={<Clock className="w-5 h-5" />}
                    label="Practice Time"
                    value="4.5h"
                    color="orange"
                />
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Recent Practice History</h3>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
                </div>
                <div className="divide-y divide-slate-100">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Loading your history...</div>
                    ) : sessions.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">No sessions recorded yet. Start practicing!</div>
                    ) : (
                        sessions.map((session) => (
                            <div key={session._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800">{session.sessionType === 'full-mock' ? 'Full Mock Interview' : 'Quick Practice'}</h4>
                                        <p className="text-xs text-slate-500">{new Date(session.startedAt).toLocaleDateString()} • {session.questions.length} Questions</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-slate-800">
                                            Score: {(session.questions.reduce((acc, q) => acc + (q.aiEvaluation?.score || 0), 0) / (session.questions.length || 1)).toFixed(1)}/10
                                        </div>
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Performance</div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-300" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className={`w-10 h-10 ${colors[color]} rounded-xl flex items-center justify-center mb-4`}>
                {icon}
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
    );
}
