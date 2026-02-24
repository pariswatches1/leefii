import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

const VALID_CATEGORIES = [
  'WRONG_HOURS',
  'WRONG_PHONE',
  'WRONG_ADDRESS',
  'WRONG_MENU',
  'PERMANENTLY_CLOSED',
  'OTHER',
];

// POST — submit an inaccuracy report (anonymous allowed)
export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const { dispensaryId, category, description, email } = body;

    // Validate dispensaryId
    if (!dispensaryId) {
      return NextResponse.json(
        { error: 'Dispensary ID is required' },
        { status: 400 }
      );
    }

    // Validate category
    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: 'Please select a valid category' },
        { status: 400 }
      );
    }

    // Validate description
    if (!description || description.length < 10) {
      return NextResponse.json(
        { error: 'Description must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Verify dispensary exists
    const dispensary = await prisma.dispensary.findUnique({
      where: { id: dispensaryId },
      select: { id: true, inaccuracyReportsCount: true, menuAccuracyScore: true },
    });

    if (!dispensary) {
      return NextResponse.json(
        { error: 'Dispensary not found' },
        { status: 404 }
      );
    }

    // Create the inaccuracy report
    const report = await prisma.inaccuracyReport.create({
      data: {
        dispensaryId,
        userId: session?.user?.id || null,
        reporterEmail: email || null,
        category,
        description,
      },
    });

    // Update dispensary inaccuracy count and auto-trust scoring
    const newCount = dispensary.inaccuracyReportsCount + 1;
    let newAccuracyScore = dispensary.menuAccuracyScore;

    // Auto-trust scoring logic
    if (newAccuracyScore != null) {
      if (newCount >= 5) {
        newAccuracyScore = Math.min(newAccuracyScore, 50);
      } else if (newCount >= 3) {
        newAccuracyScore = Math.max(0, newAccuracyScore - 10);
      }
    }

    await prisma.dispensary.update({
      where: { id: dispensaryId },
      data: {
        inaccuracyReportsCount: newCount,
        lastReportedInaccuracy: new Date(),
        ...(newAccuracyScore != null ? { menuAccuracyScore: newAccuracyScore } : {}),
      },
    });

    return NextResponse.json(
      {
        success: true,
        report: {
          id: report.id,
          category: report.category,
          createdAt: report.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}

// GET — admin: list all inaccuracy reports
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const dispensaryId = searchParams.get('dispensaryId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build filter
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (dispensaryId) where.dispensaryId = dispensaryId;

    const [reports, total] = await Promise.all([
      prisma.inaccuracyReport.findMany({
        where,
        include: {
          dispensary: {
            select: { name: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.inaccuracyReport.count({ where }),
    ]);

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch reports error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
