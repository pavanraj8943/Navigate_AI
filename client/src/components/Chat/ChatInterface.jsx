import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Maximize2, Minimize2 } from 'lucide-react';

export function ChatInterface() {
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', content: "Hello! I'm your Navigate Assistant. Upload your resume to get started, or ask me any general interview questions." }
    ]);
    const [input, setInput] = useState('');
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessage = { id: Date.now(), role: 'user', content: input };
        setMessages([...messages, newMessage]);
        setInput('');

        // Simulate AI response for now
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: "I'm still learning! Once the backend is connected, I'll be able to give meaningful feedback."
            }]);
        }, 1000);
    };

    return (
        <div className={`bg-white shadow-sm border border-slate-200 flex flex-col transition-all duration-300 ${isFullScreen ? 'fixed inset-0 z-50 h-[100dvh] rounded-none' : 'h-[600px] rounded-xl'}`}>
            {/* Chat Application Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">Navigate Assistant</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs text-slate-500 font-medium">Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleFullScreen}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                    >
                        {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                    <button className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        New Session
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-white border border-slate-200 text-indigo-600'
                            }`}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>

                        <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                    AI can make mistakes. Please verify important information.
                </p>
            </div>
        </div>
    );
}
