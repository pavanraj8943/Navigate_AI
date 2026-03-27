import React, { useState } from 'react';
import { UploadCloud, FileText, X, AlertCircle } from 'lucide-react';

export function ResumeUpload({ onFileUpload }) {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const validateFile = (selectedFile) => {
        setError(null);
        if (!selectedFile) return false;

        if (selectedFile.type !== 'application/pdf') {
            setError('Invalid file type. Only PDF files are allowed.');
            return false;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setError('File size too large. Maximum size is 10MB.');
            return false;
        }

        return true;
    };

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
            const droppedFile = e.dataTransfer.files[0];
            if (validateFile(droppedFile)) {
                setFile(droppedFile);
                if (onFileUpload) onFileUpload(droppedFile);
            }
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
                if (onFileUpload) onFileUpload(selectedFile);
            }
        }
    };

    const removeFile = () => {
        setFile(null);
        setError(null);
        // Reset the file input value if needed, although usually creating a new key or unmounting handles it.
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-blue-500" />
                    Upload Resume
                </h3>
                <p className="text-sm text-slate-500 mt-1 mb-4">
                    Please upload your resume to get started. Only <span className="font-semibold text-slate-700">PDF</span> files up to <span className="font-semibold text-slate-700">5MB</span> are supported.
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-medium text-red-800">Validation Error</h4>
                        <p className="text-xs text-red-600 mt-0.5">{error}</p>
                    </div>
                </div>
            )}

            {!file ? (
                <div
                    className={`relative border-2 border-dashed rounded-xl p-8 transition-colors text-center ${dragActive ? 'border-blue-500 bg-blue-50/50' : error ? 'border-red-300 bg-red-50/30' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
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
                        accept=".pdf"
                    />
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${error ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {error ? <AlertCircle className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700">
                                <span className="text-blue-600">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-slate-500 mt-1">PDF only, up to 5MB</p>
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
                        onClick={removeFile}
                        className="p-1 hover:bg-white rounded-full text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
