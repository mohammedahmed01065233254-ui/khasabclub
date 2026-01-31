'use client';

import { useLanguage } from './LanguageProvider';

interface BookingSummaryProps {
    selectedSlots: string[];
    totalPrice: number;
    onProceed: () => void;
}

export function BookingForm({ selectedSlots, totalPrice, onProceed }: BookingSummaryProps) {
    const { dict, dir } = useLanguage();

    return (
        <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-2xl sticky top-24">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></svg>
                </div>
                <h2 className="text-xl font-bold text-white">{dict.booking.summary}</h2>
            </div>

            <div className="space-y-4 mb-6">
                {selectedSlots.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                        <p>{dict.booking.noSlots}</p>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {selectedSlots.map((slot, i) => (
                            <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                                <span className="text-sm font-medium text-slate-300">{slot}</span>
                                <span className="text-xs text-emerald-400 font-mono">{selectedSlots.length > 0 ? (totalPrice / selectedSlots.length).toFixed(0) : 0} OMR</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="border-t border-slate-700/50 pt-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">{dict.booking.total}</span>
                    <span className="text-2xl font-bold text-white">{totalPrice} <span className="text-sm text-emerald-500 font-normal">OMR</span></span>
                </div>
            </div>

            <button
                onClick={onProceed}
                disabled={selectedSlots.length === 0}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            >
                <span>{dict.booking.proceed}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={dir === 'rtl' ? 'rotate-180' : ''}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </button>
        </div>
    );
}
