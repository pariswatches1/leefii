import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Leefii <hello@leefii.com>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://leefii.com';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

/**
 * Send a single email via Resend
 */
export async function sendEmail({ to, subject, html, replyTo, tags }: SendEmailOptions) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('[Email] RESEND_API_KEY not set, skipping email send');
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
      replyTo: replyTo || 'support@leefii.com',
      tags: tags || [],
    });

    if (error) {
      console.error('[Email] Send error:', error);
      return { success: false, error: error.message };
    }

    console.log('[Email] Sent successfully:', data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[Email] Unexpected error:', err);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Generate an unsubscribe URL for a user
 */
export function getUnsubscribeUrl(userId: string): string {
  return `${SITE_URL}/api/email/unsubscribe?uid=${encodeURIComponent(userId)}`;
}

/**
 * Get the site URL for email links
 */
export function getSiteUrl(): string {
  return SITE_URL;
}
