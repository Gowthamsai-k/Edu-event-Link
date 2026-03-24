import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const USER_LOCAL_STORAGE_KEY = 'edu_user';
const TOKEN_KEY = 'edu_token';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem(USER_LOCAL_STORAGE_KEY);
            if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
                return JSON.parse(savedUser);
            }
        } catch (e) {
            console.error('Error parsing saved user:', e);
            localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
        }
        return null;
    });
    const [loading, setLoading] = useState(true);

    // Initial check to see if the session cookie is valid
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem(TOKEN_KEY);
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await fetch('/api/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser({ ...data, role: 'student' });
                } else if (response.status === 401) {
                    logout();
                }
            } catch (err) {
                console.error('Session check failed:', err);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const signup = async (userData) => {
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...userData, id: null }),
            });

            let errorMessage = 'Signup failed';
            try {
                const data = await response.json();
                if (!response.ok) {
                    errorMessage = Array.isArray(data.detail)
                        ? data.detail.map(d => d.msg).join(', ')
                        : (data.detail || 'Signup failed');
                    throw new Error(errorMessage);
                }

                // Server should set the HttpOnly cookie in the Set-Cookie header
                const userState = { mail: data.mail, name: data.name, role: 'student' };
                setUser(userState);
                localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(userState));
                return data;
            } catch (err) {
                if (err instanceof SyntaxError) throw new Error('Server returned invalid response');
                throw err;
            }
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    };

    const login = async (credentials) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            let errorMessage = 'Login failed';
            try {
                const data = await response.json();
                if (!response.ok) {
                    errorMessage = Array.isArray(data.detail)
                        ? data.detail.map(d => d.msg).join(', ')
                        : (data.detail || 'Login failed');
                    throw new Error(errorMessage);
                }

                const { access_token, user: userData } = data;

                // Store token
                localStorage.setItem(TOKEN_KEY, access_token);

                // Store user info if backend provided it, otherwise use a placeholder
                // (Ideally the backend should return the user object or a /me endpoint should be called)
                const userState = userData ?
                    { mail: userData.mail, name: userData.name, role: 'student' } :
                    (user || { mail: credentials.mail, name: 'Student', role: 'student' });

                setUser(userState);
                localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(userState));
                return data;
            } catch (err) {
                if (err instanceof SyntaxError) throw new Error('Server returned invalid response');
                throw err;
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem(TOKEN_KEY);
            await fetch('/api/logout', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) {
            console.error('Logout error:', e);
        } finally {
            setUser(null);
            localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
            localStorage.removeItem(TOKEN_KEY);
        }
    };

    // Global fetcher that relies on browser-managed HttpOnly cookies
    const authFetch = async (url, options = {}) => {
        const token = localStorage.getItem(TOKEN_KEY);
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            logout();
            throw new Error('Session expired');
        }
        return response;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, authFetch }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
