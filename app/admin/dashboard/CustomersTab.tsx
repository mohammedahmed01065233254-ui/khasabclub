'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '../AdminContext';

interface Customer {
    name: string;
    phone: string;
    visits: number;
}

export default function CustomersTab() {
    const { dict } = useAdmin();
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        fetch('/api/admin/bookings')
            .then(res => res.json())
            .then((data: any[]) => {
                const map = new Map<string, Customer>();
                data.forEach(b => {
                    const key = b.phone; // Unique by phone
                    if (!map.has(key)) {
                        map.set(key, { name: b.name, phone: b.phone, visits: 0 });
                    }
                    map.get(key)!.visits += 1;
                });
                setCustomers(Array.from(map.values()));
            });
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 font-cairo">{dict.nav.customers}</h1>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-950 text-slate-200">
                        <tr>
                            <th className="p-4">{dict.headers.name}</th>
                            <th className="p-4">{dict.headers.phone}</th>
                            <th className="p-4">{dict.headers.totalBookings}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {customers.map((c) => (
                            <tr key={c.phone} className="hover:bg-slate-800/50">
                                <td className="p-4 text-white font-medium">{c.name}</td>
                                <td className="p-4 font-mono">{c.phone}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold">
                                        {c.visits}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
