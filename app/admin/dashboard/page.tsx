'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLanguageProvider, useAdmin } from '../AdminContext';

// Tabs
import OverviewTab from './OverviewTab';
import BookingsTab from './BookingsTab';
import CustomersTab from './CustomersTab';
import SettingsTab from './SettingsTab';

function DashboardContent() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const { lang, toggleLang, dict, dir } = useAdmin();

    useEffect(() => {
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, val] = cookie.trim().split('=');
            acc[key] = val;
            return acc;
        }, {} as Record<string, string>);

        if (cookies['admin_auth'] !== 'true') {
            router.push('/admin');
        }
    }, [router]);

    const tabs = [
        { id: 'overview', label: dict.nav.overview, icon: '📊' },
        { id: 'bookings', label: dict.nav.bookings, icon: '📅' },
        { id: 'customers', label: dict.nav.customers, icon: '👥' },
        { id: 'settings', label: dict.nav.settings, icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white flex transition-all">
            {/* Sidebar */}
            <aside className={`w-64 border-slate-800 p-6 flex flex-col hidden md:flex ${dir === 'rtl' ? 'border-l' : 'border-r'}`}>
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-xl font-bold font-cairo text-emerald-400">Khasab Admin</h2>
                    <button
                        onClick={toggleLang}
                        className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 hover:text-white"
                    >
                        {lang === 'AR' ? '🇺🇸 EN' : '🇴🇲 AR'}
                    </button>
                </div>

                <nav className="flex-1 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === tab.id
                                    ? 'bg-emerald-600/20 text-emerald-400'
                                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                                } ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                        >
                            <span>{tab.icon}</span>
                            <span className="font-medium font-cairo">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <button
                    onClick={() => { document.cookie = "admin_auth=; max-age=0; path=/"; router.push('/admin'); }}
                    className={`text-slate-500 hover:text-white text-sm ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                >
                    {dict.nav.logout}
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8 md:hidden">
                    <h2 className="text-xl font-bold">Admin</h2>
                    <button onClick={toggleLang}>{lang}</button>
                </header>

                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'bookings' && <BookingsTab />}
                {activeTab === 'customers' && <CustomersTab />}
                {activeTab === 'settings' && <SettingsTab />}
            </main>
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <AdminLanguageProvider>
            <DashboardContent />
        </AdminLanguageProvider>
    );
}
