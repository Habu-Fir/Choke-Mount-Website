// src/context/LanguageContext.tsx
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, TranslationDict } from '../translations';

export type Language = 'en' | 'am';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDict;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('digo_tsion_lang');
    return (saved === 'am' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('digo_tsion_lang', lang);
    // Amharic (Ge'ez script) is written left-to-right, same as English.
    // Direction must always stay 'ltr' for both languages.
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = lang;
  };

  const t = translations[language];
  // Kept for backward compatibility with any component still reading
  // isRTL, but Amharic is not an RTL language, so this is always false.
  const isRTL = false;

  // Set initial document direction/lang on mount and whenever language changes.
  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
