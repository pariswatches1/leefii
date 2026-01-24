import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET reviews for a specific entity
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dispensaryId = searchParams.get('dispensaryId');
    const strainId = searchParams.get('strainId');
    const productId = searchParams.get('productId');
    const sellerId = searchParams.get('sellerId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build filter
    const where: Record<string, string | boolean> = {
      isApproved: true,
    };

    if (dispensaryId) where.dispensaryId = dispensaryId;
    if (strainId) where.strainId = strainId;
    if (productId) where.productId = productId;
    if (sellerId) where.sellerId = sellerId;

    // Get reviews with pagination
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: { name: true, image: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    // Calculate average rating
    const avgRating = await prisma.review.aggregate({
      where,
      _avg: { rating: true },
      _count: true,
    });

    return NextResponse.json({
      reviews: reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        title: review.title,
        content: review.content,
        isVerified: review.isVerified,
        helpfulCount: review.helpfulCount,
        createdAt: review.createdAt,
        user: {
          name: review.user.name || 'Anonymous',
          image: review.user.image,
        },
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        averageRating: avgRating._avg.rating?.toFixed(1) || '0',
        totalReviews: avgRating._count,
      },
    });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST create a new review
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to write a review' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      dispensaryId,
      strainId,
      productId,
      sellerId,
      rating,
      title,
      content,
    } = body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate content
    if (!content || content.length < 10) {
      return NextResponse.json(
        { error: 'Review must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Must have at least one entity to review
    if (!dispensaryId && !strainId && !productId && !sellerId) {
      return NextResponse.json(
        { error: 'Must specify what you are reviewing' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this entity
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        OR: [
          { dispensaryId: dispensaryId || undefined },
          { strainId: strainId || undefined },
          { productId: productId || undefined },
          { sellerId: sellerId || undefined },
        ].filter((condition) => Object.values(condition)[0] !== undefined),
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this' },
        { status: 400 }
      );
    }

    // Create review (auto-approve for now, can add moderation later)
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        dispensaryId: dispensaryId || null,
        strainId: strainId || null,
        productId: productId || null,
        sellerId: sellerId || null,
        rating,
        title: title || null,
        content,
        isApproved: true, // Auto-approve for now
      },
    });

    // Update the entity's rating
    if (dispensaryId) {
      const stats = await prisma.review.aggregate({
        where: { dispensaryId, isApproved: true },
        _avg: { rating: true },
        _count: true,
      });
      await prisma.dispensary.update({
        where: { id: dispensaryId },
        data: {
          rating: stats._avg.rating || 0,
          reviewsCount: stats._count,
        },
      });
    }

    if (strainId) {
      const stats = await prisma.review.aggregate({
        where: { strainId, isApproved: true },
        _avg: { rating: true },
        _count: true,
      });
      await prisma.strain.update({
        where: { id: strainId },
        data: {
          rating: stats._avg.rating || 0,
          reviewsCount: stats._count,
        },
      });
    }

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        rating: review.rating,
        title: review.title,
        content: review.content,
        createdAt: review.createdAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
