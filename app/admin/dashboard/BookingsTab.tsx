'use client';

import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { useAdmin } from '../AdminContext';
import ManualBookingModal from './ManualBookingModal';

interface Booking {
    id: string;
    name: string;
    phone: string;
    totalPrice: number;
    paidAmount: number;
    slots: string;
    paymentMethod: string;
    createdAt: string;
}

export default function BookingsTab() {
    const { dict, lang } = useAdmin();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchBookings = () => {
        fetch('/api/admin/bookings')
            .then(res => res.json())
            .then(data => {
                setBookings(data);
                setFilteredBookings(data);
            });
    };

    // Search handler
    const handleSearch = () => {
        const lowerQuery = searchQuery.toLowerCase().trim();
        if (!lowerQuery) {
            setFilteredBookings(bookings);
            return;
        }

        const filtered = bookings.filter(b =>
            b.name.toLowerCase().includes(lowerQuery) ||
            b.phone.includes(lowerQuery)
        );
        setFilteredBookings(filtered);
    };

    const handleClear = () => {
        setSearchQuery('');
        setFilteredBookings(bookings);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm(dict.actions.confirmCancel)) return;
        await fetch(`/api/admin/bookings?id=${id}`, { method: 'DELETE' });
        fetchBookings();
    };

    const exportToExcel = () => {
        const data = bookings.map(b => {
            const slots = JSON.parse(b.slots);
            const date = slots[0]?.split('-').slice(0, 3).join('-') || 'N/A';
            const times = slots.map((s: string) => s.split('-').slice(3).join(':')).join(', ');
            const remaining = b.totalPrice - b.paidAmount;

            let status = 'PENDING';
            if (b.paidAmount >= b.totalPrice) status = 'PAID';
            else if (b.paidAmount > 0) status = 'PARTIAL';

            return {
                Date: date,
                Time: times,
                Customer: b.name,
                Phone: b.phone,
                Type: b.paymentMethod === 'CASH' && b.paidAmount === 0 ? 'Manual' : 'Online/Manual',
                Status: status,
                'Total Price': b.totalPrice,
                'Paid Amount': b.paidAmount,
                'Remaining Debt': remaining,
                'Payment Method': b.paymentMethod
            };
        });

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Bookings");

        const fileName = `Khasab_Club_Bookings_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    const formatTimeSlot = (slot: string) => {
        const parts = slot.split('-');
        const time = parts[parts.length - 1];
        const dateOrDay = parts.slice(0, parts.length - 1).join('-');

        const [hour, minute] = time.split(':').map(Number);

        if (isNaN(hour)) return slot;

        const displayHour = hour % 12 || 12;
        const isPm = hour >= 12;

        const period = lang === 'AR'
            ? (isPm ? 'م' : 'ص')
            : (isPm ? 'PM' : 'AM');

        // Parse date for Arabic day name
        const dateObj = new Date(dateOrDay);
        const dayName = new Intl.DateTimeFormat('ar-EG', { weekday: 'long' }).format(dateObj);

        return (
            <div key={slot} className="whitespace-nowrap flex flex-col items-start gap-0.5">
                <span className="text-sm font-bold text-slate-500 font-mono tracking-wide">
                    {dayName} {dateOrDay}
                </span>
                <span className="text-lg font-extrabold text-blue-400 font-numeric">{displayHour}:{minute.toString().padStart(2, '0')} {period}</span>
            </div>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold font-cairo">{dict.nav.bookings}</h1>
                <div className="flex gap-2">
                    <button
                        onClick={exportToExcel}
                        className="px-4 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-600/30 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                        Export Excel / تصدير
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm flex items-center gap-2"
                    >
                        <span>+</span> {dict.actions.addBooking}
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6 flex gap-2 items-center">
                <div className="flex-1 relative flex gap-2">
                    <input
                        type="text"
                        placeholder="Search by Name or Phone / ابحث بالاسم أو رقم الهاتف"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                    <button
                        onClick={handleSearch}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        Search
                    </button>
                </div>

                {(searchQuery || filteredBookings.length !== bookings.length) && (
                    <button
                        onClick={handleClear}
                        className="px-4 py-3 bg-slate-800 text-slate-400 hover:text-white rounded-xl font-bold transition-colors border border-slate-700"
                    >
                        Clear / مسح
                    </button>
                )}
            </div>

            <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-950 text-slate-200 uppercase font-medium">
                        <tr>
                            <th className="p-4">{dict.headers.name}</th>
                            <th className="p-4">{dict.headers.phone}</th>
                            <th className="p-4">{dict.headers.method || 'Method'}</th>
                            <th className="p-4">{dict.headers.slots}</th>
                            <th className="p-4">{dict.headers.price}</th>
                            <th className="p-4">{dict.headers.actions}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-slate-800/50">
                                    <td className="p-4 font-bold text-white">{booking.name}</td>
                                    <td className="p-4">{booking.phone}</td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2 py-1 rounded font-bold ${booking.paymentMethod === 'TRANSFER' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                            {booking.paymentMethod || 'CASH'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-2 relative">
                                            {JSON.parse(booking.slots).map((slot: string) => (
                                                <div key={slot} className="text-xs bg-slate-800/50 border border-slate-700 px-2 py-1.5 rounded-md w-fit hover:bg-slate-800 transition-colors">
                                                    {formatTimeSlot(slot)}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className={`font-bold ${booking.paidAmount < booking.totalPrice ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                {booking.paidAmount} / {booking.totalPrice} OMR
                                            </span>
                                            {booking.paidAmount < booking.totalPrice && (
                                                <span className="text-[10px] text-rose-500 bg-rose-500/10 px-1 py-0.5 rounded w-fit">
                                                    Partially Paid
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleDelete(booking.id)}
                                            className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded hover:bg-rose-500 hover:text-white transition-colors text-xs font-bold"
                                        >
                                            {dict.actions.delete}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-500">
                                    {searchQuery ? "No bookings found with this name. / لا توجد حجوزات بهذا الاسم." : "No bookings found. / لا توجد حجوزات."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ManualBookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchBookings}
            />
        </div >
    );
}
