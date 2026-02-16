import React from 'react';

export function QuestionDisplay({ question, currentCount, totalCounts }) {
    if (!question) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                    Question {currentCount} of {totalCounts}
                </span>
                <div className="flex gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${question.difficulty === 'Easy' ? 'bg-green-50 text-green-600' :
                            question.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-600' :
                                'bg-red-50 text-red-600'
                        }`}>
                        {question.difficulty || 'Medium'}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
                        {question.category || 'General'}
                    </span>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {question.text}
            </h2>

            <p className="text-slate-500">
                {question.hint || "Take a moment to structure your answer before starting."}
            </p>
        </div>
    );
}
