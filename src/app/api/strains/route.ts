import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const effect = searchParams.get('effect');
    const take = parseInt(searchParams.get('take') || '48');
    const skip = parseInt(searchParams.get('skip') || '0');

    const where: any = { isActive: true };
    
    if (type && type !== 'all') {
      where.type = type.toUpperCase();
    }
    
    if (effect) {
      where.effects = { has: effect };
    }

    const [strains, total] = await Promise.all([
      prisma.strain.findMany({
        where,
        orderBy: { rating: 'desc' },
        take,
        skip,
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          thcMin: true,
          thcMax: true,
          cbdMin: true,
          cbdMax: true,
          effects: true,
          rating: true,
        }
      }),
      prisma.strain.count({ where }),
    ]);

    return NextResponse.json({ strains, total });
  } catch (error) {
    console.error('Error fetching strains:', error);
    return NextResponse.json({ error: 'Failed to fetch strains' }, { status: 500 });
  }
}
