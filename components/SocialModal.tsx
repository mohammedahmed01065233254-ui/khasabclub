'use client';

import { useLanguage } from './LanguageProvider';

interface SocialModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SocialModal({ isOpen, onClose }: SocialModalProps) {
    const { lang } = useLanguage();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-full hover:bg-slate-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 12" /></svg>
                </button>

                <div className="text-center space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {lang === 'ar' ? 'تواصل معنا' : 'Connect With Us'}
                        </h2>
                        <p className="text-slate-400">
                            {lang === 'ar' ? 'تابعنا على وسائل التواصل الاجتماعي' : 'Follow us on social media'}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Instagram Button */}
                        <a
                            href="https://www.instagram.com/khasabclub/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between w-full p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white transition-all transform hover:scale-[1.02] shadow-lg shadow-pink-900/20"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 p-2 rounded-xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                                </div>
                                <div className="text-right flex-1">
                                    <div className="font-bold text-lg">{lang === 'ar' ? 'تابعنا على انستغرام' : 'Follow on Instagram'}</div>
                                    <div className="text-white/80 text-sm font-mono">@khasabclub</div>
                                </div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`opacity-0 group-hover:opacity-100 transition-opacity transform ${lang === 'ar' ? '-scale-x-100' : ''}`}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </a>

                        {/* YouTube Button */}
                        <a
                            href="https://www.youtube.com/channel/UCsqt2mRPstJ0wxptDA3KyqA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between w-full p-4 rounded-2xl bg-[#FF0000] hover:bg-[#FF2020] text-white transition-all transform hover:scale-[1.02] shadow-lg shadow-red-900/20"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 p-2 rounded-xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
                                </div>
                                <div className="text-right flex-1">
                                    <div className="font-bold text-lg">{lang === 'ar' ? 'شاهدنا على يوتيوب' : 'Watch on YouTube'}</div>
                                    <div className="text-white/80 text-sm">Khasab Sports Club</div>
                                </div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`opacity-0 group-hover:opacity-100 transition-opacity transform ${lang === 'ar' ? '-scale-x-100' : ''}`}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
