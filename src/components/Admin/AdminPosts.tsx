// src/components/Admin/AdminPosts.tsx - With Back Button (No Hamburger)
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
    Image as ImageIcon,
    Video,
    Loader2,
    Upload,
    Trash2 as TrashIcon,
    Eye,
    EyeOff,
    Clock,
    Filter,
    ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { postService } from '../../services/api';
import { PostCategory, CATEGORY_LABELS } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminPosts() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { user } = useAuth();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState<any>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helper function to get image URL with proper base URL
    const getImageUrl = (url: string | undefined): string => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return `${baseUrl}${cleanUrl}`;
    };

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        localTitle: '',
        category: 'news' as PostCategory,
        content: '',
        localContent: '',
        author: '',
        localAuthor: '',
        authorPhoto: '',
        imageUrl: '',
        videoUrl: '',
        duration: '',
        tags: [] as string[],
        isPublished: false,
        scheduledPublish: '',
    });

    // Get allowed categories based on user role
    const getAllowedCategories = (): PostCategory[] => {
        const userRole = user?.role;
        if (!userRole) return [];

        if (userRole === 'super_admin') {
            return ['news', 'history', 'entertainment', 'health', 'technology', 'vacancy', 'gallery'];
        }

        const roleCategoryMap: Record<string, PostCategory> = {
            news_admin: 'news',
            history_admin: 'history',
            entertainment_admin: 'entertainment',
            health_admin: 'health',
            technology_admin: 'technology',
            vacancy_admin: 'vacancy',
            gallery_admin: 'gallery',
        };

        const category = roleCategoryMap[userRole];
        return category ? [category] : [];
    };

    const allowedCategories = getAllowedCategories();

    useEffect(() => {
        fetchPosts();
    }, [categoryFilter, statusFilter, searchTerm, currentPage]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const params: any = { page: currentPage, limit: 10 };
            if (categoryFilter !== 'all') params.category = categoryFilter;
            if (statusFilter === 'published') params.isPublished = true;
            if (statusFilter === 'draft') params.isPublished = false;
            if (searchTerm) params.search = searchTerm;

            const response = await postService.getAll(params);
            if (response.success) {
                setPosts(response.data || []);
                setTotalPages(response.pages || 1);
                setImageErrors({});
            } else {
                setError(response.message || 'Failed to load posts');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            localTitle: '',
            category: allowedCategories[0] || 'news',
            content: '',
            localContent: '',
            author: user?.name || '',
            localAuthor: '',
            authorPhoto: '',
            imageUrl: '',
            videoUrl: '',
            duration: '',
            tags: [],
            isPublished: false,
            scheduledPublish: '',
        });
        setImageFile(null);
        setImagePreview(null);
        setEditingPost(null);
        setShowForm(false);
        setError(null);
        setSubmitting(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setError(language === 'en'
                    ? 'Please select a valid image file (JPEG, PNG, GIF, WEBP)'
                    : 'እባክዎት ትክክለኛ የምስል ፋይል ይምረጡ (JPEG, PNG, GIF, WEBP)'
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
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleImageError = (postId: string) => {
        setImageErrors(prev => ({ ...prev, [postId]: true }));
    };

    const handleEdit = (post: any) => {
        setEditingPost(post);
        setFormData({
            title: post.title || '',
            localTitle: post.localTitle || '',
            category: post.category || 'news',
            content: post.content || '',
            localContent: post.localContent || '',
            author: post.author || '',
            localAuthor: post.localAuthor || '',
            authorPhoto: post.authorPhoto || '',
            imageUrl: post.imageUrl || '',
            videoUrl: post.videoUrl || '',
            duration: post.duration || '',
            tags: post.tags || [],
            isPublished: post.isPublished || false,
            scheduledPublish: post.scheduledPublish ? new Date(post.scheduledPublish).toISOString().slice(0, 16) : '',
        });
        if (post.imageUrl) {
            setImagePreview(getImageUrl(post.imageUrl));
        }
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        if (!formData.title || !formData.content || !formData.author) {
            setError(language === 'en'
                ? 'Please fill in all required fields'
                : 'እባክዎት ሁሉንም አስፈላጊ መስኮች ይሙሉ'
            );
            setSubmitting(false);
            return;
        }

        try {
            const submitData = {
                ...formData,
                scheduledPublish: formData.scheduledPublish || undefined,
            };

            let response;
            if (editingPost) {
                response = await postService.updateWithImage(editingPost._id, submitData, imageFile || undefined);
            } else {
                response = await postService.createWithImage(submitData, imageFile || undefined);
            }

            if (response.success) {
                setSuccessMsg(editingPost
                    ? (language === 'en' ? 'Post updated successfully!' : 'ጽሑፉ በተሳካ ሁኔታ ተሻሽሏል!')
                    : (language === 'en' ? 'Post created successfully!' : 'ጽሑፉ በተሳካ ሁኔታ ተፈጥሯል!')
                );
                setTimeout(() => setSuccessMsg(null), 3000);
                resetForm();
                fetchPosts();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save post');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(language === 'en' ? 'Delete this post?' : 'ይህን ጽሑፍ መሰረዝ ይፈልጋሉ?')) return;

        try {
            const response = await postService.delete(id);
            if (response.success) {
                setSuccessMsg(language === 'en' ? 'Post deleted!' : 'ጽሑፉ ተሰርዟል!');
                setTimeout(() => setSuccessMsg(null), 3000);
                fetchPosts();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete post');
        }
    };

    const togglePublish = async (id: string) => {
        try {
            const response = await postService.togglePublish(id);
            if (response.success) {
                setSuccessMsg(language === 'en' ? 'Post status updated!' : 'የጽሑፉ ሁኔታ ተሻሽሏል!');
                setTimeout(() => setSuccessMsg(null), 3000);
                fetchPosts();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update post status');
        }
    };

    const getCategoryLabel = (category: string) => {
        return CATEGORY_LABELS[category as PostCategory] || category;
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            news: 'bg-blue-100 text-blue-800 border-blue-200',
            history: 'bg-amber-100 text-amber-800 border-amber-200',
            entertainment: 'bg-rose-100 text-rose-800 border-rose-200',
            health: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            technology: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            vacancy: 'bg-cyan-100 text-cyan-800 border-cyan-200',
            gallery: 'bg-pink-100 text-pink-800 border-pink-200',
        };
        return colors[category] || colors.news;
    };

    const goBack = () => {
        navigate('/admin');
    };

    if (loading && posts.length === 0) {
        return (
            <div className="min-h-screen lg:ml-64 flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Main Content */}
            <div className="lg:ml-64">
                <div className="p-4 sm:p-6 lg:p-8">
                    {/* Header with Back Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3 min-w-0">
                            <button
                                onClick={goBack}
                                className="p-2 hover:bg-stone-100 rounded-xl transition-all flex-shrink-0 group"
                                title={language === 'en' ? 'Back to Dashboard' : 'ወደ መረጃ ጠቋሚ ተመለስ'}
                            >
                                <ArrowLeft className="w-5 h-5 text-stone-600 group-hover:text-amber-600 transition-colors" />
                            </button>
                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 truncate">
                                    {language === 'en' ? 'Manage Posts' : 'ጽሑፎችን ያስተዳድሩ'}
                                </h1>
                                <p className="text-sm text-stone-500 truncate">
                                    {language === 'en'
                                        ? 'Create, edit and manage all content posts'
                                        : 'ሁሉንም የይዘት ጽሑፎች ይፍጠሩ፣ ያስተካክሉ እና ያስተዳድሩ'}
                                </p>
                            </div>
                        </div>
                        {allowedCategories.length > 0 && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl transition-all font-medium flex-shrink-0 w-full sm:w-auto"
                            >
                                <Plus className="w-4 h-4" />
                                {language === 'en' ? 'New Post' : 'አዲስ ጽሑፍ'}
                            </button>
                        )}
                    </div>

                    {/* Success/Error Messages */}
                    {successMsg && (
                        <div className="mb-4 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm sm:text-base">{successMsg}</span>
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm sm:text-base">{error}</span>
                        </div>
                    )}

                    {/* Filters - Responsive */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                placeholder={language === 'en' ? 'Search posts...' : 'ጽሑፎችን ይፈልጉ...'}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                        >
                            <option value="all">{language === 'en' ? 'All Categories' : 'ሁሉም ምድቦች'}</option>
                            {allowedCategories.map((cat) => (
                                <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                        >
                            <option value="all">{language === 'en' ? 'All Status' : 'ሁሉም ሁኔታ'}</option>
                            <option value="published">{language === 'en' ? 'Published' : 'የታተመ'}</option>
                            <option value="draft">{language === 'en' ? 'Draft' : 'ረቂቅ'}</option>
                        </select>

                        <button
                            onClick={fetchPosts}
                            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span className="hidden sm:inline">{language === 'en' ? 'Refresh' : 'አድስ'}</span>
                        </button>
                    </div>

                    {/* Posts Grid - Responsive */}
                    {posts.length === 0 ? (
                        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 text-center">
                            <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                            <p className="text-stone-500 text-sm sm:text-base">
                                {language === 'en' ? 'No posts found' : 'ምንም ጽሑፎች አልተገኙም'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                            {posts.map((post) => {
                                const hasImageError = imageErrors[post._id];
                                const imageUrl = getImageUrl(post.imageUrl);

                                return (
                                    <div key={post._id} className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-md transition-all flex flex-col">
                                        {/* Image */}
                                        <div className="aspect-video bg-stone-100 relative">
                                            {post.imageUrl && !hasImageError ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                    onError={() => handleImageError(post._id)}
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-stone-200">
                                                    <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-stone-400" />
                                                </div>
                                            )}
                                            <span className={`absolute top-2 left-2 px-1.5 sm:px-2 py-0.5 rounded-md text-[8px] sm:text-[10px] font-mono border ${getCategoryColor(post.category)}`}>
                                                {getCategoryLabel(post.category)}
                                            </span>
                                            <span className={`absolute top-2 right-2 px-1.5 sm:px-2 py-0.5 rounded-md text-[8px] sm:text-[10px] font-mono border ${post.isPublished
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                {post.isPublished
                                                    ? (language === 'en' ? 'Published' : 'የታተመ')
                                                    : (language === 'en' ? 'Draft' : 'ረቂቅ')}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="p-3 sm:p-4 flex flex-col flex-1">
                                            <h3 className="font-serif font-bold text-stone-900 line-clamp-2 text-sm sm:text-base">
                                                {post.title}
                                            </h3>
                                            <p className="text-xs text-stone-500 line-clamp-2 mt-1 flex-1">
                                                {post.content}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2 text-xs text-stone-400">
                                                <User className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{post.author}</span>
                                                <span className="mx-1">•</span>
                                                <Calendar className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{new Date(post.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => togglePublish(post._id)}
                                                        className="p-1.5 hover:bg-stone-100 rounded-lg transition-all"
                                                        title={post.isPublished ? 'Unpublish' : 'Publish'}
                                                    >
                                                        {post.isPublished ? (
                                                            <EyeOff className="w-4 h-4 text-stone-400" />
                                                        ) : (
                                                            <Eye className="w-4 h-4 text-stone-400" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(post)}
                                                        className="p-1.5 hover:bg-stone-100 rounded-lg transition-all"
                                                    >
                                                        <Edit2 className="w-4 h-4 text-stone-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(post._id)}
                                                        className="p-1.5 hover:bg-red-50 rounded-lg transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </button>
                                                </div>
                                                {post.views > 0 && (
                                                    <span className="text-xs text-stone-400">{post.views} views</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination - Responsive */}
                    {totalPages > 1 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 sm:px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all disabled:opacity-50 text-sm"
                            >
                                {language === 'en' ? 'Previous' : 'ቀዳሚ'}
                            </button>
                            <span className="text-sm text-stone-600">
                                {language === 'en' ? 'Page' : 'ገጽ'} {currentPage} {language === 'en' ? 'of' : 'ከ'} {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 sm:px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all disabled:opacity-50 text-sm"
                            >
                                {language === 'en' ? 'Next' : 'ቀጣይ'}
                            </button>
                        </div>
                    )}

                    {/* Create/Edit Modal - Responsive */}
                    <AnimatePresence>
                        {showForm && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                                onClick={() => resetForm()}
                            >
                                <motion.div
                                    initial={{ scale: 0.95, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.95, y: 20 }}
                                    className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                                            {editingPost
                                                ? (language === 'en' ? 'Edit Post' : 'ጽሑፍ ያስተካክሉ')
                                                : (language === 'en' ? 'Create Post' : 'አዲስ ጽሑፍ ይፍጠሩ')}
                                        </h2>
                                        <button onClick={resetForm} className="p-2 hover:bg-stone-100 rounded-lg transition-all">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Title */}
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
                                                    className="w-full px-4 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                                                    className="w-full px-4 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Category */}
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                                {language === 'en' ? 'Category' : 'ምድብ'} *
                                            </label>
                                            <select
                                                required
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value as PostCategory })}
                                                className="w-full px-4 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            >
                                                {allowedCategories.map((cat) => (
                                                    <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                                {language === 'en' ? 'Content (English)' : 'ይዘት (እንግሊዝኛ)'} *
                                            </label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={formData.content}
                                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                className="w-full px-4 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
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
                                                className="w-full px-4 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                                            />
                                        </div>

                                        {/* Author */}
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
                                                    className="w-full px-4 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                                                    className="w-full px-4 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Image Upload */}
                                        <div className="border-2 border-dashed border-stone-300 rounded-xl p-4">
                                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                                {language === 'en' ? 'Upload Image' : 'ምስል ይጫኑ'}
                                            </label>
                                            {imagePreview ? (
                                                <div className="relative">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-32 object-cover rounded-xl"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    className="border-2 border-dashed border-stone-300 rounded-xl p-4 sm:p-6 text-center cursor-pointer hover:border-amber-500 transition-all"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-stone-400 mx-auto mb-2" />
                                                    <p className="text-xs sm:text-sm text-stone-500">
                                                        {language === 'en' ? 'Click to upload an image' : 'ምስል ለመጫን ጠቅ ያድርጉ'}
                                                    </p>
                                                    <p className="text-[10px] sm:text-xs text-stone-400">JPEG, PNG, GIF, WEBP (Max 5MB)</p>
                                                </div>
                                            )}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </div>

                                        {/* Video URL */}
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                                {language === 'en' ? 'Video URL' : 'የቪዲዮ አድራሻ'}
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.videoUrl}
                                                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                                className="w-full px-4 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                placeholder="https://www.youtube.com/embed/..."
                                            />
                                        </div>

                                        {/* Publish Settings */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="isPublished"
                                                    checked={formData.isPublished}
                                                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                                    className="w-4 h-4 text-amber-500 rounded"
                                                />
                                                <label htmlFor="isPublished" className="text-sm text-stone-700">
                                                    {language === 'en' ? 'Publish immediately' : 'ወዲያውኑ አትም'}
                                                </label>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                                    {language === 'en' ? 'Schedule Publish' : 'ለማተም ቀጠሮ ያስይዙ'}
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    value={formData.scheduledPublish}
                                                    onChange={(e) => setFormData({ ...formData, scheduledPublish: e.target.value })}
                                                    className="w-full px-4 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                                {language === 'en' ? 'Tags (comma separated)' : 'መለያዎች (በነጠላ ሰረዝ የሚለያዩ)'}
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.tags.join(', ')}
                                                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                                                className="w-full px-4 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                placeholder={language === 'en' ? 'e.g. tourism, culture, mountain' : 'ለምሳሌ፡ ቱሪዝም፣ ባህል፣ ተራራ'}
                                            />
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-medium rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                                {editingPost
                                                    ? (language === 'en' ? 'Update Post' : 'ጽሑፉን ያሻሽሉ')
                                                    : (language === 'en' ? 'Create Post' : 'ጽሑፍ ይፍጠሩ')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                className="py-3 px-6 bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium rounded-xl transition-all"
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