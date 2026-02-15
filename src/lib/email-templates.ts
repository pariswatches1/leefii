import { getUnsubscribeUrl, getSiteUrl } from './email';

// ==========================================
// EMAIL LAYOUT WRAPPER
// ==========================================

function emailLayout(content: string, unsubscribeUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Leefii</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">
    <!-- Header -->
    <div style="background:#16a34a;padding:24px 32px;">
      <a href="${getSiteUrl()}" style="text-decoration:none;display:flex;align-items:center;gap:8px;">
        <div style="width:32px;height:32px;background:rgba(255,255,255,0.2);border-radius:8px;display:inline-flex;align-items:center;justify-content:center;">
          <span style="color:#fff;font-weight:bold;font-size:14px;">L</span>
        </div>
        <span style="color:#fff;font-size:20px;font-weight:bold;">Leefii</span>
      </a>
    </div>

    <!-- Content -->
    <div style="padding:32px;">
      ${content}
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;padding:24px 32px;border-top:1px solid #e5e7eb;">
      <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;">
        You're receiving this because you signed up for Leefii.
      </p>
      <a href="${unsubscribeUrl}" style="font-size:12px;color:#9ca3af;text-decoration:underline;">
        Unsubscribe from emails
      </a>
      <p style="margin:12px 0 0;font-size:12px;color:#d1d5db;">
        &copy; ${new Date().getFullYear()} Leefii. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ==========================================
// B2C CONSUMER SEQUENCE (6 emails)
// ==========================================

export const B2C_SEQUENCE = [
  {
    step: 1,
    delayDays: 0, // Sent immediately on registration
    subject: 'Welcome to Leefii! 🌿 Your cannabis journey starts here',
    template: (userId: string, name?: string) => emailLayout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#111;">Welcome${name ? `, ${name}` : ''}!</h1>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">
        Thanks for joining Leefii — your go-to platform for finding licensed dispensaries, exploring cannabis strains, and discovering great deals near you.
      </p>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 24px;">
        Here's what you can do right now:
      </p>
      <div style="margin:0 0 24px;">
        <a href="${getSiteUrl()}/dispensaries" style="display:inline-block;padding:12px 24px;background:#16a34a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;margin:0 8px 8px 0;">
          Find Dispensaries
        </a>
        <a href="${getSiteUrl()}/strains" style="display:inline-block;padding:12px 24px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
          Browse Strains
        </a>
      </div>
      <p style="color:#4b5563;line-height:1.6;margin:0;">
        Happy exploring!<br>The Leefii Team
      </p>
    `, getUnsubscribeUrl(userId)),
  },
  {
    step: 2,
    delayDays: 2, // 2 days after registration
    subject: 'Find your perfect strain in 60 seconds 🎯',
    template: (userId: string, name?: string) => emailLayout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#111;">Take the Strain Quiz</h1>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">
        Not sure which strain is right for you? Our quiz matches you with strains based on your preferences — effects you want, flavors you enjoy, and what you're looking to treat.
      </p>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 24px;">
        It takes about 60 seconds and gives personalized recommendations from our database of 500+ strains.
      </p>
      <a href="${getSiteUrl()}/quiz" style="display:inline-block;padding:14px 28px;background:#16a34a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
        Take the Quiz →
      </a>
    `, getUnsubscribeUrl(userId)),
  },
  {
    step: 3,
    delayDays: 5, // 5 days after registration
    subject: 'Deals near you — save on your next visit 💰',
    template: (userId: string, name?: string) => emailLayout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#111;">Check Out Local Deals</h1>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">
        Dispensaries on Leefii regularly post exclusive deals and discounts. From first-time patient specials to daily promotions, there's always a way to save.
      </p>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 24px;">
        Browse deals in your area and never pay full price again.
      </p>
      <a href="${getSiteUrl()}/deals" style="display:inline-block;padding:14px 28px;background:#16a34a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
        Browse Deals →
      </a>
    `, getUnsubscribeUrl(userId)),
  },
  {
    step: 4,
    delayDays: 10, // 10 days after registration
    subject: 'Indica, Sativa, or Hybrid? A quick guide 📚',
    template: (userId: string, name?: string) => emailLayout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#111;">Cannabis 101: Know Your Strains</h1>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">
        Understanding the basics makes all the difference:
      </p>
      <div style="margin:0 0 24px;">
        <div style="padding:16px;background:#f0fdf4;border-radius:8px;margin:0 0 12px;">
          <strong style="color:#16a34a;">Sativa</strong>
          <p style="margin:4px 0 0;color:#4b5563;font-size:14px;">Energizing, uplifting. Great for daytime use, creativity, and socializing.</p>
        </div>
        <div style="padding:16px;background:#eef2ff;border-radius:8px;margin:0 0 12px;">
          <strong style="color:#4f46e5;">Indica</strong>
          <p style="margin:4px 0 0;color:#4b5563;font-size:14px;">Relaxing, calming. Best for evening use, pain relief, and sleep.</p>
        </div>
        <div style="padding:16px;background:#fff7ed;border-radius:8px;">
          <strong style="color:#ea580c;">Hybrid</strong>
          <p style="margin:4px 0 0;color:#4b5563;font-size:14px;">Best of both worlds. Balanced effects tailored to specific needs.</p>
        </div>
      </div>
      <a href="${getSiteUrl()}/strains" style="display:inline-block;padding:14px 28px;background:#16a34a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
        Explore All Strains →
      </a>
    `, getUnsubscribeUrl(userId)),
  },
  {
    step: 5,
    delayDays: 17, // ~2.5 weeks after registration
    subject: 'Trending strains this week on Leefii 🔥',
    template: (userId: string, name?: string) => emailLayout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#111;">What's Trending</h1>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">
        Curious what other Leefii users are checking out? Our most-viewed strains change weekly based on what the community is exploring.
      </p>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">
        Plus, you can track your own experiences with our Cannabis Journal — log what you try, rate it, and build your personal strain history.
      </p>
      <div style="margin:0 0 24px;">
        <a href="${getSiteUrl()}/strains" style="display:inline-block;padding:12px 24px;background:#16a34a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;margin:0 8px 8px 0;">
          See Trending Strains
        </a>
        <a href="${getSiteUrl()}/journal" style="display:inline-block;padding:12px 24px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
          Start Your Journal
        </a>
      </div>
    `, getUnsubscribeUrl(userId)),
  },
  {
    step: 6,
    delayDays: 30, // 1 month after registration
    subject: 'We miss you! Come see what\'s new on Leefii 👋',
    template: (userId: string, name?: string) => emailLayout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#111;">It's been a while${name ? `, ${name}` : ''}!</h1>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">
        We've been adding new dispensaries, strains, and deals to Leefii. Here's what you might have missed:
      </p>
      <ul style="color:#4b5563;line-height:1.8;margin:0 0 24px;padding-left:20px;">
        <li>New dispensary listings added weekly</li>
        <li>Updated strain profiles with detailed terpene data</li>
        <li>Cannabis Journal to track your experiences</li>
        <li>Strain comparison tool</li>
        <li>Fresh deals and discounts</li>
      </ul>
      <a href="${getSiteUrl()}" style="display:inline-block;padding:14px 28px;background:#16a34a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
        Visit Leefii →
      </a>
    `, getUnsubscribeUrl(userId)),
  },
];

