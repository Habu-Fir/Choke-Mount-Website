// src/components/admin/AdminArticles.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Plus,
    Edit2,
    Trash2,
    X,
    FileText,
    Calendar,
    User,
    AlertCircle,
    CheckCircle,
    RefreshCw,
    Search,
    Video,
    Menu,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Upload,
    Trash2 as TrashIcon,
    Eye,
    ArrowLeft,
    Home,
    LogOut,
    LayoutDashboard,
    Newspaper,
    Image,
    CalendarDays,
    MessageSquare,
    Settings,
    ChevronDown
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { articleService } from '../../services/api';
import { Article } from '../../types';
import { authService } from '../../services/api';

export default function AdminArticles() {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    // State declarations
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Track image errors
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    // Image upload states
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        localTitle: '',
        category: 'news' as 'news' | 'history' | 'interview' | 'video',
        content: '',
        localContent: '',
        author: '',
        localAuthor: '',
        imageUrl: '',
        videoUrl: '',
        duration: ''
    });

    // Sidebar navigation items
    const navItems = [
        {
            id: 'dashboard',
            label: language === 'en' ? 'Dashboard' : 'ዳሽቦርድ',
            icon: LayoutDashboard,
            path: '/admin'
        },
        {
            id: 'articles',
            label: language === 'en' ? 'Articles' : 'ጽሑፎች',
            icon: Newspaper,
            path: '/admin/articles',
            active: true
        },
        {
            id: 'gallery',
            label: language === 'en' ? 'Gallery' : 'ማህደር',
            icon: Image,
            path: '/admin/gallery'
        },
        {
            id: 'events',
            label: language === 'en' ? 'Events' : 'ዝግጅቶች',
            icon: CalendarDays,
            path: '/admin/events'
        },
        {
            id: 'messages',
            label: language === 'en' ? 'Messages' : 'መልዕክቶች',
            icon: MessageSquare,
            path: '/admin/messages'
        },
        {
            id: 'settings',
            label: language === 'en' ? 'Settings' : 'ቅንብሮች',
            icon: Settings,
            path: '/admin/settings'
        },
    ];

    const categories = [
        { value: 'news', label: language === 'en' ? '📢 News' : 'ዜና', color: 'bg-blue-100 text-blue-800 border-blue-200' },
        { value: 'history', label: language === 'en' ? '📜 History' : 'ታሪክ', color: 'bg-amber-100 text-amber-800 border-amber-200' },
        { value: 'interview', label: language === 'en' ? '💬 Interview' : 'ቃለ-መጠይቅ', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
        { value: 'video', label: language === 'en' ? '🎬 Video' : 'ቪዲዮ', color: 'bg-purple-100 text-purple-800 border-purple-200' }
    ];

    const getArticleId = (article: any): string | null => {
        if (article._id) return article._id;
        if (article.id) return article.id;
        return null;
    };

    const handleImageError = (articleId: string) => {
        setImageErrors(prev => ({ ...prev, [articleId]: true }));
    };

    // Navigation functions
    const handleLogout = () => {
        authService.logout();
        navigate('/admin/login');
    };

    const goBack = () => {
        navigate(-1);
    };

    const goHome = () => {
        navigate('/');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Fetch articles
    useEffect(() => {
        fetchArticles();
    }, [categoryFilter, searchTerm, currentPage]);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            setError(null);

            const params: any = {
                page: currentPage,
                limit: 10
            };

            if (categoryFilter !== 'all') params.category = categoryFilter;
            if (searchTerm) params.search = searchTerm;

            const response = await articleService.getAll(params);

            if (response.success && response.data) {
                const articlesWithId = response.data.map((article: any) => ({
                    ...article,
                    _id: article._id || article.id
                }));
                setArticles(articlesWithId);
                setTotalPages(response.pages || 1);
            } else {
                setError(response.message || 'Failed to load articles');
            }
        } catch (err: any) {
            console.error('Fetch error:', err);
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            localTitle: '',
            category: 'news',
            content: '',
            localContent: '',
            author: '',
            localAuthor: '',
            imageUrl: '',
            videoUrl: '',
            duration: ''
        });
        setImageFile(null);
        setImagePreview(null);
        setEditingArticle(null);
        setShowForm(false);
        setError(null);
        setSubmitting(false);
        setIsImageUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff'];
            if (!validTypes.includes(file.type)) {
                setError(language === 'en'
                    ? 'Please select a valid image file (JPEG, PNG, GIF, WEBP, SVG, BMP, TIFF)'
                    : 'እባክዎት ትክክለኛ የምስል ፋይል ይምረጡ (JPEG, PNG, GIF, WEBP, SVG, BMP, TIFF)'
                );
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError(language === 'en'
                    ? 'Image size must be less than 5MB'
                    : 'የምስሉ መጠን ከ5MB ያነሰ መሆን አለበት'
                );
                return;
            }

            setImageFile(file);
            setIsImageUploading(true);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setIsImageUploading(false);
            };
            reader.onerror = () => {
                setError('Failed to read image file');
                setIsImageUploading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleEdit = (article: Article) => {
        const articleId = getArticleId(article);
        if (!articleId) {
            setError('Cannot edit article: Missing ID. Please refresh the page.');
            return;
        }

        setEditingArticle({ ...article, _id: articleId });
        setFormData({
            title: article.title || '',
            localTitle: article.localTitle || '',
            category: article.category || 'news',
            content: article.content || '',
            localContent: article.localContent || '',
            author: article.author || '',
            localAuthor: article.localAuthor || '',
            imageUrl: article.imageUrl || '',
            videoUrl: article.videoUrl || '',
            duration: article.duration || ''
        });

        if (article.imageUrl) {
            setImagePreview(article.imageUrl);
        } else {
            setImagePreview(null);
            setImageFile(null);
        }

        setShowForm(true);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        if (!formData.title || !formData.content || !formData.author) {
            setError(language === 'en'
                ? 'Please fill in all required fields (Title, Content, Author)'
                : 'እባክዎት ሁሉንም አስፈላጊ መስኮች ይሙሉ (ርዕስ፣ ይዘት፣ ደራሲ)'
            );
            setSubmitting(false);
            return;
        }

        try {
            if (editingArticle) {
                const articleId = getArticleId(editingArticle);
                if (!articleId) {
                    setError('Article ID is missing. Please refresh and try again.');
                    setSubmitting(false);
                    return;
                }

                const response = await articleService.updateWithImage(articleId, formData, imageFile || undefined);

                if (response.success) {
                    setSuccessMsg(language === 'en' ? 'Article updated successfully!' : 'ጽሑፉ በተሳካ ሁኔታ ተሻሽሏል!');
                    setTimeout(() => setSuccessMsg(null), 3000);
                    resetForm();
                    fetchArticles();
                } else {
                    setError(response.message || 'Update failed');
                }
            } else {
                const response = await articleService.createWithImage(formData, imageFile || undefined);

                if (response.success) {
                    setSuccessMsg(language === 'en' ? 'Article published successfully!' : 'ጽሑፉ በተሳካ ሁኔታ ታትሟል!');
                    setTimeout(() => setSuccessMsg(null), 3000);
                    resetForm();
                    fetchArticles();
                } else {
                    setError(response.message || 'Creation failed');
                }
            }
        } catch (err: any) {
            console.error('Submit error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to save article');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!id) {
            setError('Cannot delete: Missing article ID');
            return;
        }

        if (!confirm(language === 'en' ? 'Delete this article?' : 'ይህን ጽሑፍ መሰረዝ ይፈልጋሉ?')) return;

        try {
            const response = await articleService.delete(id);

            if (response.success) {
                setSuccessMsg(language === 'en' ? 'Article deleted!' : 'ጽሑፉ ተሰርዟል!');
                setTimeout(() => setSuccessMsg(null), 3000);
                fetchArticles();
            } else {
                setError(response.message || 'Delete failed');
            }
        } catch (err: any) {
            console.error('Delete error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to delete article');
        }
    };

    const viewArticleDetails = (article: Article) => {
        setSelectedArticle(article);
        setShowDetailModal(true);
    };

    if (loading && articles.length === 0) {
        return (
            <div className="lg:ml-64 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 animate-spin" />
                <p className="mt-4 text-stone-500 text-sm sm:text-base">
                    {language === 'en' ? 'Loading articles...' : 'ጽሑፎችን በመጫን ላይ...'}
                </p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-stone-50">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-stone-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between p-4 border-b border-stone-200">
                        <div className="flex items-baseline gap-0.5">
                            <span className="font-serif font-extrabold text-xl tracking-tight leading-none text-emerald-800">
                                ጮቄ
                            </span>
                            <span className="font-serif font-extrabold text-xl tracking-tight leading-none text-lime-500 ml-1.5">
                                ተራራ
                            </span>
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 hover:bg-stone-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-stone-600" />
                        </button>
                    </div>

                    {/* Admin User Info */}
                    <div className="flex items-center gap-3 p-4 border-b border-stone-200">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-stone-900 truncate">Admin</p>
                            <p className="text-xs text-stone-500 truncate">administrator@chokemountain.com</p>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.id}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive
                                            ? 'bg-amber-50 text-amber-700'
                                            : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-amber-600' : 'text-stone-400'}`} />
                                    <span className="text-sm font-medium">{item.label}</span>
                                    {isActive && (
                                        <span className="ml-auto w-1.5 h-8 bg-amber-500 rounded-full"></span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-stone-200">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm font-medium">
                                {language === 'en' ? 'Logout' : 'ውጣ'}
                            </span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 lg:ml-64">
                {/* Top Navigation Bar */}
                <div className="sticky top-0 z-30 bg-white border-b border-stone-200">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden p-2 hover:bg-stone-100 rounded-lg transition-all"
                            >
                                <Menu className="w-5 h-5 text-stone-600" />
                            </button>
                            <button
                                onClick={goBack}
                                className="p-2 hover:bg-stone-100 rounded-lg transition-all flex items-center gap-2 text-stone-600"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-sm hidden sm:inline">
                                    {language === 'en' ? 'Back' : 'ተመለስ'}
                                </span>
                            </button>
                            <button
                                onClick={goHome}
                                className="p-2 hover:bg-stone-100 rounded-lg transition-all flex items-center gap-2 text-stone-600"
                            >
                                <Home className="w-4 h-4" />
                                <span className="text-sm hidden sm:inline">
                                    {language === 'en' ? 'Home' : 'መነሻ'}
                                </span>
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all text-sm"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                    {language === 'en' ? 'Logout' : 'ውጣ'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-4 sm:p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                                {language === 'en' ? 'Manage Articles' : 'ጽሑፎችን ያስተዳድሩ'}
                            </h1>
                            <p className="text-sm text-stone-500">
                                {language === 'en' ? 'Create, edit and delete articles' : 'ጽሑፎችን ይፍጠሩ፣ ያስተካክሉ እና ይሰርዙ'}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl transition-all font-medium text-sm sm:text-base w-full sm:w-auto"
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            {language === 'en' ? 'New Article' : 'አዲስ ጽሑፍ'}
                        </button>
                    </div>

                    {/* Success/Error Messages */}
                    {successMsg && (
                        <div className="mb-4 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-start sm:items-center gap-2 text-sm">
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
                            <span className="break-words">{successMsg}</span>
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start sm:items-center gap-2 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
                            <span className="break-words">{error}</span>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                placeholder={language === 'en' ? 'Search articles...' : 'ጽሑፎችን ይፈልጉ...'}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2 sm:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="px-4 py-2.5 bg-stone-100 rounded-xl text-sm flex items-center gap-2 w-full justify-between"
                            >
                                <span>
                                    {categoryFilter === 'all'
                                        ? (language === 'en' ? 'All Categories' : 'ሁሉም ምድቦች')
                                        : categories.find(c => c.value === categoryFilter)?.label}
                                </span>
                                <Menu className="w-4 h-4" />
                            </button>

                            {isMobileMenuOpen && (
                                <div className="w-full bg-white rounded-xl border border-stone-200 p-2 shadow-lg z-10">
                                    <button
                                        onClick={() => {
                                            setCategoryFilter('all');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${categoryFilter === 'all' ? 'bg-amber-50 text-amber-700' : 'hover:bg-stone-50'
                                            }`}
                                    >
                                        {language === 'en' ? 'All Categories' : 'ሁሉም ምድቦች'}
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.value}
                                            onClick={() => {
                                                setCategoryFilter(cat.value);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${categoryFilter === cat.value ? 'bg-amber-50 text-amber-700' : 'hover:bg-stone-50'
                                                }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="hidden sm:flex sm:flex-wrap gap-2">
                            <button
                                onClick={() => setCategoryFilter('all')}
                                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${categoryFilter === 'all'
                                    ? 'bg-amber-500 text-stone-950'
                                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                                    }`}
                            >
                                {language === 'en' ? 'All' : 'ሁሉም'}
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setCategoryFilter(cat.value)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${categoryFilter === cat.value
                                        ? 'bg-amber-500 text-stone-950'
                                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={fetchArticles}
                            disabled={loading}
                            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">{language === 'en' ? 'Refresh' : 'አድስ'}</span>
                        </button>
                    </div>

                    {/* Articles Grid */}
                    {articles.length === 0 ? (
                        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 text-center">
                            <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-stone-300 mx-auto mb-3" />
                            <p className="text-stone-500 text-sm sm:text-base">
                                {searchTerm || categoryFilter !== 'all'
                                    ? (language === 'en' ? 'No articles match your filters' : 'ከምርጫዎ ጋር የሚዛመድ ምንም ጽሑፍ የለም')
                                    : (language === 'en' ? 'No articles created yet' : 'እስካሁን ምንም ጽሑፎች አልተፈጠሩም')}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                            {articles.map((article) => {
                                const articleId = getArticleId(article);
                                const hasImageError = articleId ? imageErrors[articleId] : false;
                                const categoryColor = categories.find(c => c.value === article.category)?.color || 'bg-stone-100 text-stone-800';

                                return (
                                    <div
                                        key={articleId || Math.random().toString()}
                                        className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md transition-all flex flex-col"
                                    >
                                        {/* Image Thumbnail */}
                                        <div className="aspect-video bg-stone-100 relative">
                                            {article.imageUrl && !hasImageError ? (
                                                <img
                                                    src={article.imageUrl}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover"
                                                    onError={() => articleId && handleImageError(articleId)}
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-stone-200">
                                                    {article.category === 'video' ? (
                                                        <Video className="w-12 h-12 text-stone-400" />
                                                    ) : (
                                                        <FileText className="w-12 h-12 text-stone-400" />
                                                    )}
                                                </div>
                                            )}
                                            <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-mono border ${categoryColor}`}>
                                                {categories.find(c => c.value === article.category)?.label || article.category}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 text-xs text-stone-400 mb-2 flex-wrap">
                                                <Calendar className="w-3 h-3 flex-shrink-0" />
                                                {article.date || new Date(article.createdAt).toLocaleDateString()}
                                                <span className="mx-1">•</span>
                                                <User className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">
                                                    {language === 'en' ? article.author : article.localAuthor || article.author}
                                                </span>
                                            </div>
                                            <h3 className="font-serif font-bold text-stone-900 line-clamp-2 text-base sm:text-lg mb-2">
                                                {language === 'en' ? article.title : article.localTitle || article.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-stone-500 line-clamp-3 flex-1">
                                                {language === 'en' ? article.content : article.localContent || article.content}
                                            </p>

                                            {/* Actions */}
                                            <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-stone-100">
                                                <button
                                                    onClick={() => viewArticleDetails(article)}
                                                    className="p-2 hover:bg-amber-50 rounded-lg transition-all"
                                                    title={language === 'en' ? 'View Details' : 'ዝርዝር ይመልከቱ'}
                                                >
                                                    <Eye className="w-4 h-4 text-amber-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(article)}
                                                    disabled={!articleId}
                                                    className="p-2 hover:bg-stone-100 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title={!articleId ? 'Missing ID' : 'Edit'}
                                                >
                                                    <Edit2 className="w-4 h-4 text-stone-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(articleId || '')}
                                                    disabled={!articleId}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title={!articleId ? 'Missing ID' : 'Delete'}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between flex-wrap gap-4 mt-6 pt-4 border-t border-stone-200">
                            <div className="text-sm text-stone-500">
                                {language === 'en' ? 'Page' : 'ገጽ'} {currentPage} {language === 'en' ? 'of' : 'ከ'} {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Article Detail Modal */}
                    <AnimatePresence>
                        {showDetailModal && selectedArticle && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                                onClick={() => setShowDetailModal(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.95, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.95, y: 20 }}
                                    className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b border-stone-100">
                                        <h2 className="text-xl font-serif font-bold text-stone-900">
                                            {language === 'en' ? 'Article Details' : 'የጽሑፍ ዝርዝር'}
                                        </h2>
                                        <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-stone-100 rounded-lg transition-all">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Image */}
                                        {selectedArticle.imageUrl && (
                                            <div className="rounded-xl overflow-hidden bg-stone-100 max-h-64">
                                                <img src={selectedArticle.imageUrl} alt={selectedArticle.title} className="w-full h-full object-cover" />
                                            </div>
                                        )}

                                        {/* Title */}
                                        <div>
                                            <label className="text-xs font-mono text-stone-500 uppercase">Title</label>
                                            <p className="font-serif font-bold text-2xl">{selectedArticle.title}</p>
                                            {selectedArticle.localTitle && (
                                                <p className="text-sm text-stone-500">{selectedArticle.localTitle}</p>
                                            )}
                                        </div>

                                        {/* Metadata */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-mono text-stone-500 uppercase">Category</label>
                                                <p className="font-semibold">{selectedArticle.category}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-mono text-stone-500 uppercase">Date</label>
                                                <p className="font-semibold">{selectedArticle.date || new Date(selectedArticle.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-mono text-stone-500 uppercase">Author</label>
                                                <p className="font-semibold">{selectedArticle.author}</p>
                                                {selectedArticle.localAuthor && (
                                                    <p className="text-sm text-stone-500">{selectedArticle.localAuthor}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="text-xs font-mono text-stone-500 uppercase">Status</label>
                                                <p className="font-semibold text-emerald-600">Published</p>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <label className="text-xs font-mono text-stone-500 uppercase">Content</label>
                                            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 max-h-48 overflow-y-auto">
                                                <p className="text-sm text-stone-700 whitespace-pre-wrap">{selectedArticle.content}</p>
                                            </div>
                                            {selectedArticle.localContent && (
                                                <div className="mt-2 bg-amber-50 p-4 rounded-xl border border-amber-200 max-h-48 overflow-y-auto">
                                                    <p className="text-sm text-stone-700 whitespace-pre-wrap">{selectedArticle.localContent}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Video URL if video */}
                                        {selectedArticle.category === 'video' && selectedArticle.videoUrl && (
                                            <div>
                                                <label className="text-xs font-mono text-stone-500 uppercase">Video URL</label>
                                                <p className="text-sm text-blue-600 break-all">{selectedArticle.videoUrl}</p>
                                                {selectedArticle.duration && (
                                                    <p className="text-sm text-stone-500">Duration: {selectedArticle.duration}</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-3 pt-4 border-t border-stone-200">
                                            <button
                                                onClick={() => {
                                                    setShowDetailModal(false);
                                                    handleEdit(selectedArticle);
                                                }}
                                                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                {language === 'en' ? 'Edit Article' : 'ጽሑፍ ያስተካክሉ'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const id = getArticleId(selectedArticle);
                                                    if (id) {
                                                        setShowDetailModal(false);
                                                        handleDelete(id);
                                                    }
                                                }}
                                                className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                {language === 'en' ? 'Delete' : 'ሰርዝ'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Create/Edit Modal */}
                    <AnimatePresence>
                        {showForm && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                                onClick={(e) => {
                                    if (e.target === e.currentTarget && !submitting) {
                                        resetForm();
                                    }
                                }}
                            >
                                <motion.div
                                    initial={{ scale: 0.95, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.95, y: 20 }}
                                    className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b border-stone-100">
                                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                                            {editingArticle
                                                ? (language === 'en' ? 'Edit Article' : 'ጽሑፍ ያስተካክሉ')
                                                : (language === 'en' ? 'Create Article' : 'አዲስ ጽሑፍ ይፍጠሩ')}
                                        </h2>
                                        <button
                                            onClick={resetForm}
                                            disabled={submitting}
                                            className="p-2 hover:bg-stone-100 rounded-lg transition-all disabled:opacity-50"
                                        >
                                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                                    {language === 'en' ? 'Title (English)' : 'ርዕስ (እንግሊዝኛ)'} *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                                    placeholder="e.g. New Trails Mapped on Mount Choke"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                                    {language === 'en' ? 'Title (Amharic)' : 'ርዕስ (አማርኛ)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.localTitle}
                                                    onChange={(e) => setFormData({ ...formData, localTitle: e.target.value })}
                                                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                                    placeholder="ለምሳሌ፡ በጮቄ ተራራ አዲስ መንገዶች ተከፈቱ"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                                {language === 'en' ? 'Category' : 'ምድብ'} *
                                            </label>
                                            <select
                                                required
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                                className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                            >
                                                {categories.map((cat) => (
                                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                                {language === 'en' ? 'Content (English)' : 'ይዘት (እንግሊዝኛ)'} *
                                            </label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={formData.content}
                                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-none"
                                                placeholder="Write the full story or historical analysis in English..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                                {language === 'en' ? 'Content (Amharic)' : 'ይዘት (አማርኛ)'}
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={formData.localContent}
                                                onChange={(e) => setFormData({ ...formData, localContent: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-none"
                                                placeholder="ይዘቱን በአማርኛ እዚህ ይጻፉ..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                                    {language === 'en' ? 'Author (English)' : 'ደራሲ (እንግሊዝኛ)'} *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.author}
                                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                                    placeholder="e.g. Abebe Kebede"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                                    {language === 'en' ? 'Author (Amharic)' : 'ደራሲ (አማርኛ)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.localAuthor}
                                                    onChange={(e) => setFormData({ ...formData, localAuthor: e.target.value })}
                                                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                                    placeholder="ለምሳሌ፡ አበበ ከበደ"
                                                />
                                            </div>
                                        </div>

                                        {/* Image Upload Section */}
                                        <div className="border-2 border-dashed border-stone-300 rounded-xl p-4 sm:p-6">
                                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                                {language === 'en' ? 'Upload Image' : 'ምስል ይጫኑ'}
                                            </label>

                                            {imagePreview ? (
                                                <div className="relative mb-4">
                                                    <div className="relative rounded-xl overflow-hidden bg-stone-100 aspect-video max-h-48">
                                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    className="border-2 border-dashed border-stone-300 rounded-xl p-6 text-center hover:border-amber-500 transition-all cursor-pointer"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                                                    <p className="text-sm text-stone-500">
                                                        {language === 'en'
                                                            ? 'Click or drag to upload an image'
                                                            : 'ምስል ለመጫን ጠቅ ያድርጉ ወይም ይጎትቱ'}
                                                    </p>
                                                    <p className="text-xs text-stone-400 mt-1">
                                                        {language === 'en'
                                                            ? 'JPEG, PNG, GIF, WEBP (Max 5MB)'
                                                            : 'JPEG, PNG, GIF, WEBP (ከፍተኛው 5MB)'}
                                                    </p>
                                                </div>
                                            )}

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                disabled={submitting}
                                            />

                                            {isImageUploading && (
                                                <div className="flex items-center justify-center gap-2 mt-2">
                                                    <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                                                    <span className="text-sm text-stone-500">
                                                        {language === 'en' ? 'Uploading...' : 'በመጫን ላይ...'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {formData.category === 'video' && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                                                <div>
                                                    <label className="block text-sm font-medium text-stone-700 mb-1">
                                                        {language === 'en' ? 'Video URL' : 'የቪዲዮ አድራሻ'}
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={formData.videoUrl}
                                                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                                        className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                                        placeholder="https://www.youtube.com/embed/..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-stone-700 mb-1">
                                                        {language === 'en' ? 'Duration' : 'ርዝመት'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.duration}
                                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                                        className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                                        placeholder="e.g. 5:30"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-100">
                                            <button
                                                type="submit"
                                                disabled={submitting || isImageUploading}
                                                className="flex-1 py-3 sm:py-3.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-medium rounded-xl transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {(submitting || isImageUploading) && <Loader2 className="w-4 h-4 animate-spin" />}
                                                {editingArticle
                                                    ? (language === 'en' ? 'Update Article' : 'ጽሑፉን ያሻሽሉ')
                                                    : (language === 'en' ? 'Publish Article' : 'ጽሑፉን ያትሙ')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                disabled={submitting}
                                                className="py-3 sm:py-3.5 px-6 bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium rounded-xl transition-all text-sm sm:text-base disabled:opacity-50"
                                            >
                                                {language === 'en' ? 'Cancel' : 'ይቅር'}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}