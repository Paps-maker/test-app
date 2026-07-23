import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children, fallback }) {
    const { user, token } = useAuth();

    // Check both token and user to verify authentication state
    if (!token || !user) {
        return fallback || <div className="auth-card">Please log in to access this area.</div>;
    }

    return children;
}