import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { email: session.user.email },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 });
    }

    return NextResponse.json({ doctor });
  } catch (error) {
    console.error('Doctor profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingDoctor = await prisma.doctor.findUnique({
      where: { email: session.user.email },
    });

    if (!existingDoctor) {
      return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 });
    }

    const body = await request.json();

    const {
      name,
      businessName,
      phone,
      website,
      description,
      address,
      city,
      state,
      zipCode,
      services,
      telemedicine,
      walkInsWelcome,
      acceptsInsurance,
      licenseNumber,
      licenseState,
      npiNumber,
    } = body;

    // Validate required fields
    if (!name || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { id: existingDoctor.id },
      data: {
        name,
        businessName: businessName || null,
        phone: phone || null,
        website: website || null,
        description: description || null,
        address: address || null,
        city,
        state,
        zipCode,
        services: services || [],
        telemedicine: telemedicine || false,
        walkInsWelcome: walkInsWelcome || false,
        acceptsInsurance: acceptsInsurance || false,
        licenseNumber: licenseNumber || null,
        licenseState: licenseState || null,
        npiNumber: npiNumber || null,
      },
    });

    return NextResponse.json({
      success: true,
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error('Doctor profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
