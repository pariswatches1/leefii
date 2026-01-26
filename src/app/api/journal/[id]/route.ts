import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { ConsumptionType, ConsumptionMethod } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const entry = await prisma.journalEntry.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    return NextResponse.json({ error: 'Failed to fetch journal entry' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const existing = await prisma.journalEntry.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      strainId,
      strainName,
      strainType,
      productType,
      amount,
      method,
      consumedAt,
      duration,
      moodBefore,
      energyBefore,
      symptomsBefore,
      effectsPositive,
      effectsNegative,
      overallRating,
      moodAfter,
      energyAfter,
      symptomsAfter,
      notes,
      setting,
      activities,
    } = body;

    const entry = await prisma.journalEntry.update({
      where: { id: params.id },
      data: {
        strainId,
        strainName,
        strainType,
        productType: productType as ConsumptionType,
        amount,
        method: method as ConsumptionMethod,
        consumedAt: consumedAt ? new Date(consumedAt) : undefined,
        duration: duration ? parseInt(duration) : null,
        moodBefore: moodBefore ? parseInt(moodBefore) : null,
        energyBefore: energyBefore ? parseInt(energyBefore) : null,
        symptomsBefore: symptomsBefore || [],
        effectsPositive: effectsPositive || [],
        effectsNegative: effectsNegative || [],
        overallRating: overallRating ? parseInt(overallRating) : undefined,
        moodAfter: moodAfter ? parseInt(moodAfter) : null,
        energyAfter: energyAfter ? parseInt(energyAfter) : null,
        symptomsAfter: symptomsAfter || [],
        notes,
        setting,
        activities: activities || [],
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    return NextResponse.json({ error: 'Failed to update journal entry' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const existing = await prisma.journalEntry.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    await prisma.journalEntry.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return NextResponse.json({ error: 'Failed to delete journal entry' }, { status: 500 });
  }
}