// ==========================================
// B2B DISPENSARY OWNER SEQUENCE (5 emails)
// ==========================================

export const B2B_SEQUENCE = [
  {
    step: 1,
    delayDays: 0, // Sent immediately on seller application
    subject: 'Thanks for applying to sell on Leefii 🤝',
    template: (userId: string, businessName?: string) => emailLayout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#111;">Application Received!</h1>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">
        Thanks for applying to list ${businessName ? `<strong>${businessName}</strong>` : 'your business'} on Leefii. We're reviewing your application and will get back to you soon.
      </p>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">
        In the meantime, here's what to expect:
      </p>
      <ol style="color:#4b5563;line-height:1.8;margin:0 0 24px;padding-left:20px;">
        <li>We verify your license and business details (1-2 business days)</li>
        <li>Once approved, you'll get access to your Seller Dashboard</li>
        <li>List your products and start reaching thousands of cannabis consumers</li>
      </ol>
      <p style="color:#4b5563;line-height:1.6;margin:0;">
        Questions? Reply to this email — we're here to help.<br>
        The Leefii Team
      </p>
    `, getUnsubscribeUrl(userId)),
  },
  {
    step: 2,
    delayDays: 3, // 3 days after application
    subject: 'How Leefii drives customers to your dispensary 📊',
    template: (userId: string, businessName?: string) => emailLayout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#111;">Grow Your Customer Base</h1>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">
        Leefii connects cannabis consumers with licensed dispensaries. Here's how being on Leefii helps your business:
      </p>
      <div style="margin:0 0 24px;">
        <div style="padding:16px;background:#f0fdf4;border-radius:8px;margin:0 0 12px;">
          <strong style="color:#16a34a;">Local SEO Boost</strong>
          <p style="margin:4px 0 0;color:#4b5563;font-size:14px;">Your listing appears in city and state-specific search results, bringing in organic traffic.</p>
        </div>
        <div style="padding:16px;background:#eef2ff;border-radius:8px;margin:0 0 12px;">
          <strong style="color:#4f46e5;">Product Marketplace</strong>
          <p style="margin:4px 0 0;color:#4b5563;font-size:14px;">List your products and get direct inquiries from interested buyers.</p>
        </div>
        <div style="padding:16px;background:#fff7ed;border-radius:8px;">
          <strong style="color:#ea580c;">Deals & Promotions</strong>
          <p style="margin:4px 0 0;color:#4b5563;font-size:14px;">Post deals to attract price-conscious customers to your store.</p>
        </div>
      </div>
      <a href="${getSiteUrl()}/sell" style="display:inline-block;padding:14px 28px;background:#16a34a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
        Learn More About Selling →
      </a>
    `, getUnsubscribeUrl(userId)),
  },
  {
    step: 3,
    delayDays: 7, // 1 week after application
    subject: 'Dispensaries like yours are growing with Leefii 🚀',
    template: (userId: string, businessName?: string) => emailLayout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#111;">Join a Growing Community</h1>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">
        Dispensaries across the US are using Leefii to reach new customers. Our platform is built specifically for the cannabis industry — we understand the unique challenges you face.
      </p>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">
        What sets Leefii apart:
      </p>
      <ul style="color:#4b5563;line-height:1.8;margin:0 0 24px;padding-left:20px;">
        <li>Cannabis-specific marketplace (no competing with unrelated products)</li>
        <li>Built-in compliance features for licensed businesses</li>
        <li>Analytics dashboard to track views, clicks, and leads</li>
        <li>Direct-to-consumer product listings</li>
        <li>SEO-optimized pages for your products and brand</li>
      </ul>
      <a href="${getSiteUrl()}/marketplace" style="display:inline-block;padding:14px 28px;background:#16a34a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
        See the Marketplace →
      </a>
    `, getUnsubscribeUrl(userId)),
  },
  {
    step: 4,
    delayDays: 14, // 2 weeks after application
    subject: 'Your competitors are on Leefii. Are you? 🏆',
    template: (userId: string, businessName?: string) => emailLayout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#111;">Don't Get Left Behind</h1>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">
        Every day, cannabis consumers search for dispensaries, strains, and deals on Leefii. If you're not listed, those customers are finding your competitors instead.
      </p>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">
        Our free Basic listing gets you started with:
      </p>
      <ul style="color:#4b5563;line-height:1.8;margin:0 0 24px;padding-left:20px;">
        <li>Business profile with hours, location, and contact info</li>
        <li>Up to 10 product listings</li>
        <li>Basic analytics (views, clicks)</li>
        <li>Customer inquiries via the platform</li>
      </ul>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 24px;">
        Upgrade to Premium for priority placement, unlimited products, and advanced analytics.
      </p>
      <a href="${getSiteUrl()}/sell" style="display:inline-block;padding:14px 28px;background:#16a34a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
        Complete Your Setup →
      </a>
    `, getUnsubscribeUrl(userId)),
  },
  {
    step: 5,
    delayDays: 21, // 3 weeks after application
    subject: 'Last chance: Exclusive early-seller benefits ending soon ⏰',
    template: (userId: string, businessName?: string) => emailLayout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#111;">Exclusive Early Access</h1>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">
        As an early seller on Leefii, you get special benefits that won't be available forever:
      </p>
      <div style="padding:20px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;margin:0 0 24px;">
        <ul style="color:#4b5563;line-height:1.8;margin:0;padding-left:20px;">
          <li><strong>Priority placement</strong> in local search results</li>
          <li><strong>Extended free trial</strong> of Premium features</li>
          <li><strong>Dedicated onboarding</strong> — we'll help set up your profile</li>
          <li><strong>Locked-in pricing</strong> as our rates increase</li>
        </ul>
      </div>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 24px;">
        If you have any questions about your application or need help getting started, just reply to this email.
      </p>
      <a href="${getSiteUrl()}/sell" style="display:inline-block;padding:14px 28px;background:#16a34a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
        Get Started Now →
      </a>
    `, getUnsubscribeUrl(userId)),
  },
];

/**
 * Get the email template for a specific sequence and step
 */
export function getSequenceEmail(
  sequence: 'B2C' | 'B2B',
  step: number,
  userId: string,
  name?: string,
): { subject: string; html: string; delayDays: number } | null {
  const seq = sequence === 'B2C' ? B2C_SEQUENCE : B2B_SEQUENCE;
  const email = seq.find((e) => e.step === step);

  if (!email) return null;

  return {
    subject: email.subject,
    html: email.template(userId, name),
    delayDays: email.delayDays,
  };
}

/**
 * Get total number of steps in a sequence
 */
export function getSequenceLength(sequence: 'B2C' | 'B2B'): number {
  return sequence === 'B2C' ? B2C_SEQUENCE.length : B2B_SEQUENCE.length;
}
