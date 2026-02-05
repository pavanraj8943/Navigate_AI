import React, { useState, useEffect } from 'react';
import { QuestionDisplay } from './QuestionDisplay';
import { ResponseRecorder } from './ResponseRecorder';
import { ArrowRight, CheckCircle2, Loader2, Play } from 'lucide-react';
import { interviewService } from '../../services/interviewService';

export function InterviewSimulation() {
    const [session, setSession] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [evaluations, setEvaluations] = useState([]);

    const startSession = async () => {
        setIsStarting(true);
        try {
            const response = await interviewService.startSession({
                sessionType: 'quick-practice',
                difficulty: 'mid'
            });
            setSession(response.data);
        } catch (error) {
            console.error('Failed to start session:', error);
        } finally {
            setIsStarting(false);
        }
    };

    const handleNextQuestion = async () => {
        if (!userAnswer.trim()) {
            // In a real app, maybe show a toast
            alert('Please provide an answer first.');
            return;
        }

        setIsLoading(true);
        try {
            const currentQuestion = session.questions[currentQuestionIndex];
            const response = await interviewService.submitAnswer(
                session._id,
                currentQuestion._id,
                userAnswer
            );

            setEvaluations([...evaluations, response.data]);
            setUserAnswer('');
            setIsRecording(false);

            if (currentQuestionIndex < session.questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setIsComplete(true);
            }
        } catch (error) {
            console.error('Failed to submit answer:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleRecording = () => {
        setIsRecording(!isRecording);
    };

    if (isStarting) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <h2 className="text-xl font-semibold text-slate-800">Generating personalized questions...</h2>
                <p className="text-slate-500 mt-2">AI is analyzing your resume to create a relevant mock interview.</p>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Play className="w-8 h-8 ml-1" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Ready to Start?</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                    We'll generate 5 personalized interview questions based on your resume context.
                </p>
                <button
                    onClick={startSession}
                    className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200/50"
                >
                    Start Mock Interview
                </button>
            </div>
        );
    }

    if (isComplete) {
        return (
            <div className="text-center py-12 px-6 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Interview Session Complete!</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                    Great job! You've completed your practice session. Here's your performance summary.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-10 text-left">
                    {evaluations.map((evalData, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-slate-800">Question {idx + 1}</h4>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${evalData.score >= 8 ? 'bg-green-100 text-green-700' :
                                        evalData.score >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    Score: {evalData.score}/10
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{evalData.feedback}</p>
                            <div className="flex flex-wrap gap-1">
                                {evalData.strengths.slice(0, 2).map((s, i) => (
                                    <span key={i} className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full border border-green-100">+{s}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                    >
                        Practice Again
                    </button>
                    <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        View Detailed Results
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = session.questions[currentQuestionIndex];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <QuestionDisplay
                    question={{ ...currentQuestion, text: currentQuestion.question }}
                    currentCount={currentQuestionIndex + 1}
                    totalCounts={session.questions.length}
                />

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-semibold text-slate-800 mb-3">Your Answer</h3>
                    <textarea
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your response here or use what you practiced..."
                        className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleNextQuestion}
                        disabled={isLoading || !userAnswer.trim()}
                        className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Evaluating...
                            </>
                        ) : (
                            <>
                                {currentQuestionIndex === session.questions.length - 1 ? 'Finish Interview' : 'Next Question'}
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>

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
