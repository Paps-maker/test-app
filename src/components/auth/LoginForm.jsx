import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function LoginForm({ onSwitchToRegister }) {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        if (error) setError(''); // Clear error message when user starts typing again
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login(formData.username, formData.password);
        } catch (err) {
            setError(err.message || 'Invalid username or password. Please try again or sign up.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-card">
            <h2>Sign In</h2>
            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username or Email</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        autoComplete="username"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="current-password"
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Authenticating...' : 'Login'}
                </button>
            </form>

            {onSwitchToRegister && (
                <p className="auth-switch">
                    Don't have an account?{' '}
                    <button type="button" className="btn-link" onClick={onSwitchToRegister}>
                        Register here
                    </button>
                </p>
            )}
        </div>
    );
}