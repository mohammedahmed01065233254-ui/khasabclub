export type Dictionary = {
  navbar: {
    home: string;
    bookNow: string;
    language: string;
    contact: string;
    myBookings: string;
    about: string;
  };
  booking: {
    title: string;
    name: string;
    phone: string;
    teamName: string;
    submit: string;
    success: string;
    date: string;
    time: string;
    price: string;
    summary: string;
    total: string;
    proceed: string;
    noSlots: string;
    otp: {
      title: string;
      desc: string;
      send: string;
      verify: string;
      invalid: string;
      placeholder: string;
    };
  };
  calendar: {
    title: string;
    available: string;
    booked: string;
    selected: string;
  };
};

export const en: Dictionary = {
  navbar: {
    home: 'Home',
    bookNow: 'Book Now',
    language: 'عربي',
    contact: 'Contact Us',
    myBookings: 'My Bookings',
    about: 'About',
  },
  booking: {
    title: 'Book Your Pitch',
    name: 'Full Name',
    phone: 'Phone Number',
    teamName: 'Team Name (Optional)',
    submit: 'Confirm Booking',
    success: 'Booking Confirmed!',
    date: 'Date',
    time: 'Time',
    price: 'Price',
    summary: 'Booking Summary',
    total: 'Total',
    proceed: 'Proceed to Book',
    noSlots: 'No slots selected',
    otp: {
      title: 'Verify Phone Number',
      desc: 'We will send a code to your phone.',
      send: 'Send Code',
      verify: 'Verify & Confirm',
      invalid: 'Invalid Code',
      placeholder: 'Enter Code',
    },
  },
  calendar: {
    title: 'Weekly Schedule',
    available: 'Available',
    booked: 'Booked',
    selected: 'Selected',
  },
};

export const ar: Dictionary = {
  navbar: {
    home: 'الرئيسية',
    bookNow: 'احجز الآن',
    language: 'English',
    contact: 'تواصل معنا',
    myBookings: 'حجوزاتي',
    about: 'من نحن',
  },
  booking: {
    title: 'احجز ملعبك',
    name: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    teamName: 'اسم الفريق (اختياري)',
    submit: 'تأكيد الحجز',
    success: 'تم تأكيد الحجز!',
    date: 'التاريخ',
    time: 'الوقت',
    price: 'السعر',
    summary: 'ملخص الحجز',
    total: 'الإجمالي',
    proceed: 'متابعة الحجز',
    noSlots: 'لم يتم اختيار أي وقت',
    otp: {
      title: 'تأكيد رقم الهاتف',
      desc: 'سنقوم بإرسال رمز التحقق إلى هاتفك.',
      send: 'أرسل الرمز',
      verify: 'تحقق وتأكيد',
      invalid: 'رمز غير صحيح',
      placeholder: 'أدخل الرمز',
    },
  },
  calendar: {
    title: 'الجدول الأسبوعي',
    available: 'متاح',
    booked: 'محجوز',
    selected: 'محدد',
  },
};

export const dictionaries = { en, ar };
