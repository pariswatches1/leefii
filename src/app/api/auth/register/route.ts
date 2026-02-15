import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { getSequenceEmail } from '@/lib/email-templates';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    // Start B2C email welcome sequence (non-blocking)
    try {
      const welcomeEmail = getSequenceEmail('B2C', 1, user.id, name || undefined);
      if (welcomeEmail) {
        // Send the first email immediately
        await sendEmail({
          to: email,
          subject: welcomeEmail.subject,
          html: welcomeEmail.html,
          tags: [
            { name: 'sequence', value: 'B2C' },
            { name: 'step', value: '1' },
          ],
        });

        // Log the sent email
        await prisma.emailLog.create({
          data: {
            userId: user.id,
            template: 'B2C_STEP_1',
            subject: welcomeEmail.subject,
          },
        });
      }

      // Create the sequence state for remaining emails (step 2 onwards)
      const nextEmail = getSequenceEmail('B2C', 2, user.id);
      const nextSendAt = new Date();
      nextSendAt.setDate(nextSendAt.getDate() + (nextEmail?.delayDays || 2));

      await prisma.emailSequenceState.create({
        data: {
          userId: user.id,
          sequence: 'B2C',
          currentStep: 2,
          nextSendAt,
        },
      });
    } catch (emailError) {
      // Don't fail registration if email fails
      console.error('Failed to start B2C email sequence:', emailError);
    }

    return NextResponse.json(
      { message: 'Account created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
