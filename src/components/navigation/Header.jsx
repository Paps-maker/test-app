import { useAuth } from '../auth/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                    Stock Management System
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                    Real-time stock tracking
                </p>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-auto">
                <span className="text-xs sm:text-sm text-slate-300">
                    Welcome, <strong className="text-indigo-400 font-semibold">{user?.username || 'User'}</strong>
                </span>
                <button
                    onClick={logout}
                    className="px-3.5 py-1.5 bg-slate-700/60 hover:bg-slate-700 border border-slate-600/70 text-slate-200 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}