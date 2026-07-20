// src/components/Admin/AdminLogin.tsx - Emerald/Green Theme with Back Button
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Eye, EyeOff, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const { language } = useLanguage();
    const { login, loading: authLoading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || '/admin';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!email || !password) {
            setError(language === 'en'
                ? 'Please enter both email and password'
                : 'እባክዎት ኢሜይል እና የይለፍ ቃል ያስገቡ'
            );
            setLoading(false);
            return;
        }

        try {
            const result = await login(email, password);

            if (result.success) {
                if (result.mustChangePassword) {
                    navigate('/admin/change-password');
                    return;
                }
                navigate(from, { replace: true });
            } else {
                if (result.error?.includes('401') || result.error?.includes('Invalid credentials')) {
                    setError(language === 'en'
                        ? 'Invalid email or password. Please try again.'
                        : 'የኢሜይል ወይም የይለፍ ቃል ስህተት ነው። እባክዎት እንደገና ይሞክሩ።'
                    );
                } else {
                    setError(result.error || (language === 'en'
                        ? 'Login failed. Please try again.'
                        : 'መግቢያ አልተሳካም። እባክዎት እንደገና ይሞክሩ።'
                    ));
                }
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || (language === 'en'
                ? 'An error occurred. Please try again.'
                : 'ስህተት ተከስቷል። እባክዎት እንደገና ይሞክሩ።'
            ));
        } finally {
            setLoading(false);
        }
    };

    const goHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-emerald-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* Back to Home Button - Top Left */}
            <button
                onClick={goHome}
                className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-700 rounded-xl transition-all shadow-md hover:shadow-lg border border-emerald-200 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">
                    {language === 'en' ? 'Back to Home' : 'ወደ መነሻ ተመለስ'}
                </span>
            </button>

            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-emerald-200">
                <div className="text-center">
                    <div className="h-16 w-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="mt-6 text-3xl font-serif font-bold text-stone-900">
                        {language === 'en' ? 'Admin Login' : 'የአስተዳዳሪ መግቢያ'}
                    </h2>
                    <p className="mt-2 text-sm text-stone-600">
                        {language === 'en' ? 'Sign in to manage content' : 'ይዘትን ለማስተዳደር ይግቡ'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                                {language === 'en' ? 'Email Address' : 'ኢሜይል አድራሻ'}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-emerald-500" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-emerald-50/30 hover:bg-emerald-50/50"
                                    placeholder={language === 'en' ? 'Enter your email' : 'ኢሜይልዎን ያስገቡ'}
                                    disabled={loading || authLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">
                                {language === 'en' ? 'Password' : 'የይለፍ ቃል'}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-emerald-500" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-emerald-50/30 hover:bg-emerald-50/50"
                                    placeholder={language === 'en' ? 'Enter your password' : 'የይለፍ ቃልዎን ያስገቡ'}
                                    disabled={loading || authLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-stone-400 hover:text-emerald-600 transition-colors"
                                    disabled={loading || authLoading}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || authLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 hover:shadow-emerald-300"
                    >
                        {(loading || authLoading) ? (
                            <>
                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                                {language === 'en' ? 'Signing in...' : 'በመግባት ላይ...'}
                            </>
                        ) : (
                            language === 'en' ? 'Sign In' : 'ግባ'
                        )}
                    </button>
                </form>

                <div className="text-center text-xs text-stone-500 bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                    {/* <p className="font-mono">
                        {language === 'en'
                            ? 'Default: superadmin@digotsion.com / superadmin123'
                            : 'ነባሪ፡ superadmin@digotsion.com / superadmin123'}
                    </p> */}
                </div>

                {/* Home link at bottom */}
                <div className="text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-800 transition-colors group"
                    >
                        <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                        {language === 'en' ? 'Return to Homepage' : 'ወደ መነሻ ገጽ ተመለስ'}
                    </Link>
                </div>
            </div>
        </div>
    );
}