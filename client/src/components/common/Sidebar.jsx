import { LayoutDashboard, FileText, MessageSquare, LogOut, BarChart3, Target } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

export function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useUserContext();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { id: 'coach', label: 'AI Coach', icon: Target, path: '/coach' },
        { id: 'interview', label: 'Mock Interview', icon: MessageSquare, path: '/interview' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full shrink-0 transition-all duration-300">
            {/* Logo area */}
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Navigate AI</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Menu</div>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                                ? 'bg-blue-600/10 text-blue-400 font-bold'
                                : 'hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-white'}`} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User Info / Logout */}
            <div className="p-4  border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
