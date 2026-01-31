import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone) {
        return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    try {
        const bookings = await prisma.booking.findMany({
            where: {
                phone: phone,
                status: { not: 'CANCELLED' } // Only show active bookings? Or all history? User said "Booking History", so ALL.
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(bookings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const booking = await prisma.booking.findUnique({ where: { id } });
        if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

        // Logic check: 6 hours before
        // Parse the first slot date/time
        // Format: 'YYYY-MM-DD-HH:MM'
        let firstSlot = '';
        try {
            const slots = JSON.parse(booking.slots);
            if (slots.length > 0) firstSlot = slots[0]; // e.g. "2024-01-28-16:00"
        } catch (e) { }

        if (firstSlot) {
            // "2024-01-28-16:00"
            // Split to get parts
            const [y, m, d, t] = firstSlot.split('-');
            const [h, min] = t.split(':');
            const bookingTime = new Date(
                parseInt(y),
                parseInt(m) - 1,
                parseInt(d),
                parseInt(h),
                parseInt(min)
            );

            const now = new Date();
            const diffMs = bookingTime.getTime() - now.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);

            if (diffHours < 6) {
                return NextResponse.json({ error: 'Too late to cancel (less than 6 hours)' }, { status: 400 });
            }
        }

        const updated = await prisma.booking.update({
            where: { id },
            data: { status: 'CANCELLED' }
        });

        return NextResponse.json({ success: true, booking: updated });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
    }
}
