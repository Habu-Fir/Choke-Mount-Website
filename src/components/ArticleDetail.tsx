// src/components/ArticleDetail.tsx - With Emerald/Green Theme
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    ArrowLeft,
    Calendar,
    User,
    Clock,
    Share2,
    Bookmark,
    Heart,
    Play,
    X,
    AlertCircle,
    ChevronLeft,
    FileText,
    MessageSquare,
    Eye,
    ThumbsUp,
    Languages
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { articleService } from '../services/api';
import { Article } from '../types';

export default function ArticleDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { language, setLanguage } = useLanguage();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [playingVideo, setPlayingVideo] = useState(false);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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

    // Language toggle function
    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'am' : 'en');
    };

    useEffect(() => {
        // Validate ID
        if (!id || id === 'undefined' || id === 'null' || id === '') {
            console.error('❌ Invalid article ID:', id);
            setError('Invalid article ID provided');
            setLoading(false);
            return;
        }

        console.log('📖 Fetching single article with ID:', id);
        fetchArticle(id);
        window.scrollTo(0, 0);

        // Check if article was bookmarked
        const savedBookmarks = localStorage.getItem('bookmarked_articles');
        if (savedBookmarks) {
            try {
                const bookmarks = JSON.parse(savedBookmarks);
                setBookmarked(bookmarks.includes(id));
            } catch (e) {
                console.warn('Could not load bookmarks');
            }
        }
    }, [id]);

    const fetchArticle = async (articleId: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await articleService.getById(articleId);

            if (response.success && response.data) {
                const articleData = {
                    ...response.data,
                    _id: response.data._id || response.data.id || articleId,
                    id: response.data.id || response.data._id || articleId,
                    publishedBy: {
                        ...response.data.publishedBy,
                        _id: response.data.publishedBy?._id || response.data.publishedBy?.id || '',
                        id: response.data.publishedBy?.id || response.data.publishedBy?._id || '',
                    }
                };
                setArticle(articleData);
            } else {
                setError(response.message || 'Article not found');
            }
        } catch (err: any) {
            console.error('Error fetching article:', err);
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getDisplayTitle = () => {
        if (!article) return '';
        return language === 'en' ? article.title : (article.localTitle || article.title);
    };

    const getDisplayContent = () => {
        if (!article) return '';
        return language === 'en' ? article.content : (article.localContent || article.content);
    };

    const getDisplayAuthor = () => {
        if (!article) return '';
        return language === 'en' ? article.author : (article.localAuthor || article.author);
    };

    const getDisplayDate = () => {
        return article?.date || new Date(article?.createdAt || '').toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getInitials = (name: string) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A';
    };

    const goBack = () => {
        navigate(-1);
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: getDisplayTitle(),
                    text: getDisplayContent()?.slice(0, 100) + '...',
                    url: window.location.href
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert(language === 'en' ? 'Link copied to clipboard!' : 'ሊንኩ ተቀድቷል!');
            }
        } catch (error) {
            console.log('Share cancelled');
        }
    };

    const toggleBookmark = () => {
        const newState = !bookmarked;
        setBookmarked(newState);
        const savedBookmarks = localStorage.getItem('bookmarked_articles');
        let bookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : [];
        if (newState) {
            if (!bookmarks.includes(id)) bookmarks.push(id);
        } else {
            bookmarks = bookmarks.filter((bookmarkId: string) => bookmarkId !== id);
        }
        localStorage.setItem('bookmarked_articles', JSON.stringify(bookmarks));
    };

    const handleImageError = () => {
        setImageErrors(prev => ({ ...prev, [id || '']: true }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-stone-500">
                        {language === 'en' ? 'Loading article...' : 'ጽሑፉን በመጫን ላይ...'}
                    </p>
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-stone-200 shadow-lg">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                        {language === 'en' ? 'Article Not Found' : 'ጽሑፍ አልተገኘም'}
                    </h2>
                    <p className="text-stone-500 mb-6">
                        {error || (language === 'en' ? "The article you're looking for doesn't exist." : 'የሚፈልጉት ጽሑፍ የለም።')}
                    </p>
                    <button
                        onClick={goBack}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all"
                    >
                        {language === 'en' ? 'Go Back' : 'ተመለስ'}
                    </button>
                </div>
            </div>
        );
    }

    const isVideo = article.category === 'video';
    const hasImageError = imageErrors[id || ''];
    const imageUrl = getImageUrl(article.imageUrl);

    const catColors = {
        news: 'bg-blue-100 text-blue-800 border-blue-200',
        history: 'bg-amber-100 text-amber-800 border-amber-200',
        interview: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        video: 'bg-purple-100 text-purple-800 border-purple-200'
    }[article.category];

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Top Navigation Bar - Emerald Theme */}
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100/80">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 text-stone-600 hover:text-emerald-700 transition-all group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium text-sm">
                            {language === 'en' ? 'Back' : 'ተመለስ'}
                        </span>
                    </button>
                    <div className="flex items-center gap-2">
                        {/* Language Toggle Button - Emerald Theme */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-all text-sm font-medium"
                        >
                            <Languages className="w-4 h-4" />
                            <span>{language === 'en' ? 'አማ' : 'EN'}</span>
                        </button>
                        <button
                            onClick={() => setLiked(!liked)}
                            className="p-2 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                            <Heart className={`w-5 h-5 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-stone-400 hover:text-red-500'}`} />
                        </button>
                        <button
                            onClick={toggleBookmark}
                            className="p-2 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                            <Bookmark className={`w-5 h-5 transition-colors ${bookmarked ? 'fill-emerald-500 text-emerald-500' : 'text-stone-400 hover:text-emerald-500'}`} />
                        </button>
                        <button
                            onClick={handleShare}
                            className="p-2 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                            <Share2 className="w-5 h-5 text-stone-400 hover:text-emerald-600 transition-colors" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content - Single Article */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl overflow-hidden border border-emerald-100 shadow-lg"
                >
                    {/* Featured Image/Video */}
                    <div className="relative">
                        {isVideo && article.videoUrl ? (
                            <div className="aspect-video bg-black">
                                {playingVideo ? (
                                    <div className="relative w-full h-full">
                                        <iframe
                                            src={article.videoUrl}
                                            title={getDisplayTitle()}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-full border-none"
                                        />
                                        <button
                                            onClick={() => setPlayingVideo(false)}
                                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative w-full h-full flex items-center justify-center bg-stone-900">
                                        {article.imageUrl && !hasImageError ? (
                                            <img
                                                src={imageUrl}
                                                alt={getDisplayTitle()}
                                                className="w-full h-full object-cover opacity-50"
                                                onError={handleImageError}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-stone-800">
                                                <FileText className="w-24 h-24 text-stone-600" />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setPlayingVideo(true)}
                                            className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                                        >
                                            <Play className="w-10 h-10 fill-current ml-1" />
                                        </button>
                                        {article.duration && (
                                            <span className="absolute bottom-4 right-4 bg-black/80 text-white text-sm font-mono px-3 py-1.5 rounded-lg">
                                                {article.duration}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : article.imageUrl && !hasImageError ? (
                            <div className="aspect-video bg-stone-100">
                                <img
                                    src={imageUrl}
                                    alt={getDisplayTitle()}
                                    className="w-full h-full object-cover"
                                    onError={handleImageError}
                                />
                            </div>
                        ) : (
                            <div className="aspect-video bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                                <FileText className="w-24 h-24 text-emerald-400" />
                            </div>
                        )}
                        <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-extrabold uppercase border ${catColors}`}>
                                {article.category}
                            </span>
                        </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-6 sm:p-8 lg:p-10">
                        <div className="mb-6">
                            <div className="flex items-center gap-4 text-sm text-stone-500 mb-3 flex-wrap">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-emerald-600" />
                                    {getDisplayDate()}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-emerald-600" />
                                    {language === 'en' ? '5 min read' : '5 ደቂቃ ንባብ'}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Eye className="w-4 h-4 text-emerald-600" />
                                    {Math.floor(Math.random() * 1000) + 100} {language === 'en' ? 'views' : 'እይታዎች'}
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
                                {getDisplayTitle()}
                            </h1>
                        </div>

                        <div className="prose prose-stone max-w-none">
                            <p className="text-base sm:text-lg text-stone-700 leading-relaxed whitespace-pre-wrap">
                                {getDisplayContent()}
                            </p>
                        </div>

                        {/* Author Section - Emerald Theme */}
                        <div className="mt-8 pt-8 border-t border-emerald-100">
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    {article.authorPhoto ? (
                                        <img
                                            src={getImageUrl(article.authorPhoto)}
                                            alt={getDisplayAuthor()}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-emerald-200"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const fallback = e.currentTarget.parentElement?.querySelector('.author-fallback');
                                                if (fallback) fallback.classList.remove('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <div className="author-fallback w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-xl">
                                        {getInitials(getDisplayAuthor() || '')}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-stone-900 text-lg">{getDisplayAuthor()}</h4>
                                    <p className="text-sm text-stone-500">
                                        {language === 'en' ? 'Author' : 'ደራሲ'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section - Emerald Theme */}
                        <div className="mt-6 pt-6 border-t border-emerald-100">
                            <button className="flex items-center gap-2 text-sm text-stone-600 hover:text-emerald-600 transition-all">
                                <MessageSquare className="w-4 h-4" />
                                <span>
                                    {language === 'en' ? 'Comments (0)' : 'አስተያየቶች (0)'}
                                </span>
                            </button>
                        </div>
                    </div>
                </motion.article>
            </div>
        </div>
    );
}