import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const RANDOM_NAMES = [
    'Campus Rover', 'Digital Scholar', 'Event Maven', 'Study Guru',
    'Code Ninja', 'Design Wizard', 'Social Butterfly', 'Lecture Listener',
    'Cafeteria Critic', 'Lab Explorer', 'Library Hermit', 'Graduation Seeker'
];

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('edu_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const signup = (email) => {
        const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)] + ' #' + Math.floor(1000 + Math.random() * 9000);
        const newUser = { email, name: randomName, role: 'student' };
        setUser(newUser);
        localStorage.setItem('edu_user', JSON.stringify(newUser));
        return newUser;
    };

    const login = (email) => {
        // Dummy login: if email exists, just log in as that user with a generic name if not found
        const existing = localStorage.getItem('edu_user');
        if (existing) {
            const parsed = JSON.parse(existing);
            if (parsed.email === email) {
                setUser(parsed);
                return parsed;
            }
        }
        // Fallback dummy login
        return signup(email);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('edu_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
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
