import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: 'Not a seller' }, { status: 403 });
    }

    return NextResponse.json(sellerProfile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: 'Not a seller' }, { status: 403 });
    }

    const body = await request.json();
    const {
      businessName,
      description,
      phone,
      email,
      website,
      address,
      city,
      state,
      zipCode,
      licenseNumber,
      logo,
      banner,
    } = body;

    if (!businessName) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      );
    }

    const updatedProfile = await prisma.sellerProfile.update({
      where: { id: sellerProfile.id },
      data: {
        businessName,
        description: description || null,
        phone: phone || null,
        email: email || null,
        website: website || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zipCode: zipCode || null,
        licenseNumber: licenseNumber || null,
        logo: logo || null,
        banner: banner || null,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
