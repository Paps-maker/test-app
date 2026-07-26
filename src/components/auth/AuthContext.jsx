import { createContext, useState, useContext } from 'react';
import { apiFetch } from '../../context/apiFetch';

const AuthContext = createContext(null);

// Spring Boot Backend Base Auth URL
// Vite projects use import.meta.env, Create-React-App uses process.env
const BASE_DOMAIN = import.meta.env.VITE_API_URL || 'http://localhost:8081';
const API_BASE_URL = `${BASE_DOMAIN}/api/auth`;

export function AuthProvider({ children }) {
    // Pure in-memory React state (No localStorage fallback)
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    // Real Spring Boot API Login
    const login = async (username, password) => {
        try {
            const response = await apiFetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Include credentials if Spring Boot sets HttpOnly cookies
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Invalid username or password');
            }

            const data = await response.json();

            // Store auth payload in React memory state
            const authToken = data.token || data.accessToken || null;
            const userData = {
                username: data.username || username,
                role: data.role || 'USER',
            };

            setToken(authToken);
            setUser(userData);

            return { token: authToken, user: userData };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    // Real Spring Boot API Registration
    const register = async (username, email, password) => {
        try {
            const response = await apiFetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Registration failed. Please try again.');
            }

            // Automatically authenticate via Spring Boot upon registration
            return await login(username, password);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    // Logout clears React memory and notifies Spring Boot
    const logout = async () => {
        try {
            await apiFetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
            }).catch(() => null);
        } finally {
            // Reset React state
            setToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user || !!token,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);