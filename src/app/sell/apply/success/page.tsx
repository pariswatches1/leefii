import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Application Submitted | Leefii',
};

export default function ApplicationSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
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
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Application Submitted!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for applying to sell on Leefii. Our team will review your application and get back to you within 2-3 business days.
        </p>
        <div className="bg-white rounded-2xl shadow-sm p-6 text-left mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">What happens next?</h2>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </span>
              <span className="text-gray-600">
                Our team reviews your application and verifies your business details.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </span>
              <span className="text-gray-600">
                You will receive an email with your application status.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </span>
              <span className="text-gray-600">
                Once approved, you can set up your seller profile and start listing products.
              </span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Back to Home
          </Link>
          <Link
            href="/marketplace"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
