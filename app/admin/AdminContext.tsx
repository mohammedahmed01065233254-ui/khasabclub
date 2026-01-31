'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Lang = 'AR' | 'EN';

const adminDict = {
    AR: {
        nav: {
            overview: 'نظرة عامة',
            bookings: 'الحجوزات',
            customers: 'العملاء',
            settings: 'الإعدادات',
            logout: 'تسجيل خروج',
        },
        actions: {
            addBooking: 'إضافة حجز يدوي',
            delete: 'إلغاء',
            save: 'حفظ',
            cancel: 'إغلاق',
            updatePrice: 'تحديث السعر',
            saving: 'جاري الحفظ...',
            confirmCancel: 'هل أنت متأكد أنك تريد إلغاء هذا الحجز؟ لا يمكن التراجع عن هذا الإجراء.',
            deleteSuccess: 'تم إلغاء الحجز بنجاح',
        },
        headers: {
            name: 'الاسم',
            phone: 'الهاتف',
            method: 'طريقة الدفع',
            slots: 'الأوقات',
            price: 'السعر',
            actions: 'إجراءات',
            totalBookings: 'إجمالي الحجوزات',
            visits: 'عدد الحجوزات',
        },
        overview: {
            title: 'لوحة التحكم',
            todayRevenue: 'دخل اليوم',
            monthlyRevenue: 'دخل الشهر',
            totalBookings: 'عدد الحجوزات',
        },
        manual: {
            title: 'حجز يدوي جديد',
            date: 'التاريخ',
            name: 'الاسم',
            phone: 'الهاتف',
            selectSlots: 'اختر الأوقات المتاحة',
            submit: 'تأكيد الحجز',
            success: 'تم الحجز بنجاح',
            sending: 'جاري الحجز...',
        },
        settings: {
            title: 'الإعدادات العامة',
            priceLabel: 'سعر الساعة (ر.ع)',
            success: 'تم تحديث الإعدادات بنجاح',
        }
    },
    EN: {
        nav: {
            overview: 'Overview',
            bookings: 'Bookings',
            customers: 'Customers',
            settings: 'Settings',
            logout: 'Logout',
        },
        actions: {
            addBooking: 'Add Manual Booking',
            delete: 'Cancel',
            save: 'Save',
            cancel: 'Close',
            updatePrice: 'Update Price',
            saving: 'Saving...',
            confirmCancel: 'Are you sure you want to cancel this booking? This action cannot be undone.',
            deleteSuccess: 'Booking cancelled successfully',
        },
        headers: {
            name: 'Name',
            phone: 'Phone',
            method: 'Method',
            slots: 'Slots',
            price: 'Price',
            actions: 'Actions',
            totalBookings: 'Total Bookings',
            visits: 'Total Bookings',
        },
        overview: {
            title: 'Dashboard Overview',
            todayRevenue: "Today's Revenue",
            monthlyRevenue: 'Monthly Revenue',
            totalBookings: 'Total Bookings',
        },
        manual: {
            title: 'New Manual Booking',
            date: 'Date',
            name: 'Name',
            phone: 'Phone',
            selectSlots: 'Select Available Slots',
            submit: 'Confirm Booking',
            success: 'Booking confirmed successfully',
            sending: 'Booking...',
        },
        settings: {
            title: 'Global Settings',
            priceLabel: 'Price Per Hour (OMR)',
            success: 'Settings updated successfully',
        }
    },
};

interface AdminContextType {
    lang: Lang;
    toggleLang: () => void;
    dict: typeof adminDict['AR'];
    dir: 'rtl' | 'ltr';
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>('AR');

    const toggleLang = () => {
        setLang((prev) => (prev === 'AR' ? 'EN' : 'AR'));
    };

    const dir = lang === 'AR' ? 'rtl' : 'ltr';

    return (
        <AdminContext.Provider value={{ lang, toggleLang, dict: adminDict[lang], dir }}>
            <div dir={dir} className="h-full">
                {children}
            </div>
        </AdminContext.Provider>
    );
}

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminLanguageProvider');
    }
    return context;
};
