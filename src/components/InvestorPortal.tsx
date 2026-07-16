import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Coins,
  Mail,
  Phone,
  FileText,
  ArrowRight,
  ChevronRight,
  Building2,
  Clock,
  Sparkles,
  Download
} from 'lucide-react';
import { INVESTMENT_SECTORS } from '../data';
import { InvestorSector, InvestorRegistration } from '../types';
import { useLanguage } from '../context/LanguageContext';

// Pre-seeded registration data to represent local momentum
const PRE_SEEDED_REGISTRATIONS: InvestorRegistration[] = [
  {
    id: 'reg_1',
    companyName: 'Choke Highlands Sweet Gold plc',
    investorName: 'Dr. Dawit G/Sillassie',
    sectorId: 'honey_forestry',
    email: 'dawit.g@choke-sweetgold.com',
    phone: '+251 911 445 566',
    proposedBudget: '$120,000 USD (Approx. 13M ETB)',
    proposalBrief: 'Establishment of a local honey filtration plant and packing facility in Digo Tsion, deploying FDA-approved stainless steel bottling machinery to package and export Choke Mountain organic white honey.',
    registeredAt: '2026-06-12',
    status: 'Pre-Approved'
  },
  {
    id: 'reg_2',
    companyName: 'Abay Eco-Tours & Lodges Ethiopia',
    investorName: 'Sarah Jenkins',
    sectorId: 'eco_tourism',
    email: 'sjenkins@abayecotours.org',
    phone: '+44 7911 123456',
    proposedBudget: '$250,000 USD (Approx. 27M ETB)',
    proposalBrief: 'Constructing 10 high-altitude solar-powered geothermal stone cabins along the Choke ridge, prioritizing local stone masons and establishing a guided flora and mountaineering tour syndicate.',
    registeredAt: '2026-06-19',
    status: 'Under Review'
  }
];

