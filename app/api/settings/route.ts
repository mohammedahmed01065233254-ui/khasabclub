import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const config = await prisma.config.findFirst();
        return NextResponse.json({ price: config?.pricePerHour ?? 15 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { price } = await request.json();

        // Upsert equivalent (since ID is 1)
        const count = await prisma.config.count();
        let config;
        if (count === 0) {
            config = await prisma.config.create({
                data: { id: 1, pricePerHour: parseFloat(price) }
            });
        } else {
            config = await prisma.config.update({
                where: { id: 1 },
                data: { pricePerHour: parseFloat(price) }
            });
        }

        return NextResponse.json({ success: true, config });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
