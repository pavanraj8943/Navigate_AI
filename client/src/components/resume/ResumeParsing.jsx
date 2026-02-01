import React, { useEffect, useState } from 'react';
import { Loader2, FileText, CheckCircle2 } from 'lucide-react';

export function ResumeParsing({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [step, setStep] = useState('Uploading...');

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 800); // Wait a bit before completing
                    return 100;
                }
                const increment = Math.random() * 10;
                return Math.min(prev + increment, 100);
            });
        }, 300);

        return () => clearInterval(interval);
    }, [onComplete]);

    useEffect(() => {
        if (progress < 30) setStep('Uploading document...');
        else if (progress < 60) setStep('Analyzing layout...');
        else if (progress < 90) setStep('Extracting skills and experience...');
        else setStep('Finalizing...');
    }, [progress]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative mb-6">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                    <FileText className="w-10 h-10 text-blue-600" />
                </div>
                {progress < 100 && (
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    </div>
                )}
                {progress === 100 && (
                    <div className="absolute -bottom-2 -right-2 bg-green-100 rounded-full p-1 shadow-sm">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                )}
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-2">Processing Resume</h3>
            <p className="text-slate-500 text-sm mb-6">{step}</p>

            <div className="w-full max-w-xs bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                    className="h-full bg-blue-600 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
}
