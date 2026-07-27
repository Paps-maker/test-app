import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function SignUpForm({ onSwitchToLogin }) {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        if (error) setError(''); // Clear error message when user starts typing again
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setIsSubmitting(true);

        try {
            // Calls register() in AuthContext (Spring Boot endpoint)
            await register(formData.username, formData.email, formData.password);
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 sm:p-8 shadow-2xl max-w-md w-full mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-slate-100 text-center">Create Account</h2>

            {error && (
                <div className="p-3.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs sm:text-sm font-medium leading-relaxed text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="reg-username" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Username
                    </label>
                    <input
                        id="reg-username"
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
                    <label htmlFor="reg-email" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Email Address
                    </label>
                    <input
                        id="reg-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-500"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="reg-password" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Password
                    </label>
                    <input
                        id="reg-password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-500"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="reg-confirm" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Confirm Password
                    </label>
                    <input
                        id="reg-confirm"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg shadow transition-colors cursor-pointer"
                >
                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>

            {onSwitchToLogin && (
                <p className="text-xs sm:text-sm text-slate-400 text-center pt-2 border-t border-slate-700/60">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline-offset-2 hover:underline focus:outline-none"
                    >
                        Sign In
                    </button>
                </p>
            )}
        </div>
    );
}