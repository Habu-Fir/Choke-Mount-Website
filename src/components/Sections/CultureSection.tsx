// src/components/sections/CultureSection.tsx
import { useLanguage } from '../../context/LanguageContext';
import { Trees, Milestone } from 'lucide-react';
import gojjamCultureRiders from '../../assets/images/gojjam_culture_riders_1782218878158.jpg';

export default function CultureSection() {
    const { t } = useLanguage();

    return (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl border border-stone-200/80 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>

            <div className="lg:col-span-4 rounded-2xl overflow-hidden aspect-video lg:aspect-square shadow-md bg-stone-100">
                <img
                    src={gojjamCultureRiders}
                    alt="Elite Gojjam Horsemen riders"
                    className="object-cover w-full h-full"
                />
            </div>

            <div className="lg:col-span-8 space-y-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 block">The Land of Gojjame Nobles</span>
                <h2 className="text-3xl font-serif font-extrabold text-stone-900 tracking-tight">{t.cultureHeadline}</h2>
                <div className="space-y-3 text-stone-600 text-sm leading-relaxed font-sans">
                    <p>{t.culturePara1}</p>
                    <p>{t.culturePara2}</p>
                </div>
                <div className="flex items-center gap-3 pt-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200/60 font-mono py-1.5 px-3.5 rounded-xl font-bold">
                        <Milestone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.orthodoxForests}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200/60 font-mono py-1.5 px-3.5 rounded-xl font-bold">
                        <Trees className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.chokeReserve}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
