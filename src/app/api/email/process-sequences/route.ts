import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { getSequenceEmail, getSequenceLength } from '@/lib/email-templates';

/**
 * GET /api/email/process-sequences
 *
 * Cron-callable endpoint that checks EmailSequenceState for due emails
 * and sends them. Call this every hour or so via Vercel Cron or external cron.
 *
 * Protected by a simple secret key in the Authorization header.
 */
export async function GET(request: Request) {
  try {
    // Simple auth: check for cron secret or admin session
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || process.env.RESEND_API_KEY;

    if (authHeader !== `Bearer ${cronSecret}`) {
      // Also allow admin users
      const { auth } = await import('@/lib/auth');
      const session = await auth();
      if (!session?.user?.id || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Find all sequences that are due and not completed
    const dueSequences = await prisma.emailSequenceState.findMany({
      where: {
        nextSendAt: { lte: new Date() },
        completedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            emailOptOut: true,
          },
        },
      },
      take: 50, // Process max 50 at a time
    });

    let sent = 0;
    let skipped = 0;
    let completed = 0;
    const errors: string[] = [];

    for (const seq of dueSequences) {
      // Skip if user opted out
      if (seq.user.emailOptOut) {
        await prisma.emailSequenceState.update({
          where: { id: seq.id },
          data: { completedAt: new Date() },
        });
        skipped++;
        continue;
      }

      const sequenceType = seq.sequence as 'B2C' | 'B2B';
      const emailData = getSequenceEmail(
        sequenceType,
        seq.currentStep,
        seq.user.id,
        seq.user.name || undefined,
      );

      if (!emailData) {
        // No more emails in sequence — mark as completed
        await prisma.emailSequenceState.update({
          where: { id: seq.id },
          data: { completedAt: new Date() },
        });
        completed++;
        continue;
      }

      // Send the email
      const result = await sendEmail({
        to: seq.user.email,
        subject: emailData.subject,
        html: emailData.html,
        tags: [
          { name: 'sequence', value: sequenceType },
          { name: 'step', value: String(seq.currentStep) },
        ],
      });

      if (result.success) {
        // Log the sent email
        await prisma.emailLog.create({
          data: {
            userId: seq.user.id,
            template: `${sequenceType}_STEP_${seq.currentStep}`,
            subject: emailData.subject,
            status: 'SENT',
          },
        });

        const maxSteps = getSequenceLength(sequenceType);
        const nextStep = seq.currentStep + 1;

        if (nextStep > maxSteps) {
          // Sequence complete
          await prisma.emailSequenceState.update({
            where: { id: seq.id },
            data: {
              currentStep: nextStep,
              completedAt: new Date(),
            },
          });
          completed++;
        } else {
          // Get next email's delay
          const nextEmail = getSequenceEmail(sequenceType, nextStep, seq.user.id);
          const nextDelay = nextEmail?.delayDays || 3;
          const nextSendAt = new Date();
          nextSendAt.setDate(nextSendAt.getDate() + nextDelay);

          await prisma.emailSequenceState.update({
            where: { id: seq.id },
            data: {
              currentStep: nextStep,
              nextSendAt,
            },
          });
        }

        sent++;
      } else {
        errors.push(`Failed to send to ${seq.user.email}: ${result.error}`);
      }
    }

    return NextResponse.json({
      processed: dueSequences.length,
      sent,
      skipped,
      completed,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Process sequences error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
