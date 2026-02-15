import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/email/unsubscribe?uid=xxx
 * Unsubscribe a user from email sequences
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('uid');

    if (!userId) {
      return new NextResponse(unsubscribePage('Invalid unsubscribe link.', false), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Update user to opt out of emails
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return new NextResponse(unsubscribePage('User not found.', false), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Set emailOptOut to true
    await prisma.user.update({
      where: { id: userId },
      data: { emailOptOut: true },
    });

    // Mark all active sequences as completed
    await prisma.emailSequenceState.updateMany({
      where: {
        userId,
        completedAt: null,
      },
      data: {
        completedAt: new Date(),
      },
    });

    return new NextResponse(
      unsubscribePage('You have been unsubscribed from Leefii emails.', true),
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new NextResponse(
      unsubscribePage('Something went wrong. Please try again later.', false),
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

function unsubscribePage(message: string, success: boolean): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribe - Leefii</title>
  <style>
    body { margin:0; padding:40px 20px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:#f4f4f5; }
    .container { max-width:480px; margin:0 auto; background:#fff; border-radius:12px; padding:40px; text-align:center; box-shadow:0 1px 3px rgba(0,0,0,0.1); }
    .icon { font-size:48px; margin-bottom:16px; }
    h1 { font-size:20px; color:#111; margin:0 0 12px; }
    p { color:#6b7280; line-height:1.6; margin:0 0 24px; }
    a { color:#16a34a; text-decoration:none; font-weight:500; }
    a:hover { text-decoration:underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">${success ? '✅' : '⚠️'}</div>
    <h1>${message}</h1>
    <p>${success
      ? 'You will no longer receive marketing emails from Leefii. You can always re-subscribe from your account settings.'
      : 'Please contact support@leefii.com if you continue to have issues.'
    }</p>
    <a href="https://leefii.com">Go to Leefii →</a>
  </div>
</body>
</html>`;
}
