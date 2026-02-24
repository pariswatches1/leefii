import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// PATCH — admin: resolve or dismiss a report
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, adminNotes } = body;

    if (!action || !['resolve', 'dismiss'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be "resolve" or "dismiss"' },
        { status: 400 }
      );
    }

    // Fetch the report
    const report = await prisma.inaccuracyReport.findUnique({
      where: { id: params.id },
      include: {
        dispensary: {
          select: { id: true, inaccuracyReportsCount: true, menuAccuracyScore: true },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    if (action === 'resolve') {
      // Mark as resolved
      const updatedReport = await prisma.inaccuracyReport.update({
        where: { id: params.id },
        data: {
          status: 'RESOLVED',
          resolvedAt: new Date(),
          resolvedBy: session.user.email || session.user.name || 'Admin',
          adminNotes: adminNotes || null,
        },
      });

      return NextResponse.json({ success: true, report: updatedReport });
    }

    if (action === 'dismiss') {
      // Mark as dismissed and decrement dispensary count
      const updatedReport = await prisma.inaccuracyReport.update({
        where: { id: params.id },
        data: {
          status: 'DISMISSED',
          resolvedAt: new Date(),
          resolvedBy: session.user.email || session.user.name || 'Admin',
          adminNotes: adminNotes || null,
        },
      });

      // Decrement inaccuracy count on dispensary (floor at 0)
      const newCount = Math.max(0, report.dispensary.inaccuracyReportsCount - 1);
      await prisma.dispensary.update({
        where: { id: report.dispensaryId },
        data: {
          inaccuracyReportsCount: newCount,
        },
      });

      return NextResponse.json({ success: true, report: updatedReport });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Update report error:', error);
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    );
  }
}
