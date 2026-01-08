import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Leefii',
  description: 'Read the terms and conditions for using Leefii cannabis dispensary directory.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-green-100 text-lg">
            Last updated: January 7, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using Leefii (the "Site"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you do not have permission to access the Site. These Terms apply to all visitors, users, and others who access or use the Site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Age Requirement</h2>
            <p className="text-gray-600 leading-relaxed">
              You must be at least 21 years of age to use this Site. By using this Site, you represent and warrant that you are at least 21 years old and have the legal capacity to enter into these Terms. If you are under 21, you are not permitted to use this Site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Use of the Site</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Leefii provides a directory of licensed cannabis dispensaries and cannabis strain information for informational purposes only. By using our Site, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Use the Site only for lawful purposes</li>
              <li>Not use the Site in any way that violates applicable federal, state, local, or international law</li>
              <li>Not attempt to gain unauthorized access to any portion of the Site</li>
              <li>Not use the Site to transmit any harmful, offensive, or illegal content</li>
              <li>Not use any automated means to access the Site for any purpose without our express written permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>Important:</strong> Leefii is an informational directory only. We do not sell, distribute, or provide cannabis products. We are not a dispensary, and we do not facilitate the purchase or sale of cannabis.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              The information provided on this Site, including but not limited to dispensary listings, strain information, and cannabis-related content, is for general informational purposes only. While we strive to keep the information up to date and accurate, we make no representations or warranties of any kind, express or implied, about:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>The completeness, accuracy, reliability, or availability of any information on the Site</li>
              <li>The legal status of cannabis in your jurisdiction</li>
              <li>The operating status, hours, or services of any listed dispensary</li>
              <li>The effects, potency, or safety of any cannabis strains</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal Compliance</h2>
            <p className="text-gray-600 leading-relaxed">
              Cannabis laws vary by jurisdiction. It is your responsibility to understand and comply with all applicable federal, state, and local laws regarding cannabis use in your area. Leefii does not encourage or condone the illegal use, possession, or distribution of cannabis. Always verify that cannabis is legal in your jurisdiction before visiting a dispensary or purchasing cannabis products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Links</h2>
            <p className="text-gray-600 leading-relaxed">
              Our Site may contain links to third-party websites or services that are not owned or controlled by Leefii. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that Leefii shall not be responsible or liable for any damage or loss caused by or in connection with the use of any such content, goods, or services available on or through any such websites or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Content</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you submit reviews, comments, or other content to our Site, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and distribute that content. You represent and warrant that:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>You own or have the necessary rights to the content you submit</li>
              <li>Your content does not violate the privacy rights, publicity rights, copyright, or other rights of any person</li>
              <li>Your content is accurate and not misleading</li>
              <li>Your content does not contain any illegal, offensive, or harmful material</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              The Site and its original content, features, and functionality are and will remain the exclusive property of Leefii. The Site is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Leefii.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              To the maximum extent permitted by applicable law, in no event shall Leefii, its affiliates, directors, employees, or agents be liable for any indirect, punitive, incidental, special, consequential, or exemplary damages, including without limitation damages for loss of profits, goodwill, use, data, or other intangible losses, arising out of or relating to your use of, or inability to use, the Site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to defend, indemnify, and hold harmless Leefii and its affiliates, licensors, and service providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees arising out of or relating to your violation of these Terms or your use of the Site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Site after any revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="text-gray-600 mt-4 space-y-2">
              <li><strong>Email:</strong> legal@leefii.com</li>
              <li><strong>Website:</strong> <a href="/contact" className="text-green-600 hover:underline">leefii.com/contact</a></li>
            </ul>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-white font-bold">Leefii</span>
            </div>
            <p className="text-sm">© 2026 Leefii. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
