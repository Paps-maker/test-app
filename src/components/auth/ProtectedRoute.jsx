import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children, fallback }) {
    const { user, token, isAuthenticated } = useAuth();

    // Verify authentication state in memory
    const isAuthorized = isAuthenticated || (token && user);

    if (!isAuthorized) {
        return (
            fallback || (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-slate-800/80 border border-slate-700/80 rounded-2xl p-8 shadow-2xl backdrop-blur-md text-center">
                        <h3 className="text-xl font-bold text-slate-100 mb-2">
                            Access Restricted
                        </h3>
                        <p className="text-slate-400 text-sm">
                            Please log in to access this area.
                        </p>
                    </div>
                </div>
            )
        );
    }

    return children;
}