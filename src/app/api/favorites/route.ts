import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { FavoriteType } from '@prisma/client';

// GET - Get user's favorites
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('type'); // STRAIN, DISPENSARY, PRODUCT

    const where: { userId: string; entityType?: FavoriteType } = { userId: session.user.id };
    if (entityType) {
      where.entityType = entityType.toUpperCase() as FavoriteType;
    }

    const favorites = await prisma.favorite.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Get entity details based on type
    const strainIds = favorites.filter(f => f.entityType === 'STRAIN').map(f => f.entityId);
    const dispensaryIds = favorites.filter(f => f.entityType === 'DISPENSARY').map(f => f.entityId);

    const [strains, dispensaries] = await Promise.all([
      strainIds.length > 0
        ? prisma.strain.findMany({
            where: { id: { in: strainIds } },
            select: {
              id: true,
              name: true,
              slug: true,
              type: true,
              thcMin: true,
              thcMax: true,
              effects: true,
              rating: true,
              terpMyrcene: true,
              terpLimonene: true,
              terpCaryophyllene: true,
              terpPinene: true,
              terpLinalool: true,
            },
          })
        : [],
      dispensaryIds.length > 0
        ? prisma.dispensary.findMany({
            where: { id: { in: dispensaryIds } },
            select: {
              id: true,
              name: true,
              slug: true,
              address: true,
              rating: true,
              hasDelivery: true,
              licenseType: true,
            },
          })
        : [],
    ]);

    // Merge favorites with entity details
    const enrichedFavorites = favorites.map(fav => {
      let entity = null;
      if (fav.entityType === 'STRAIN') {
        entity = strains.find(s => s.id === fav.entityId);
      } else if (fav.entityType === 'DISPENSARY') {
        entity = dispensaries.find(d => d.id === fav.entityId);
      }
      return { ...fav, entity };
    });

    return NextResponse.json({ favorites: enrichedFavorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

// POST - Add a favorite
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { entityType, entityId } = body;

    if (!entityType || !entityId) {
      return NextResponse.json({ error: 'Missing entityType or entityId' }, { status: 400 });
    }

    // Validate entityType
    const validTypes = ['STRAIN', 'DISPENSARY', 'PRODUCT'];
    if (!validTypes.includes(entityType.toUpperCase())) {
      return NextResponse.json({ error: 'Invalid entityType' }, { status: 400 });
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_entityType_entityId: {
          userId: session.user.id,
          entityType: entityType.toUpperCase() as FavoriteType,
          entityId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already favorited' }, { status: 409 });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        entityType: entityType.toUpperCase() as FavoriteType,
        entityId,
      },
    });

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}

// DELETE - Remove a favorite
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('type');
    const entityId = searchParams.get('id');

    if (!entityType || !entityId) {
      return NextResponse.json({ error: 'Missing type or id' }, { status: 400 });
    }

    await prisma.favorite.delete({
      where: {
        userId_entityType_entityId: {
          userId: session.user.id,
          entityType: entityType.toUpperCase() as FavoriteType,
          entityId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}
