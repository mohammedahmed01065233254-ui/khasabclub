'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '../AdminContext';

export default function SettingsTab() {
    const { dict } = useAdmin();
    const [price, setPrice] = useState(15);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch('/api/settings').then(res => res.json()).then(data => setPrice(data.price));
    }, []);

    const handleSave = async () => {
        setLoading(true);
        await fetch('/api/settings', {
            method: 'POST',
            body: JSON.stringify({ price }),
        });
        setLoading(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 font-cairo">{dict.settings.title}</h1>
            <div className="max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">{dict.settings.priceLabel}</label>
                        <input
                            type="number"
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-emerald-500 outline-none text-lg font-bold"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-white transition-all disabled:opacity-50"
                    >
                        {loading ? dict.actions.saving : dict.actions.updatePrice}
                    </button>
                    {saved && <p className="text-emerald-400 text-center text-sm">{dict.settings.success}</p>}
                </div>
            </div>
        </div>
    );
}
