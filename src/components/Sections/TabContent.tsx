// src/components/sections/TabContent.tsx
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import InteractiveMap from '../InteractiveMap';
import EventCalendar from '../EventCalendar';
import GallerySection from '../GallerySection';
import InvestorPortal from '../InvestorPortal';
import AIChatGuide from '../AIChatGuide';
import NewsHub from '../NewsHub';

interface TabContentProps {
    activeTab: 'map' | 'events' | 'gallery' | 'investor' | 'chat' | 'news';
}

// Define separate types for tabs with and without description
interface BaseTabConfig {
    title: string;
    component: React.ReactNode;
    id: string;
}

interface TabConfigWithDesc extends BaseTabConfig {
    desc: string;
}

type TabConfig = BaseTabConfig | TabConfigWithDesc;

export default function TabContent({ activeTab }: TabContentProps) {
    const { language, t } = useLanguage();

    const tabConfig: Record<string, TabConfig> = {
        news: {
            title: language === 'en' ? 'News & Community Hub' : 'ዜና እና ማህበረሰብ',
            component: <NewsHub />,
            id: 'map-tabs-nav'
        },
        map: {
            title: language === 'en' ? 'Mount Choke Peaks & Digo Tsion Landmarks' : 'የጮቄ ተራራ ጫፎች እና የድጎ ጽዮን ታሪካዊ ቦታዎች',
            desc: t.mapDesc,
            component: <InteractiveMap />,
            id: 'map-tabs-nav'
        },
        events: {
            title: language === 'en' ? 'Dynamic Calendar of Cultural Events' : 'ንቁ ባህላዊ ሁነቶች እና በዓላት መቁጠሪያ',
            desc: t.eventDesc,
            component: <EventCalendar />,
            id: 'event-tabs-nav'
        },
        gallery: {
            title: language === 'en' ? 'Cultural & Agribusiness Photo Archiving' : 'የባህል እና የግብርና ምርቶች ፎቶዎች ማህደር',
            desc: t.galleryDesc,
            component: <GallerySection />,
            id: 'gallery-tabs-nav'
        },
        investor: {
            title: language === 'en' ? 'High-Priority Investor Registration Portal' : 'ቀዳሚ የኢንቨስተሮች ምዝገባ መግቢያ በር',
            desc: t.investorDesc,
            component: <InvestorPortal />,
            id: 'investor-tabs-nav'
        },
        chat: {
            title: language === 'en' ? 'Converse with DigoAI Guide Bot' : 'ከዲጎአይ ረዳት ቦት ጋር ይነጋገሩ',
            desc: t.chatDesc,
            component: <AIChatGuide embedMode={true} />,
            id: 'chat-tabs-nav'
        }
    };

    const config = tabConfig[activeTab];

    // Helper to check if config has description
    const hasDesc = (config: TabConfig): config is TabConfigWithDesc => {
        return 'desc' in config;
    };

    return (
        <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-4"
            id={config.id}
        >
            <div className="max-w-2xl">
                <h3 className="text-xl font-serif text-stone-900">{config.title}</h3>
                {hasDesc(config) && <p className="text-xs text-stone-500 mt-1">{config.desc}</p>}
            </div>
            {config.component}
        </motion.div>
    );
}