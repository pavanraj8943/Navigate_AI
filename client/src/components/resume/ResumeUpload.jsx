import React, { useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

export function ResumeUpload({ onFileUpload }) {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            // Validate file type (pdf, docx) if needed
            setFile(e.dataTransfer.files[0]);
            if (onFileUpload) onFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            if (onFileUpload) onFileUpload(e.target.files[0]);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-500" />
                Upload Resume
            </h3>

            {!file ? (
                <div
                    className={`relative border-2 border-dashed rounded-xl p-8 transition-colors text-center ${dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleChange}
                        accept=".pdf,.docx,.txt"
                    />
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <UploadCloud className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700">
                                <span className="text-blue-600">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-slate-500 mt-1">PDF, DOCX, TXT up to 10MB</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-blue-200 rounded-lg flex items-center justify-center text-blue-500">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-800 truncate max-w-50">{file.name}</p>
                            <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setFile(null)}
                        className="p-1 hover:bg-white rounded-full text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
