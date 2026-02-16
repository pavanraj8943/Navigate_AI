import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    {/* Brand & Copyright */}
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Navigate AI
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            © {currentYear} Navigate AI. All rights reserved.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex gap-6 text-sm text-slate-600 dark:text-slate-300">
                        <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</a>
                        <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a>
                    </div>

                    {/* Social Icons */}
                    <div className="flex gap-4">
                        <a href="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-slate-400 hover:text-red-500 transition-colors">
                            <Mail className="w-5 h-5" />
                        </a>
                    </div>

                </div>
            </div>
        </footer>
    );
}
