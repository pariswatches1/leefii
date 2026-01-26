import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { DayOfWeek } from '@prisma/client';

const DAY_MAP: DayOfWeek[] = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

const DAY_INDEX_MAP: Record<DayOfWeek, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { email: session.user.email },
      include: { businessHours: true },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 });
    }

    // Convert enum to numbers for frontend
    const hoursWithNumbers = doctor.businessHours.map((h) => ({
      ...h,
      dayOfWeek: DAY_INDEX_MAP[h.dayOfWeek],
    }));

    return NextResponse.json({ hours: hoursWithNumbers });
  } catch (error) {
    console.error('Doctor hours fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch hours' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { email: session.user.email },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const { hours } = body;

    if (!hours || !Array.isArray(hours)) {
      return NextResponse.json({ error: 'Invalid hours data' }, { status: 400 });
    }

    // Delete existing hours and create new ones
    await prisma.doctorHours.deleteMany({
      where: { doctorId: doctor.id },
    });

    await prisma.doctorHours.createMany({
      data: hours.map((h: { dayOfWeek: number; openTime: string; closeTime: string; isClosed: boolean }) => ({
        doctorId: doctor.id,
        dayOfWeek: DAY_MAP[h.dayOfWeek],
        openTime: h.openTime,
        closeTime: h.closeTime,
        isClosed: h.isClosed,
      })),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Doctor hours update error:', error);
    return NextResponse.json({ error: 'Failed to update hours' }, { status: 500 });
  }
}
