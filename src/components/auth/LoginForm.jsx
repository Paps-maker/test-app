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
            setError(
                err.message || 'Invalid username or password. Please try again or sign up.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 sm:p-8 shadow-2xl max-w-md w-full mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-slate-100 text-center">Sign In</h2>

            {error && (
                <div className="p-3.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs sm:text-sm font-medium leading-relaxed text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="username" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Username or Email
                    </label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        autoComplete="username"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-500"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="password" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="current-password"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg shadow transition-colors cursor-pointer"
                >
                    {isSubmitting ? 'Authenticating...' : 'Login'}
                </button>
            </form>

            {onSwitchToRegister && (
                <p className="text-xs sm:text-sm text-slate-400 text-center pt-2 border-t border-slate-700/60">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={onSwitchToRegister}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline-offset-2 hover:underline focus:outline-none"
                    >
                        Register here
                    </button>
                </p>
            )}
        </div>
    );
}