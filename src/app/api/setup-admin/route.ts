import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// This route promotes an existing user to ADMIN role
// IMPORTANT: Delete this file after setting up your admin account!

export async function POST(request: Request) {
  try {
    const { email, secretKey } = await request.json();

    // Simple secret key check - use environment variable in production
    const expectedKey = process.env.ADMIN_SETUP_KEY || 'leefii-admin-setup-2026';

    if (secretKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Invalid secret key' },
        { status: 401 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please register first at /register' },
        { status: 404 }
      );
    }

    if (user.role === 'ADMIN') {
      return NextResponse.json(
        { message: 'User is already an admin' },
        { status: 200 }
      );
    }

    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });

    return NextResponse.json(
      { message: `Successfully made ${email} an admin. You can now login and access /admin/applications` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Setup admin error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
