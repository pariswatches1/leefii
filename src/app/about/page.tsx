import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Leefii',
  description: 'Learn about Leefii - your trusted cannabis dispensary directory helping you find the best dispensaries and strains near you.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">About Leefii</h1>
          <p className="text-green-100 text-lg">
            Your trusted guide to finding the best cannabis dispensaries and strains.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              At Leefii, we believe everyone deserves access to accurate, up-to-date information about licensed cannabis dispensaries. Our mission is to connect consumers with trusted, legal dispensaries while providing comprehensive strain information to help you make informed decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-3xl mb-3">🏪</div>
                <h3 className="font-semibold text-gray-900 mb-2">Dispensary Directory</h3>
                <p className="text-gray-600 text-sm">
                  Browse 2,897+ licensed dispensaries across 50 states with real-time hours, contact information, and customer reviews.
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-3xl mb-3">🌿</div>
                <h3 className="font-semibold text-gray-900 mb-2">Strain Database</h3>
                <p className="text-gray-600 text-sm">
                  Explore 5,000+ cannabis strains with detailed information on effects, THC/CBD content, and user ratings.
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="font-semibold text-gray-900 mb-2">Deals & Specials</h3>
                <p className="text-gray-600 text-sm">
                  Find the best cannabis deals and discounts from dispensaries in your area.
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-3xl mb-3">📰</div>
                <h3 className="font-semibold text-gray-900 mb-2">Industry News</h3>
                <p className="text-gray-600 text-sm">
                  Stay informed with the latest cannabis industry news, legislation updates, and market trends.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span><strong>Accuracy:</strong> We verify dispensary information regularly to ensure you have the most current details.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span><strong>Legal Compliance:</strong> We only list licensed, legally operating dispensaries.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span><strong>User Privacy:</strong> Your privacy matters. We never sell your personal information.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span><strong>Education:</strong> We promote responsible cannabis use through accurate information and resources.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              Have questions, feedback, or want to partner with us? We'd love to hear from you. 
              Visit our <a href="/contact" className="text-green-600 hover:underline">contact page</a> to get in touch.
            </p>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
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
