import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Leefii collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-green-100 text-lg">Last updated: January 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 prose prose-gray max-w-none">
          
          <h2>Introduction</h2>
          <p>
            Leefii ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website leefii.com.
          </p>

          <h2>Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>We may collect personal information that you voluntarily provide when you:</p>
          <ul>
            <li>Subscribe to our newsletter</li>
            <li>Contact us through our contact form</li>
            <li>Leave reviews or comments</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>When you visit our site, we may automatically collect:</p>
          <ul>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>IP address</li>
            <li>Pages visited and time spent</li>
            <li>Referring website addresses</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our website</li>
            <li>Improve and personalize your experience</li>
            <li>Analyze how our website is used</li>
            <li>Send newsletters and updates (with your consent)</li>
            <li>Respond to your inquiries</li>
          </ul>

          <h2>Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our site and improve your experience. You can instruct your browser to refuse cookies, but some features may not function properly.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            We may use third-party services like Google Analytics to help us understand how our site is used. These services have their own privacy policies governing the use of your information.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2>Your Rights</h2>
          <p>Depending on your location, you may have rights to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Request correction of your data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h2>Children's Privacy</h2>
          <p>
            Our site is not intended for individuals under 21 years of age. We do not knowingly collect information from anyone under 21.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of changes by posting the new policy on this page.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@leefii.com" className="text-green-600 hover:underline">privacy@leefii.com</a>.
          </p>

        </div>
      </div>
    </div>
  )
}
