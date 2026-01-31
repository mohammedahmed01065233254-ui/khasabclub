'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';

interface ManualBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const TIME_SLOTS = ['19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00'];
const DAYS_MAP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ManualBookingModal({ isOpen, onClose, onSuccess }: ManualBookingModalProps) {
    const { dict, dir, lang } = useAdmin();
    const [date, setDate] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState(15);
    const [customTotal, setCustomTotal] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);

    useEffect(() => {
        // Fetch current price
        fetch('/api/settings').then(res => res.json()).then(data => setPrice(data.price || 15));
        // Fetch current bookings
        fetch('/api/bookings').then(res => res.json()).then(data => {
            if (data.bookedSlots) setBookedSlots(data.bookedSlots);
        });
    }, [isOpen]);

    // Update customTotal and paidAmount when slots or price change
    useEffect(() => {
        const total = selectedSlots.length * price;
        setCustomTotal(total);
        setPaidAmount(total); // Default to full payment
    }, [selectedSlots, price]);

    if (!isOpen) return null;

    const getDayName = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return DAYS_MAP[d.getDay()];
    };

    const currentDay = getDayName(date);

    const getSlotId = (baseDate: string, time: string) => {
        if (!baseDate) return null;
        const d = new Date(baseDate);
        const hour = parseInt(time.split(':')[0], 10);

        // Late night handling: midnight to 5AM belongs to the session started on previous day visually,
        // but technically it is the NEXT date.
        // BaseDate in input is the "Session Date".
        // If hour < 5, we add 1 day to the ID.
        if (hour < 5) {
            d.setDate(d.getDate() + 1);
        }

        return `${d.toISOString().split('T')[0]}-${time}`;
    };

    const toggleSlot = (time: string) => {
        if (!date) return;
        const slotId = getSlotId(date, time);
        if (!slotId) return;

        if (selectedSlots.includes(slotId)) {
            setSelectedSlots(prev => prev.filter(ID => ID !== slotId));
        } else {
            setSelectedSlots(prev => [...prev, slotId]);
        }
    };

    const isBooked = (time: string) => {
        if (!date) return false;
        const slotId = getSlotId(date, time);
        if (!slotId) return false;
        return bookedSlots.includes(slotId);
    };

    const formatTime = (time: string) => {
        const [hour, minute] = time.split(':').map(Number);
        const displayHour = hour % 12 || 12;
        const isPm = hour >= 12;
        const period = lang === 'AR' ? (isPm ? 'م' : 'ص') : (isPm ? 'PM' : 'AM');
        return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    };

    const handleSubmit = async () => {
        setLoading(true);
        await fetch('/api/bookings', {
            method: 'POST',
            body: JSON.stringify({
                name,
                phone,
                team: 'Walk-in',
                selectedSlots,
                totalPrice: customTotal, // Use customTotal
                paidAmount: paidAmount, // Send paid amount
                paymentMethod: 'CASH' // Default for manual
            })
        });
        setLoading(false);
        onSuccess();
        onClose();
        // Reset
        setDate(''); setName(''); setPhone(''); setSelectedSlots([]); setCustomTotal(0); setPaidAmount(0);
    };

    const remaining = customTotal - paidAmount;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white font-cairo">{dict.manual.title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                    {/* Date */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{dict.manual.date}</label>
                        <input
                            type="date"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500"
                            value={date}
                            onChange={(e) => { setDate(e.target.value); setSelectedSlots([]); }}
                        />
                    </div>

                    {/* Slots */}
                    {currentDay && (
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">{dict.manual.selectSlots} ({currentDay})</label>
                            <div className="grid grid-cols-4 gap-2">
                                {TIME_SLOTS.map(time => {
                                    const booked = isBooked(time);
                                    const slotId = getSlotId(date, time);
                                    const selected = slotId ? selectedSlots.includes(slotId) : false;
                                    return (
                                        <button
                                            key={time}
                                            disabled={booked}
                                            onClick={() => toggleSlot(time)}
                                            className={`py-2 rounded text-sm font-medium transition-colors ${booked ? 'bg-rose-900/20 text-rose-500/50 cursor-not-allowed' :
                                                selected ? 'bg-blue-600 text-white' :
                                                    'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                                }`}
                                        >
                                            {formatTime(time)}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Price and Contact Info */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">{dict.manual.name}</label>
                            <input
                                type="text"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">{dict.manual.phone}</label>
                            <input
                                type="text"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Price and Payment - 2 Columns */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Total Price */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Total Price (OMR)</label>
                            <input
                                type="number"
                                placeholder="0"
                                className={`w-full bg-slate-800 border rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500 font-bold ${customTotal !== selectedSlots.length * price ? 'border-yellow-500/50 text-yellow-400' : 'border-slate-700'}`}
                                value={customTotal || ''}
                                onChange={(e) => setCustomTotal(Number(e.target.value))}
                            />
                        </div>

                        {/* Paid Amount */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Amount Paid Now</label>
                            <input
                                type="number"
                                placeholder="0"
                                className={`w-full bg-slate-800 border rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500 font-bold ${paidAmount < customTotal ? 'border-rose-500/50 text-rose-400' : 'border-emerald-500/50 text-emerald-400'}`}
                                value={paidAmount || ''}
                                onChange={(e) => setPaidAmount(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* Remaining Balance Indicator */}
                    <div className={`text-sm font-bold text-center p-2 rounded ${remaining > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {remaining > 0
                            ? `Remaining Balance: ${remaining} OMR (Partially Paid)`
                            : 'Fully Paid ✅'}
                    </div>

                </div>

                <div className="p-6 border-t border-slate-700 bg-slate-900">
                    <button
                        onClick={handleSubmit}
                        disabled={!name || !phone || selectedSlots.length === 0 || loading}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl disabled:opacity-50"
                    >
                        {loading ? dict.manual.sending : dict.manual.submit}
                    </button>
                </div>
            </div>
        </div>
    );
}
