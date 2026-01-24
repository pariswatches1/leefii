import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { action, notes } = await request.json();

    const application = await prisma.sellerApplication.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (action === 'approve') {
      // Generate unique slug for seller
      let slug = slugify(application.businessName);
      const existingSeller = await prisma.sellerProfile.findUnique({
        where: { slug },
      });
      if (existingSeller) {
        slug = `${slug}-${Date.now()}`;
      }

      // Create seller profile and update application in a transaction
      await prisma.$transaction([
        prisma.sellerApplication.update({
          where: { id },
          data: {
            status: 'APPROVED',
            adminNotes: notes || null,
            reviewedAt: new Date(),
            reviewedBy: session.user.id,
          },
        }),
        prisma.sellerProfile.create({
          data: {
            userId: application.userId,
            businessName: application.businessName,
            slug,
            phone: application.phone,
            website: application.website,
            licenseNumber: application.licenseNumber,
            description: application.description,
          },
        }),
        prisma.user.update({
          where: { id: application.userId },
          data: { role: 'SELLER' },
        }),
      ]);

      return NextResponse.json({ message: 'Application approved' });
    }

    if (action === 'reject') {
      if (!notes) {
        return NextResponse.json(
          { error: 'Rejection reason is required' },
          { status: 400 }
        );
      }

      await prisma.sellerApplication.update({
        where: { id },
        data: {
          status: 'REJECTED',
          adminNotes: notes,
          reviewedAt: new Date(),
          reviewedBy: session.user.id,
        },
      });

      return NextResponse.json({ message: 'Application rejected' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Admin application error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
