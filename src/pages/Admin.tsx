// src/pages/Admin.tsx
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/Admin/AdminDashboard';
import AdminPosts from '../components/Admin/AdminPosts';
import AdminGallery from '../components/Admin/AdminGallery';
import AdminEvents from '../components/Admin/AdminEvents';
import AdminInvestments from '../components/Admin/AdminInvestments';
import AdminUsers from '../components/Admin/AdminUsers';

// ===============================
// PROTECTED ROUTE WITH ROLE CHECK
// ===============================
interface PrivateRouteProps {
    children: React.ReactNode;
    requiredRoles?: string[];
    redirectTo?: string;
}

const PrivateRoute = ({
    children,
    requiredRoles = [],
    redirectTo = '/admin'
}: PrivateRouteProps) => {
    const { isAuthenticated, user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/admin/login', { state: { from: location.pathname } });
        }
    }, [isAuthenticated, loading, navigate, location]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-stone-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" state={{ from: location.pathname }} />;
    }

    if (requiredRoles.length > 0 && user) {
        const hasRequiredRole = requiredRoles.includes(user.role);
        if (!hasRequiredRole) {
            return (
                <div className="ml-64 p-8">
                    <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl text-center max-w-2xl mx-auto">
                        <div className="flex justify-center mb-4">
                            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-3xl">🔒</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-serif font-bold mb-2">Access Denied</h2>
                        <p className="text-red-600">You do not have permission to access this page.</p>
                        <p className="text-sm text-red-500 mt-2">
                            Required role: <span className="font-bold">{requiredRoles.join(', ')}</span>
                        </p>
                        <p className="text-sm text-red-500">
                            Your role: <span className="font-bold">{user.role}</span>
                        </p>
                        <button
                            onClick={() => navigate(redirectTo)}
                            className="mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl transition-all font-medium"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            );
        }
    }

    return children;
};

// ===============================
// ADMIN LAYOUT
// ===============================
export default function Admin() {
    const { language } = useLanguage();
    const {
        user,
        isAuthenticated,
        loading,
        logout,
        mustChangePassword
    } = useAuth();  // ← Get mustChangePassword from AuthContext
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/admin/login', { state: { from: location.pathname } });
        }
        // If user must change password, redirect to change password page
        if (!loading && isAuthenticated && mustChangePassword) {
            navigate('/admin/change-password');
        }
    }, [isAuthenticated, loading, navigate, location, mustChangePassword]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" />;
    }

    if (mustChangePassword) {
        return <Navigate to="/admin/change-password" />;
    }

    const isAdmin = user?.role !== 'viewer' && user?.role !== undefined;

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-stone-200 shadow-lg">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center">
                            <span className="text-3xl">👋</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                        {language === 'en' ? 'No Admin Access' : 'የአስተዳዳሪ መድረሻ የለም'}
                    </h2>
                    <p className="text-stone-500 mb-6">
                        {language === 'en'
                            ? 'You do not have admin privileges. Please contact your administrator.'
                            : 'የአስተዳዳሪ መብት የሎትም። እባክዎት አስተዳዳሪዎን ያነጋግሩ።'}
                    </p>
                    <button
                        onClick={() => {
                            logout();
                            navigate('/');
                        }}
                        className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl transition-all font-medium"
                    >
                        {language === 'en' ? 'Go Home' : 'ወደ መነሻ ገጽ'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50">
            <Routes>
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <AdminDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/posts"
                    element={
                        <PrivateRoute>
                            <AdminPosts />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/gallery"
                    element={
                        <PrivateRoute requiredRoles={['gallery_admin', 'super_admin']}>
                            <AdminGallery />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/events"
                    element={
                        <PrivateRoute requiredRoles={['super_admin']}>
                            <AdminEvents />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/investments"
                    element={
                        <PrivateRoute requiredRoles={['super_admin']}>
                            <AdminInvestments />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <PrivateRoute requiredRoles={['super_admin']}>
                            <AdminUsers />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/articles"
                    element={
                        <PrivateRoute>
                            <AdminPosts />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/admin" />} />
            </Routes>
        </div>
    );
}