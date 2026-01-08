import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms and conditions for using Leefii cannabis dispensary directory.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-green-100 text-lg">Last updated: January 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 prose prose-gray max-w-none">
          
          <h2>Agreement to Terms</h2>
          <p>
            By accessing or using Leefii (the "Site"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you do not have permission to access the Site.
          </p>

          <h2>Age Requirement</h2>
          <p>
            <strong>You must be at least 21 years of age to use this Site.</strong> By using this Site, you represent and warrant that you are at least 21 years old. If you are under 21, you are not permitted to use this Site.
          </p>

          <h2>Use of the Site</h2>
          <p>
            Leefii provides a directory of licensed cannabis dispensaries and strain information for informational purposes only. By using our Site, you agree to:
          </p>
          <ul>
            <li>Use the Site only for lawful purposes</li>
            <li>Not violate any applicable laws or regulations</li>
            <li>Not attempt to gain unauthorized access to any portion of the Site</li>
            <li>Not use automated means to access the Site without our permission</li>
          </ul>

          <h2>Disclaimer</h2>
          <p>
            <strong>Important:</strong> Leefii is an informational directory only. We do not sell, distribute, or provide cannabis products. We are not a dispensary, and we do not facilitate the purchase or sale of cannabis.
          </p>
          <p>
            The information provided on this Site is for general informational purposes only. We make no representations or warranties about:
          </p>
          <ul>
            <li>The accuracy or completeness of any information on the Site</li>
            <li>The legal status of cannabis in your jurisdiction</li>
            <li>The operating status or services of any listed dispensary</li>
            <li>The effects or safety of any cannabis strains</li>
          </ul>

          <h2>Legal Compliance</h2>
          <p>
            Cannabis laws vary by jurisdiction. It is your responsibility to understand and comply with all applicable federal, state, and local laws regarding cannabis in your area. Leefii does not encourage or condone illegal cannabis use.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Our Site may contain links to third-party websites. We have no control over the content or practices of these sites and assume no responsibility for them.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            The Site and its original content, features, and functionality are owned by Leefii and are protected by copyright, trademark, and other intellectual property laws.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Leefii shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Site.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Continued use of the Site after changes constitutes acceptance of the new Terms.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about these Terms, please contact us at{' '}
            <a href="mailto:legal@leefii.com" className="text-green-600 hover:underline">legal@leefii.com</a>.
          </p>

        </div>
      </div>
    </div>
  )
}
