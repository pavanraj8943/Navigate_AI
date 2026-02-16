import React from 'react';
import { FileText, Mail, Phone, Award, Trash2, MapPin, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ResumePreview({ file, data, onDelete, resumeId }) {
    const navigate = useNavigate();
    // Calculate API Root for static file access
    const API_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

    // Ensure we have some defaults if data is missing
    const personalInfo = data?.personalInfo || {};
    const skills = data?.skills || [];

    const handleViewPdf = (e) => {
        e?.stopPropagation();
        if (file?.filename) {
            window.open(`${API_ROOT}/uploads/${file.filename}`, '_blank');
        }
    };

    return (
        <div
            onClick={() => navigate('/interview')}
            className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[500px] cursor-pointer hover:shadow-md transition-all group/card overflow-hidden"
        >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <button
                        onClick={handleViewPdf}
                        className="p-1 hover:bg-blue-50 rounded-full transition-colors focus:outline-none"
                        title="View PDF"
                    >
                        <FileText className="w-4 h-4 text-blue-500" />
                    </button>
                    <span className="truncate max-w-[150px]" title={file?.name}>
                        {file?.name || 'Resume Preview'}
                    </span>
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.();
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                        title="Delete Resume"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded uppercase tracking-wider">
                        Analyzed
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Candidate Info */}
                <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-4">
                        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-slate-500">
                            {personalInfo.email && (
                                <div className="flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span>{personalInfo.email}</span>
                                </div>
                            )}
                            {personalInfo.phone && (
                                <div className="flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5" />
                                    <span>{personalInfo.phone}</span>
                                </div>
                            )}
                            {personalInfo.location && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{personalInfo.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    {data?.summary && (
                        <div>
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Professional Summary</h5>
                            <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-blue-100 pl-3">
                                "{data.summary.length > 150 ? data.summary.substring(0, 150) + '...' : data.summary}"
                            </p>
                        </div>
                    )}

                    {/* Skills */}
                    <div>
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Award className="w-3.5 h-3.5 text-purple-500" />
                            Core Skills
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                            {skills.length > 0 ? (
                                skills.flatMap(s => s.items).slice(0, 12).map((skill, idx) => (
                                    <span key={idx} className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[11px] font-semibold border border-blue-100">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-slate-400 italic">No skills identified yet.</span>
                            )}
                        </div>
                    </div>

                    {/* Experience Preview */}
                    {data?.experience && data.experience.length > 0 && (
                        <div>
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Key Experience</h5>
                            <div className="space-y-3">
                                {data.experience.slice(0, 2).map((exp, idx) => (
                                    <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <div className="font-bold text-sm text-slate-800">{exp.role}</div>
                                        <div className="text-xs text-blue-600 font-medium">{exp.company}</div>
                                        {exp.startDate && (
                                            <div className="text-[10px] text-slate-400 mt-1">{exp.startDate} - {exp.endDate || 'Present'}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Link to start interview */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
                {resumeId && (
                    <button
                        onClick={handleViewPdf}
                        className="flex-1 py-2 px-3 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                    >
                        View Full Details
                    </button>
                )}
                <button
                    onClick={() => navigate('/interview')}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
                >
                    <span>Start Interview</span>
                    <Globe className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}