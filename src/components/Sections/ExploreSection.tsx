// src/components/sections/ExploreSection.tsx
import { useLanguage } from '../../context/LanguageContext';
import { Compass, Calendar, Image as ImageIcon, Building2, Bot, FileText } from 'lucide-react';

interface ExploreSectionProps {
    activeTab: string;
    setActiveTab: (tab: any) => void;
}

export default function ExploreSection({ activeTab, setActiveTab }: ExploreSectionProps) {
    const { language, t } = useLanguage();

    const tabs = [
        { id: 'news', label: language === 'en' ? '📰 News & History' : '📰 ዜና እና ታሪክ', icon: FileText },
        { id: 'map', label: '🗺️ Map & History', icon: Compass },
        { id: 'events', label: '📅 Cultural Calendar', icon: Calendar },
        { id: 'gallery', label: '📸 Photo Gallery', icon: ImageIcon },
        { id: 'investor', label: '💼 Investment Portal', icon: Building2 },
        { id: 'chat', label: '🤖 Ask DigoAI Guide', icon: Bot },
    ];

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const sectionIds = {
        news: 'map-tabs-nav',
        map: 'map-tabs-nav',
        events: 'event-tabs-nav',
        gallery: 'gallery-tabs-nav',
        investor: 'investor-tabs-nav',
        chat: 'chat-tabs-nav'
    };

    return (
        <div id="map-tabs-nav" className="text-center space-y-4 pt-4 border-t border-stone-200">
            <div className="max-w-xl mx-auto space-y-1">
                <span className="text-emerald-600 font-mono text-[10px] uppercase tracking-widest block font-bold">{t.secHeadline}</span>
                <h2 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">
                    {language === 'en' ? 'Select Interactive Mode' : 'የመፈለጊያ ምርጫ ይምረጡ'}
                </h2>
                <p className="text-xs text-stone-500 font-sans leading-relaxed">{t.secSubtitle}</p>
            </div>

            <div className="inline-flex bg-white p-2 rounded-2xl border border-stone-200 shadow-sm max-w-full overflow-x-auto gap-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as any);
                                scrollToSection(sectionIds[tab.id as keyof typeof sectionIds]);
                            }}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${isActive ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
