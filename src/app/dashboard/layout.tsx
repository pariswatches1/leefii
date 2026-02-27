import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  // Check if user has a seller profile
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!sellerProfile) {
    // Check if they have a pending application
    const application = await prisma.sellerApplication.findUnique({
      where: { userId: session.user.id },
    });

    if (application) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Under Review</h1>
            <p className="text-gray-600 mb-4">
              Your seller application is currently being reviewed. We will notify you once it has been processed.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Status: <span className="font-medium text-yellow-600">{application.status}</span>
            </p>
            <Link
              href="/"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      );
    }

    redirect('/sell/apply');
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Products', href: '/dashboard/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { name: 'Leads', href: '/dashboard/leads', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { name: 'Inquiries', href: '/dashboard/inquiries', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { name: 'Profile', href: '/dashboard/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 hidden lg:block">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-gray-900">Seller Dashboard</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Bottom */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-gray-900">{sellerProfile.businessName}</p>
              <p className="text-xs text-gray-500">{sellerProfile.subscriptionTier} Plan</p>
            </div>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition mt-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back to Leefii
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-gray-900">Dashboard</span>
          </div>
        </div>
        <nav className="flex gap-4 mt-3 overflow-x-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm text-gray-600 hover:text-green-600 whitespace-nowrap"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
