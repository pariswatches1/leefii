import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to apply' },
        { status: 401 }
      );
    }

    const { businessName, businessType, phone, website, licenseNumber, licenseState, ein, description } = await request.json();

    if (!businessName || !businessType || !phone || !description) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    if (description.length < 50) {
      return NextResponse.json(
        { error: 'Description must be at least 50 characters' },
        { status: 400 }
      );
    }

    // Check if user already has a pending application
    const existingApplication = await prisma.sellerApplication.findUnique({
      where: { userId: session.user.id },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You already have a pending application' },
        { status: 400 }
      );
    }

    // Check if user is already a seller
    const existingProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'You are already a seller' },
        { status: 400 }
      );
    }

    // Create the application
    await prisma.sellerApplication.create({
      data: {
        userId: session.user.id,
        businessName,
        businessType,
        phone,
        website: website || null,
        licenseNumber: licenseNumber || null,
        licenseState: licenseState || null,
        ein: ein || null,
        description,
      },
    });

    return NextResponse.json(
      { message: 'Application submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Seller application error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
