// src/components/admin/AdminEvents.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Plus,
    Edit2,
    Trash2,
    X,
    Calendar,
    Clock,
    MapPin,
    User,
    AlertCircle,
    CheckCircle,
    RefreshCw,
    Eye,
    ArrowLeft,
    Home,
    LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { eventService } from '../../services/api';
import { EventItem } from '../../types';
import { authService } from '../../services/api';

export default function AdminEvents() {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        localTitle: '',
        date: '',
        month: '',
        ethiopianDateStr: '',
        category: 'cultural' as 'cultural' | 'market' | 'holiday' | 'investment',
        description: '',
        location: '',
        time: '',
        organizer: '',
        isPopular: false
    });

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

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await eventService.getAll();
            if (response.success && response.data) {
                setEvents(response.data);
            } else {
                setError(response.message || 'Failed to load events');
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
            date: '',
            month: '',
            ethiopianDateStr: '',
            category: 'cultural',
            description: '',
            location: '',
            time: '',
            organizer: '',
            isPopular: false
        });
        setEditingEvent(null);
        setShowForm(false);
    };

    const handleEdit = (event: EventItem) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            localTitle: event.localTitle || '',
            date: event.date.toString(),
            month: event.month,
            ethiopianDateStr: event.ethiopianDateStr || '',
            category: event.category,
            description: event.description,
            location: event.location,
            time: event.time,
            organizer: event.organizer,
            isPopular: event.isPopular || false
        });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const submitData = {
                ...formData,
                date: parseInt(formData.date)
            };

            if (editingEvent) {
                await eventService.update(editingEvent._id, submitData);
                setSuccessMsg(language === 'en' ? 'Event updated successfully!' : 'ዝግጅቱ በተሳካ ሁኔታ ተሻሽሏል!');
            } else {
                await eventService.create(submitData);
                setSuccessMsg(language === 'en' ? 'Event created successfully!' : 'አዲስ ዝግጅት ተፈጥሯል!');
            }

            setTimeout(() => setSuccessMsg(null), 3000);
            resetForm();
            fetchEvents();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save event');
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(language === 'en' ? 'Delete this event?' : 'ይህን ዝግጅት መሰረዝ ይፈልጋሉ?')) return;

        try {
            await eventService.delete(id);
            setSuccessMsg(language === 'en' ? 'Event deleted!' : 'ዝግጅቱ ተሰርዟል!');
            setTimeout(() => setSuccessMsg(null), 3000);
            fetchEvents();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete event');
            setTimeout(() => setError(null), 3000);
        }
    };

    const viewEventDetails = (event: EventItem) => {
        setSelectedEvent(event);
        setShowDetailModal(true);
    };

    const categories = [
        { value: 'cultural', label: language === 'en' ? 'Cultural' : 'ባህላዊ' },
        { value: 'market', label: language === 'en' ? 'Market' : 'ገበያ' },
        { value: 'holiday', label: language === 'en' ? 'Holiday' : 'በዓል' },
        { value: 'investment', label: language === 'en' ? 'Investment' : 'ኢንቨስትመንት' }
    ];

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    if (loading && events.length === 0) {
        return (
            <div className="ml-64 p-8 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="ml-64 p-8">
            {/* Navigation Bar */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={goBack}
                        className="p-2 hover:bg-stone-100 rounded-lg transition-all flex items-center gap-2 text-stone-600"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">{language === 'en' ? 'Back' : 'ተመለስ'}</span>
                    </button>
                    <button
                        onClick={goHome}
                        className="p-2 hover:bg-stone-100 rounded-lg transition-all flex items-center gap-2 text-stone-600"
                    >
                        <Home className="w-4 h-4" />
                        <span className="text-sm">{language === 'en' ? 'Home' : 'መነሻ'}</span>
                    </button>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all text-sm"
                >
                    <LogOut className="w-4 h-4" />
                    <span>{language === 'en' ? 'Logout' : 'ውጣ'}</span>
                </button>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-stone-900">
                        {language === 'en' ? 'Manage Events' : 'ዝግጅቶችን ያስተዳድሩ'}
                    </h1>
                    <p className="text-sm text-stone-500">
                        {language === 'en' ? 'Create, edit and delete cultural events' : 'ባህላዊ ዝግጅቶችን ይፍጠሩ፣ ያስተካክሉ እና ይሰርዙ'}
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl transition-all font-medium"
                >
                    <Plus className="w-4 h-4" />
                    {language === 'en' ? 'New Event' : 'አዲስ ዝግጅት'}
                </button>
            </div>

            {/* Success/Error Messages */}
            {successMsg && (
                <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {successMsg}
                </div>
            )}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* Events List */}
            {events.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center">
                    <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <p className="text-stone-500">
                        {language === 'en' ? 'No events created yet' : 'እስካሁን ምንም ዝግጅቶች አልተፈጠሩም'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {events.map((event) => (
                        <div key={event._id} className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between hover:shadow-md transition-all">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="flex-shrink-0 w-12 h-14 bg-stone-900 text-white rounded-xl flex flex-col items-center justify-center text-center">
                                    <span className="text-[10px] font-mono text-stone-400 uppercase">{event.month.substring(0, 3)}</span>
                                    <span className="text-lg font-bold">{event.date}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${event.category === 'cultural' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                            event.category === 'market' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                                event.category === 'holiday' ? 'bg-purple-50 border-purple-200 text-purple-700' :
                                                    'bg-blue-50 border-blue-200 text-blue-700'
                                            }`}>
                                            {event.category}
                                        </span>
                                        {event.isPopular && (
                                            <span className="text-[10px] bg-rose-50 border border-rose-200 text-rose-700 px-2 py-0.5 rounded-md">★ Popular</span>
                                        )}
                                    </div>
                                    <h3 className="font-serif font-bold text-stone-900 truncate">
                                        {language === 'en' ? event.title : event.localTitle || event.title}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs text-stone-500">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => viewEventDetails(event)}
                                    className="p-2 hover:bg-amber-50 rounded-lg transition-all"
                                    title={language === 'en' ? 'View Details' : 'ዝርዝር ይመልከቱ'}
                                >
                                    <Eye className="w-4 h-4 text-amber-600" />
                                </button>
                                <button
                                    onClick={() => handleEdit(event)}
                                    className="p-2 hover:bg-stone-100 rounded-lg transition-all"
                                >
                                    <Edit2 className="w-4 h-4 text-stone-600" />
                                </button>
                                <button
                                    onClick={() => handleDelete(event._id)}
                                    className="p-2 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Event Detail Modal */}
            <AnimatePresence>
                {showDetailModal && selectedEvent && (
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
                            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b border-stone-100">
                                <h2 className="text-xl font-serif font-bold text-stone-900">
                                    {language === 'en' ? 'Event Details' : 'የዝግጅት ዝርዝር'}
                                </h2>
                                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-stone-100 rounded-lg transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-mono text-stone-500 uppercase">Title</label>
                                    <p className="font-serif font-bold text-2xl">{selectedEvent.title}</p>
                                    {selectedEvent.localTitle && (
                                        <p className="text-sm text-stone-500">{selectedEvent.localTitle}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-mono text-stone-500 uppercase">Date</label>
                                        <p className="font-semibold">{selectedEvent.month} {selectedEvent.date}</p>
                                        {selectedEvent.ethiopianDateStr && (
                                            <p className="text-sm text-stone-500">🇪🇹 {selectedEvent.ethiopianDateStr}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-mono text-stone-500 uppercase">Category</label>
                                        <p className="font-semibold">{selectedEvent.category}</p>
                                        {selectedEvent.isPopular && (
                                            <span className="text-xs text-rose-600">★ Popular</span>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-mono text-stone-500 uppercase">Time</label>
                                        <p className="font-semibold">{selectedEvent.time}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-mono text-stone-500 uppercase">Organizer</label>
                                        <p className="font-semibold">{selectedEvent.organizer}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-mono text-stone-500 uppercase">Location</label>
                                    <p className="font-semibold flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-600" /> {selectedEvent.location}</p>
                                </div>

                                <div>
                                    <label className="text-xs font-mono text-stone-500 uppercase">Description</label>
                                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 max-h-48 overflow-y-auto">
                                        <p className="text-sm text-stone-700 whitespace-pre-wrap">{selectedEvent.description}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-stone-200">
                                    <button
                                        onClick={() => {
                                            setShowDetailModal(false);
                                            handleEdit(selectedEvent);
                                        }}
                                        className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        {language === 'en' ? 'Edit Event' : 'ዝግጅት ያስተካክሉ'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDetailModal(false);
                                            handleDelete(selectedEvent._id);
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

            {/* Create/Edit Modal - Same as before */}
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
                            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* ... Same form content as before ... */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-serif font-bold text-stone-900">
                                    {editingEvent ? (language === 'en' ? 'Edit Event' : 'ዝግጅት ያስተካክሉ') : (language === 'en' ? 'Create Event' : 'አዲስ ዝግጅት ይፍጠሩ')}
                                </h2>
                                <button onClick={resetForm} className="p-2 hover:bg-stone-100 rounded-lg transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* ... Same form fields as before ... */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">
                                            {language === 'en' ? 'Title (English)' : 'ርዕስ (እንግሊዝኛ)'} *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="e.g. Timkat Equestrian Tournament"
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
                                            className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="ለምሳሌ፡ የጥምቀት ፈረሰኞች ውድድር"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">
                                            {language === 'en' ? 'Date (Day)' : 'ቀን'} *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            max="31"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">
                                            {language === 'en' ? 'Month' : 'ወር'} *
                                        </label>
                                        <select
                                            required
                                            value={formData.month}
                                            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                                            className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        >
                                            <option value="">Select month</option>
                                            {months.map((m) => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">
                                            {language === 'en' ? 'Ethiopian Date' : 'የኢትዮጵያ ቀን'}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.ethiopianDateStr}
                                            onChange={(e) => setFormData({ ...formData, ethiopianDateStr: e.target.value })}
                                            className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="e.g. Tir 11"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">
                                            {language === 'en' ? 'Category' : 'ምድብ'} *
                                        </label>
                                        <select
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                            className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        >
                                            {categories.map((c) => (
                                                <option key={c.value} value={c.value}>{c.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">
                                            {language === 'en' ? 'Location' : 'ቦታ'} *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="e.g. Digo Tsion Equestrian Grounds"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">
                                            {language === 'en' ? 'Time' : 'ሰዓት'} *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="e.g. 2:00 PM - 6:00 PM"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">
                                            {language === 'en' ? 'Organizer' : 'አዘጋጅ'} *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.organizer}
                                            onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                                            className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="e.g. Bibugn Culture & Sports Association"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">
                                        {language === 'en' ? 'Description' : 'መግለጫ'} *
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                                        placeholder="Describe the event..."
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isPopular"
                                        checked={formData.isPopular}
                                        onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                                        className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                                    />
                                    <label htmlFor="isPopular" className="text-sm text-stone-700">
                                        {language === 'en' ? 'Mark as Popular Event' : 'እንደ ታዋቂ ዝግጅት ምልክት ያድርጉ'}
                                    </label>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-medium rounded-xl transition-all"
                                    >
                                        {editingEvent ? (language === 'en' ? 'Update Event' : 'ዝግጅቱን ያሻሽሉ') : (language === 'en' ? 'Create Event' : 'ዝግጅት ይፍጠሩ')}
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
    );
}