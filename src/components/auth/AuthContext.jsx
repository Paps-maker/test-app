import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // Session state initialized directly from localStorage
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [user, setUser] = useState(() => {
        const storedUsername = localStorage.getItem('username');
        const storedToken = localStorage.getItem('token');
        return storedToken ? { username: storedUsername || 'User' } : null;
    });

    // Helper to get registered users array from localStorage
    const getStoredUsers = () => {
        const users = localStorage.getItem('registered_users');
        return users ? JSON.parse(users) : [];
    };

    // Simulated Register (Sign Up)
    const register = async (username, email, password) => {
        // Small delay to simulate server network latency
        await new Promise((resolve) => setTimeout(resolve, 300));

        const existingUsers = getStoredUsers();

        // Check if username already exists
        const userExists = existingUsers.some(
            (u) => u.username.toLowerCase() === username.toLowerCase()
        );

        if (userExists) {
            throw new Error('Username is already taken');
        }

        // Save new user account to localStorage
        const newUser = { username, email, password };
        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem('registered_users', JSON.stringify(updatedUsers));

        // Auto-login after successful registration
        return login(username, password);
    };

    // Simulated Login (Sign In)
    const login = async (username, password) => {
        // Small delay to simulate server response time
        await new Promise((resolve) => setTimeout(resolve, 300));

        const existingUsers = getStoredUsers();

        // Find user by username
        const foundUser = existingUsers.find(
            (u) => u.username.toLowerCase() === username.toLowerCase()
        );

        if (!foundUser || foundUser.password !== password) {
            throw new Error('Invalid username or password');
        }

        // Generate fake mock session token
        const mockToken = 'mock-jwt-token-' + Date.now();

        // Save session locally
        localStorage.setItem('token', mockToken);
        localStorage.setItem('username', foundUser.username);

        setToken(mockToken);
        setUser({ username: foundUser.username });

        return { token: mockToken, user: { username: foundUser.username } };
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);