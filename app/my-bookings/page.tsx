'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';

interface Booking {
    id: string;
    name: string;
    phone: string;
    totalPrice: number;
    paidAmount: number;
    paymentMethod: string;
    status: string;
    slots: string;
    createdAt: string;
}

export default function MyBookingsPage() {
    const { language } = useLanguage();
    const [phone, setPhone] = useState('');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const t = {
        ar: {
            title: 'حجوزاتي',
            subtitle: 'أدخل رقم هاتفك لعرض وإدارة حجوزاتك',
            placeholder: 'رقم الهاتف (9xxxxxxx)',
            search: 'بحث',
            loading: 'جار التحقق...',
            noBookings: 'لا توجد حجوزات لهذا الرقم',
            bookedOn: 'تم الحجز في:',
            cancelled: 'ملغي',
            paid: 'مدفوع',
            partial: 'معلق / جزئي',
            cancelBooking: 'إلغاء الحجز',
            tooLate: 'لا يمكن الإلغاء (الوقت متأخر)',
            confirmCancel: 'هل أنت متأكد من إلغاء الحجز؟',
            cancelSuccess: 'تم إلغاء الحجز بنجاح',
            cancelFail: 'فشل الإلغاء',
            error: 'حدث خطأ ما',
            back: 'رجوع'
        },
        en: {
            title: 'My Bookings',
            subtitle: 'Enter your phone number to manage your bookings',
            placeholder: 'Phone Number',
            search: 'Search',
            loading: 'Searching...',
            noBookings: 'No bookings found',
            bookedOn: 'Booked on:',
            cancelled: 'CANCELLED',
            paid: 'PAID',
            partial: 'PENDING / PARTIAL',
            cancelBooking: 'Cancel Booking',
            tooLate: 'Cancellation unavailable (too late)',
            confirmCancel: 'Are you sure you want to cancel?',
            cancelSuccess: 'Booking cancelled successfully',
            cancelFail: 'Cancellation failed',
            error: 'An error occurred',
            back: 'Back'
        }
    };

    const text = t[language as 'ar' | 'en'] || t.en;

    const handleSearch = async () => {
        if (!phone) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/my-bookings?phone=${phone}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setBookings(data);
            } else {
                setBookings([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setSearched(true);
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm(text.confirmCancel)) return;

        try {
            const res = await fetch('/api/my-bookings', {
                method: 'PATCH',
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
                alert(text.cancelSuccess);
                handleSearch(); // Refresh list
            } else {
                alert(data.error || text.cancelFail);
            }
        } catch (error) {
            alert(text.error);
        }
    };

    const isCancellable = (slotsStr: string) => {
        try {
            const slots = JSON.parse(slotsStr);
            if (!slots.length) return false;
            // "2024-01-29-16:00"
            const firstSlot = slots[0];
            const parts = firstSlot.split('-'); // ["2024", "01", "29", "16:00"]
            if (parts.length < 4) return false;

            const [y, m, d] = parts;
            const t = parts[3];
            const [h, min] = t.split(':');

            const bookingDate = new Date(
                parseInt(y),
                parseInt(m) - 1,
                parseInt(d),
                parseInt(h),
                parseInt(min)
            );

            const now = new Date();
            const diffMs = bookingDate.getTime() - now.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);

            return diffHours >= 6;
        } catch (e) {
            return false;
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-24 pb-12 px-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="max-w-md mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold font-cairo text-emerald-400">
                        {text.title}
                    </h1>
                    <p className="text-slate-400">
                        {text.subtitle}
                    </p>
                </div>

                {/* Search */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setPhone(val);
                        }}
                        placeholder={text.placeholder}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-lg outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading || !phone}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-6 rounded-xl font-bold font-cairo transition-all transform active:scale-95"
                    >
                        {loading ? text.loading : text.search}
                    </button>
                </div>

                {/* Results */}
                <div className="space-y-4">
                    {searched && bookings.length === 0 && (
                        <div className="text-center py-8 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                            {text.noBookings}
                        </div>
                    )}

                    {bookings.map(booking => {
                        const slots = JSON.parse(booking.slots);
                        const cancellable = isCancellable(booking.slots);
                        const isCancelled = booking.status === 'CANCELLED';

                        return (
                            <div key={booking.id} className={`bg-slate-900 border ${isCancelled ? 'border-rose-900/30 opacity-50' : 'border-slate-800'} rounded-2xl p-5 space-y-4 relative overflow-hidden group`}>
                                {/* Status Tag */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex flex-wrap gap-2 text-sm text-emerald-400 mb-1">
                                            {slots.map((s: string) => (
                                                <span key={s} className="bg-emerald-500/10 px-2 py-1 rounded">
                                                    {s.split('-').slice(0, 3).join('-')} <span className="text-white mx-1">|</span> {s.split('-')[3]}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="text-slate-400 text-xs mt-2">
                                            {text.bookedOn} {new Date(booking.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {isCancelled ? (
                                            <span className="bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-xs font-bold border border-rose-500/20">
                                                {text.cancelled}
                                            </span>
                                        ) : (
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${booking.paidAmount >= booking.totalPrice ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                                {booking.paidAmount >= booking.totalPrice
                                                    ? text.paid
                                                    : text.partial}
                                            </span>
                                        )}
                                        <span className="text-white font-bold">{booking.totalPrice} OMR</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                {!isCancelled && (
                                    <div className="pt-4 border-t border-slate-800 flex justify-end">
                                        {cancellable ? (
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                className="text-rose-400 hover:text-rose-300 text-sm font-bold flex items-center gap-1 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                {text.cancelBooking}
                                            </button>
                                        ) : (
                                            <span className="text-slate-600 text-xs italic cursor-not-allowed" title="Cancellation period expired">
                                                {text.tooLate}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
