import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Bot, Send, User, CheckCircle, AlertCircle, Loader, SkipForward } from 'lucide-react';
import { ResumeUpload } from '../components/resume/ResumeUpload';
import { resumeService } from '../services/resumeService';
import { interviewService } from '../services/interviewService';

export function InterviewPage() {
    const [step, setStep] = useState('loading'); // loading, upload, setup, interview, results
    const [resume, setResume] = useState(null);
    const [session, setSession] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [skipping, setSkipping] = useState(false);
    const [evaluations, setEvaluations] = useState({});
    const [loadingMessage, setLoadingMessage] = useState('');
    const [interviewMode, setInterviewMode] = useState(null);
    const [jdText, setJdText] = useState('');

    useEffect(() => {
        checkResume();
    }, []);

    const checkResume = async () => {
        try {
            const response = await resumeService.getResumes();
            if (response.success && response.count > 0) {
                setResume(response.data[0]);
                setStep('setup');
            } else {
                setStep('upload');
            }
        } catch (error) {
            console.error("Error checking resume:", error);
            setStep('upload');
        }
    };

    const handleUpload = async (file) => {
        setLoadingMessage('Uploading and analyzing resume...');
        setStep('loading');
        try {
            const response = await resumeService.uploadResume(file);
            if (response.success) {
                setResume(response.data);
                setStep('setup');
            }
        } catch (error) {
            console.error("Upload error:", error);
            setStep('upload');
            // Show error toast
        }
    };

    const startInterview = async (focusArea = '', mode = 'general') => {
        setLoadingMessage('Initializing AI Interviewer...');
        setStep('loading');
        try {
            const response = await interviewService.startSession({
                targetRole: focusArea || resume?.parsed?.personalInfo?.title || 'Software Engineer',
                interviewMode: mode
            });
            if (response.success) {
                setSession(response.data);
                setQuestions(response.data.questions);
                setStep('interview');
            }
        } catch (error) {
            console.error("Start session error:", error);
            setStep('setup');
        }
    };

    const handleSubmitAnswer = async () => {
        if (!answer.trim()) return;
        setSubmitting(true);
        try {
            const currentQ = questions[currentQuestionIndex];
            const response = await interviewService.submitAnswer(
                session._id,
                currentQ._id,
                answer
            );

            if (response.success) {
                // Save evaluation
                setEvaluations(prev => ({
                    ...prev,
                    [currentQ._id]: response.data
                }));

                // Handle Next Question or Completion
                if (response.nextQuestion) {
                    setQuestions(prev => {
                        // Avoid duplicates if weird sync issues, although backend handles logic
                        if (prev.find(q => q._id === response.nextQuestion._id)) return prev;
                        return [...prev, response.nextQuestion];
                    });
                }

                if (response.interviewCompleted) {
                    // We'll show results after they click "View Results" or "Next" from feedback view
                    // stored in state? Or just flag it.
                    // Actually, let's wait for user to click "Next" to see results.
                }
            }
        } catch (error) {
            console.error("Submit answer error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSkip = async () => {
        setSkipping(true);
        try {
            const currentQ = questions[currentQuestionIndex];
            const response = await interviewService.skipQuestion(
                session._id,
                currentQ._id
            );

            if (response.success) {
                // Mark current locally as skipped (optional, for UI)

                // Handle Next Question
                if (response.nextQuestion) {
                    setQuestions(prev => [...prev, response.nextQuestion]);
                    // Automatically move to next question since no feedback to show
                    setCurrentQuestionIndex(prev => prev + 1);
                    setAnswer('');
                } else if (response.interviewCompleted) {
                    setStep('results');
                }
            }
        } catch (error) {
            console.error("Skip error:", error);
        } finally {
            setSkipping(false);
        }
    };

    const handleNextAfterFeedback = () => {
        setAnswer('');
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Check if session is actually completed on backend?
            // Since we append questions, if index is last, it means no new question came back yet?
            // Or we just show results.
            setStep('results');
        }
    };

    const calculateTotalScore = () => {
        const scores = Object.values(evaluations).map(e => e.score);
        if (scores.length === 0) return 0;
        return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
    };

    const markdownComponents = {
        p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-2 text-slate-800" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-4 mb-2 text-slate-800" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-base font-bold mt-4 mb-2 text-slate-800" {...props} />,
        code: ({ node, inline, ...props }) =>
            inline ? <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 text-xs font-mono" {...props} />
                : <code className="block bg-slate-800 text-slate-50 p-3 rounded-lg text-sm my-2 overflow-x-auto font-mono" {...props} />
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => window.history.back()}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">AI Mock Interviewer</h1>
                        <p className="text-slate-500 text-sm">Adaptive & Personalized</p>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[500px] p-4 md:p-8">

                {step === 'loading' && (
                    <div className="h-full flex flex-col items-center justify-center space-y-4 py-20">
                        <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
                        <p className="text-slate-600 font-medium">{loadingMessage || 'Loading...'}</p>
                    </div>
                )}

                {step === 'upload' && (
                    <div className="max-w-xl mx-auto py-10">
                        <div className="text-center mb-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Upload Your Resume</h2>
                            <p className="text-slate-500">To generate personalized interview questions, we need your resume first.</p>
                        </div>
                        <ResumeUpload onFileUpload={handleUpload} />
                    </div>
                )}

                {step === 'setup' && (
                    <div className="max-w-4xl mx-auto py-8">
                        <div className="text-center mb-8 bg-indigo-50 rounded-2xl p-6">
                            <h2 className="text-2xl font-bold text-indigo-900 mb-2">Configure Your Interview</h2>
                            <p className="text-indigo-600">
                                Assessment Level: <strong>{resume?.analysis?.level || 'Intermediate'}</strong>
                            </p>
                        </div>

                        {!interviewMode ? (
                            <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                                {/* Skill Based */}
                                <div
                                    onClick={() => setInterviewMode('skill')}
                                    className="bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 cursor-pointer transition-all shadow-sm hover:shadow-md group"
                                >
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Bot className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">Skill-Based Interview</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">Focus strictly on specific technical skills extracted from your resume.</p>
                                </div>

                                {/* JD Based */}
                                <div
                                    onClick={() => setInterviewMode('jd')}
                                    className="bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 cursor-pointer transition-all shadow-sm hover:shadow-md group"
                                >
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">Job Description</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">Paste a job description to simulate an interview for a specific role.</p>
                                </div>

                                {/* HR Based */}
                                <div
                                    onClick={() => setInterviewMode('hr')}
                                    className="bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 cursor-pointer transition-all shadow-sm hover:shadow-md group"
                                >
                                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">HR & Behavioral</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">Focus on culture fit, soft skills, and evaluating past experiences.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in zoom-in-95 duration-300">
                                <button
                                    onClick={() => setInterviewMode(null)}
                                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 text-sm font-medium transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to options
                                </button>

                                {interviewMode === 'skill' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-2">Select a Skill</h3>
                                            <p className="text-slate-500 text-sm">We've extracted these skills from your resume. Pick one to begin a specialized technical deep dive.</p>
                                        </div>

                                        {resume?.parsed?.skills && resume.parsed.skills.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                                {resume.parsed.skills.map((skillCategory, idx) =>
                                                    skillCategory.items?.map((skill, sIdx) => (
                                                        <button
                                                            key={`${idx}-${sIdx}`}
                                                            onClick={() => startInterview(skill, 'skill')}
                                                            className="px-4 py-2 bg-slate-50 text-indigo-700 border border-slate-200 rounded-full text-sm font-medium hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors"
                                                        >
                                                            {skill}
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-red-500 text-sm">No skills could be extracted from your resume. <button className="underline text-indigo-600 font-medium" onClick={() => startInterview('General Tech', 'skill')}>Start anyway</button></p>
                                        )}
                                    </div>
                                )}

                                {interviewMode === 'jd' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-2">Paste Job Description</h3>
                                            <p className="text-slate-500 text-sm">Paste the job description of the role you're applying for. We'll tailor the questions accordingly.</p>
                                        </div>
                                        <textarea
                                            value={jdText}
                                            onChange={(e) => setJdText(e.target.value)}
                                            placeholder="Example: We are looking for a Senior React Developer with 5+ years of experience in Node.js..."
                                            className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition resize-none text-sm"
                                        />
                                        <button
                                            disabled={!jdText.trim()}
                                            onClick={() => startInterview(jdText, 'jd')}
                                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition w-full disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                                        >
                                            Start JD Interview
                                        </button>
                                    </div>
                                )}

                                {interviewMode === 'hr' && (
                                    <div className="space-y-6 text-center py-6">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                            <User className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-2">HR & Behavioral Interview</h3>
                                            <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm leading-relaxed">This session will evaluate your problem solving, past workplace experiences, and culture fit. Technical questions will be avoided.</p>
                                            <button
                                                onClick={() => startInterview('Behavioral Focus', 'hr')}
                                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                                            >
                                                Start HR Interview
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="text-center mt-8">
                            <button
                                onClick={() => startInterview('', 'general')}
                                className="text-sm font-medium text-slate-400 hover:text-slate-600 transition underline underline-offset-4"
                            >
                                Skip and start a general interview
                            </button>
                        </div>
                    </div>
                )}

                {step === 'interview' && questions.length > 0 && questions[currentQuestionIndex] && (
                    <div className="space-y-8">
                        {/* Status Bar */}
                        <div className="flex items-center justify-between text-sm text-slate-500 border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${questions[currentQuestionIndex].difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                    questions[currentQuestionIndex].difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {questions[currentQuestionIndex].difficulty}
                                </span>
                                <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-medium">
                                    {questions[currentQuestionIndex].category}
                                </span>
                            </div>
                            <span>Question {questions.length} (Adaptive)</span>
                        </div>

                        {/* Question */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-slate-800 leading-relaxed">
                                {questions[currentQuestionIndex].question}
                            </h2>
                            {questions[currentQuestionIndex].hint && (
                                <p className="text-sm text-slate-500 italic flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Hint: {questions[currentQuestionIndex].hint}
                                </p>
                            )}
                        </div>

                        {/* Answer Area */}
                        {!evaluations[questions[currentQuestionIndex]._id] ? (
                            <div className="space-y-4">
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Type your answer here..."
                                    className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition resize-none"
                                />
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={handleSkip}
                                        disabled={skipping || submitting}
                                        className="text-slate-400 hover:text-slate-600 px-4 py-2 rounded-lg transition flex items-center gap-2"
                                    >
                                        <SkipForward className="w-4 h-4" />
                                        Skip Question
                                    </button>

                                    <button
                                        onClick={handleSubmitAnswer}
                                        disabled={!answer.trim() || submitting}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        Submit Answer
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Evaluation Result */}
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-slate-800">AI Feedback</h3>
                                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${evaluations[questions[currentQuestionIndex]._id].score >= 7 ? 'bg-green-100 text-green-700' :
                                            evaluations[questions[currentQuestionIndex]._id].score >= 4 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            Score: {evaluations[questions[currentQuestionIndex]._id].score}/10
                                        </div>
                                    </div>
                                    <div className="text-slate-600 text-sm leading-relaxed">
                                        <ReactMarkdown components={markdownComponents}>
                                            {evaluations[questions[currentQuestionIndex]._id].feedback}
                                        </ReactMarkdown>
                                    </div>

                                    <div className="pt-4 border-t border-slate-200">
                                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">My Answer</h4>
                                        <p className="text-slate-700 text-sm bg-white p-3 rounded-lg border border-slate-100">
                                            {questions[currentQuestionIndex].userResponse || answer}
                                        </p>
                                    </div>

                                    {evaluations[questions[currentQuestionIndex]._id].improvedAnswer && (
                                        <div className="pt-4 border-t border-slate-200">
                                            <h4 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Improved Answer</h4>
                                            <div className="text-slate-700 text-sm bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                                                <ReactMarkdown components={markdownComponents}>
                                                    {evaluations[questions[currentQuestionIndex]._id].improvedAnswer}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleNextAfterFeedback}
                                        className="px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition flex items-center gap-2"
                                    >
                                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Final Results'}
                                        <ArrowLeft className="w-4 h-4 rotate-180" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 'results' && (
                    <div className="text-center py-10 space-y-8 animate-in zoom-in duration-300">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12" />
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Interview Completed!</h2>
                            <p className="text-slate-500">Here's how you performed</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-sm mx-auto">
                            <div className="text-5xl font-bold text-indigo-600 mb-2">{calculateTotalScore()}</div>
                            <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Average Score</div>
                        </div>

                        <div className="max-w-2xl mx-auto space-y-4 text-left">
                            <h3 className="font-semibold text-slate-800 mb-4">Question Breakdown</h3>
                            {questions.map((q, idx) => (
                                <div key={idx} className="bg-slate-50 p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex-1 pr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium text-slate-500">{q.category}</span>
                                            {q.skipped && <span className="text-xs font-bold text-red-400">SKIPPED</span>}
                                        </div>
                                        <div className="text-sm text-slate-800 font-medium truncate">{q.question}</div>
                                    </div>
                                    {!q.skipped && (
                                        <div className={`px-3 py-1 rounded-lg text-sm font-bold ${(evaluations[q._id]?.score || 0) >= 7 ? 'bg-green-100 text-green-700' :
                                            (evaluations[q._id]?.score || 0) >= 4 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {evaluations[q._id]?.score || 0}/10
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="pt-8">
                            <button
                                onClick={() => {
                                    setStep('setup');
                                    setQuestions([]);
                                    setCurrentQuestionIndex(0);
                                    setEvaluations({});
                                    setAnswer('');
                                }}
                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                Start New Interview
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
