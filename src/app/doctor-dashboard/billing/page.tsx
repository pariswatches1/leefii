import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function DoctorBillingPage() {
  const session = await auth();

  const doctor = await prisma.doctor.findUnique({
    where: { email: session?.user?.email! },
  });

  if (!doctor) {
    return null;
  }

  const tierBenefits = {
    FREE: [
      'Basic listing in directory',
      'Contact information displayed',
    ],
    BASIC: [
      'Enhanced listing visibility',
      'Priority placement over free listings',
      'Lead tracking & analytics',
      'Business hours display',
      'Service listings',
      'Phone & website links',
    ],
    PREMIUM: [
      'Everything in Basic',
      'Featured badge on listing',
      'Top placement in search results',
      'Premium support',
      'Custom profile URL',
      'Review management tools',
    ],
  };

  const tierPricing = {
    FREE: 0,
    BASIC: 20,
    PREMIUM: 50,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600 mt-1">Manage your subscription plan</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
            <div className="mt-2 flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                doctor.subscriptionTier === 'PREMIUM'
                  ? 'bg-purple-100 text-purple-700'
                  : doctor.subscriptionTier === 'BASIC'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {doctor.subscriptionTier}
              </span>
              {doctor.subscriptionTier !== 'FREE' && (
                <span className="text-2xl font-bold text-gray-900">
                  ${Number(doctor.monthlyRate)}/mo
                </span>
              )}
            </div>
            <p className={`mt-2 text-sm ${
              doctor.subscriptionStatus === 'ACTIVE'
                ? 'text-green-600'
                : doctor.subscriptionStatus === 'PAST_DUE'
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}>
              Status: {doctor.subscriptionStatus}
            </p>
          </div>
          {doctor.subscriptionTier !== 'PREMIUM' && (
            <Link
              href="/doctors/register?upgrade=true"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Upgrade Plan
            </Link>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Your Plan Includes:</h3>
          <ul className="space-y-2">
            {tierBenefits[doctor.subscriptionTier].map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Available Plans */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['FREE', 'BASIC', 'PREMIUM'] as const).map((tier) => (
            <div
              key={tier}
              className={`bg-white rounded-xl border-2 p-6 ${
                doctor.subscriptionTier === tier
                  ? 'border-blue-500'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{tier}</h3>
                {doctor.subscriptionTier === tier && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    Current
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-4">
                ${tierPricing[tier]}
                <span className="text-sm font-normal text-gray-500">/month</span>
              </p>
              <ul className="space-y-2 mb-6">
                {tierBenefits[tier].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
              {doctor.subscriptionTier !== tier && (
                <button
                  className={`w-full py-2 rounded-lg text-sm font-medium transition ${
                    tier === 'FREE'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {tier === 'FREE' ? 'Downgrade' : 'Upgrade'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
        {doctor.stripeCustomerId ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                  <rect width="32" height="20" rx="2" fill="#1A1F71" />
                  <text x="8" y="14" fill="white" fontSize="8" fontWeight="bold">VISA</text>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-xs text-gray-500">Expires 12/25</p>
              </div>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              Update
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-3">No payment method on file</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
              Add Payment Method
            </button>
          </div>
        )}
      </div>

      {/* Billing Contact */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Contact</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Billing email</p>
            <p className="font-medium text-gray-900">{doctor.billingEmail || doctor.email}</p>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700">
            Change
          </button>
        </div>
      </div>
    </div>
  );
}
