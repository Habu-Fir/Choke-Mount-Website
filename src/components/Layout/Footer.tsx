// src/components/layout/Footer.tsx - Full Language Support
import { useLanguage } from '../../context/LanguageContext';
import { Compass, Heart } from 'lucide-react';

interface FooterProps {
    activeTab: string;
    setActiveTab: (tab: any) => void;
}

export default function Footer({ activeTab, setActiveTab }: FooterProps) {
    const { language } = useLanguage();

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <footer className="mt-28 bg-stone-950 text-stone-100 py-12 border-t-2 border-emerald-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-mono text-stone-400">
                {/* Brand Section */}
                <div className="md:col-span-5 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                            <Compass className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <span className="text-white text-base font-serif font-bold tracking-tight">
                            {language === 'en' ? 'DIGO TSION TOWN' : 'ድጎ ጽዮን ከተማ'}
                        </span>
                    </div>
                    <p className="font-sans leading-relaxed text-xs max-w-sm">
                        {language === 'en'
                            ? 'An interactive public portal managed by the Bibugn Wereda Culture, Sports, and Agribusiness Development cabinets. Promoting sustainable community engagement, tourism welfare, and high-standard investor stewardship.'
                            : 'በቢቡኝ ወረዳ ባህል፣ ስፖርት እና እርሻ ልማት ካቢኔቶች የሚተዳደር መስተጋብራዊ የህዝብ መግቢያ በር። ዘላቂ የማህበረሰብ ተሳትፎን፣ የቱሪዝም ደህንነትን እና ከፍተኛ ደረጃ ያለው የባለሀብት አስተዳደርን ማስተዋወቅ።'}
                    </p>
                    <span className="block text-[10px] text-stone-500 font-mono">
                        © 2026 {language === 'en' ? 'Bibugn district.' : 'ቢቡኝ ወረዳ።'}
                    </span>
                </div>

                {/* Core Sections */}
                <div className="md:col-span-3 space-y-3.5">
                    <span className="text-white font-bold block uppercase text-[10px] tracking-wider font-mono">
                        {language === 'en' ? 'Core Sections' : 'ዋና ክፍሎች'}
                    </span>
                    <div className="flex flex-col gap-2 font-sans text-xs">
                        <button 
                            onClick={() => { setActiveTab('news'); scrollToSection('map-tabs-nav'); }} 
                            className="hover:text-emerald-400 text-left transition-colors"
                        >
                            {language === 'en' ? 'News & Community Hub' : 'ዜና እና የማህበረሰብ ማዕከል'}
                        </button>
                        <button 
                            onClick={() => scrollToSection('map-tabs-nav')} 
                            className="hover:text-emerald-400 text-left transition-colors"
                        >
                            {language === 'en' ? 'Illustrated Landmarks Map' : 'የታሪክ ቦታዎች ካርታ'}
                        </button>
                        <button 
                            onClick={() => { setActiveTab('events'); scrollToSection('event-tabs-nav'); }} 
                            className="hover:text-emerald-400 text-left transition-colors"
                        >
                            {language === 'en' ? 'Cultural Affairs Calendar' : 'የባህላዊ ጉዳዮች ቀን መቁጠሪያ'}
                        </button>
                        <button 
                            onClick={() => { setActiveTab('gallery'); scrollToSection('gallery-tabs-nav'); }} 
                            className="hover:text-emerald-400 text-left transition-colors"
                        >
                            {language === 'en' ? 'Photo Galleries Archive' : 'የፎቶ ማህደር'}
                        </button>
                        <button 
                            onClick={() => { setActiveTab('investor'); scrollToSection('investor-tabs-nav'); }} 
                            className="hover:text-emerald-400 text-left transition-colors"
                        >
                            {language === 'en' ? 'Agribusiness Investor Registry' : 'የእርሻ ኢንቨስትመንት መዝገብ'}
                        </button>
                    </div>
                </div>

                {/* Administrative Contact */}
                <div className="md:col-span-4 space-y-3.5 bg-stone-900 p-5 rounded-2xl border border-stone-800">
                    <span className="text-emerald-400 font-bold block uppercase text-[10px] tracking-wider font-mono">
                        {language === 'en' ? 'Administrative Contact' : 'የአስተዳደር እውቂያ'}
                    </span>
                    <p className="font-sans text-stone-300 leading-normal text-[11px]">
                        {language === 'en' ? (
                            <>
                                ⛰️ Digo Tsion Municipality, <br />
                                Wereda Admin Block A, Office 4. <br />
                                East Gojjam Zone, Amhara region, Ethiopia.
                            </>
                        ) : (
                            <>
                                ⛰️ ድጎ ጽዮን ማዘጋጃ ቤት፣ <br />
                                የወረዳ አስተዳደር ህንፃ ሀ፣ ቢሮ 4። <br />
                                ምስራቅ ጎጃም ዞን፣ አማራ ክልል፣ ኢትዮጵያ።
                            </>
                        )}
                    </p>
                    <div className="h-[1px] bg-stone-850 my-2"></div>
                    <div className="font-mono text-[9px] text-stone-500 flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-500 animate-pulse fill-rose-500" />
                        <span>
                            {language === 'en' 
                                ? 'Gojjam White Honey & Stone Craft' 
                                : 'ጎጃም ነጭ ማር እና የድንጋይ ስራ'}
                        </span>
                    </div>
                </div>

                {/* Admin Section */}
                <div className="md:col-span-3 space-y-3.5 md:col-start-10">
                    <span className="text-white font-bold block uppercase text-[10px] tracking-wider font-mono">
                        {language === 'en' ? 'Admin' : 'አስተዳደር'}
                    </span>
                    <div className="flex flex-col gap-2 font-sans text-xs">
                        <a 
                            href="/admin/login" 
                            className="hover:text-emerald-400 text-left transition-colors"
                        >
                            {language === 'en' ? 'Admin Login' : 'የአስተዳዳሪ መግቢያ'}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}