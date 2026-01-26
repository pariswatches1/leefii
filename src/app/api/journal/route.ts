import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { ConsumptionType, ConsumptionMethod } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const take = parseInt(searchParams.get('take') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');
    const strainId = searchParams.get('strainId');

    const where: any = { userId: session.user.id };
    if (strainId) {
      where.strainId = strainId;
    }

    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where,
        orderBy: { consumedAt: 'desc' },
        take,
        skip,
      }),
      prisma.journalEntry.count({ where }),
    ]);

    return NextResponse.json({ entries, total });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json({ error: 'Failed to fetch journal entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Validate required fields
    if (!strainName || !productType || !method || !overallRating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const entry = await prisma.journalEntry.create({
      data: {
        userId: session.user.id,
        strainId,
        strainName,
        strainType,
        productType: productType as ConsumptionType,
        amount,
        method: method as ConsumptionMethod,
        consumedAt: consumedAt ? new Date(consumedAt) : new Date(),
        duration: duration ? parseInt(duration) : null,
        moodBefore: moodBefore ? parseInt(moodBefore) : null,
        energyBefore: energyBefore ? parseInt(energyBefore) : null,
        symptomsBefore: symptomsBefore || [],
        effectsPositive: effectsPositive || [],
        effectsNegative: effectsNegative || [],
        overallRating: parseInt(overallRating),
        moodAfter: moodAfter ? parseInt(moodAfter) : null,
        energyAfter: energyAfter ? parseInt(energyAfter) : null,
        symptomsAfter: symptomsAfter || [],
        notes,
        setting,
        activities: activities || [],
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    return NextResponse.json({ error: 'Failed to create journal entry' }, { status: 500 });
  }
}
