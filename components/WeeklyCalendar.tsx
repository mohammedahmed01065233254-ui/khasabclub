'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from './LanguageProvider';

// Time slots as defined previously
const TIME_SLOTS = ['19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00'];

// Helper to format date as YYYY-MM-DD
const toISODate = (date: Date) => {
    return date.toISOString().split('T')[0];
};

interface WeeklyCalendarProps {
    selectedSlots: string[];
    bookedSlots: string[];
    onSlotToggle: (slotId: string) => void;
}

export function WeeklyCalendar({ selectedSlots, bookedSlots, onSlotToggle }: WeeklyCalendarProps) {
    const { dict, lang } = useLanguage();

    // State for the currently visible week buffer
    // defaults to today
    const [currentDate, setCurrentDate] = useState(new Date());

    // Calculate the start of the week (e.g., Sunday or Saturday depending on locale?)
    // Let's stick to a standard viewing window of 7 days starting from the 'currentDate' 
    // OR align to Sunday. Let's align to Sunday to be like a traditional calendar.
    const weekDates = useMemo(() => {
        const start = new Date(currentDate);
        // Reset to previous Sunday (0)
        const day = start.getDay();
        const diff = start.getDate() - day; // adjust when day is sunday
        start.setDate(diff);

        const dates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            dates.push(d);
        }
        return dates;
    }, [currentDate]);

    // Helpers for navigation
    const nextWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + 7);
        setCurrentDate(d);
    };

    const prevWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - 7);
        setCurrentDate(d);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setCurrentDate(new Date(e.target.value));
        }
    };

    const getDayName = (date: Date) => {
        return date.toLocaleDateString(lang === 'ar' ? 'ar-OM' : 'en-US', { weekday: 'short' });
    };

    const formatDateDisplay = (date: Date) => {
        return date.toLocaleDateString(lang === 'ar' ? 'ar-OM' : 'en-US', { day: 'numeric', month: 'short' });
    };

    // Logic to generate the actual Slot ID (YYYY-MM-DD-HH:mm)
    // IMPORTANT: late night slots (00:00, 01:00, 02:00) belong to the NEXT calendar day
    const getSlotId = (baseDate: Date, time: string) => {
        const d = new Date(baseDate);
        const hour = parseInt(time.split(':')[0], 10);
        if (hour < 5) { // 00, 01, 02 are early morning, meaning next day relative to the "Session Start"
            d.setDate(d.getDate() + 1);
        }
        return `${toISODate(d)}-${time}`;
    };

    const isBooked = (slotId: string) => {
        return bookedSlots.includes(slotId);
    };

    const formatTime = (time: string) => {
        const [hour, minute] = time.split(':').map(Number);
        const displayHour = hour % 12 || 12;

        if (lang === 'ar') {
            // Simple check: 12-23 is PM (م), 0-11 is AM (ص)
            const isPm = hour >= 12;
            const periodAr = isPm ? 'م' : 'ص';
            return `${displayHour}:${minute.toString().padStart(2, '0')} ${periodAr}`;
        }

        const isPm = hour >= 12;
        const periodEn = isPm ? 'PM' : 'AM';
        return `${displayHour}:${minute.toString().padStart(2, '0')} ${periodEn}`;
    };

    return (
        <div className="w-full overflow-hidden bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl">
            {/* Header / Navigation */}
            <div className="p-6 border-b border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-white">
                        {weekDates[0].toLocaleDateString(lang === 'ar' ? 'ar-OM' : 'en-US', { month: 'long', year: 'numeric' })}
                    </h2>

                    {/* Navigation Controls */}
                    <div className="flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700">
                        <button onClick={prevWeek} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={lang === 'ar' ? 'rotate-180' : ''}><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <div className="w-px h-4 bg-slate-700 mx-1"></div>
                        <button onClick={nextWeek} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={lang === 'ar' ? 'rotate-180' : ''}><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                    </div>

                    {/* Date Picker Input */}
                    <input
                        type="date"
                        value={toISODate(currentDate)}
                        onChange={handleDateChange}
                        className="bg-slate-800/50 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 [color-scheme:dark]"
                    />
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-slate-300">{dict.calendar.available}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-500/20"></div>
                        <span className="text-slate-300">{dict.calendar.booked}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                        <span className="text-slate-300">{dict.calendar.selected}</span>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
                <div className="min-w-[800px] p-4">
                    {/* Header Row */}
                    <div className="grid grid-cols-8 gap-2 mb-2">
                        <div className="text-center text-slate-500 text-xs font-semibold uppercase tracking-wider py-2 flex items-center justify-center">
                            {dict.booking.time}
                        </div>
                        {weekDates.map((date, i) => (
                            <div key={i} className={`text-center py-2 rounded-lg ${toISODate(date) === toISODate(new Date()) ? 'bg-emerald-950/30 border border-emerald-500/20' : 'bg-slate-800/50'}`}>
                                <div className="text-slate-400 text-xs font-medium mb-0.5">{getDayName(date)}</div>
                                <div className="text-slate-200 font-bold text-sm bg-slate-900/40 inline-block px-2 py-0.5 rounded">{formatDateDisplay(date)}</div>
                            </div>
                        ))}
                    </div>

                    {/* Slots Grid */}
                    <div className="space-y-2">
                        {TIME_SLOTS.map((time) => (
                            <div key={time} className="grid grid-cols-8 gap-2">
                                <div className="flex items-center justify-center text-slate-500 text-xs sm:text-sm font-mono bg-slate-900/30 rounded-lg px-1">
                                    {formatTime(time)}
                                </div>
                                {weekDates.map((date) => {
                                    const slotId = getSlotId(date, time);
                                    const booked = isBooked(slotId);
                                    const isSelected = selectedSlots.includes(slotId);

                                    return (
                                        <button
                                            key={slotId}
                                            disabled={booked}
                                            onClick={() => onSlotToggle(slotId)}
                                            className={`
                        h-12 rounded-lg transition-all duration-200 border relative overflow-hidden group
                        ${booked
                                                    ? 'bg-rose-900/10 border-rose-500/20 text-rose-500/30 cursor-not-allowed'
                                                    : isSelected
                                                        ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-[1.02] z-10'
                                                        : 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/50 hover:bg-emerald-500/20 text-emerald-400'
                                                }
                      `}
                                        >
                                            {booked ? (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="w-8 h-[1px] bg-rose-500/30 rotate-45 absolute"></span>
                                                    <span className="w-8 h-[1px] bg-rose-500/30 -rotate-45 absolute"></span>
                                                </div>
                                            ) : (
                                                <span className="flex items-center justify-center">
                                                    {isSelected ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                    ) : (
                                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-lg">+</span>
                                                    )}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
