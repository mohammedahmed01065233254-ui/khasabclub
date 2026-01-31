import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const bookings = await prisma.booking.findMany({
            where: { status: { not: 'CANCELLED' } }
        });

        // Flatten all slots into a single array
        const bookedSlots = bookings.flatMap((b) => JSON.parse(b.slots));

        return NextResponse.json({ bookedSlots });
    } catch (error) {
        console.error('API GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch bookings', details: String(error) }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, team, selectedSlots, totalPrice, paymentMethod, paidAmount } = body;

        // Basic Validation
        if (!name || !phone || !selectedSlots || selectedSlots.length === 0) {
            return NextResponse.json({ error: 'Missing Required Fields' }, { status: 400 });
        }

        const booking = await prisma.booking.create({
            data: {
                name,
                phone,
                teamName: team,
                slots: JSON.stringify(selectedSlots),
                totalPrice,
                paidAmount: paidAmount !== undefined ? paidAmount : totalPrice, // Default full payment if not specified
                paymentMethod: paymentMethod || 'CASH',
            },
        });

        return NextResponse.json({ success: true, booking }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}
