'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Navbar } from "@/components/Navbar";
import { BookingForm } from "@/components/BookingForm";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { BookingModal } from "@/components/BookingModal";
import { useLanguage } from "@/components/LanguageProvider";

export default function Home() {
  const { dict, lang } = useLanguage();
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pricePerHour, setPricePerHour] = useState(15);

  const totalPrice = selectedSlots.length * pricePerHour;

  useEffect(() => {
    // Fetch bookings & price on mount
    const fetchData = async () => {
      try {
        const [bookingsRes, settingsRes] = await Promise.all([
          fetch('/api/bookings'),
          fetch('/api/settings')
        ]);

        if (!bookingsRes.ok) {
          console.error('API Error:', bookingsRes.status);
        } else {
          const bookingData = await bookingsRes.json();
          if (bookingData.bookedSlots) setBookedSlots(bookingData.bookedSlots);
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData.price) setPricePerHour(settingsData.price);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, [isModalOpen]);

  const handleSlotToggle = (slotId: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId]
    );
  };

  const clearSelection = () => {
    setSelectedSlots([]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 pt-10 space-y-16">
        {/* Hero Section */}
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {lang === 'ar' ? 'نادي خصب الرياضي' : 'Khasab Sports Club'}
          </div>
          {/* Logo Section */}
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt="Khasab Sports Club Logo"
              width={300}
              height={300}
              priority
              quality={100}
              className="object-contain w-48 md:w-72 h-auto"
            />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight leading-tight">
            {lang === 'ar' ? 'احجز ملعبك في' : 'Book your pitch at'} <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              {lang === 'ar' ? 'نادي خصب الرياضي' : 'Khasab Sports Club'}
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {lang === 'ar'
              ? 'أفضل تجربة كرة قدم في مسندم. احجز الآن واستمتع باللعب.'
              : 'The best football experience in Musandam. Book now and enjoy the game.'}
          </p>
        </section>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start relative">
          {/* Calendar Section */}
          <div className="lg:col-span-8 space-y-6 animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
            <WeeklyCalendar
              selectedSlots={selectedSlots}
              onSlotToggle={handleSlotToggle}
              bookedSlots={bookedSlots} // Pass booked slots
            />
          </div>

          {/* Booking Form Section */}
          <div className="lg:col-span-4 sticky top-24 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
            <BookingForm
              selectedSlots={selectedSlots}
              totalPrice={totalPrice}
              onProceed={() => setIsModalOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/5 blur-3xl"></div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={clearSelection}
        selectedSlots={selectedSlots}
        totalPrice={totalPrice}
      />
    </div>
  );
}
