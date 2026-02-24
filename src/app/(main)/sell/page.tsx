import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sell on Leefii - List Your Products | Leefii Marketplace',
  description: 'Join thousands of cannabis and CBD sellers on Leefii. List your products, reach more customers, and grow your business with our trusted marketplace.',
};

const tiers = [
  {
    name: 'Basic',
    price: 'Free',
    description: 'Perfect for getting started',
    features: [
      'Up to 10 product listings',
      'Basic seller profile',
      'Customer inquiries',
      'Email support',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Standard',
    price: '$99',
    period: '/month',
    description: 'For growing businesses',
    features: [
      'Up to 50 product listings',
      'Featured seller badge',
      'Priority in search results',
      'Analytics dashboard',
      'Priority support',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Premium',
    price: '$299',
    period: '/month',
    description: 'For established brands',
    features: [
      'Unlimited product listings',
      'Premium placement',
      'Custom storefront',
      'Advanced analytics',
      'Dedicated account manager',
      'API access',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const benefits = [
  {
    title: 'Reach More Customers',
    description: 'Access thousands of cannabis consumers actively searching for products like yours.',
    icon: '👥',
  },
  {
    title: 'Easy Product Management',
    description: 'Simple dashboard to add, edit, and manage your product listings.',
    icon: '📦',
  },
  {
    title: 'Lead Generation',
    description: 'Receive customer inquiries directly to your email or dashboard.',
    icon: '💬',
  },
  {
    title: 'Build Your Brand',
    description: 'Create a professional storefront to showcase your products and brand story.',
    icon: '🏪',
  },
  {
    title: 'Analytics & Insights',
    description: 'Track views, inquiries, and customer engagement with detailed analytics.',
    icon: '📊',
  },
  {
    title: 'Trusted Platform',
    description: 'Join a verified marketplace trusted by consumers and businesses alike.',
    icon: '✓',
  },
];

export default function SellPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Sell on Leefii Marketplace
          </h1>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of cannabis and CBD sellers. List your products, reach more customers, and grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sell/apply"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
            >
              Apply to Sell
            </Link>
            <Link
              href="#pricing"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Why Sell on Leefii?
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Everything you need to grow your cannabis or CBD business online.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Choose the plan that fits your business. Start free and upgrade as you grow.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-8 ${
                  tier.popular
                    ? 'bg-green-600 text-white ring-4 ring-green-600 ring-offset-4'
                    : 'bg-gray-50 text-gray-900'
                }`}
              >
                {tier.popular && (
                  <span className="inline-block bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.period && (
                    <span className={tier.popular ? 'text-green-100' : 'text-gray-500'}>
                      {tier.period}
                    </span>
                  )}
                </div>
                <p className={`mb-6 ${tier.popular ? 'text-green-100' : 'text-gray-600'}`}>
                  {tier.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <svg
                        className={`w-5 h-5 ${tier.popular ? 'text-green-200' : 'text-green-600'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sell/apply"
                  className={`block text-center py-3 rounded-lg font-semibold transition ${
                    tier.popular
                      ? 'bg-white text-green-600 hover:bg-green-50'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: '1', title: 'Apply', description: 'Submit your seller application with business details' },
            { step: '2', title: 'Get Approved', description: 'Our team reviews and approves your application' },
            { step: '3', title: 'List Products', description: 'Add your products with photos and descriptions' },
            { step: '4', title: 'Start Selling', description: 'Receive inquiries and grow your business' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Trust Banner */}
      <div className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Every Listing Verified for Accuracy</h3>
          <p className="text-gray-600 mb-4">
            Our team verifies every dispensary listing. If anything is wrong, we fix it within 24 hours.
          </p>
          <Link href="/how-we-verify" className="text-green-600 font-semibold hover:underline">
            Learn how we verify →
          </Link>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join the Leefii marketplace today and start reaching thousands of new customers.
          </p>
          <Link
            href="/sell/apply"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Apply to Sell
          </Link>
        </div>
      </div>
    </div>
  );
}
