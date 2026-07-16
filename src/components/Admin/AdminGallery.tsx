// src/components/Admin/AdminGallery.tsx - Fully Responsive with Back Button
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Plus,
    Trash2,
    X,
    Image as ImageIcon,
    AlertCircle,
    CheckCircle,
    RefreshCw,
    Search,
    Loader2,
    Upload,
    Trash2 as TrashIcon,
    Star,
    ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { galleryService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function AdminGallery() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        category: 'general',
        description: '',
        tags: [] as string[],
        isFeatured: false,
    });

    const categories = [
        'nature', 'culture', 'cuisine', 'investment',
        'event', 'general', 'news', 'history',
        'entertainment', 'health', 'technology', 'vacancy'
    ];

    useEffect(() => {
        fetchGallery();
    }, [categoryFilter, searchTerm]);

    const fetchGallery = async () => {
        try {
            setLoading(true);
            setError(null);
            const params: any = {};
            if (categoryFilter !== 'all') params.category = categoryFilter;
            if (searchTerm) params.search = searchTerm;

            const response = await galleryService.getAll(params);
            if (response.success) {
                setItems(response.data || []);
                setImageErrors({});
            } else {
                setError(response.message || 'Failed to load gallery');
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
            category: 'general',
            description: '',
            tags: [],
            isFeatured: false,
        });
        setImageFile(null);
        setImagePreview(null);
        setShowForm(false);
        setError(null);
        setSubmitting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
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

    const handleImageError = (itemId: string) => {
        setImageErrors(prev => ({ ...prev, [itemId]: true }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        if (!formData.title || !imageFile) {
            setError(language === 'en'
                ? 'Please provide a title and select an image'
                : 'እባክዎት ርዕስ ያስገቡ እና ምስል ይምረጡ'
            );
            setSubmitting(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            const jsonData = {
                title: formData.title,
                category: formData.category,
                description: formData.description,
                tags: formData.tags,
                isFeatured: formData.isFeatured,
            };

            formDataToSend.append('data', JSON.stringify(jsonData));
            formDataToSend.append('image', imageFile);

            const response = await galleryService.createWithImage(formDataToSend);

            if (response.success) {
                setSuccessMsg(language === 'en' ? 'Image uploaded successfully!' : 'ምስሉ በተሳካ ሁኔታ ተጭኗል!');
                setTimeout(() => setSuccessMsg(null), 3000);
                resetForm();
                fetchGallery();
            } else {
                setError(response.message || 'Failed to upload image');
            }
        } catch (err: any) {
            console.error('❌ Upload error:', err);
            setError(err.response?.data?.message || 'Failed to upload image');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(language === 'en' ? 'Delete this image?' : 'ይህን ምስል መሰረዝ ይፈልጋሉ?')) return;

        try {
            const response = await galleryService.delete(id);
            if (response.success) {
                setSuccessMsg(language === 'en' ? 'Image deleted!' : 'ምስሉ ተሰርዟል!');
                setTimeout(() => setSuccessMsg(null), 3000);
                fetchGallery();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete image');
        }
    };

    const toggleFeatured = async (id: string, currentState: boolean) => {
        try {
            const response = await galleryService.update(id, { isFeatured: !currentState });
            if (response.success) {
                fetchGallery();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update featured status');
        }
    };

    const getImageUrl = (item: any): string => {
        if (!item.url) return '';
        if (item.url.startsWith('http://') || item.url.startsWith('https://')) {
            return item.url;
        }
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
        return `${baseUrl}${item.url.startsWith('/') ? '' : '/'}${item.url}`;
    };

    const goBack = () => {
        navigate('/admin');
    };

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            nature: language === 'en' ? 'Nature' : 'ተፈጥሮ',
            culture: language === 'en' ? 'Culture' : 'ባህል',
            cuisine: language === 'en' ? 'Cuisine' : 'ምግብ',
            investment: language === 'en' ? 'Investment' : 'ኢንቨስትመንት',
            event: language === 'en' ? 'Event' : 'ዝግጅት',
            general: language === 'en' ? 'General' : 'አጠቃላይ',
            news: language === 'en' ? 'News' : 'ዜና',
            history: language === 'en' ? 'History' : 'ታሪክ',
            entertainment: language === 'en' ? 'Entertainment' : 'መዝናኛ',
            health: language === 'en' ? 'Health' : 'ጤና',
            technology: language === 'en' ? 'Technology' : 'ቴክኖሎጂ',
            vacancy: language === 'en' ? 'Vacancy' : 'የስራ ክፍት ቦታ',
        };
        return labels[category] || category;
    };

    if (loading && items.length === 0) {
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
                                    {language === 'en' ? 'Gallery Management' : 'ማህደር አስተዳደር'}
                                </h1>
                                <p className="text-sm text-stone-500 truncate">
                                    {language === 'en'
                                        ? 'Upload and manage images'
                                        : 'ምስሎችን ይጫኑ እና ያስተዳድሩ'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl transition-all font-medium flex-shrink-0 w-full sm:w-auto"
                        >
                            <Plus className="w-4 h-4" />
                            {language === 'en' ? 'Upload Image' : 'ምስል ይጫኑ'}
                        </button>
                    </div>

                    {/* Messages */}
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
                                placeholder={language === 'en' ? 'Search images...' : 'ምስሎችን ይፈልጉ...'}
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
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                            ))}
                        </select>

                        <button
                            onClick={fetchGallery}
                            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span className="hidden sm:inline">{language === 'en' ? 'Refresh' : 'አድስ'}</span>
                        </button>
                    </div>

                    {/* Gallery Grid - Responsive */}
                    {items.length === 0 ? (
                        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 text-center">
                            <ImageIcon className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                            <p className="text-stone-500 text-sm sm:text-base">
                                {language === 'en' ? 'No images uploaded yet' : 'እስካሁን ምንም ምስሎች አልተጫኑም'}
                            </p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl transition-all text-sm"
                            >
                                {language === 'en' ? 'Upload First Image' : 'የመጀመሪያ ምስል ይጫኑ'}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                            {items.map((item) => {
                                const hasError = imageErrors[item._id];
                                const imageUrl = getImageUrl(item);

                                return (
                                    <div key={item._id} className="group relative aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                                        {item.url && !hasError ? (
                                            <img
                                                src={imageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={() => handleImageError(item._id)}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-stone-200">
                                                <ImageIcon className="w-8 h-8 sm:w-12 sm:h-12 text-stone-400" />
                                            </div>
                                        )}

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                                                <p className="text-white text-xs sm:text-sm font-medium truncate">{item.title}</p>
                                                <p className="text-stone-300 text-[10px] sm:text-xs truncate">{getCategoryLabel(item.category)}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => toggleFeatured(item._id, item.isFeatured)}
                                                className={`p-1 sm:p-1.5 rounded-lg transition-all ${item.isFeatured
                                                    ? 'bg-amber-500 text-stone-950'
                                                    : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800'
                                                    }`}
                                                title={item.isFeatured ? 'Featured' : 'Set as featured'}
                                            >
                                                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-1 sm:p-1.5 bg-red-600/80 text-white rounded-lg hover:bg-red-600 transition-all"
                                            >
                                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </button>
                                        </div>

                                        {/* Featured badge */}
                                        {item.isFeatured && (
                                            <div className="absolute top-2 left-2 px-1.5 sm:px-2 py-0.5 bg-amber-500 text-stone-950 text-[8px] sm:text-[10px] font-mono rounded-md">
                                                ★ Featured
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Upload Modal - Responsive */}
                    <AnimatePresence>
                        {showForm && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                                onClick={() => {
                                    if (!submitting) resetForm();
                                }}
                            >
                                <motion.div
                                    initial={{ scale: 0.95, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.95, y: 20 }}
                                    className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                                            {language === 'en' ? 'Upload Image' : 'ምስል ይጫኑ'}
                                        </h2>
                                        <button
                                            onClick={resetForm}
                                            disabled={submitting}
                                            className="p-2 hover:bg-stone-100 rounded-lg transition-all disabled:opacity-50"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                                {language === 'en' ? 'Image Title' : 'የምስል ርዕስ'} *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-4 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                placeholder={language === 'en' ? 'Enter image title' : 'የምስል ርዕስ ያስገቡ'}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                                {language === 'en' ? 'Category' : 'ምድብ'} *
                                            </label>
                                            <select
                                                required
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-4 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            >
                                                {categories.map((cat) => (
                                                    <option key={cat} value={cat}>
                                                        {getCategoryLabel(cat)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                                {language === 'en' ? 'Description' : 'መግለጫ'}
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-4 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                                                placeholder={language === 'en' ? 'Describe the image' : 'የምስሉን መግለጫ ይስጡ'}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                                {language === 'en' ? 'Tags (comma separated)' : 'መለያዎች (በነጠላ ሰረዝ የሚለያዩ)'}
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.tags.join(', ')}
                                                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                                                className="w-full px-4 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                placeholder={language === 'en' ? 'e.g. nature, mountain, lake' : 'ለምሳሌ፡ ተፈጥሮ፣ ተራራ፣ ሀይቅ'}
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="isFeatured"
                                                checked={formData.isFeatured}
                                                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                                className="w-4 h-4 text-amber-500 rounded"
                                            />
                                            <label htmlFor="isFeatured" className="text-sm text-stone-700 cursor-pointer">
                                                {language === 'en' ? 'Feature this image' : 'ይህን ምስል በደንብ አሳይ'}
                                            </label>
                                        </div>

                                        {/* Image Upload */}
                                        <div className="border-2 border-dashed border-stone-300 rounded-xl p-4">
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
                                                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                                                        disabled={submitting}
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
                                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                disabled={submitting}
                                            />
                                            {imagePreview && imageFile && (
                                                <p className="text-xs text-stone-500 mt-2 truncate">
                                                    {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                            <button
                                                type="submit"
                                                disabled={submitting || !imageFile}
                                                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                                {language === 'en' ? 'Upload Image' : 'ምስል ይጫኑ'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                disabled={submitting}
                                                className="py-3 px-6 bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium rounded-xl transition-all disabled:opacity-50"
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