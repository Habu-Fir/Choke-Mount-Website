// src/components/Admin/AdminUsers.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Users,
    UserPlus,
    Edit2,
    Trash2,
    X,
    Check,
    AlertCircle,
    Search,
    RefreshCw,
    Mail,
    Lock,
    User as UserIcon,
    Shield,
    MoreVertical,
    Loader2,
    Copy,
    Eye,
    EyeOff,
    Key,
    RefreshCcw
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api';
import { UserRole, ROLE_LABELS, ROLE_DESCRIPTIONS } from '../../types';

export default function AdminUsers() {
    const { language } = useLanguage();
    const { user: currentUser, isSuperAdmin } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [submitting, setSubmitting] = useState(false);
    const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Form state - NO password field
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'viewer' as UserRole,
        department: '',
    });

    // All available roles
    const allRoles: UserRole[] = [
        'super_admin',
        'gallery_admin',
        'news_admin',
        'history_admin',
        'entertainment_admin',
        'health_admin',
        'technology_admin',
        'vacancy_admin',
        'viewer'
    ];

    useEffect(() => {
        if (!isSuperAdmin) {
            setError(language === 'en'
                ? 'You do not have permission to manage users'
                : 'ተጠቃሚዎችን ለማስተዳደር ፈቃድ የሎትም'
            );
            return;
        }
        fetchUsers();
    }, [roleFilter, searchTerm, isSuperAdmin]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const params: any = {};
            if (roleFilter !== 'all') params.role = roleFilter;
            if (searchTerm) params.search = searchTerm;

            const response = await userService.getAll(params);
            if (response.success) {
                setUsers(response.data || []);
            } else {
                setError(response.message || 'Failed to load users');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            role: 'viewer',
            department: '',
        });
        setTemporaryPassword(null);
        setShowPassword(false);
        setEditingUser(null);
        setShowForm(false);
        setError(null);
        setSubmitting(false);
    };

    const handleEdit = (user: any) => {
        if (user.role === 'super_admin' && currentUser?._id !== user._id) {
            setError(language === 'en'
                ? 'Cannot edit another Super Admin'
                : 'ሌላ ልዕለ አስተዳዳሪ ማስተካከል አይቻልም'
            );
            return;
        }

        setEditingUser(user);
        setFormData({
            name: user.name || '',
            email: user.email || '',
            role: user.role || 'viewer',
            department: user.department || '',
        });
        setTemporaryPassword(null);
        setShowForm(true);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        if (!formData.name || !formData.email) {
            setError(language === 'en'
                ? 'Please fill in all required fields'
                : 'እባክዎት ሁሉንም አስፈላጊ መስኮች ይሙሉ'
            );
            setSubmitting(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError(language === 'en'
                ? 'Please enter a valid email address'
                : 'እባክዎት ትክክለኛ የኢሜይል አድራሻ ያስገቡ'
            );
            setSubmitting(false);
            return;
        }

        try {
            if (editingUser) {
                const updateData: any = {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    department: formData.department,
                };
                const response = await userService.update(editingUser._id, updateData);
                if (response.success) {
                    setSuccessMsg(language === 'en' ? 'User updated successfully!' : 'ተጠቃሚው በተሳካ ሁኔታ ተሻሽሏል!');
                    setTimeout(() => setSuccessMsg(null), 3000);
                    resetForm();
                    fetchUsers();
                }
            } else {
                // Create new user - backend will generate password
                // FIX: Don't include password field - use type assertion to bypass TypeScript
                const createData = {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    department: formData.department,
                } as any; // ← Type assertion to fix TypeScript error

                const response = await userService.create(createData);
                if (response.success) {
                    // Store the temporary password if returned
                    if (response.data?.temporaryPassword) {
                        setTemporaryPassword(response.data.temporaryPassword);
                    }
                    setSuccessMsg(language === 'en' ? 'User created successfully!' : 'ተጠቃሚው በተሳካ ሁኔታ ተፈጥሯል!');
                    setTimeout(() => setSuccessMsg(null), 3000);
                    fetchUsers();
                    // Don't close form immediately so user can see the password
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save user');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        const userToDelete = users.find(u => u._id === id);

        if (id === currentUser?._id) {
            setError(language === 'en'
                ? 'You cannot delete your own account'
                : 'የራስዎን መለያ መሰረዝ አይቻልም'
            );
            return;
        }

        if (userToDelete?.role === 'super_admin') {
            setError(language === 'en'
                ? 'Cannot delete a Super Admin'
                : 'ልዕለ አስተዳዳሪን መሰረዝ አይቻልም'
            );
            return;
        }

        if (!confirm(language === 'en' ? 'Delete this user?' : 'ይህን ተጠቃሚ መሰረዝ ይፈልጋሉ?')) return;

        try {
            const response = await userService.delete(id);
            if (response.success) {
                setSuccessMsg(language === 'en' ? 'User deleted!' : 'ተጠቃሚው ተሰርዟል!');
                setTimeout(() => setSuccessMsg(null), 3000);
                fetchUsers();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleRegeneratePassword = async (userId: string) => {
        try {
            const response = await userService.regeneratePassword(userId);
            if (response.success) {
                setTemporaryPassword(response.data.temporaryPassword);
                setSuccessMsg(language === 'en' ? 'New password generated!' : 'አዲስ የይለፍ ቃል ተፈጥሯል!');
                setTimeout(() => setSuccessMsg(null), 3000);
                fetchUsers();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to regenerate password');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setSuccessMsg(language === 'en' ? 'Password copied to clipboard!' : 'የይለፍ ቃሉ ተገልብጧል!');
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    const getRoleLabel = (role: string) => {
        return ROLE_LABELS[role as UserRole] || role;
    };

    const getRoleColor = (role: string) => {
        const colors: Record<string, string> = {
            super_admin: 'bg-purple-100 text-purple-800 border-purple-200',
            gallery_admin: 'bg-pink-100 text-pink-800 border-pink-200',
            news_admin: 'bg-blue-100 text-blue-800 border-blue-200',
            history_admin: 'bg-amber-100 text-amber-800 border-amber-200',
            entertainment_admin: 'bg-rose-100 text-rose-800 border-rose-200',
            health_admin: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            technology_admin: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            vacancy_admin: 'bg-cyan-100 text-cyan-800 border-cyan-200',
            viewer: 'bg-stone-100 text-stone-800 border-stone-200',
        };
        return colors[role] || colors.viewer;
    };

    const getRoleDescription = (role: string) => {
        return ROLE_DESCRIPTIONS[role as UserRole] || '';
    };

    if (!isSuperAdmin) {
        return (
            <div className="ml-64 p-8">
                <div className="bg-amber-50 border border-amber-200 text-amber-700 p-8 rounded-2xl text-center max-w-2xl mx-auto">
                    <Shield className="w-16 h-16 mx-auto mb-4 text-amber-500" />
                    <h2 className="text-2xl font-serif font-bold mb-2">
                        {language === 'en' ? 'Access Denied' : 'መድረሻ አልተፈቀደም'}
                    </h2>
                    <p>{language === 'en'
                        ? 'You do not have permission to manage users.'
                        : 'ተጠቃሚዎችን ለማስተዳደር ፈቃድ የሎትም።'}</p>
                </div>
            </div>
        );
    }

    if (loading && users.length === 0) {
        return (
            <div className="ml-64 p-8 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="ml-64 p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-stone-900">
                        {language === 'en' ? 'Manage Users' : 'ተጠቃሚዎችን ያስተዳድሩ'}
                    </h1>
                    <p className="text-sm text-stone-500 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amber-500" />
                        {language === 'en'
                            ? 'Super Admin - Create, edit and manage all user accounts'
                            : 'ልዕለ አስተዳዳሪ - ሁሉንም የተጠቃሚ መለያዎች ይፍጠሩ፣ ያስተካክሉ እና ያስተዳድሩ'}
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl transition-all font-medium"
                >
                    <UserPlus className="w-4 h-4" />
                    {language === 'en' ? 'Add User' : 'ተጠቃሚ ይጨምሩ'}
                </button>
            </div>

            {/* Success/Error Messages */}
            {successMsg && (
                <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    {successMsg}
                </div>
            )}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                        type="text"
                        placeholder={language === 'en' ? 'Search users...' : 'ተጠቃሚዎችን ይፈልጉ...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                    <option value="all">{language === 'en' ? 'All Roles' : 'ሁሉም ሚናዎች'}</option>
                    {allRoles.map((role) => (
                        <option key={role} value={role}>{getRoleLabel(role)}</option>
                    ))}
                </select>
                <button
                    onClick={fetchUsers}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-all flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    {language === 'en' ? 'Refresh' : 'አድስ'}
                </button>
            </div>

            {/* Users List */}
            {users.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center">
                    <Users className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <p className="text-stone-500">
                        {language === 'en' ? 'No users found' : 'ምንም ተጠቃሚዎች አልተገኙም'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-stone-50 border-b border-stone-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-mono text-stone-500 uppercase tracking-wider">User</th>
                                    <th className="text-left px-6 py-3 text-xs font-mono text-stone-500 uppercase tracking-wider">Email</th>
                                    <th className="text-left px-6 py-3 text-xs font-mono text-stone-500 uppercase tracking-wider">Role</th>
                                    <th className="text-left px-6 py-3 text-xs font-mono text-stone-500 uppercase tracking-wider">Department</th>
                                    <th className="text-left px-6 py-3 text-xs font-mono text-stone-500 uppercase tracking-wider">Status</th>
                                    <th className="text-right px-6 py-3 text-xs font-mono text-stone-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {users.map((user) => {
                                    const isCurrentUser = user._id === currentUser?._id;
                                    const isSuperAdminUser = user.role === 'super_admin';
                                    const canEdit = !isSuperAdminUser || isCurrentUser;
                                    const canDelete = !isSuperAdminUser && !isCurrentUser;

                                    return (
                                        <tr key={user._id} className="hover:bg-stone-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                                                        <UserIcon className="h-5 w-5 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-stone-900">{user.name}</span>
                                                        {isCurrentUser && (
                                                            <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                                                {language === 'en' ? 'You' : 'እርስዎ'}
                                                            </span>
                                                        )}
                                                        {user.mustChangePassword && (
                                                            <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                                                {language === 'en' ? 'Must Change Password' : 'የይለፍ ቃል መቀየር አለበት'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-stone-600">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-mono border ${getRoleColor(user.role)}`}>
                                                    {getRoleLabel(user.role)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-stone-600">{user.department || '-'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-mono border ${user.isActive
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        : 'bg-red-50 text-red-700 border-red-200'
                                                    }`}>
                                                    {user.isActive
                                                        ? (language === 'en' ? 'Active' : 'ንቁ')
                                                        : (language === 'en' ? 'Inactive' : 'እንቅስቃሴ የለም')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {canEdit && (
                                                        <button
                                                            onClick={() => handleEdit(user)}
                                                            className="p-2 hover:bg-stone-100 rounded-lg transition-all"
                                                            title={language === 'en' ? 'Edit' : 'አስተካክል'}
                                                        >
                                                            <Edit2 className="w-4 h-4 text-stone-600" />
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button
                                                            onClick={() => handleDelete(user._id)}
                                                            className="p-2 hover:bg-red-50 rounded-lg transition-all"
                                                            title={language === 'en' ? 'Delete' : 'ሰርዝ'}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                        </button>
                                                    )}
                                                    {!isCurrentUser && (
                                                        <button
                                                            onClick={() => handleRegeneratePassword(user._id)}
                                                            className="p-2 hover:bg-amber-50 rounded-lg transition-all"
                                                            title={language === 'en' ? 'Regenerate Password' : 'የይለፍ ቃል እንደገና ያዘጋጁ'}
                                                        >
                                                            <RefreshCcw className="w-4 h-4 text-amber-600" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create/Edit User Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                        onClick={() => {
                            if (!temporaryPassword) resetForm();
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-serif font-bold text-stone-900">
                                    {editingUser
                                        ? (language === 'en' ? 'Edit User' : 'ተጠቃሚ ያስተካክሉ')
                                        : (language === 'en' ? 'Create User' : 'አዲስ ተጠቃሚ ይፍጠሩ')}
                                </h2>
                                <button
                                    onClick={() => {
                                        if (!temporaryPassword) resetForm();
                                    }}
                                    className="p-2 hover:bg-stone-100 rounded-lg transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">
                                        {language === 'en' ? 'Full Name' : 'ሙሉ ስም'} *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder={language === 'en' ? 'e.g. John Doe' : 'ለምሳሌ፡ አበበ ከበደ'}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">
                                        {language === 'en' ? 'Email Address' : 'ኢሜይል አድራሻ'} *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">
                                        {language === 'en' ? 'Role' : 'ሚና'} *
                                    </label>
                                    <select
                                        required
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                                        className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        {allRoles.map((role) => (
                                            <option key={role} value={role}>
                                                {getRoleLabel(role)}
                                            </option>
                                        ))}
                                    </select>
                                    {formData.role && (
                                        <p className="text-xs text-stone-400 mt-1">
                                            {getRoleDescription(formData.role)}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">
                                        {language === 'en' ? 'Department' : 'ክፍል'}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder={language === 'en' ? 'e.g. IT Department' : 'ለምሳሌ፡ የአይቲ ክፍል'}
                                    />
                                </div>

                                {temporaryPassword && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium text-amber-800">
                                                {language === 'en' ? 'Temporary Password' : 'ጊዜያዊ የይለፍ ቃል'}
                                            </label>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="text-amber-600 hover:text-amber-800"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(temporaryPassword)}
                                                    className="text-amber-600 hover:text-amber-800"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-amber-200 font-mono text-lg text-center text-amber-900">
                                            {showPassword ? temporaryPassword : '•'.repeat(temporaryPassword.length)}
                                        </div>
                                        <p className="text-xs text-amber-600 mt-2">
                                            {language === 'en'
                                                ? 'Please copy this password and share it with the user securely.'
                                                : 'እባክዎት ይህን የይለፍ ቃል ይቅዱ እና ለተጠቃሚው በደህንነት ያሳውቁ።'}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                resetForm();
                                                fetchUsers();
                                            }}
                                            className="mt-3 w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-all text-sm font-medium"
                                        >
                                            {language === 'en' ? 'Done, Close' : 'ተጠናቅቋል፣ ዝጋ'}
                                        </button>
                                    </div>
                                )}

                                {!temporaryPassword && (
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-medium rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                            {editingUser
                                                ? (language === 'en' ? 'Update User' : 'ተጠቃሚ ያሻሽሉ')
                                                : (language === 'en' ? 'Create User' : 'ተጠቃሚ ይፍጠሩ')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="py-3 px-6 bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium rounded-xl transition-all"
                                        >
                                            {language === 'en' ? 'Cancel' : 'ይቅር'}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}