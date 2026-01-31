'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedSlots: string[];
    totalPrice: number;
}

export function BookingModal({ isOpen, onClose, selectedSlots, totalPrice }: BookingModalProps) {
    const { dict, dir } = useLanguage();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', team: '' });
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'TRANSFER'>('TRANSFER');

    useEffect(() => {
        if (isOpen) {
            const savedUser = localStorage.getItem('khasab_user');
            if (savedUser) {
                try {
                    const { name, phone } = JSON.parse(savedUser);
                    setFormData(prev => ({ ...prev, name: name || '', phone: phone || '' }));
                } catch (e) {
                    // Ignore parse error
                }
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    team: formData.team,
                    selectedSlots,
                    totalPrice,
                    paymentMethod,
                }),
            });

            if (res.ok) {
                // Save user details for next time
                localStorage.setItem('khasab_user', JSON.stringify({ name: formData.name, phone: formData.phone }));

                setIsSuccess(true);
                setTimeout(() => {
                    onClose();
                    setIsSuccess(false);
                    setFormData({ name: '', phone: '', team: '' });
                    setPaymentMethod('CASH');
                }, 2000);
            } else {
                alert('Booking failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold font-cairo text-white">
                            {isSuccess ? dict.booking.success : dict.booking.title}
                        </h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 12" /></svg>
                        </button>
                    </div>

                    {!isSuccess ? (
                        <div className="space-y-4">
                            <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700/50">
                                <div className="flex justify-between text-sm text-slate-400 mb-1">
                                    <span>{dict.booking.total} ({selectedSlots.length} slots)</span>
                                    <span className="text-emerald-400 font-bold text-lg">{totalPrice} OMR</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-400 ms-1 block">{dict.booking.name}</label>
                                <input
                                    type="text"
                                    required
                                    placeholder={dict.booking.name}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-700 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-slate-100"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-400 ms-1 block">{dict.booking.phone}</label>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    required
                                    dir="ltr"
                                    placeholder="91234567"
                                    className={`w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-700 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-slate-100 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                                    style={{ textAlign: dir === 'rtl' ? 'end' : 'start' }}
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        setFormData({ ...formData, phone: value });
                                    }}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-400 ms-1 block">{dict.booking.teamName}</label>
                                <input
                                    type="text"
                                    placeholder={dict.booking.teamName}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-700 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-slate-100"
                                    value={formData.team}
                                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                                />
                            </div>

                            {/* Payment Method Section */}
                            <div className="pt-4 border-t border-slate-700/50">
                                <label className="text-sm font-medium text-slate-400 ms-1 block mb-3">Payment Method / طريقة الدفع</label>

                                <div className='p-4 bg-slate-800 rounded-xl border border-slate-700 text-sm space-y-3'>
                                    <div className='flex justify-between border-b border-slate-700 pb-2'>
                                        <span className='text-slate-400'>Payment Type</span>
                                        <span className='text-emerald-400 font-bold'>Transfer via Phone Number</span>
                                    </div>
                                    <div className='flex justify-between border-b border-slate-700 pb-2'>
                                        <span className='text-slate-400'>Phone Number</span>
                                        <div className="text-right">
                                            <span className='text-white font-bold font-mono tracking-wider text-lg'>92594860</span>
                                            <div className="text-[10px] text-slate-500">Bank Muscat (Mobile Payment)</div>
                                        </div>
                                    </div>
                                    <div className='text-center text-xs text-slate-400 pt-1'>
                                        * Please take a screenshot of the transfer.<br />
                                        * يرجى أخذ لقطة شاشة للتحويل.
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirm}
                                disabled={!formData.name || !formData.phone || isSubmitting}
                                className="w-full py-3.5 mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    dict.booking.submit
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-8 space-y-4">
                            <div className="w-20 h-20 rounded-full bg-emerald-500 mx-auto flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-in zoom-in duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-emerald-400">{dict.booking.success}</h3>
                            <p className="text-slate-400">Your booking has been saved.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
