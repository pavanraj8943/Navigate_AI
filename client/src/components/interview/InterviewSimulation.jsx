import React, { useState } from 'react';
import { QuestionDisplay } from './QuestionDisplay';
import { ResponseRecorder } from './ResponseRecorder';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const MOCK_QUESTIONS = [
    {
        id: 1,
        text: "Tell me about yourself and your background.",
        hint: "Focus on your professional journey and key achievements relevant to the role.",
        category: "Introduction"
    },
    {
        id: 2,
        text: "What do you consider to be your greatest professional strength?",
        hint: "Choose a strength that is relevant to the job description and provide a concrete example.",
        category: "Behavioral"
    },
    {
        id: 3,
        text: "Describe a time when you faced a significant challenge at work. How did you handle it?",
        hint: "Use the STAR method (Situation, Task, Action, Result) to structure your answer.",
        category: "Behavioral"
    }
];

export function InterviewSimulation() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const currentQuestion = MOCK_QUESTIONS[currentQuestionIndex];

    const handleNextQuestion = () => {
        setIsRecording(false);
        if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setIsComplete(true);
        }
    };

    const handleToggleRecording = () => {
        setIsRecording(!isRecording);
    };

    if (isComplete) {
        return (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Interview Session Complete!</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                    Great job practicing! Your responses have been recorded (simulated) and are ready for review.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                    >
                        Start New Session
                    </button>
                    <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        View Analytics
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Question & Controls */}
            <div className="space-y-6">
                <QuestionDisplay
                    question={currentQuestion}
                    currentCount={currentQuestionIndex + 1}
                    totalCounts={MOCK_QUESTIONS.length}
                />

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Tips for this Question</h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                            <span>Keep your answer under 2 minutes.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                            <span>Maintain eye contact with the camera.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                            <span>Speak clearly and confidently.</span>
                        </li>
                    </ul>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleNextQuestion}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
                    >
                        {currentQuestionIndex === MOCK_QUESTIONS.length - 1 ? 'Finish Interview' : 'Next Question'}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Right Column: Weban & Recording */}
            <div className="lg:order-last">
                <div className="sticky top-6">
                    <ResponseRecorder
                        isRecording={isRecording}
                        onToggleRecording={handleToggleRecording}
                    />
                </div>
            </div>
        </div>
    );
}
