import { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SocialModal } from './SocialModal';

export function Navbar() {
    const { toggleLanguage, dict, lang } = useLanguage();
    const pathname = usePathname();
    const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/90 border-b border-emerald-100 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="Khasab Sports Club"
                            width={120}
                            height={120}
                            quality={100}
                            priority
                            className="h-20 w-auto object-contain"
                        />
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/" className={`${pathname === '/' ? 'text-emerald-600 font-bold' : 'text-slate-600 hover:text-emerald-500'} transition-colors`}>
                        {dict.navbar.home}
                    </Link>
                    <Link href="/my-bookings" className={`${pathname === '/my-bookings' ? 'text-emerald-600 font-bold' : 'text-slate-600 hover:text-emerald-500'} transition-colors`}>
                        {dict.navbar.myBookings || 'My Bookings'}
                    </Link>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsSocialModalOpen(true)}
                            className="text-slate-600 hover:text-emerald-500 transition-colors"
                        >
                            {dict.navbar.about}
                        </button>
                        <div className="flex items-center gap-1 border-s border-slate-200 ps-2 rtl:border-r rtl:border-l-0 rtl:ps-2 rtl:pr-0">
                            <a
                                href="https://www.instagram.com/khasabclub/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pink-600 hover:text-pink-700 hover:scale-110 transition-transform p-1"
                                title="Instagram"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            </a>
                            <a
                                href="https://www.youtube.com/channel/UCsqt2mRPstJ0wxptDA3KyqA"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-600 hover:text-red-700 hover:scale-110 transition-transform p-1"
                                title="YouTube"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
                            </a>
                        </div>
                    </div>
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 transition-all active:scale-95"
                    >
                        <span className="text-sm font-bold uppercase">{lang === 'ar' ? 'English' : 'عربي'}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-languages"><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" /></svg>
                    </button>
                </div>
            </div>

            <SocialModal
                isOpen={isSocialModalOpen}
                onClose={() => setIsSocialModalOpen(false)}
            />
        </nav>
    );
}
