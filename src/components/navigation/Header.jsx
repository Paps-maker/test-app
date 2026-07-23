import { useAuth } from '../auth/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="inventory-header">
            <div>
                <h1>Stock Management System</h1>
                <p>Real-time stock tracking </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span>
          Welcome, <strong>{user?.username || 'User'}</strong>
        </span>
                <button className="btn btn-secondary" onClick={logout}>
                    Logout
                </button>
            </div>
        </header>
    );
}