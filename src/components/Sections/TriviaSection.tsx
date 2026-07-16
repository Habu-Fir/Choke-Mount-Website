// src/components/sections/TriviaSection.tsx
import { useLanguage } from '../../context/LanguageContext';

export default function TriviaSection() {
    const { language, t } = useLanguage();

    const triviaItems = [
        { title: t.triviaFact1Title, desc: t.triviaFact1Desc },
        { title: t.triviaFact2Title, desc: t.triviaFact2Desc }
    ];

    return (
        <section className="bg-stone-50 p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-inner grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-600 block">
                    {language === 'en' ? 'Culture & Trivia' : 'ባህል እና እውነታዎች'}
                </span>
                <h3 className="text-2xl font-serif text-stone-900 font-bold mt-1">{t.triviaHeader}</h3>
                <p className="text-xs text-stone-500 mt-2 pr-4 leading-relaxed font-sans">{t.triviaSubtitle}</p>

                <div className="mt-6 flex items-center gap-3 bg-white p-4 rounded-2xl border border-stone-200">
                    <div className="w-5 h-5 text-emerald-600 flex-shrink-0">🌍</div>
                    <div className="text-[11px] text-stone-600 font-sans">
                        <span className="font-bold text-stone-900 font-serif block text-xs">
                            {language === 'en' ? 'UNESCO Biosphere Protection' : 'የዩኔስኮ ባዮስፌር ጥበቃ'}
                        </span>
                        {language === 'en'
                            ? 'Mount Choke is under rapid conservation protocols to protect over 16 species of endemic highland birds.'
                            : 'የጮቄ ተራራ ከ16 በላይ ደጋ በቀል አእዋፍ ዝርያዎችን እና የውሃ ፍሰትን የሚቆጣጠሩ ረግረግ መሬቶችን ለመጠበቅ በጥበቃ ሥር ይገኛል።'}
                    </div>
                </div>
            </div>

            <div className="space-y-4 font-sans text-xs">
                {triviaItems.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl border border-stone-200">
                        <h4 className="font-serif font-bold text-stone-900 text-sm">{item.title}</h4>
                        <p className="text-stone-600 mt-2 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
