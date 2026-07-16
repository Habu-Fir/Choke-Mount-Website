// src/components/admin/AdminInvestments.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    RefreshCw,
    FileText,
    Building2,
    User,
    Mail,
    Phone,
    Coins,
    ArrowLeft,
    Home,
    LogOut,
    X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { investmentService } from '../../services/api';
import { Investment } from '../../types';
import { authService } from '../../services/api';

export default function AdminInvestments() {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
        fetchInvestments();
    }, []);

    const fetchInvestments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await investmentService.getAll();
            if (response.success && response.data) {
                setInvestments(response.data);
            } else {
                setError(response.message || 'Failed to load investments');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await investmentService.updateStatus(id, status);
            setSuccessMsg(language === 'en' ? `Status updated to ${status}` : `ሁኔታው ወደ ${status} ተቀይሯል`);
            setTimeout(() => setSuccessMsg(null), 3000);
            fetchInvestments();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update status');
            setTimeout(() => setError(null), 3000);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            case 'reviewing': return 'bg-amber-100 text-amber-800 border-amber-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const getStatusLabel = (status: string) => {
        if (language === 'en') {
            switch (status) {
                case 'approved': return 'Approved';
                case 'rejected': return 'Rejected';
                case 'reviewing': return 'Under Review';
                default: return 'Pending';
            }
        } else {
            switch (status) {
                case 'approved': return 'ተፈቅዷል';
                case 'rejected': return 'ውድቅ ተደርጓል';
                case 'reviewing': return 'በግምገማ ላይ';
                default: return 'በመጠበቅ ላይ';
            }
        }
    };

    if (loading && investments.length === 0) {
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
                        {language === 'en' ? 'Manage Investments' : 'ኢንቨስትመንቶችን ያስተዳድሩ'}
                    </h1>
                    <p className="text-sm text-stone-500">
                        {language === 'en' ? 'Review and manage investment applications' : 'የኢንቨስትመንት ማመልከቻዎችን ይገምግሙ እና ያስተዳድሩ'}
                    </p>
                </div>
                <button
                    onClick={fetchInvestments}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-all"
                >
                    <RefreshCw className="w-4 h-4" />
                    {language === 'en' ? 'Refresh' : 'አድስ'}
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

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total', count: investments.length, color: 'bg-blue-50 text-blue-700' },
                    { label: 'Pending', count: investments.filter(i => i.status === 'pending').length, color: 'bg-amber-50 text-amber-700' },
                    { label: 'Approved', count: investments.filter(i => i.status === 'approved').length, color: 'bg-emerald-50 text-emerald-700' },
                    { label: 'Rejected', count: investments.filter(i => i.status === 'rejected').length, color: 'bg-red-50 text-red-700' }
                ].map((stat) => (
                    <div key={stat.label} className={`p-4 rounded-xl ${stat.color}`}>
                        <p className="text-sm font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.count}</p>
                    </div>
                ))}
            </div>

            {/* Investments List */}
            {investments.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center">
                    <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <p className="text-stone-500">
                        {language === 'en' ? 'No investment applications yet' : 'እስካሁን ምንም የኢንቨስትመንት ማመልከቻዎች አልተገኙም'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {investments.map((inv) => (
                        <div key={inv._id} className="bg-white p-4 rounded-2xl border border-stone-200 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <Building2 className="w-5 h-5 text-amber-600" />
                                        <h3 className="font-serif font-bold text-stone-900 truncate">{inv.companyName}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${getStatusColor(inv.status)}`}>
                                            {getStatusLabel(inv.status)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-stone-600 flex-wrap">
                                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {inv.investorName}</span>
                                        <span className="flex items-center gap-1"><Coins className="w-3 h-3" /> {inv.proposedBudget}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(inv.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-xs text-stone-500 line-clamp-2 mt-1">{inv.proposalBrief}</p>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => {
                                            setSelectedInvestment(inv);
                                            setShowDetailModal(true);
                                        }}
                                        className="p-2 hover:bg-amber-50 rounded-lg transition-all"
                                        title={language === 'en' ? 'View Details' : 'ዝርዝር ይመልከቱ'}
                                    >
                                        <Eye className="w-4 h-4 text-amber-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Investment Detail Modal */}
            <AnimatePresence>
                {showDetailModal && selectedInvestment && (
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
                                    {language === 'en' ? 'Investment Details' : 'የኢንቨስትመንት ዝርዝር'}
                                </h2>
                                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-stone-100 rounded-lg transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-mono text-stone-500 uppercase">Company</label>
                                        <p className="font-semibold">{selectedInvestment.companyName}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-mono text-stone-500 uppercase">Investor</label>
                                        <p className="font-semibold">{selectedInvestment.investorName}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-mono text-stone-500 uppercase">Email</label>
                                        <p className="flex items-center gap-1"><Mail className="w-4 h-4 text-stone-400" /> {selectedInvestment.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-mono text-stone-500 uppercase">Phone</label>
                                        <p className="flex items-center gap-1"><Phone className="w-4 h-4 text-stone-400" /> {selectedInvestment.phone}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-mono text-stone-500 uppercase">Sector</label>
                                    <p className="font-semibold">{selectedInvestment.sector}</p>
                                </div>

                                <div>
                                    <label className="text-xs font-mono text-stone-500 uppercase">Proposed Budget</label>
                                    <p className="text-lg font-bold text-amber-600">{selectedInvestment.proposedBudget}</p>
                                </div>

                                <div>
                                    <label className="text-xs font-mono text-stone-500 uppercase">Proposal Brief</label>
                                    <div className="bg-stone-50 p-3 rounded-xl max-h-32 overflow-y-auto">
                                        <p className="text-sm text-stone-700">{selectedInvestment.proposalBrief}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-mono text-stone-500 uppercase">Status</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedInvestment.status)}`}>
                                            {getStatusLabel(selectedInvestment.status)}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-stone-200">
                                    <label className="text-xs font-mono text-stone-500 uppercase block mb-2">Update Status</label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => handleStatusUpdate(selectedInvestment._id, 'pending')}
                                            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-all text-sm"
                                        >
                                            Pending
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedInvestment._id, 'reviewing')}
                                            className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl transition-all text-sm"
                                        >
                                            Reviewing
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedInvestment._id, 'approved')}
                                            className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl transition-all text-sm"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedInvestment._id, 'rejected')}
                                            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all text-sm"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}