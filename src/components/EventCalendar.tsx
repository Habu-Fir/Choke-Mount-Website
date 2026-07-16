// src/components/EventCalendar.tsx
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Filter,
  Plus,
  Trash2,
  Sparkles,
  BookmarkCheck,
  AlertCircle
} from 'lucide-react';
import { eventService } from '../services/api';
import { EventItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

export default function EventCalendar() {
  const { language, t } = useLanguage();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [itinerary, setItinerary] = useState<EventItem[]>([]);

  // Fetch events from API
  useEffect(() => {
    fetchEvents();
  }, [activeCategory]);

  // Load itinerary from localStorage
  useEffect(() => {
    loadItinerary();
  }, [events]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.getAll({
        category: activeCategory === 'all' ? undefined : activeCategory
      });

      if (response.success && response.data) {
        // FIX: Ensure each event has both _id and id fields
        const eventsWithIds = response.data.map((event: any) => ({
          ...event,
          _id: event._id || event.id,
          id: event.id || event._id,
        }));
        setEvents(eventsWithIds);
        if (eventsWithIds.length > 0) {
          setSelectedEvent(eventsWithIds[0]);
        }
      } else {
        setError(response.message || 'Failed to load events');
      }
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadItinerary = () => {
    const saved = localStorage.getItem('digo_tsion_itinerary');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Match saved IDs with actual dataset
        const items = events.filter(e => parsed.includes(e._id || e.id));
        setItinerary(items);
      } catch (err) {
        console.error('Error loading itinerary', err);
      }
    }
  };

  const saveItineraryToDisk = (newItinerary: EventItem[]) => {
    // FIX: Use _id as primary, fallback to id
    const ids = newItinerary.map(item => item._id || item.id);
    localStorage.setItem('digo_tsion_itinerary', JSON.stringify(ids));
  };

  const addToItinerary = (event: EventItem) => {
    const eventId = event._id || event.id;
    if (itinerary.some(item => (item._id || item.id) === eventId)) return;
    const updated = [...itinerary, event];
    setItinerary(updated);
    saveItineraryToDisk(updated);
  };

  const removeFromItinerary = (id: string) => {
    const updated = itinerary.filter(item => (item._id || item.id) !== id);
    setItinerary(updated);
    saveItineraryToDisk(updated);
  };

  const filteredEvents = events;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'cultural':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'market':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'holiday':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'investment':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-stone-600 bg-stone-50 border-stone-200';
    }
  };

  const formatMonthShort = (month: string) => {
    if (language === 'am') {
      switch (month) {
        case 'January': return 'ጥር';
        case 'November': return 'ህዳር';
        case 'Quarterly Tuesdays': return 'ማክሰ';
        case 'October': return 'ጥቅም';
        case 'July': return 'ሐምሌ';
        default: return month.substring(0, 3).toUpperCase();
      }
    }
    return month.length > 3 ? month.substring(0, 3).toUpperCase() : month.toUpperCase();
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
          onClick={fetchEvents}
          className="mt-2 text-sm text-red-600 underline hover:text-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div id="cultural-calendar-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      {/* LEFT COLUMN: EVENTS DIRECTORY (8 cols on large screen) */}
      <div className="lg:col-span-8 space-y-6">

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-500" />
            <span className="font-mono text-xs text-stone-500 uppercase tracking-widest">{t.scheduleFilter}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: t.allEvents },
              { id: 'cultural', label: language === 'en' ? '🐴 Cultural' : '🐴 ባህላዊ' },
              { id: 'market', label: t.marketFairs },
              { id: 'holiday', label: t.religiousHolidays },
              { id: 'investment', label: t.investmentForums },
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

        {/* List of Events */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
            <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500">
              {language === 'en' ? 'No events found' : 'ምንም ዝግጅቶች አልተገኙም'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map(event => {
                const eventId = event._id;
                const isSelected = (selectedEvent?._id || selectedEvent?.id) === eventId;
                const isSaved = itinerary.some(item => (item._id || item.id) === eventId);

                return (
                  <motion.div
                    key={eventId}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => setSelectedEvent(event)}
                    className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer bg-white ${isSelected
                      ? 'ring-2 ring-emerald-500 border-transparent shadow-md'
                      : 'border-stone-200 hover:border-stone-300 hover:shadow-sm'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Event Calendar Date Stamp */}
                      <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-16 rounded-xl bg-stone-900 text-white font-mono border border-stone-800 shadow-sm">
                        <span className="text-[10px] text-stone-400 font-bold tracking-widest uppercase leading-none">
                          {formatMonthShort(event.month)}
                        </span>
                        <span className="text-xl font-bold mt-1 leading-none">{event.date}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono border uppercase ${getCategoryColor(event.category)}`}>
                            {event.category === 'cultural' && (language === 'en' ? 'Cultural' : 'ባህላዊ')}
                            {event.category === 'market' && (language === 'en' ? 'Market' : 'ገበያ')}
                            {event.category === 'holiday' && (language === 'en' ? 'Holiday' : 'በዓል')}
                            {event.category === 'investment' && (language === 'en' ? 'Investment' : 'ኢንቨስትመንት')}
                          </span>
                          {event.ethiopianDateStr && (
                            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 font-bold">
                              🇪🇹 {event.ethiopianDateStr}
                            </span>
                          )}
                          {event.isPopular && (
                            <span className="flex items-center gap-1 text-[9px] font-mono text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-100">
                              <Sparkles className="w-2.5 h-2.5 fill-current" /> {language === 'en' ? 'Popular' : 'ተፈላጊ'}
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-serif font-bold text-stone-900 mt-2 flex items-center gap-1.5 group-hover:text-emerald-800 transition-colors leading-snug">
                          {language === 'en' ? event.title : event.localTitle || event.title}
                        </h4>
                        {event.localTitle && language === 'en' && (
                          <span className="text-xs text-stone-400 font-serif block">
                            {event.localTitle}
                          </span>
                        )}

                        <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                          {event.description}
                        </p>

                        {/* Micro info bar */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                            {event.location}
                          </span>
                        </div>
                      </div>

                      {/* Add to Itinerary Quick Trigger Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isSaved) {
                            removeFromItinerary(eventId);
                          } else {
                            addToItinerary(event);
                          }
                        }}
                        className={`flex-shrink-0 p-2.5 rounded-xl border border-stone-200/60 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer ${isSaved
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                          }`}
                        title={isSaved ? 'Assigned to Itinerary' : 'Save Event to My Itinerary'}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: EVENT SUMMARY AND SELECTED DETAILS (4 cols) */}
      <div className="lg:col-span-4 space-y-6">

        {/* Selected Event Spotlight */}
        <AnimatePresence mode="wait">
          {selectedEvent ? (
            <motion.div
              key={selectedEvent._id || selectedEvent.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-stone-900 text-stone-100 p-6 rounded-3xl border border-stone-800 shadow-xl flex flex-col justify-between"
            >
              <div>
                <span className="text-emerald-400 text-[9px] tracking-widest font-mono uppercase block mb-1">{t.activeSpotlight}</span>
                <h3 className="text-xl font-serif text-white tracking-tight leading-snug">
                  {language === 'en' ? selectedEvent.title : selectedEvent.localTitle || selectedEvent.title}
                </h3>
                {selectedEvent.localTitle && language === 'en' && (
                  <span className="text-xs text-stone-400 font-serif leading-none mt-1 block">
                    {selectedEvent.localTitle}
                  </span>
                )}

                <div className="h-[1px] bg-stone-800 my-4"></div>

                <div className="space-y-3 font-mono text-[11px] text-stone-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span>
                      {selectedEvent.month} {selectedEvent.date}
                      {selectedEvent.ethiopianDateStr && ` (🇪🇹 ${selectedEvent.ethiopianDateStr})`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-500" />
                    <span>
                      {language === 'en' ? `Hosted by ${selectedEvent.organizer}` : `አዘጋጅ፡ ${selectedEvent.organizer}`}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed font-sans mt-4 bg-stone-950 p-4 rounded-xl border border-stone-800">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-800">
                {itinerary.some(item => (item._id || item.id) === (selectedEvent._id || selectedEvent.id)) ? (
                  <button
                    onClick={() => removeFromItinerary(selectedEvent._id)}
                    className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-400 font-mono text-xs hover:bg-rose-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> {t.removeFromItinerary}
                  </button>
                ) : (
                  <button
                    onClick={() => addToItinerary(selectedEvent)}
                    className="w-full bg-emerald-600 text-white font-mono text-xs font-bold py-2.5 rounded-xl hover:bg-emerald-500 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-white stroke-[3]" /> {t.addToItinerary}
                  </button>
                )}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Personal Visitor Itinerary Board */}
        <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-mono font-bold text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
              <BookmarkCheck className="w-4 h-4 text-emerald-600" /> {t.myItinerary}
            </h4>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
              {itinerary.length} {t.savedEvents}
            </span>
          </div>

          {itinerary.length > 0 ? (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {itinerary.map(item => {
                  const itemId = item._id
                  return (
                    <motion.div
                      key={itemId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-sm flex justify-between items-center gap-2 group hover:border-emerald-300 transition-all"
                    >
                      <div className="min-w-0">
                        <h5 className="text-xs font-serif font-bold text-stone-800 group-hover:text-emerald-900 truncate">
                          {language === 'en' ? item.title : item.localTitle || item.title}
                        </h5>
                        <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono mt-0.5">
                          <span className="text-emerald-600 font-bold">{item.month} {item.date}</span>
                          <span>•</span>
                          <span className="truncate">{item.location}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromItinerary(itemId)}
                        className="p-1.5 text-stone-300 hover:text-red-500 rounded-lg hover:bg-stone-50 transition-all flex-shrink-0 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div className="pt-2 text-center">
                <span className="text-[10px] text-stone-400 font-mono italic">
                  {language === 'en' ? 'Itinerary saved to your local browser storage!' : 'የጉዞ ዕቅድዎ በራሱ ጊዜ በኮምፒተርዎ ላይ ተቀምጧል!'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-stone-400 border border-dashed border-emerald-200 rounded-2xl bg-white/50">
              <Calendar className="w-8 h-8 text-stone-300 mx-auto mb-1.5 stroke-1" />
              <p className="text-xs italic font-serif">{t.emptyItinerary}</p>
              <p className="text-[10px] max-w-xs px-4 mx-auto text-stone-400 mt-1 leading-normal font-sans">
                {t.emptyItineraryDesc}
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