export default function InvestorPortal() {
  const { language, t } = useLanguage();
  const [selectedSector, setSelectedSector] = useState<InvestorSector>(INVESTMENT_SECTORS[0]);
  const [registrations, setRegistrations] = useState<InvestorRegistration[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);

  // Form States
  const [companyName, setCompanyName] = useState<string>('');
  const [investorName, setInvestorName] = useState<string>('');
  const [sectorId, setSectorId] = useState<string>(INVESTMENT_SECTORS[0].id);
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [proposedBudget, setProposedBudget] = useState<string>('');
  const [proposalBrief, setProposalBrief] = useState<string>('');

  // UI states
  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [latestSubmittedReg, setLatestSubmittedReg] = useState<InvestorRegistration | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Load submissions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('digo_tsion_investors');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRegistrations([...PRE_SEEDED_REGISTRATIONS, ...parsed]);
      } catch (err) {
        console.error('Error parsing saved registries', err);
        setRegistrations(PRE_SEEDED_REGISTRATIONS);
      }
    } else {
      setRegistrations(PRE_SEEDED_REGISTRATIONS);
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!companyName || !investorName || !email || !proposedBudget || !proposalBrief) {
      setFormError(language === 'en'
        ? 'Please fill out all required fields to submit your registration proposal.'
        : 'እባክዎን ምዝገባውን ለማስገባት ሁሉንም መስኮች በደንብ ይሙሉ!');
      return;
    }
    setFormError(null);

    const newReg: InvestorRegistration = {
      id: 'reg_' + Date.now(),
      companyName,
      investorName,
      sectorId,
      email,
      phone: phone || 'N/A',
      proposedBudget,
      proposalBrief,
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'Pending Verification'
    };

    // Save state & localStorage
    const savedRaw = localStorage.getItem('digo_tsion_investors');
    let savedList: InvestorRegistration[] = [];
    if (savedRaw) {
      try {
        savedList = JSON.parse(savedRaw);
      } catch (err) {
        savedList = [];
      }
    }
    const updatedLocalStorage = [newReg, ...savedList];
    localStorage.setItem('digo_tsion_investors', JSON.stringify(updatedLocalStorage));

    setRegistrations([newReg, ...registrations]);
    setLatestSubmittedReg(newReg);
    setFormSuccess(true);

    // Reset form fields
    setCompanyName('');
    setInvestorName('');
    setEmail('');
    setPhone('');
    setProposedBudget('');
    setProposalBrief('');
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'Critical':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'High':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  const steps_en = [
    { title: 'Project Intake', description: 'Complete municipal intake form selecting your target sector and estimation budget.' },
    { title: 'Technical Match', description: 'The Bibugn Wereda Investment bureau cross-checks proposed ideas against vacant plots & priority zoning.' },
    { title: 'EIA Clearings', description: 'Draft an Environmental Impact Assessment ensuring your ecotourism model preserves Choke soil integrity.' },
    { title: 'Permit & Grants', description: 'Local cabinet allocates title cards, issues business permits, and issues duty-free machinery import exemptions.' },
  ];

  const steps_am = [
    { title: 'የፕሮጀክት ምዝገባ', description: 'የታለመውን ዘርፍ እና ግምታዊ በጀት በመምረጥ የማዘጋጃ ቤቱን ምዝገባ ቅጽ ያጠናቅቁ።' },
    { title: 'የቴክኒክ ማጣሪያ', description: 'የቢቡኝ ወረዳ ኢንቨስትመንት ቢሮ የቀረቡትን ሃሳቦች ከተዘጋጁ መሬቶች እና ከቀዳሚ ቀጠናዎች ጋር ያመሳክራል።' },
    { title: 'የአካባቢ ጥበቃ ግምገማ', description: 'የኢኮ-ቱሪዝም ፕሮጀክትዎ የጮቄን የአፈር እና ስነ-ምህዳር ደህንነት እንደሚጠብቅ የሚያረጋግጥ የአካባቢ ተፅዕኖ ግምገማ ያዘጋጁ።' },
    { title: 'ፈቃድ እና ሹመት', description: 'የወረዳው ካቢኔ የመሬት ካርታ ያዘጋጃል፣ የንግድ ፈቃድ ይሰጣል እንዲሁም የማሽነሪዎችን ከቀረጥ ነፃ የማስገቢያ መብት ይፈቅዳል።' },
  ];

  const steps = language === 'en' ? steps_en : steps_am;

  const getLocalizedBrief = (regId: string, defaultBrief: string) => {
    if (language === 'en') return defaultBrief;
    if (regId === 'reg_1') {
      return 'በድጎ ጽዮን ውስጥ የማር ማጣሪያና ማሸጊያ ፋብሪካ በማቋቋም፥ ከጮቄ ተራራ የሚሰበሰበውን ኦርጋኒክ ነጭ ማር በአገር አቀፍ ደረጃ እና ለውጭ ገበያ ማቅረብ።';
    }
    if (regId === 'reg_2') {
      return 'በጮቄ ተራሮች ላይ 10 በፀሐይ ኃይል የሚሰሩ የድንጋይ ጎጆዎችን መገንባት፥ የአካባቢውን ባለሙያዎች መቅጠር እና የስነ-ምህዳር መመሪያዎችን ማዘጋጀት።';
    }
    return defaultBrief;
  };

  const getLocalizedStatus = (status: string) => {
    if (language === 'en') return status;
    switch (status) {
      case 'Pre-Approved': return 'የተፈቀደ';
      case 'Under Review': return 'በግምገማ ላይ';
      case 'Pending Verification': return 'ማረጋገጫ የሚጠብቅ';
      default: return status;
    }
  };

  return (
    <div className="space-y-12">

      {/* SECTION 1: INVESTMENT SECTORS & COGNIZANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Sector Directory */}
        <div className="lg:col-span-5 space-y-4">
          <div className="mb-4">
            <span className="text-emerald-600 font-mono text-[9px] uppercase tracking-widest block">
              {t.priorityFields}
            </span>
            <h3 className="text-xl font-serif text-stone-950 font-bold leading-tight mt-1">
              {t.priorityTitle}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              {t.prioritySubtitle}
            </p>
          </div>

          <div className="space-y-3">
            {INVESTMENT_SECTORS.map(sec => {
              const isActive = selectedSector.id === sec.id;
              const sectorName = language === 'en' ? sec.name : (sec.localName || sec.name);
              const sectorDesc = language === 'en' ? sec.description : (sec.localDescription || sec.description);
              const sectorDemand = language === 'en' ? sec.demand : (sec.localDemand || sec.demand);

              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSector(sec)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start gap-4 transition-all cursor-pointer ${isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300'
                    }`}
                >
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-stone-50 text-emerald-600'}`}>
                    <Briefcase className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider truncate">
                        {sectorName}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-md font-mono border ${isActive
                        ? 'bg-white/25 text-white border-transparent'
                        : getDemandColor(sec.demand)
                        }`}>
                        {sectorDemand}
                      </span>
                    </div>
                    <p className={`text-xs mt-1.5 line-clamp-1 ${isActive ? 'text-emerald-100' : 'text-stone-500'}`}>
                      {sectorDesc}
                    </p>
                  </div>

                  <ChevronRight className={`w-4 h-4 mt-1 flex-shrink-0 opacity-60 ${isActive ? 'translate-x-1 transition-transform' : ''}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Sector Spotlight details */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSector.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-stone-50 p-6 rounded-3xl border border-stone-200 shadow-inner flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-4 border-b border-stone-200">
                  <div>
                    <h4 className="text-lg font-serif font-bold text-stone-900 leading-none">
                      {language === 'en' ? selectedSector.name : (selectedSector.localName || selectedSector.name)}
                    </h4>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block mt-1.5">
                      {t.demandLevel}: <span className="text-emerald-600 font-bold">{language === 'en' ? selectedSector.demand : (selectedSector.localDemand || selectedSector.demand)}</span> • {t.capitalMin}: <span className="text-stone-800 font-bold">{language === 'en' ? selectedSector.minimumCapital : (selectedSector.localMinimumCapital || selectedSector.minimumCapital)}</span>
                    </span>
                  </div>

                  <div className="bg-stone-900 text-stone-100 font-mono text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 border border-stone-800">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{language === 'en' ? selectedSector.growth : (selectedSector.localGrowth || selectedSector.growth)}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed font-sans mb-5 bg-white p-4 rounded-xl border border-stone-100">
                  {language === 'en' ? selectedSector.description : (selectedSector.localDescription || selectedSector.description)}
                </p>

                {/* Incentives checklist */}
                <div className="space-y-4">
                  <div>
                    <h5 className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest mb-2.5">
                      {t.registeredIncentives}
                    </h5>
                    <div className="grid grid-cols-1 gap-2">
                      {(language === 'en' ? selectedSector.incentives : (selectedSector.localIncentives || selectedSector.incentives)).map((inc:any, i:any) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-stone-800 bg-white p-3 rounded-xl border border-stone-100/80">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest mb-1">
                      {t.priorityRepDesk}
                    </h5>
                    <span className="text-xs text-stone-700 block">
                      📞 {language === 'en' ? selectedSector.contactPerson : (selectedSector.localContactPerson || selectedSector.contactPerson)}
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* SECTION 2: PROCEDURAL ROADMAP & INTERACTIVE STEP CHECKLIST */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        <div>
          <span className="text-emerald-600 font-mono text-[9px] uppercase tracking-widest block">
            {t.licensingFramework}
          </span>
          <h3 className="text-xl font-serif text-stone-950 font-bold tracking-tight mt-1">
            {t.roadmapTitle}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {t.roadmapSubtitle}
          </p>
        </div>

        {/* Interacting Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((st, idx) => {
            const isCompleted = activeStep >= idx;
            const isCurrent = activeStep === idx;

            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`text-left p-5 rounded-2xl border transition-all cursor-pointer ${isCurrent
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : isCompleted
                    ? 'bg-emerald-50 border-emerald-100 text-stone-800'
                    : 'bg-stone-50 border-stone-200/60 text-stone-500'
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${isCurrent
                    ? 'bg-white text-emerald-700'
                    : 'bg-stone-900 text-white'
                    }`}>
                    0{idx + 1}
                  </span>

                  {isCompleted && !isCurrent && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                </div>

                <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                  {st.title}
                </h4>
                <p className={`text-[11px] leading-relaxed mt-2 font-sans ${isCurrent ? 'text-emerald-100' : 'text-stone-500'}`}>
                  {st.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>
              {language === 'en' ? 'Average turnaround to complete the license:' : 'ፈቃዱን አጠናቆ ለመቀበል የሚፈጀው አማካይ ጊዜ፡'} <span className="font-bold text-stone-900">{language === 'en' ? '14 Business Days' : '14 የሥራ ቀናት'}</span>
            </span>
          </div>

          <button
            onClick={() => setActiveStep((current) => (current < 3 ? current + 1 : 0))}
            className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold cursor-pointer"
          >
            {language === 'en' ? 'Advance Stepper' : 'ወደ ቀጣዩ ደረጃ እለፍ'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SECTION 3: FORM REGISTRATION + LIVE TRACKING GRID */}
      <div id="investor-form-anchor" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Hand: Registration Intake Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-lg space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-serif font-bold text-stone-900 tracking-tight">
                {t.submitIntent}
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {t.submitIntentDesc}
            </p>
          </div>

          {formSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-4"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <div>
                <h4 className="text-base font-bold text-emerald-800">
                  {language === 'en' ? 'Proposal Registration Queued!' : 'የባለሀብት ምዝገባ ጥያቄዎ በተሳካ ሁኔታ ተመዝግቧል!'}
                </h4>
                <p className="text-xs text-emerald-600 max-w-md mx-auto mt-1 text-center">
                  {language === 'en'
                    ? `Thank you, your proposal has been successfully indexed in the district public records and will update live below. Our Investment Commissioner advisor will reach out to: `
                    : `እናመሰግናለን፥ የኢንቨስትመንት ጥያቄዎ በተሳካ ሁኔታ በሕዝባዊ መዝገብ ውስጥ ተመዝግቧል፤ በቅርቡ የኢንቨስትመንት ኮሚሽነሩ ረዳት በዚህ አድራሻ ያገኝዎታል፡ `}
                  <span className="font-bold">{latestSubmittedReg?.email}</span>.
                </p>
              </div>

              {latestSubmittedReg && (
                <div className="bg-white/80 p-4 rounded-2xl border border-emerald-100/80 text-left font-mono text-[11px] text-stone-700 space-y-1.5 max-w-sm mx-auto">
                  <div>REGISTRY ID / መለያ ቁጥር: <span className="font-bold text-stone-900">{latestSubmittedReg.id}</span></div>
                  <div>COMPANY / የድርጅት ስም: <span className="font-bold text-stone-900">{latestSubmittedReg.companyName}</span></div>
                  <div>PRINCIPAL / ባለቤት: <span className="font-bold text-stone-900">{latestSubmittedReg.investorName}</span></div>
                  <div>PROPOSED BUDGET / በጀት: <span className="font-bold text-stone-900">{latestSubmittedReg.proposedBudget}</span></div>
                  <div>DECLARED DATE / ቀን: <span className="font-bold text-stone-900">{latestSubmittedReg.registeredAt}</span></div>
                </div>
              )}

              <div className="flex justify-center gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-xl font-mono text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> {language === 'en' ? 'Export PDF Receipt' : 'የፒዲኤፍ ማረጋገጫ አውርድ'}
                </button>
                <button
                  onClick={() => setFormSuccess(false)}
                  className="px-4 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-xl font-mono text-xs cursor-pointer"
                >
                  {language === 'en' ? 'File another intent' : 'ሌላ ሃሳብ መዝግብ'}
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono text-stone-700">
              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-sans"
                >
                  ⚠️ {formError}
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[10px] uppercase text-stone-500 mb-1">
                    {t.companyName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Abay Organic Honey plc"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-sans"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[10px] uppercase text-stone-500 mb-1">
                    {t.investorName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={investorName}
                    onChange={(e) => setInvestorName(e.target.value)}
                    placeholder="Principal contact"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[10px] uppercase text-stone-500 mb-1">
                    {t.selectSector} *
                  </label>
                  <select
                    value={sectorId}
                    onChange={(e) => setSectorId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 font-sans cursor-pointer"
                  >
                    {INVESTMENT_SECTORS.map(sec => (
                      <option key={sec.id} value={sec.id}>
                        {language === 'en' ? sec.name : (sec.localName || sec.name)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[10px] uppercase text-stone-500 mb-1">
                    {t.proposedBudget} *
                  </label>
                  <input
                    type="text"
                    required
                    value={proposedBudget}
                    onChange={(e) => setProposedBudget(e.target.value)}
                    placeholder="e.g. $150,000 USD / 8M ETB"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[10px] uppercase text-stone-500 mb-1">
                    {t.contactEmail} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="investor@domain.com"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-sans"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[10px] uppercase text-stone-500 mb-1">
                    {t.contactPhone}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +251 9xx xxx xxx"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[10px] uppercase text-stone-500 mb-1">
                  {t.projectBrief} *
                </label>
                <textarea
                  required
                  rows={4}
                  value={proposalBrief}
                  onChange={(e) => setProposalBrief(e.target.value)}
                  placeholder={language === 'en' ? "Describe your agribusiness or tourism lodge idea. Mention land expectations." : "የግብርና ምርትዎን ወይም የስነ-ምህዳር ሎጅ ሃሳብዎን በአጭሩ ይግለጹ።"}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-sans"
                ></textarea>
              </div>

              <div className="pt-2 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex items-start gap-2.5 font-sans mb-2">
                <input
                  type="checkbox"
                  required
                  id="agree-checkbox"
                  className="mt-1 h-4 w-4 bg-stone-50 border-stone-300 hover:border-emerald-500 transition-colors cursor-pointer text-emerald-600 rounded"
                />
                <label htmlFor="agree-checkbox" className="text-[11px] text-stone-600 leading-snug cursor-pointer">
                  {t.sustainablePledge}
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-sm py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-99 cursor-pointer"
              >
                {t.submitBtn}
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}
        </div>

        {/* Right Hand: Public Investment proposal queue (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="mb-2">
            <span className="text-emerald-600 font-mono text-[9px] uppercase tracking-widest block">District Log</span>
            <h3 className="text-lg font-serif text-stone-950 font-bold leading-tight">
              {t.activeRegistry}
            </h3>
            <p className="text-xs text-stone-500 leading-snug">
              {t.activeRegistryDesc}
            </p>
          </div>

          <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
            {registrations.map((reg) => (
              <div
                key={reg.id}
                className="bg-stone-50 p-5 rounded-2xl border border-stone-200 flex flex-col justify-between hover:border-emerald-400 transition-all shadow-sm"
              >
                <div>
                  <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                    <span className="font-mono text-[9px] text-stone-400 bg-stone-200 px-2 py-0.5 rounded">
                      ID: {reg.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono border uppercase tracking-wider ${reg.status === 'Pre-Approved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : reg.status === 'Under Review'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                      {getLocalizedStatus(reg.status)}
                    </span>
                  </div>

                  <h5 className="text-sm font-serif font-bold text-stone-900 leading-tight">
                    {reg.companyName}
                  </h5>
                  <span className="text-xs text-stone-400 font-sans mt-0.5 block">
                    {language === 'en' ? 'Lead:' : 'ባለቤት:'} {reg.investorName}
                  </span>

                  <p className="text-xs text-stone-600 font-sans leading-relaxed mt-2.5 line-clamp-3 bg-white p-3 rounded-xl border border-stone-100">
                    {getLocalizedBrief(reg.id, reg.proposalBrief)}
                  </p>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-stone-500 mt-4 pt-3 border-t border-stone-100">
                  <div className="flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-stone-900 font-bold font-sans">{reg.proposedBudget}</span>
                  </div>

                  <span>{language === 'en' ? 'Indexed:' : 'የተመዘገበበት ቀን:'} {reg.registeredAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
