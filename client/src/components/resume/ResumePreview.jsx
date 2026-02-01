import React from 'react';
import { FileText, Mail, Phone, Award } from 'lucide-react';

export function ResumePreview({ file }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Resume Preview
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-600 rounded">
                    Analysis Complete
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Mock Parsed Data Section */}
                <div className="grid gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 className="font-medium text-slate-900 mb-2">Candidate Details</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                                <span className="font-semibold text-slate-800">Alex Morgan</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Mail className="w-3.5 h-3.5" />
                                <span>alex.morgan@example.com</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Phone className="w-3.5 h-3.5" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                            <Award className="w-4 h-4 text-purple-500" />
                            Identified Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'GraphQL', 'System Design', 'Agile Methodology'].map(skill => (
                                <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium border border-blue-100">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* PDF Viewer Placeholder */}
                <div className="border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-500 mb-2">Document Preview:</p>
                    <div className="bg-slate-100 rounded-lg h-64 flex items-center justify-center text-slate-400">
                        <div className="text-center">
                            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">
                                {file ? `Previewing: ${file.name}` : 'Document Loaded'}
                            </p>
                            <p className="text-xs mt-1 opacity-75">(PDF rendering simulated)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
