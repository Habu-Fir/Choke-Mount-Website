// src/pages/Home.tsx
import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Layout/Navbar';
import Hero from '../components/Layout/Hero';
import CultureSection from '../components/Sections/CultureSection';
import ExploreSection from '../components/Sections/ExploreSection';
import TabContent from '../components/Sections/TabContent';
import TriviaSection from '../components/Sections/TriviaSection';
import Footer from '../components/Layout/Footer';
import AIChatGuide from '../components/AIChatGuide';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'map' | 'events' | 'gallery' | 'investor' | 'chat' | 'news'>('news');

  return (
    <div className="bg-stone-150 min-h-screen text-stone-850 font-sans antialiased selection:bg-amber-100 selection:text-amber-900 pb-16">
      <AIChatGuide />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-24">
        <CultureSection />
        
        <ExploreSection activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="pt-4">
          <AnimatePresence mode="wait">
            <TabContent activeTab={activeTab} />
          </AnimatePresence>
        </div>
        
        <TriviaSection />
      </main>
      
      <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}