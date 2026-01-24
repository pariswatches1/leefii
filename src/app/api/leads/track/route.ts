import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Generate a unique tracking code
function generateTrackingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate a session ID for anonymous users
function generateSessionId(): string {
  return `sess_${generateTrackingCode()}${Date.now().toString(36)}`;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();

    const {
      sellerId,
      productId,
      dispensaryId,
      destinationUrl,
      referrerUrl,
      utmSource,
      utmMedium,
      utmCampaign,
    } = body;

    // Validate required fields
    if (!destinationUrl) {
      return NextResponse.json(
        { error: 'Destination URL is required' },
        { status: 400 }
      );
    }

    // Generate unique tracking code
    const trackingCode = generateTrackingCode();

    // Get request metadata
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : null;
    const userAgent = request.headers.get('user-agent');

    // Create lead record
    const lead = await prisma.leadReferral.create({
      data: {
        userId: session?.user?.id || null,
        sessionId: generateSessionId(),
        ipAddress,
        userAgent,
        sellerId: sellerId || null,
        productId: productId || null,
        dispensaryId: dispensaryId || null,
        referrerUrl: referrerUrl || null,
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        destinationUrl,
        trackingCode,
        status: 'CLICKED',
      },
    });

    // Build tracking URL with parameters
    const url = new URL(destinationUrl);
    url.searchParams.set('ref', 'leefii');
    url.searchParams.set('lid', trackingCode);

    // If there's a seller, update their lead count
    if (sellerId) {
      await prisma.sellerPayoutSettings.upsert({
        where: { sellerId },
        update: {
          totalLeads: { increment: 1 },
        },
        create: {
          sellerId,
          totalLeads: 1,
        },
      });
    }

    return NextResponse.json({
      success: true,
      trackingUrl: url.toString(),
      leadId: lead.id,
      trackingCode,
    });
  } catch (error) {
    console.error('Lead tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track lead' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve lead statistics (for sellers)
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the seller profile for this user
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json(
        { error: 'Seller profile not found' },
        { status: 404 }
      );
    }

    // Get lead statistics
    const [totalLeads, clickedLeads, convertedLeads, recentLeads] = await Promise.all([
      // Total leads
      prisma.leadReferral.count({
        where: { sellerId: sellerProfile.id },
      }),
      // Leads in last 30 days
      prisma.leadReferral.count({
        where: {
          sellerId: sellerProfile.id,
          clickedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      // Converted leads
      prisma.leadReferral.count({
        where: {
          sellerId: sellerProfile.id,
          status: 'CONVERTED',
        },
      }),
      // Recent leads (last 10)
      prisma.leadReferral.findMany({
        where: { sellerId: sellerProfile.id },
        orderBy: { clickedAt: 'desc' },
        take: 10,
        include: {
          product: {
            select: { name: true, slug: true },
          },
        },
      }),
    ]);

    // Get payout settings
    const payoutSettings = await prisma.sellerPayoutSettings.findUnique({
      where: { sellerId: sellerProfile.id },
    });

    return NextResponse.json({
      stats: {
        totalLeads,
        last30DaysLeads: clickedLeads,
        convertedLeads,
        conversionRate: totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0',
        pendingPayout: payoutSettings?.pendingPayout || 0,
        totalPaid: payoutSettings?.totalPaid || 0,
      },
      recentLeads: recentLeads.map((lead) => ({
        id: lead.id,
        productName: lead.product?.name || 'Direct visit',
        clickedAt: lead.clickedAt,
        status: lead.status,
        referrerUrl: lead.referrerUrl,
      })),
    });
  } catch (error) {
    console.error('Lead stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead statistics' },
      { status: 500 }
    );
  }
}
