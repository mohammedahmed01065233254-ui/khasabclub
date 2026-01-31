'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '../AdminContext';

export default function OverviewTab() {
    const { dict } = useAdmin();
    const [stats, setStats] = useState({ todayRevenue: 0, monthlyRevenue: 0, totalBookings: 0 });

    useEffect(() => {
        fetch('/api/admin/stats').then(res => res.json()).then(setStats);
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 font-cairo">{dict.overview.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <p className="text-slate-400 text-sm mb-1">{dict.overview.todayRevenue}</p>
                    <h3 className="text-3xl font-bold text-emerald-400">{stats.todayRevenue} <span className="text-sm">OMR</span></h3>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <p className="text-slate-400 text-sm mb-1">{dict.overview.monthlyRevenue}</p>
                    <h3 className="text-3xl font-bold text-blue-400">{stats.monthlyRevenue} <span className="text-sm">OMR</span></h3>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <p className="text-slate-400 text-sm mb-1">{dict.overview.totalBookings}</p>
                    <h3 className="text-3xl font-bold text-white">{stats.totalBookings}</h3>
                </div>
            </div>
        </div>
    );
}
