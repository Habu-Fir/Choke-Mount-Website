// src/components/Admin/AdminDashboard.tsx - Emerald/Green Theme
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
    LayoutDashboard,
    Newspaper,
    Image as ImageIcon,
    CalendarDays,
    FileText,
    Users,
    LogOut,
    Eye,
    Clock,
    UserPlus,
    Shield,
    Menu,
    X,
    ArrowLeft,
    Home
} from 'lucide-react';
import { postService, userService } from '../../services/api';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalUsers: 0,
        totalViews: 0,
        pendingPosts: 0,
        postsByCategory: {
            news: 0,
            history: 0,
            entertainment: 0,
            health: 0,
            technology: 0,
            vacancy: 0,
            gallery: 0,
        },
        recentActivity: [],
    });

    const isSuperAdmin = user?.role === 'super_admin';
    const userRole = user?.role || 'viewer';

    useEffect(() => {
        if (!user) {
            navigate('/admin/login');
            return;
        }
        fetchStats();
    }, [user, navigate]);

    const fetchStats = async () => {
        try {
            setLoading(true);

            try {
                const response = await userService.getDashboardStats();
                if (response.success) {
                    setStats(response.data);
                    return;
                }
            } catch (error) {
                console.log('Dashboard stats endpoint not available, using fallback');
            }

            const [postsRes, usersRes] = await Promise.all([
                postService.getAll({ limit: 1 }),
                userService.getAll(),
            ]);

            setStats({
                totalPosts: postsRes?.data?.length || 0,
                totalUsers: usersRes?.data?.length || 0,
                totalViews: 0,
                pendingPosts: 0,
                postsByCategory: {
                    news: 0,
                    history: 0,
                    entertainment: 0,
                    health: 0,
                    technology: 0,
                    vacancy: 0,
                    gallery: 0,
                },
                recentActivity: [],
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const goToWebsite = () => {
        navigate('/');
    };

    const getRoleLabel = (role: string) => {
        const labels: Record<string, string> = {
            super_admin: language === 'en' ? 'Super Admin' : 'ሱፐር አስተዳዳሪ',
            gallery_admin: language === 'en' ? 'Gallery Admin' : 'ማህደር አስተዳዳሪ',
            news_admin: language === 'en' ? 'News Admin' : 'ዜና አስተዳዳሪ',
            history_admin: language === 'en' ? 'History Admin' : 'ታሪክ አስተዳዳሪ',
            entertainment_admin: language === 'en' ? 'Entertainment Admin' : 'መዝናኛ አስተዳዳሪ',
            health_admin: language === 'en' ? 'Health Admin' : 'ጤና አስተዳዳሪ',
            technology_admin: language === 'en' ? 'Technology Admin' : 'ቴክኖሎጂ አስተዳዳሪ',
            vacancy_admin: language === 'en' ? 'Vacancy Admin' : 'የስራ ክፍት ቦታ አስተዳዳሪ',
            viewer: language === 'en' ? 'Viewer' : 'ተመልካች',
        };
        return labels[role] || role;
    };

    const getMenuItems = () => {
        const items = [];

        items.push({
            label: language === 'en' ? 'Dashboard' : 'መረጃ ጠቋሚ',
            icon: LayoutDashboard,
            path: '/admin'
        });

        if (userRole !== 'viewer') {
            items.push({
                label: language === 'en' ? 'Articles' : 'ጽሑፎች',
                icon: Newspaper,
                path: '/admin/articles'
            });
        }

        if (isSuperAdmin || userRole === 'gallery_admin') {
            items.push({
                label: language === 'en' ? 'Gallery' : 'ማህደር',
                icon: ImageIcon,
                path: '/admin/gallery'
            });
        }

        if (isSuperAdmin) {
            items.push({
                label: language === 'en' ? 'Events' : 'ዝግጅቶች',
                icon: CalendarDays,
                path: '/admin/events'
            });
            items.push({
                label: language === 'en' ? 'Investments' : 'ኢንቨስትመንቶች',
                icon: FileText,
                path: '/admin/investments'
            });
            items.push({
                label: language === 'en' ? 'Users' : 'ተጠቃሚዎች',
                icon: Users,
                path: '/admin/users'
            });
        }

        return items;
    };

    const menuItems = getMenuItems();

    if (loading) {
        return (
            <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-emerald-50">
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2.5 bg-white rounded-xl shadow-lg border border-emerald-200 hover:bg-emerald-50 transition-all"
                >
                    {sidebarOpen ? (
                        <X className="h-5 w-5 text-stone-700" />
                    ) : (
                        <Menu className="h-5 w-5 text-stone-700" />
                    )}
                </button>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Emerald Theme */}
            <div className={`
                fixed inset-y-0 left-0 w-64 bg-emerald-900 text-white shadow-xl z-50
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                <div className="p-6 border-b border-emerald-800">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <LayoutDashboard className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg font-serif font-bold truncate">Digo Tsion</h1>
                            <p className="text-xs text-emerald-300 truncate">
                                {language === 'en' ? 'Admin Panel' : 'የአስተዳደር ፓነል'}
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-200px)]">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = window.location.pathname === item.path;
                        return (
                            <button
                                key={item.label}
                                onClick={() => {
                                    navigate(item.path);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-emerald-500 text-white'
                                    : 'text-emerald-300 hover:text-white hover:bg-emerald-800'
                                    }`}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                <span className="font-medium truncate">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-800 bg-emerald-900">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-9 w-9 bg-emerald-800 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-emerald-300">
                                {user?.name?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-emerald-300 truncate">{user?.email}</p>
                            <span className="text-[10px] bg-emerald-800 px-2 py-0.5 rounded-full text-emerald-400 inline-block truncate max-w-full">
                                {getRoleLabel(user?.role || 'viewer')}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-all text-sm text-emerald-300 hover:text-white"
                    >
                        <LogOut className="h-4 w-4 flex-shrink-0" />
                        <span>{language === 'en' ? 'Sign Out' : 'ውጣ'}</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-64 min-h-screen">
                <div className="p-4 sm:p-6 lg:p-8">
                    {/* Header with Back to Website button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-12 lg:pt-0">
                        <div className="min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <button
                                    onClick={goToWebsite}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 rounded-lg transition-all text-xs sm:text-sm text-stone-600 hover:text-emerald-700"
                                >
                                    <Home className="w-4 h-4 text-emerald-600" />
                                    <span className="hidden xs:inline">
                                        {language === 'en' ? 'Back to Website' : 'ወደ ድረ-ገጽ ተመለስ'}
                                    </span>
                                    <span className="xs:hidden">
                                        {language === 'en' ? 'Website' : 'ድረ-ገጽ'}
                                    </span>
                                </button>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 hover:border-stone-300 hover:bg-stone-50 rounded-lg transition-all text-xs sm:text-sm text-stone-600"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">
                                        {language === 'en' ? 'Back' : 'ተመለስ'}
                                    </span>
                                </button>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 truncate">
                                {language === 'en' ? 'Dashboard' : 'መረጃ ጠቋሚ'}
                            </h1>
                            <p className="text-sm text-stone-500 truncate">
                                {language === 'en'
                                    ? `Welcome back, ${user?.name}`
                                    : `እንኳን ደህና መጡ፣ ${user?.name}`}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span className="text-xs text-stone-500 truncate">
                                    {language === 'en'
                                        ? `Role: ${getRoleLabel(user?.role || 'viewer')}`
                                        : `ሚና: ${getRoleLabel(user?.role || 'viewer')}`}
                                </span>
                            </div>
                        </div>
                        {isSuperAdmin && (
                            <button
                                onClick={() => navigate('/admin/users')}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all flex-shrink-0 w-full sm:w-auto shadow-lg shadow-emerald-200 hover:shadow-emerald-300"
                            >
                                <UserPlus className="h-4 w-4" />
                                <span>{language === 'en' ? 'Add User' : 'ተጠቃሚ ይጨምሩ'}</span>
                            </button>
                        )}
                    </div>

                    {/* Stats Grid - Emerald Theme */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
                        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="min-w-0">
                                    <p className="text-xs sm:text-sm text-stone-500 truncate">
                                        {language === 'en' ? 'Total Posts' : 'ጠቅላላ ጽሑፎች'}
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-bold text-emerald-700">{stats.totalPosts}</p>
                                </div>
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Newspaper className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="min-w-0">
                                    <p className="text-xs sm:text-sm text-stone-500 truncate">
                                        {language === 'en' ? 'Total Users' : 'ጠቅላላ ተጠቃሚዎች'}
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-bold text-emerald-700">{stats.totalUsers}</p>
                                </div>
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="min-w-0">
                                    <p className="text-xs sm:text-sm text-stone-500 truncate">
                                        {language === 'en' ? 'Total Views' : 'ጠቅላላ እይታዎች'}
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-bold text-emerald-700">{stats.totalViews}</p>
                                </div>
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="min-w-0">
                                    <p className="text-xs sm:text-sm text-stone-500 truncate">
                                        {language === 'en' ? 'Pending Posts' : 'ያልተረጋገጡ ጽሑፎች'}
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-bold text-emerald-700">{stats.pendingPosts}</p>
                                </div>
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Stats */}
                    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-emerald-200 shadow-sm">
                        <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 mb-4">
                            {language === 'en' ? 'Posts by Category' : 'በምድብ የተከፋፈሉ ጽሑፎች'}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                            {Object.entries(stats.postsByCategory).map(([category, count]) => {
                                const categoryLabels: Record<string, string> = {
                                    news: language === 'en' ? 'News' : 'ዜና',
                                    history: language === 'en' ? 'History' : 'ታሪክ',
                                    entertainment: language === 'en' ? 'Entertainment' : 'መዝናኛ',
                                    health: language === 'en' ? 'Health' : 'ጤና',
                                    technology: language === 'en' ? 'Technology' : 'ቴክኖሎጂ',
                                    vacancy: language === 'en' ? 'Vacancy' : 'የስራ ክፍት ቦታ',
                                    gallery: language === 'en' ? 'Gallery' : 'ማህደር',
                                };

                                const categoryColors: Record<string, string> = {
                                    news: 'bg-emerald-50 border-emerald-200 text-emerald-700',
                                    history: 'bg-amber-50 border-amber-200 text-amber-700',
                                    entertainment: 'bg-rose-50 border-rose-200 text-rose-700',
                                    health: 'bg-emerald-50 border-emerald-200 text-emerald-700',
                                    technology: 'bg-indigo-50 border-indigo-200 text-indigo-700',
                                    vacancy: 'bg-cyan-50 border-cyan-200 text-cyan-700',
                                    gallery: 'bg-pink-50 border-pink-200 text-pink-700',
                                };

                                return (
                                    <div
                                        key={category}
                                        className={`p-3 sm:p-4 rounded-xl border ${categoryColors[category] || 'bg-stone-50 border-stone-200 text-stone-700'}`}
                                    >
                                        <p className="text-xs sm:text-sm capitalize truncate">{categoryLabels[category] || category}</p>
                                        <p className="text-xl sm:text-2xl font-bold">{count}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}