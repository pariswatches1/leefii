import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      businessName,
      email,
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
      tier,
      password,
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !city || !state || !zipCode || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { email },
    });

    if (existingDoctor) {
      return NextResponse.json(
        { error: 'A listing with this email already exists' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = slugify(businessName || name);
    const existingSlug = await prisma.doctor.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    // Hash password (stored in a separate field for login)
    const passwordHash = await bcrypt.hash(password, 12);

    // Determine monthly rate based on tier
    const monthlyRate = tier === 'PREMIUM' ? 50 : 20;

    // Create the doctor listing
    const doctor = await prisma.doctor.create({
      data: {
        name,
        slug,
        businessName: businessName || null,
        email,
        phone,
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
        subscriptionTier: tier === 'PREMIUM' ? 'PREMIUM' : 'BASIC',
        monthlyRate,
        billingEmail: email,
        isActive: true,
        isVerified: false, // Will be verified after email confirmation
      },
    });

    // Also create a user account for login
    // Check if user with this email exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash,
          role: 'USER', // Can be promoted to DOCTOR role if needed
        },
      });
    }

    return NextResponse.json({
      success: true,
      doctor: {
        id: doctor.id,
        slug: doctor.slug,
        name: doctor.name,
        subscriptionTier: doctor.subscriptionTier,
        monthlyRate: doctor.monthlyRate,
      },
    });
  } catch (error) {
    console.error('Doctor registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
