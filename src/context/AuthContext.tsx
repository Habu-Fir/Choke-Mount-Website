// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';
import { User, UserRole } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string; mustChangePassword?: boolean }>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    hasRole: (role: UserRole | UserRole[]) => boolean;
    hasPermission: (permission: string) => boolean;
    refreshUser: () => Promise<void>;
    mustChangePassword: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mustChangePassword, setMustChangePassword] = useState(false);

    // Load user on mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = authService.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                    // Check if user must change password
                    if (currentUser.mustChangePassword) {
                        setMustChangePassword(true);
                    }
                }
            } catch (err) {
                console.error('Error loading user:', err);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; mustChangePassword?: boolean }> => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.login(email, password);
            if (response.success) {
                const userData = authService.getCurrentUser();
                setUser(userData);
                // Check if user must change password from response
                const mustChange = response.data?.mustChangePassword || userData?.mustChangePassword || false;
                setMustChangePassword(mustChange);
                return {
                    success: true,
                    mustChangePassword: mustChange
                };
            } else {
                const errorMsg = response.message || 'Login failed';
                setError(errorMsg);
                return { success: false, error: errorMsg };
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || 'Login failed';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setMustChangePassword(false);
    };

    const refreshUser = async () => {
        try {
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                if (currentUser.mustChangePassword) {
                    setMustChangePassword(true);
                }
            }
        } catch (err) {
            console.error('Error refreshing user:', err);
        }
    };

    const isAuthenticated = !!user;
    const isAdmin = user?.role !== 'viewer' && user?.role !== undefined;
    const isSuperAdmin = user?.role === 'super_admin';

    const hasRole = (roles: UserRole | UserRole[]): boolean => {
        if (!user) return false;
        const roleList = Array.isArray(roles) ? roles : [roles];
        return roleList.includes(user.role as UserRole);
    };

    const hasPermission = (permission: string): boolean => {
        if (!user) return false;
        if (isSuperAdmin) return true;
        const rolePermissions: Record<string, string[]> = {
            super_admin: ['*'],
            gallery_admin: ['manage_gallery'],
            news_admin: ['manage_news'],
            history_admin: ['manage_history'],
            entertainment_admin: ['manage_entertainment'],
            health_admin: ['manage_health'],
            technology_admin: ['manage_technology'],
            vacancy_admin: ['manage_vacancy'],
            viewer: [],
        };
        const userPermissions = rolePermissions[user.role as string] || [];
        return userPermissions.includes('*') || userPermissions.includes(permission);
    };

    const value: AuthContextType = {
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        hasRole,
        hasPermission,
        refreshUser,
        mustChangePassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};