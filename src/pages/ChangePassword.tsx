// src/pages/ChangePassword.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ArrowLeft,
  Shield
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

export default function ChangePassword() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError(language === 'en' 
        ? 'Passwords do not match' 
        : 'የይለፍ ቃላቶች አይመሳሰሉም'
      );
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError(language === 'en' 
        ? 'Password must be at least 6 characters' 
        : 'የይለፍ ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት'
      );
      setLoading(false);
      return;
    }

    try {
      const response = await authService.changePassword({
        currentPassword,
        newPassword,
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          // Logout and redirect to login
          logout();
          navigate('/admin/login');
        }, 3000);
      } else {
        setError(response.message || 'Failed to change password');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-stone-950" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            {language === 'en' ? 'Change Password' : 'የይለፍ ቃል ይቀይሩ'}
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            {language === 'en' 
              ? 'You must change your temporary password before continuing.' 
              : 'ከመቀጠልዎ በፊት ጊዜያዊ የይለፍ ቃልዎን መቀየር አለብዎት።'}
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
            <Check className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-emerald-800">
              {language === 'en' ? 'Password Changed!' : 'የይለፍ ቃል ተቀይሯል!'}
            </h3>
            <p className="text-sm text-emerald-600">
              {language === 'en' 
                ? 'Redirecting to login...' 
                : 'ወደ መግቢያ ገጽ እየተዘዋወረ ነው...'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                {language === 'en' ? 'Current Password' : 'አሁን ያለው የይለፍ ቃል'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder={language === 'en' ? 'Enter current password' : 'አሁን ያለውን የይለፍ ቃል ያስገቡ'}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                {language === 'en' ? 'New Password' : 'አዲስ የይለፍ ቃል'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder={language === 'en' ? 'Enter new password' : 'አዲስ የይለፍ ቃል ያስገቡ'}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                {language === 'en' ? 'Confirm New Password' : 'አዲሱን የይለፍ ቃል ያረጋግጡ'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder={language === 'en' ? 'Confirm new password' : 'አዲሱን የይለፍ ቃል ያረጋግጡ'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-stone-950 border-t-transparent"></span>
                  {language === 'en' ? 'Changing...' : 'በመቀየር ላይ...'}
                </>
              ) : (
                language === 'en' ? 'Change Password' : 'የይለፍ ቃል ቀይር'
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}