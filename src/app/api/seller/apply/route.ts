import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { getSequenceEmail } from '@/lib/email-templates';

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

    // Start B2B email sequence (non-blocking)
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true, name: true, emailOptOut: true },
      });

      if (user && !user.emailOptOut) {
        const welcomeEmail = getSequenceEmail('B2B', 1, session.user.id, businessName);
        if (welcomeEmail) {
          // Send the first email immediately
          await sendEmail({
            to: user.email,
            subject: welcomeEmail.subject,
            html: welcomeEmail.html,
            tags: [
              { name: 'sequence', value: 'B2B' },
              { name: 'step', value: '1' },
            ],
          });

          // Log the sent email
          await prisma.emailLog.create({
            data: {
              userId: session.user.id,
              template: 'B2B_STEP_1',
              subject: welcomeEmail.subject,
            },
          });
        }

        // Create the sequence state for remaining emails (step 2 onwards)
        const nextEmail = getSequenceEmail('B2B', 2, session.user.id);
        const nextSendAt = new Date();
        nextSendAt.setDate(nextSendAt.getDate() + (nextEmail?.delayDays || 3));

        await prisma.emailSequenceState.upsert({
          where: {
            userId_sequence: {
              userId: session.user.id,
              sequence: 'B2B',
            },
          },
          create: {
            userId: session.user.id,
            sequence: 'B2B',
            currentStep: 2,
            nextSendAt,
          },
          update: {
            currentStep: 2,
            nextSendAt,
            completedAt: null,
          },
        });
      }
    } catch (emailError) {
      // Don't fail the application if email fails
      console.error('Failed to start B2B email sequence:', emailError);
    }

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
