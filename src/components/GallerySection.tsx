// src/components/GallerySection.tsx
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Grid,
  MapPin,
  AlertCircle,
  Loader2,
  Calendar,
  User,
  Star
} from 'lucide-react';
import { galleryService } from '../services/api';
import { GalleryItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

export default function GallerySection() {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Fetch gallery from API
  useEffect(() => {
    fetchGallery();

    // Listen for custom gallery updates (from admin)
    const handleGalleryUpdate = () => {
      fetchGallery();
    };
    window.addEventListener('customGalleryUpdated', handleGalleryUpdate);

    return () => {
      window.removeEventListener('customGalleryUpdated', handleGalleryUpdate);
    };
  }, [activeCategory]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {};
      if (activeCategory !== 'all') {
        params.category = activeCategory;
      }

      const response = await galleryService.getAll(params);

      if (response.success && response.data) {
        // Ensure each item has an _id and proper URL
        const itemsWithId = response.data.map((item: any) => ({
          ...item,
          _id: item._id || item.id,
          // Ensure URL is absolute
          url: item.url?.startsWith('http')
            ? item.url
            : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${item.url?.startsWith('/') ? '' : '/'}${item.url || ''}`
        }));
        setGalleryItems(itemsWithId);
        setImageErrors({});
      } else {
        setError(response.message || 'Failed to load gallery');
      }
    } catch (err: any) {
      console.error('Error fetching gallery:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const openLightbox = (item: GalleryItem) => {
    const idx = galleryItems.findIndex(g => g._id === item._id);
    if (idx !== -1) {
      setLightboxIndex(idx);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = 'auto';
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (lightboxIndex === null || galleryItems.length === 0) return;
    let nextIdx = direction === 'next' ? lightboxIndex + 1 : lightboxIndex - 1;

    if (nextIdx < 0) {
      nextIdx = galleryItems.length - 1;
    } else if (nextIdx >= galleryItems.length) {
      nextIdx = 0;
    }
    setLightboxIndex(nextIdx);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
      if (e.key === 'ArrowRight') navigateLightbox('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  // Static per-category badge classes (Tailwind JIT can't see dynamically
  // built class names like `bg-${color}-500/15`, so each category gets a
  // full literal className here instead of an interpolated color token).
  const getCategoryDetails = (category: string) => {
    switch (category) {
      case 'nature':
        return { label: language === 'en' ? '🌳 Nature' : '🌳 ተፈጥሮ', badgeClass: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30' };
      case 'culture':
        return { label: language === 'en' ? '🐴 Culture' : '🐴 ባህል', badgeClass: 'bg-amber-500/15 text-amber-200 border-amber-500/30' };
      case 'cuisine':
        return { label: language === 'en' ? '🍯 Culinary' : '🍯 ምግብ', badgeClass: 'bg-rose-500/15 text-rose-200 border-rose-500/30' };
      case 'investment':
        return { label: language === 'en' ? '📈 Development' : '📈 ልማት', badgeClass: 'bg-blue-500/15 text-blue-200 border-blue-500/30' };
      case 'event':
        return { label: language === 'en' ? '🎉 Event' : '🎉 ዝግጅት', badgeClass: 'bg-purple-500/15 text-purple-200 border-purple-500/30' };
      case 'general':
        return { label: language === 'en' ? '📸 General' : '📸 አጠቃላይ', badgeClass: 'bg-stone-500/15 text-stone-200 border-stone-500/30' };
      case 'news':
        return { label: language === 'en' ? '📰 News' : '📰 ዜና', badgeClass: 'bg-blue-500/15 text-blue-200 border-blue-500/30' };
      case 'history':
        return { label: language === 'en' ? '📜 History' : '📜 ታሪክ', badgeClass: 'bg-amber-500/15 text-amber-200 border-amber-500/30' };
      case 'entertainment':
        return { label: language === 'en' ? '🎭 Entertainment' : '🎭 መዝናኛ', badgeClass: 'bg-rose-500/15 text-rose-200 border-rose-500/30' };
      case 'health':
        return { label: language === 'en' ? '🏥 Health' : '🏥 ጤና', badgeClass: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30' };
      case 'technology':
        return { label: language === 'en' ? '💻 Technology' : '💻 ቴክኖሎጂ', badgeClass: 'bg-indigo-500/15 text-indigo-200 border-indigo-500/30' };
      case 'vacancy':
        return { label: language === 'en' ? '💼 Vacancy' : '💼 ክፍት ቦታ', badgeClass: 'bg-cyan-500/15 text-cyan-200 border-cyan-500/30' };
      default:
        return { label: '🗂️ Unknown', badgeClass: 'bg-stone-500/15 text-stone-200 border-stone-500/30' };
    }
  };

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const getImageUrl = (item: GalleryItem): string => {
    if (!item.url) return '';
    if (item.url.startsWith('http://') || item.url.startsWith('https://')) {
      return item.url;
    }
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseUrl}${item.url.startsWith('/') ? '' : '/'}${item.url}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchGallery}
          className="mt-2 text-sm text-red-600 underline hover:text-red-800"
        >
          {language === 'en' ? 'Try again' : 'እንደገና ሞክር'}
        </button>
      </div>
    );
  }

  return (
    <div id="media-gallery-section" className="space-y-6">

      {/* Upper toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Grid className="w-4 h-4 text-stone-500" />
          <span className="font-mono text-xs text-stone-500 uppercase tracking-widest">
            {language === 'en' ? 'Filter Gallery:' : 'ማህደር አጣራ:'}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: language === 'en' ? '🗂️ All Photos' : '🗂️ ሁሉም ፎቶዎች' },
            { id: 'nature', label: language === 'en' ? '🌿 Nature' : '🌿 ተፈጥሮ' },
            { id: 'culture', label: language === 'en' ? '🐴 Culture' : '🐴 ባህል' },
            { id: 'cuisine', label: language === 'en' ? '🍯 Cuisine' : '🍯 ምግብ' },
            { id: 'investment', label: language === 'en' ? '📈 Investment' : '📈 ኢንቨስትመንት' },
            { id: 'event', label: language === 'en' ? '🎉 Events' : '🎉 ዝግጅቶች' },
            { id: 'news', label: language === 'en' ? '📰 News' : '📰 ዜና' },
            { id: 'history', label: language === 'en' ? '📜 History' : '📜 ታሪክ' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${activeCategory === cat.id
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Canvas */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <div className="text-6xl mb-4">🖼️</div>
          <p className="text-stone-500">
            {language === 'en' ? 'No images found' : 'ምንም ምስሎች አልተገኙም'}
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => {
              const catInfo = getCategoryDetails(item.category);
              const hasError = imageErrors[item._id];
              const imageUrl = getImageUrl(item);

              return (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group relative rounded-2xl overflow-hidden border border-stone-200 shadow-sm aspect-4/3 bg-stone-100 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                  onClick={() => openLightbox(item)}
                >
                  {/* Image */}
                  {!hasError && imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      onError={() => handleImageError(item._id)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-200 text-6xl">
                      📷
                    </div>
                  )}

                  {/* Dark Overlay gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-900/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity flex flex-col justify-end p-5">
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {/* Category tag */}
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono border font-bold uppercase inline-block mb-1.5 ${catInfo.badgeClass}`}>
                        {catInfo.label}
                      </span>

                      {/* Title */}
                      <h4 className="text-white text-sm font-serif font-bold tracking-tight">
                        {item.title}
                      </h4>

                      {/* Brief description */}
                      {item.description && (
                        <p className="text-stone-300 text-[11px] line-clamp-1 mt-1 font-sans">
                          {item.description}
                        </p>
                      )}

                      {/* Featured badge */}
                      {item.isFeatured && (
                        <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-amber-400 font-mono">
                          <Star className="w-3 h-3 fill-amber-400" /> Featured
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick expand plus sign */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-stone-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Plus className="w-4 h-4 text-stone-700" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Lightbox Modal overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && galleryItems[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-stone-950/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-stone-900 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-50 bg-stone-950/70 hover:bg-stone-950 p-2.5 rounded-full border border-stone-800 text-stone-300 hover:text-white transition-all hover:scale-110 active:scale-95 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Navigator triggers */}
              <button
                onClick={() => navigateLightbox('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-stone-950/70 hover:bg-stone-950 p-3 rounded-full border border-stone-800 text-stone-300 hover:text-white transition-all hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateLightbox('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-stone-950/70 hover:bg-stone-950 p-3 rounded-full border border-stone-800 text-stone-300 hover:text-white transition-all hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Zoom Panel Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12">
                {/* Visual Column */}
                <div className="md:col-span-8 bg-stone-950 aspect-4/3 md:aspect-auto md:h-[500px] flex items-center justify-center overflow-hidden">
                  <img
                    src={getImageUrl(galleryItems[lightboxIndex])}
                    alt={galleryItems[lightboxIndex].title}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                    onError={() => { }}
                  />
                </div>

                {/* Metadata Details Column */}
                <div className="md:col-span-4 p-6 flex flex-col justify-between h-[220px] md:h-[500px] bg-stone-900 border-t md:border-t-0 md:border-l border-stone-800 text-stone-100">
                  <div className="space-y-4">
                    <div>
                      <span className="text-emerald-400 font-mono text-[9px] uppercase tracking-widest block mb-1">
                        Digo Tsion Archive
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono border font-bold uppercase inline-block mb-3 ${getCategoryDetails(galleryItems[lightboxIndex].category).badgeClass}`}>
                        {getCategoryDetails(galleryItems[lightboxIndex].category).label}
                      </span>
                      <h3 className="text-xl font-serif text-white font-bold leading-snug">
                        {galleryItems[lightboxIndex].title}
                      </h3>
                    </div>

                    {galleryItems[lightboxIndex].description && (
                      <p className="text-stone-400 text-xs leading-relaxed font-sans">
                        {galleryItems[lightboxIndex].description}
                      </p>
                    )}

                    {galleryItems[lightboxIndex].tags && galleryItems[lightboxIndex].tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {galleryItems[lightboxIndex].tags?.map((tag: string, i: number) => (
                          <span key={i} className="text-[10px] text-stone-500 font-mono">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-stone-800 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Bibugn District Municipality, Gojjam</span>
                    </div>
                    {galleryItems[lightboxIndex].createdAt && (
                      <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{new Date(galleryItems[lightboxIndex].createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    {galleryItems[lightboxIndex].uploadedBy && (
                      <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono">
                        <User className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{galleryItems[lightboxIndex].uploadedBy.name}</span>
                      </div>
                    )}
                    {galleryItems[lightboxIndex].isFeatured && (
                      <div className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-mono">
                        <Star className="w-3 h-3 fill-amber-400" /> Featured
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Counter */}
              <div className="absolute bottom-4 left-4 text-white/50 text-xs font-mono">
                {lightboxIndex + 1} / {galleryItems.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
