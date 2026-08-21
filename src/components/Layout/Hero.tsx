// src/components/layout/Hero.tsx
import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, ChevronRight } from 'lucide-react';
import chokeMountainHero from '../../assets/images/choke-mountain-hero.jpg';

export default function Hero() {
    const { language, t } = useLanguage();

    const [views, setViews] = useState<number | null>(null);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);

        if (el) {
            el.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    // Record a website view
    useEffect(() => {
        const recordView = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/stats/views`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to record view: ${response.status}`
                    );
                }

                const data = await response.json();

                setViews(data.views);
            } catch (error) {
                console.error(
                    'Website view counter error:',
                    error
                );
            }
        };

        recordView();
    }, []);

    return (
        <header className="relative bg-stone-900 overflow-hidden">

            {/* Background photo layer */}
            <div className="absolute inset-0 z-0">
                <img
                    src={chokeMountainHero}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-stone-950/55 via-stone-900/25 to-stone-950/60"></div>

                {/* Soft color accents */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-emerald-500/10 rounded-full blur-3xl"></div>

                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-lime-500/10 rounded-full blur-3xl"></div>
                </div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-28 pb-12 sm:pb-24 text-center space-y-6 sm:space-y-8">

                {/* Welcome badge */}
                <div className="inline-flex items-center gap-2 bg-emerald-500/15 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-500/40 text-emerald-300 font-mono text-xs sm:text-sm tracking-wider animate-bounce-slow">
                    <Sparkles className="w-4 h-4 fill-current text-emerald-400" />

                    <span>{t.welcomeBadge}</span>
                </div>

                {/* Main headline */}
                <div className="space-y-3 sm:space-y-4 bg-stone-950/45 backdrop-blur-[2px] rounded-3xl px-4 sm:px-10 py-6 sm:py-8 inline-block max-w-3xl mx-auto">

                    <h1 className="text-4xl sm:text-6xl font-serif font-extrabold text-white tracking-tight leading-none max-w-4xl mx-auto drop-shadow-lg">
                        {language === 'en' ? 'Bibugn & ' : 'ቢቡኝ እና '}

                        <br className="sm:hidden" />

                        <span className="text-lime-400 relative inline-block">
                            {language === 'en'
                                ? 'Mount Choke'
                                : 'ጮቄ ተራራ'}

                            <span className="absolute left-0 right-0 bottom-1 h-1.5 bg-emerald-500/35 rounded"></span>
                        </span>
                    </h1>

                    <p className="text-stone-100 font-serif text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed">
                        {t.heroSubtitle}
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center font-mono text-xs max-w-md mx-auto">

                    <button
                        onClick={() => scrollToSection('map-tabs-nav')}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/40 active:scale-99 transition-all cursor-pointer"
                    >
                        {t.exploreBtn}

                        <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                        className="w-full sm:w-auto bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white py-3.5 px-6 rounded-2xl border border-white/25 flex items-center justify-center gap-1.5 hover:scale-102 transition-all cursor-pointer"
                    >
                        {t.prospectusBtn}
                    </button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/20 max-w-3xl mx-auto font-mono text-center">

                    {[
                        {
                            value: '4,120m+',
                            label: t.altChoke,
                        },
                        {
                            value:
                                language === 'en'
                                    ? 'Weekly'
                                    : 'ሳምንታዊ',
                            label: t.tueMarket,
                        },
                        {
                            value:
                                language === 'en'
                                    ? '5 Years'
                                    : '5 ዓመታት',
                            label: t.taxHoliday,
                        },
                        {
                            value:
                                views !== null
                                    ? views.toLocaleString()
                                    : '...',
                            label:
                                language === 'en'
                                    ? 'Website Views'
                                    : 'የድረ-ገጽ እይታዎች',
                        },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="bg-stone-950/40 backdrop-blur-sm p-4 rounded-2xl border border-white/15"
                        >
                            <span className="block text-xl sm:text-2xl font-bold text-lime-400 leading-none">
                                {stat.value}
                            </span>

                            <span className="block text-[10px] text-stone-200 mt-1 uppercase tracking-wider">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </header>
    );
}