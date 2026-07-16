// src/components/NewsHub.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  FileText,
  BookOpen,
  Video,
  MessageSquare,
  Search,
  Calendar,
  User,
  AlertCircle,
  Play,
  Eye
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { articleService } from '../services/api';
import { Article } from '../types';

export default function NewsHub() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'all' | 'news' | 'history' | 'interview' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Fetch articles from API
  useEffect(() => {
    fetchArticles();
  }, [activeCategory, searchQuery]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articleService.getAll({
        category: activeCategory === 'all' ? undefined : activeCategory,
        search: searchQuery || undefined
      });

      if (response.success && response.data) {
        // Ensure each article has both _id and id fields
        const articlesWithIds = response.data.map((article: any) => ({
          ...article,
          _id: article._id || article.id,
          id: article.id || article._id,
          publishedBy: {
            ...article.publishedBy,
            _id: article.publishedBy?._id || article.publishedBy?.id || '',
            id: article.publishedBy?.id || article.publishedBy?._id || '',
          }
        }));
        setArticles(articlesWithIds);
        setImageErrors({});
      } else {
        setError(response.message || 'Failed to load articles');
      }
    } catch (err: any) {
      console.error('Error fetching articles:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Navigate to single article detail page
  const navigateToArticle = (article: Article) => {
    const articleId = article._id || article.id;

    if (!articleId || articleId === 'undefined' || articleId === 'null' || articleId === '') {
      console.error('❌ Article has no valid ID:', article);
      return;
    }

    console.log('🔗 Navigating to article detail with ID:', articleId);
    navigate(`/article/${articleId}`);
  };

  // Get display content based on language
  const getDisplayTitle = (article: Article) => {
    return language === 'en' ? article.title : (article.localTitle || article.title);
  };

  const getDisplayContent = (article: Article) => {
    return language === 'en' ? article.content : (article.localContent || article.content);
  };

  const getDisplayAuthor = (article: Article) => {
    return language === 'en' ? article.author : (article.localAuthor || article.author);
  };

  const getDisplayDate = (article: Article) => {
    return article.date || new Date(article.createdAt).toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // ✅ FIX: Get image URL with proper base URL
  const getImageUrl = (url: string | undefined): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${cleanUrl}`;
  };

  const handleImageError = (articleId: string) => {
    setImageErrors(prev => ({ ...prev, [articleId]: true }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchArticles}
          className="mt-2 text-sm text-red-600 underline hover:text-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-200/80">
          {[
            { id: 'all', label: language === 'en' ? 'All' : 'ሁሉም', icon: FileText },
            { id: 'news', label: language === 'en' ? 'News' : 'ዜና', icon: FileText },
            { id: 'history', label: language === 'en' ? 'History' : 'ታሪክ', icon: BookOpen },
            { id: 'interview', label: language === 'en' ? 'Interview' : 'ቃለ-መጠይቅ', icon: MessageSquare },
            { id: 'video', label: language === 'en' ? 'Video' : 'ቪዲዮ', icon: Video }
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${isSel
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-850 hover:bg-stone-100'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === 'en' ? 'Search articles...' : 'ጽሑፎችን ይፈልጉ...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-mono bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Articles Grid - Cards */}
      {articles.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-stone-200 rounded-3xl bg-white space-y-3">
          <AlertCircle className="w-8 h-8 text-stone-400 mx-auto" />
          <h4 className="font-serif font-bold text-stone-800 text-sm">
            {language === 'en' ? 'No Articles Found' : 'ምንም ዓይነት ጽሑፍ አልተገኘም'}
          </h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto font-mono">
            {language === 'en'
              ? 'Try adjusting your categories or search queries.'
              : 'እባክዎን ምርጫዎን ያስተካክሉ ወይም ሌላ የፍለጋ ቃል ይሞክሩ።'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const displayTitle = getDisplayTitle(article);
            const displayContent = getDisplayContent(article);
            const displayAuthor = getDisplayAuthor(article);
            const displayDate = getDisplayDate(article);
            const isVideo = article.category === 'video';
            const hasImageError = imageErrors[article._id];
            const imageUrl = getImageUrl(article.imageUrl);

            const catColors = {
              news: 'bg-blue-100 text-blue-800 border-blue-200',
              history: 'bg-amber-100 text-amber-800 border-amber-200',
              interview: 'bg-emerald-100 text-emerald-800 border-emerald-200',
              video: 'bg-purple-100 text-purple-800 border-purple-200'
            }[article.category];

            return (
              <motion.div
                key={article._id || article.id || Math.random().toString()}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 flex flex-col hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => navigateToArticle(article)}
              >
                {/* Image/Video Section - FIXED */}
                <div className="aspect-video w-full bg-stone-100 relative overflow-hidden">
                  {article.imageUrl && !hasImageError ? (
                    <img
                      src={imageUrl}
                      alt={displayTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={() => handleImageError(article._id)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-200">
                      {isVideo ? (
                        <Video className="w-12 h-12 text-stone-400" />
                      ) : (
                        <FileText className="w-12 h-12 text-stone-400" />
                      )}
                    </div>
                  )}

                  {isVideo && (
                    <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all pointer-events-none">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  )}

                  {article.duration && (
                    <span className="absolute bottom-2 right-2 bg-stone-950/80 backdrop-blur-xs text-[10px] font-mono text-stone-100 px-1.5 py-0.5 rounded border border-stone-800 font-bold">
                      {article.duration}
                    </span>
                  )}

                  <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-md text-[9px] font-mono font-extrabold uppercase border ${catColors}`}>
                    {article.category}
                  </span>

                  {/* Click to read indicator */}
                  <div className="absolute bottom-2 left-2 bg-stone-950/70 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded-lg flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{language === 'en' ? 'Read More' : 'ተጨማሪ ያንብቡ'}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 font-mono text-[10px] text-stone-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-600" />
                      {displayDate}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-stone-900 tracking-tight leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {displayTitle}
                  </h3>

                  <p className="text-xs text-stone-600 font-sans leading-relaxed line-clamp-3 flex-1">
                    {displayContent}
                  </p>

                  {/* Author Profile */}
                  <div className="mt-3 pt-3 border-t border-stone-100/80 flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {article.authorPhoto ? (
                        <img
                          src={article.authorPhoto}
                          alt={displayAuthor}
                          className="w-8 h-8 rounded-full object-cover border-2 border-emerald-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-xs">
                          {getInitials(displayAuthor)}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-stone-800">
                        {displayAuthor}
                      </span>
                      <span className="text-[9px] font-mono text-stone-400">
                        {language === 'en' ? 'Author' : 'ደራሲ'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
