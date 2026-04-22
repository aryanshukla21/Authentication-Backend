import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const parseToken = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch { return null; }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('tm_token');
        return token ? parseToken(token) : null;
    });

    const login = useCallback((token) => {
        localStorage.setItem('tm_token', token);
        setUser(parseToken(token));
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('tm_token');
        localStorage.removeItem('tm_user');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}; 1
4