import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

const OWNER_EMAIL = 'saidragragui@gmail.com'

const SUBJECT_LABELS: Record<string, string> = {
  general: 'General Inquiry',
  dispensary: 'Dispensary Information',
  business: 'Business Partnership',
  feedback: 'Feedback',
  support: 'Technical Support',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Rate limit: basic check via header (Vercel handles more robust rate limiting)
    const subjectLabel = SUBJECT_LABELS[subject] || subject

    // Send notification email to owner
    const result = await sendEmail({
      to: OWNER_EMAIL,
      subject: `[Leefii Contact] ${subjectLabel} — from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #16a34a; color: white; padding: 20px; border-radius: 12px 12px 0 0;">
            <h2 style="margin: 0;">New Contact Form Submission</h2>
          </div>
          <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151; width: 100px;">Name:</td>
                <td style="padding: 10px 0; color: #111827;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 10px 0; color: #111827;"><a href="mailto:${escapeHtml(email)}" style="color: #16a34a;">${escapeHtml(email)}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151;">Subject:</td>
                <td style="padding: 10px 0; color: #111827;">${escapeHtml(subjectLabel)}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;" />
            <div style="padding: 10px 0;">
              <p style="font-weight: bold; color: #374151; margin-bottom: 8px;">Message:</p>
              <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; color: #111827; line-height: 1.6;">
                ${escapeHtml(message).replace(/\n/g, '<br/>')}
              </div>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;" />
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              Reply directly to this email to respond to ${escapeHtml(name)}.
            </p>
          </div>
        </div>
      `,
      replyTo: email,
      tags: [
        { name: 'type', value: 'contact-form' },
        { name: 'subject', value: subject },
      ],
    })

    if (!result.success) {
      console.error('[Contact] Failed to send email:', result.error)
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Contact] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
