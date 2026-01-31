import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const bookings = await prisma.booking.findMany();

        // Today's Revenue
        const todayRevenue = bookings
            .filter(b => b.createdAt >= today)
            .reduce((sum, b) => sum + b.totalPrice, 0);

        // Monthly Revenue
        const monthlyRevenue = bookings
            .filter(b => b.createdAt >= startOfMonth)
            .reduce((sum, b) => sum + b.totalPrice, 0);

        // Total Bookings
        const totalBookings = bookings.length;

        return NextResponse.json({ todayRevenue, monthlyRevenue, totalBookings });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
