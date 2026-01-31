'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { dictionaries, Dictionary, ar, en } from '@/lib/dictionaries';

type Lang = 'ar' | 'en';
type Dir = 'rtl' | 'ltr';

interface LanguageContextProps {
    lang: Lang;
    dir: Dir;
    language: Lang; // Add this alias to match useLanguage return
    dict: Dictionary;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Lang>('ar');

    useEffect(() => {
        // Check localStorage or default to 'ar'
        const savedLang = localStorage.getItem('lang') as Lang;
        if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
            setLang(savedLang);
        }
    }, []);

    useEffect(() => {
        const dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = lang;
        localStorage.setItem('lang', lang);
    }, [lang]);

    const toggleLanguage = () => {
        setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
    };

    const dict = lang === 'ar' ? ar : en;
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    return (
        <LanguageContext.Provider value={{ lang, language: lang, dir, dict, toggleLanguage }}>
            <div dir={dir} className={lang === 'ar' ? 'font-cairo' : 'font-inter'}>
                {children}
            </div>
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
