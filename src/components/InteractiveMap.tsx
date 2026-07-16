/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  MapPin,
  Info,
  Trees,
  Volume2,
  VolumeX,
  Check,
  X,
  Navigation
} from 'lucide-react';
import { LANDMARKS } from '../data';
import { Landmark } from '../types';
import { useLanguage } from '../context/LanguageContext';

export default function InteractiveMap() {
  const { language, t } = useLanguage();
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | any>(LANDMARKS[0]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [audioTranscript, setAudioTranscript] = useState<string>('');
  const [visitedCount, setVisitedCount] = useState<string[]>([]);

  const filteredLandmarks = activeFilter === 'all'
    ? LANDMARKS
    : LANDMARKS.filter(l => l.category === activeFilter);

  const toggleVisited = (id: string) => {
    if (visitedCount.includes(id)) {
      setVisitedCount(visitedCount.filter(item => item !== id));
    } else {
      setVisitedCount([...visitedCount, id]);
    }
  };

  const handleAudioTour = (landmark: Landmark) => {
    if (isAudioPlaying) {
      setIsAudioPlaying(false);
      setAudioTranscript('');
    } else {
      setIsAudioPlaying(true);
      const nameText = language === 'en' ? landmark.name : landmark.localName;
      setAudioTranscript(
        language === 'en'
          ? `"${nameText} local guide: Welcome to ${landmark.localName || landmark.name}. Positioned at ${landmark.elevation || 'high altitude'}, this site holds deep historical and spiritual meaning in Gojjam..."`
          : `"${nameText} የአካባቢው መመሪያ፡ ወደ ${landmark.localName || landmark.name} በደህና መጡ። ከባህር ጠለል በላይ በ${landmark.elevation || 'ከፍተኛ ከፍታ'} ላይ የሚገኘው ይህ ስፍራ በጎጃም ውስጥ ጥልቅ ታሪካዊና መንፈሳዊ ትርጉም አለው..."`
      );
      // Simulate auto-end after 12 seconds
      setTimeout(() => {
        setIsAudioPlaying(current => {
          if (current) {
            setAudioTranscript('');
            return false;
          }
          return current;
        });
      }, 12000);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nature':
        return <Trees className="w-4 h-4 text-emerald-600" />;
      case 'sacred':
        return <Compass className="w-4 h-4 text-orange-600" />;
      case 'admin':
        return <Navigation className="w-4 h-4 text-blue-600" />;
      default:
        return <Compass className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nature':
        return 'emerald';
      case 'sacred':
        return 'orange';
      case 'admin':
        return 'blue';
      default:
        return 'yellow';
    }
  };

  return (
    <div id="interactive-map-section" className="bg-stone-50 border border-stone-200 rounded-3xl overflow-hidden shadow-xl">
      {/* Upper bar with filters and statistics */}
      <div className="bg-stone-900 text-stone-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-800">
        <div>
          <span className="text-emerald-400 font-mono text-xs uppercase tracking-wider">
            {language === 'en' ? 'Explore Bibugn District' : 'ቢቡኝ ወረዳን ይመርምሩ'}
          </span>
          <h2 className="text-2xl font-serif text-white tracking-tight mt-1">
            {language === 'en' ? 'Interactive Cultural Map' : 'በይነተገናኝ የባህል ካርታ'}
          </h2>
        </div>

        {/* Statistics or Mini tracker */}
        <div className="flex items-center gap-4 bg-stone-800/80 p-3 rounded-xl border border-stone-700 font-mono text-xs">
          <div className="text-right">
            <span className="text-stone-400 block">{t.visitedStatus}</span>
            <span className="text-emerald-400 font-bold font-sans text-base">
              {visitedCount.length} {language === 'en' ? 'of' : 'ከ'} {LANDMARKS.length} {language === 'en' ? 'Sites' : 'ቦታዎች'}
            </span>
          </div>
          <div className="h-8 w-[1px] bg-stone-700"></div>
          <div className="text-center bg-stone-900 px-3 py-1.5 rounded-lg border border-lime-500/30">
            <span className="text-lime-500 block font-bold leading-none">
              {(visitedCount.length / LANDMARKS.length * 100).toFixed(0)}%
            </span>
            <span className="text-[10px] text-stone-400">{t.exploredPercent}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 h-[680px]">
        {/* Column 1: Map Canvas (7 cols on large screen) */}
        <div className="col-span-1 lg:col-span-7 bg-stone-200/50 relative overflow-hidden h-[400px] lg:h-full border-b lg:border-b-0 lg:border-r border-stone-200 flex flex-col">

          {/* Category Filter Pills on Map */}
          <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap gap-2 pointer-events-auto">
            {[
              { id: 'all', label: t.allSites },
              { id: 'nature', label: t.natureFilter },
              { id: 'culture', label: t.cultureFilter },
              { id: 'sacred', label: t.sacredFilter },
              { id: 'admin', label: t.adminFilter },
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm transition-all border ${activeFilter === filter.id
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white/95 backdrop-blur-sm text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Interactive Styled Map SVG Canvas */}
          <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing bg-emerald-50/20 overflow-hidden">
            {/* Scenic Styled SVG Background */}
            <svg
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
              viewBox="0 0 800 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="800" height="600" fill="#FBF8F3" />

              {/* Topological Green Contour curves for Choke Range (Top) */}
              <path d="M 0 50 Q 150 100 400 30 Q 650 150 800 60" stroke="#E6E0D2" strokeWidth="2" fill="none" strokeDasharray="4 4" />
              <path d="M 0 100 Q 200 180 500 80 Q 700 210 800 140" stroke="#E3DC CE" strokeWidth="3" fill="none" />
              <path d="M 100 70 C 250 20 350 140 500 50 C 650 -40 750 90 800 10" fill="#EAE5D9" fillOpacity="0.4" />

              {/* Mount Choke Massif styling */}
              <circle cx="450" cy="80" r="140" fill="#E4DEC F" fillOpacity="0.3" />
              <path d="M 360 120 L 410 70 L 440 90 L 485 50 L 530 110 Z" fill="#D3C9B6" fillOpacity="0.4" />

              {/* Rivers flowing down from Choke Peaks to Blue Nile */}
              <path d="M 450 130 C 420 220 330 350 310 420" stroke="#A5C4D4" strokeWidth="4" strokeLinecap="round" />
              <path d="M 310 420 C 300 450 280 520 250 600" stroke="#A5C4D4" strokeWidth="5" strokeLinecap="round" />
              {/* Memsah cascade branching */}
              <path d="M 350 300 Q 250 320 220 400 T 150 490" stroke="#B8D3E2" strokeWidth="2" strokeLinecap="round" />

              {/* Forest Boundaries Delineation */}
              <path d="M 400 240 C 440 230 490 260 520 290 Q 550 350 480 390 C 430 400 390 350 360 300 Z" fill="#DCECD7" fillOpacity="0.6" stroke="#C3D9BD" strokeWidth="2" strokeDasharray="6 3" />

              {/* Central town boundaries (Digo Tsion) */}
              <rect x="300" y="380" width="220" height="150" rx="30" fill="#F4E FE6" fillOpacity="0.8" stroke="#E3DAC7" strokeWidth="3" />
              <text x="410" y="465" fill="#2F6B4F" fontFamily="serif" fontSize="16" fontWeight="bold" textAnchor="middle" letterSpacing="2">DIGO TSION</text>
              <text x="410" y="482" fill="#6FA588" fontFamily="sans-serif" fontSize="10" textAnchor="middle">ዲጎ ጽዮን ከተማ</text>

              {/* Agricultural fields around */}
              <rect x="60" y="200" width="80" height="70" transform="rotate(-15 60 200)" fill="#EAEEDC" stroke="#D3DCBC" strokeWidth="1" />
              <rect x="150" y="160" width="100" height="80" transform="rotate(10 150 160)" fill="#EEF2DE" stroke="#D3DCBC" strokeWidth="1" />
              <rect x="620" y="320" width="120" height="90" transform="rotate(25 620 320)" fill="#E9F0DB" stroke="#D3DCBC" strokeWidth="1" />
            </svg>

            {/* Render Map Pin Coordinates dynamically overlaying the SVG */}
            {filteredLandmarks.map((landmark: any) => {
              const isSelected = selectedLandmark?.id === landmark.id;
              const isVisited = visitedCount.includes(landmark.id);
              const colorClass = getCategoryColor(landmark.category);

              return (
                <button
                  key={landmark.id}
                  onClick={() => {
                    setSelectedLandmark(landmark);
                    setIsAudioPlaying(false);
                    setAudioTranscript('');
                  }}
                  className="absolute group z-25 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                  style={{ left: `${landmark.coordinates.x}%`, top: `${landmark.coordinates.y}%` }}
                >
                  {/* Ripple Ring when selected */}
                  {isSelected && (
                    <span className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping z-0"></span>
                  )}

                  {/* Marker Pin Style */}
                  <div className={`relative z-10 flex items-center justify-center h-10 w-10 rounded-full shadow-lg border-2 transition-all ${isSelected
                    ? 'bg-emerald-600 border-white text-white scale-110'
                    : 'bg-white border-stone-300 text-stone-700 hover:scale-105'
                    }`}>
                    {isVisited ? (
                      <Check className="w-5 h-5 text-emerald-600 font-bold" />
                    ) : (
                      getCategoryIcon(landmark.category)
                    )}

                    {/* Popover label on hover */}
                    <div className="absolute top-11 hidden group-hover:block bg-stone-900 text-white text-[11px] py-1 px-2.5 rounded-md whitespace-nowrap shadow-md pointer-events-none z-30 font-serif">
                      {landmark.name} ({landmark.localName})
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Custom compass rose on bottom-left of map */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-2 rounded-xl border border-stone-200 flex items-center gap-2 shadow-sm font-mono text-[10px] text-stone-600">
              <Compass className="w-5 h-5 text-emerald-600 animate-spin-slow" />
              <div>
                <span className="block font-bold">10°38&apos;N 37°53&apos;E</span>
                <span className="text-stone-400">BIBUGN, GOJJAM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Landmark Profile Pane (5 cols) */}
        <div className="col-span-1 lg:col-span-5 bg-white flex flex-col p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {selectedLandmark ? (
              <motion.div
                key={selectedLandmark.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col h-full justify-between"
              >
                <div>
                  {/* Category Pill and Checked badge */}
                  <div className="flex justify-between items-center mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-${getCategoryColor(selectedLandmark.category)}-50 text-${getCategoryColor(selectedLandmark.category)}-700 border border-${getCategoryColor(selectedLandmark.category)}-200/50`}>
                      {selectedLandmark.category === 'nature' && t.natureFilter}
                      {selectedLandmark.category === 'culture' && t.cultureFilter}
                      {selectedLandmark.category === 'sacred' && t.sacredFilter}
                      {selectedLandmark.category === 'admin' && t.adminFilter}
                    </span>
                    <button
                      onClick={(selectedLandmark: any) => toggleVisited(selectedLandmark.id)}
                      className={`flex items-center gap-1 text-[11px] font-mono border rounded-lg px-2.5 py-1 transition-all cursor-pointer ${visitedCount.includes(selectedLandmark.id)
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                    >
                      <Check className={`w-3.5 h-3.5 ${visitedCount.includes(selectedLandmark.id) ? 'stroke-current' : 'text-stone-400'}`} />
                      {visitedCount.includes(selectedLandmark.id)
                        ? (language === 'en' ? 'Visited' : 'ተጎብኝቷል')
                        : (language === 'en' ? 'Mark Visited' : 'የጎበኙት መዳረሻ')}
                    </button>
                  </div>

                  {/* Title & Local Title */}
                  <h3 className="text-2xl font-serif text-stone-900 tracking-tight leading-tight">
                    {language === 'en' ? selectedLandmark.name : selectedLandmark.localName}
                  </h3>
                  <span className="text-sm text-emerald-600 font-serif block mt-1">
                    {language === 'en' ? `${selectedLandmark.name} — Gojjam, Ethiopia` : `${selectedLandmark.localName} — ጎጃም፥ ኢትዮጵያ`}
                  </span>

                  {/* Image Container */}
                  <div className="mt-4 rounded-2xl overflow-hidden aspect-video relative shadow-inner bg-stone-100">
                    <img
                      src={selectedLandmark.image}
                      alt={selectedLandmark.name}
                      referrerPolicy="no-referrer"
                      className="object-cover w-full h-full"
                    />
                    {selectedLandmark.elevation && (
                      <span className="absolute bottom-2 right-2 bg-stone-900/80 backdrop-blur-sm text-stone-100 text-[10px] py-1 px-2.5 rounded-lg border border-stone-700 font-mono">
                        {language === 'en' ? selectedLandmark.elevation : selectedLandmark.elevation.replace('above sea level', 'ከባህር ጠለል በላይ')}
                      </span>
                    )}
                  </div>

                  {/* Tabs info */}
                  <div className="mt-4 text-stone-600 text-xs space-y-3 leading-relaxed font-sans">
                    <p className="bg-stone-50 p-3 rounded-xl border-l-4 border-emerald-500 font-sans italic text-stone-700">
                      {selectedLandmark.description}
                    </p>

                    <div>
                      <h4 className="font-mono text-stone-400 uppercase tracking-widest text-[9px] mb-1">
                        {language === 'en' ? 'Cultural & Historical Value' : 'ባህላዊ እና ታሪካዊ እሴት'}
                      </h4>
                      <p className="bg-stone-50/50 p-3 rounded-lg border border-stone-100 font-sans">
                        {selectedLandmark.history}
                      </p>
                    </div>

                    {/* Highlights Bulleted */}
                    <div>
                      <h4 className="font-mono text-stone-400 uppercase tracking-widest text-[9px] mb-2">
                        {language === 'en' ? 'Key Experience Highlights' : 'ዋና ዋና የመስህብ ነጥቦች'}
                      </h4>
                      <div className="grid grid-cols-1 gap-1">
                        {selectedLandmark.highlights.map((h, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-stone-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Audio Tour Player at bottom */}
                <div className="mt-6 pt-4 border-t border-stone-100">
                  <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/60 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAudioPlaying ? 'bg-emerald-500' : 'bg-stone-300'}`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${isAudioPlaying ? 'bg-emerald-600' : 'bg-stone-400'}`}></span>
                        </span>
                        <span className="font-mono text-[10px] text-stone-500">
                          {isAudioPlaying
                            ? (language === 'en' ? 'NARRATION ACTIVE' : 'የድምጽ ትረካ ገቢር ሆኗል')
                            : (language === 'en' ? 'GUIDED AUDIO CO-PILOT' : 'የድምጽ አስጎብኚ ረዳት')}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAudioTour(selectedLandmark)}
                        className={`p-2 rounded-lg transition-all border cursor-pointer ${isAudioPlaying
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                        title="Simulate Guide Audio Story"
                      >
                        {isAudioPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>

                    {isAudioPlaying && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-[11px] font-mono text-stone-600 italic leading-normal bg-white p-2 rounded border border-emerald-100"
                      >
                        {audioTranscript}
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center text-stone-400">
                <Compass className="w-12 h-12 stroke-1 text-stone-300 mb-2 animate-bounce-slow" />
                <span className="font-serif">
                  {language === 'en' ? 'No Site Selected' : 'የተመረጠ ቦታ የለም'}
                </span>
                <span className="text-xs max-w-xs mt-1 font-sans">
                  {language === 'en'
                    ? 'Click on any interactive map landmark pin to reveal local secrets and Gojjam culture.'
                    : 'ታሪካዊ ምስጢሮችን እና የጎጃምን ባህል ለመመልከት በካርታው ምልክቶች ላይ ጠቅ ያድርጉ።'}
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
