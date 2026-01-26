import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET - Check if items are favorited
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ favorited: [] });
    }

    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('type');
    const entityIds = searchParams.get('ids')?.split(',').filter(Boolean) || [];

    if (!entityType || entityIds.length === 0) {
      return NextResponse.json({ favorited: [] });
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
        entityType: entityType.toUpperCase(),
        entityId: { in: entityIds },
      },
      select: { entityId: true },
    });

    const favoritedIds = favorites.map(f => f.entityId);

    return NextResponse.json({ favorited: favoritedIds });
  } catch (error) {
    console.error('Error checking favorites:', error);
    return NextResponse.json({ favorited: [] });
  }
}
