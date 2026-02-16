import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout({ children }) {
    return (
        <div className="flex h-screen bg-white overflow-hidden transition-colors duration-200">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Header />

                {/* Scrollable Content Container */}
                <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-slate-100 dark:scrollbar-track-slate-900 flex flex-col">
                    <main className="flex-1 p-6">
                        <div className="max-w-7xl mx-auto w-full">
                            {children}
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
}
