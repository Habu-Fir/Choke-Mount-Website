// src/components/layout/Navbar.tsx - Fixed Language Toggle
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
    Search,
    Heart,
    User,
    Globe,
    Menu,
    X
} from 'lucide-react';

interface NavbarProps {
    activeTab: string;
    setActiveTab: (tab: any) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
    const { language, setLanguage, t } = useLanguage();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setIsMobileMenuOpen(false);
    };

    const navItems = [
        { id: 'news', label: language === 'en' ? 'News ' : 'ዜና ', anchor: 'map-tabs-nav' },
        { id: 'map', label: language === 'en' ? 'Map & History' : 'ካርታ እና ታሪክ', anchor: 'map-tabs-nav' },
        { id: 'events', label: language === 'en' ? 'Cultural Calendar' : 'ባህላዊ ቀን መቁጠሪያ', anchor: 'event-tabs-nav' },
        { id: 'gallery', label: language === 'en' ? 'Photo Gallery' : 'የፎቶ ማህደር', anchor: 'gallery-tabs-nav' },
        { id: 'investor', label: language === 'en' ? 'Investment Portal' : 'የኢንቨስትመንት በር', anchor: 'investor-tabs-nav' },
        { id: 'chat', label: language === 'en' ? 'Ask DigoAI' : 'ዲጎአይ ይጠይቁ', anchor: 'chat-tabs-nav' },
    ];

    const handleNavClick = (item: typeof navItems[0]) => {
        setActiveTab(item.id as any);
        scrollToSection(item.anchor);
    };

    const toggleLanguage = () => setLanguage(language === 'en' ? 'am' : 'en');

    return (
        <>
            {/* Top Announcement Bar */}
            <div className="hidden sm:block bg-emerald-800 text-white text-[13px]">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 h-9 flex items-center justify-between">
                    <span>
                        {language === 'en' ? 'Serving Bibugn District' : 'ቢቡኝ ወረዳን በማገልገል ላይ'}{' '}
                        <button
                            onClick={() => { setActiveTab('news'); scrollToSection('map-tabs-nav'); }}
                            className="underline underline-offset-2 hover:text-emerald-200 transition-colors"
                        >
                            {language === 'en' ? 'Learn more' : 'ተጨማሪ ይመልከቱ'}
                        </button>
                    </span>
                    <span>
                        {language === 'en' ? '24/7 AI Assistant available' : '24/7 የዲጎ ኤአይ'}{' '}
                        <button
                            onClick={() => { setActiveTab('chat'); scrollToSection('chat-tabs-nav'); }}
                            className="underline underline-offset-2 hover:text-emerald-200 transition-colors"
                        >
                            {language === 'en' ? 'Ask now' : 'አሁን ይጠይቁ'}
                        </button>
                    </span>
                    <span>
                        {language === 'en' ? 'Have an investment idea?' : 'የኢንቨስትመንት ሃሳብ አለዎት?'}{' '}
                        <button
                            onClick={() => { setActiveTab('investor'); scrollToSection('investor-tabs-nav'); }}
                            className="underline underline-offset-2 hover:text-emerald-200 transition-colors"
                        >
                            {language === 'en' ? 'Find out more' : 'ተጨማሪ ይመልከቱ'}
                        </button>
                    </span>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className="sticky top-0 z-50 bg-white">
                {/* Middle row - 3-column grid: [mobile toggle] [logo] [icons] */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                    <div className="grid grid-cols-[auto_1fr_auto] items-center h-20 sm:h-24 gap-4">
                        {/* Left cell: mobile menu toggle only (empty on desktop) */}
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-emerald-50 transition-colors"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="w-6 h-6 text-stone-700" />
                                ) : (
                                    <Menu className="w-6 h-6 text-stone-700" />
                                )}
                            </button>
                        </div>

                        {/* Center cell: logo, always centered */}
                        <div
                            className="flex items-baseline gap-0.5 cursor-pointer justify-self-center rounded-lg px-2 py-1 -mx-2 hover:bg-emerald-50 transition-colors"
                            onClick={() => {
                                setActiveTab('news');
                                scrollToSection('map-tabs-nav');
                            }}
                        >
                            <span className="font-serif font-extrabold text-2xl sm:text-3xl tracking-tight leading-none text-emerald-800">
                                ጮቄን
                            </span>
                            <span className="font-serif font-extrabold text-2xl sm:text-3xl tracking-tight leading-none text-lime-500 ml-1.5">
                                ይጎብኙ
                            </span>
                        </div>

                        {/* Right cell: search, favorites, account, language - pinned right */}
                        <div className="flex items-center gap-1 sm:gap-2 justify-self-end">
                            <button
                                className="hidden sm:inline-flex items-center gap-2 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg px-2.5 py-2 transition-colors"
                            >
                                <Search className="w-5 h-5" strokeWidth={1.75} />
                                <span className="text-sm">{language === 'en' ? 'Search' : 'ፈልግ'}</span>
                            </button>
                            <button
                                className="sm:hidden text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg p-2 transition-colors"
                                aria-label={language === 'en' ? 'Search' : 'ፈልግ'}
                            >
                                <Search className="w-5 h-5" strokeWidth={1.75} />
                            </button>

                            {/* Heart - desktop only */}
                            <button
                                onClick={() => { setActiveTab('gallery'); scrollToSection('gallery-tabs-nav'); }}
                                className="hidden sm:inline-flex text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg p-2 transition-colors"
                                aria-label={language === 'en' ? 'Favorites' : 'ተወዳጆች'}
                            >
                                <Heart className="w-5 h-5" strokeWidth={1.75} />
                            </button>

                            {/* Language toggle - mobile: shows opposite language */}
                            <button
                                onClick={toggleLanguage}
                                className="sm:hidden flex items-center gap-1 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg px-2.5 py-2 transition-colors"
                                aria-label={language === 'en' ? 'Switch to Amharic' : 'Switch to English'}
                            >
                                <Globe className="w-5 h-5" strokeWidth={1.75} />
                                <span className="text-sm font-bold font-mono">
                                    {language === 'en' ? 'አማ' : 'EN'}
                                </span>
                            </button>

                            {/* User/Admin Icon - Now linked to admin route */}
                            <Link
                                to="/admin"
                                className="text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg p-2 transition-colors"
                                aria-label={language === 'en' ? 'Admin portal' : 'የአስተዳደር በር'}
                            >
                                <User className="w-5 h-5" strokeWidth={1.75} />
                            </Link>

                            {/* Language toggle - desktop: shows opposite language */}
                            <button
                                onClick={toggleLanguage}
                                className="hidden sm:inline-flex items-center gap-1.5 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg px-2.5 py-2 transition-colors"
                                aria-label={language === 'en' ? 'Switch to Amharic' : 'Switch to English'}
                            >
                                <Globe className="w-5 h-5" strokeWidth={1.75} />
                                <span className="text-sm font-bold font-mono">
                                    {language === 'en' ? 'አማ' : 'EN'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom row - centered text nav links (desktop) */}
                <div className="hidden lg:block border-t border-stone-100">
                    <div className="max-w-7xl mx-auto px-10 flex items-center justify-center gap-2 h-12">
                        {navItems.map((item) => {
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item)}
                                    className={`relative text-[13px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-lg transition-colors ${isActive ? 'text-emerald-800' : 'text-stone-600 hover:text-emerald-700 hover:bg-emerald-50'
                                        }`}
                                >
                                    {item.label}
                                    {isActive && (
                                        <span className="absolute -bottom-3.5 left-4 right-4 h-0.5 bg-emerald-700 rounded-full"></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="border-b border-stone-100" />

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-stone-100 shadow-lg">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-1">
                            {navItems.map((item) => {
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleNavClick(item)}
                                        className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${isActive
                                            ? 'bg-emerald-700 text-white'
                                            : 'text-stone-700 hover:bg-emerald-50 hover:text-emerald-700'
                                            }`}
                                    >
                                        {item.label}
                                        {isActive && <span className="ml-auto text-xs">✓</span>}
                                    </button>
                                );
                            })}

                            {/* Mobile menu admin link */}
                            <Link
                                to="/admin"
                                className="flex items-center gap-2 px-4 py-3 mt-2 text-stone-600 text-sm font-bold rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                            >
                                <User className="w-5 h-5" strokeWidth={1.75} />
                                {language === 'en' ? 'Admin Portal' : 'የአስተዳደር በር'}
                            </Link>

                            {/* Mobile language toggle - shows current language and what it will switch to */}
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-2 px-4 py-3 text-stone-600 text-sm font-bold rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors w-full"
                            >
                                <Globe className="w-5 h-5" strokeWidth={1.75} />
                                <span>
                                    {language === 'en'
                                        ? 'Switch to Amharic (አማርኛ)'
                                        : 'Switch to English (EN)'}
                                </span>
                                <span className="ml-auto text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                                    {language === 'en' ? 'አማ' : 'EN'}
                                </span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}