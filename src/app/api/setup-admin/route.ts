import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// TEMPORARY: Remove this file after making yourself admin
// This is a one-time setup route

const ADMIN_EMAIL = 'pariswatches111@yahoo.com';
const SECRET_KEY = 'leefii-setup-2024-admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (key !== SECRET_KEY) {
    return NextResponse.json({ error: 'Invalid key' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (!user) {
      return NextResponse.json({
        error: `User not found with email: ${ADMIN_EMAIL}`,
        hint: 'Make sure you have registered an account first at /register'
      }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: ADMIN_EMAIL },
      data: { role: 'ADMIN' },
    });

    return NextResponse.json({
      success: true,
      message: `User ${updatedUser.email} is now an ADMIN!`,
      nextSteps: [
        'Go to /admin/applications to review seller applications',
        'Go to /admin/sellers to manage active sellers',
        'DELETE this file (src/app/api/setup-admin/route.ts) for security!'
      ]
    });
  } catch (error) {
    console.error('Error making admin:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
