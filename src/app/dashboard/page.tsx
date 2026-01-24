import Link from 'next/link';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await auth();

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: session!.user!.id },
    include: {
      products: {
        select: { id: true, viewCount: true },
      },
      inquiries: {
        where: { status: 'NEW' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          product: {
            select: { name: true },
          },
        },
      },
    },
  });

  if (!sellerProfile) {
    return null;
  }

  const totalProducts = sellerProfile.products.length;
  const totalViews = sellerProfile.products.reduce((sum, p) => sum + p.viewCount, 0);
  const newInquiries = sellerProfile.inquiries.length;

  const stats = [
    { name: 'Total Products', value: totalProducts, href: '/dashboard/products' },
    { name: 'Total Views', value: totalViews, href: '/dashboard/products' },
    { name: 'New Inquiries', value: newInquiries, href: '/dashboard/inquiries' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {sellerProfile.businessName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here is an overview of your seller dashboard.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500">{stat.name}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard/products/new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            + Add Product
          </Link>
          <Link
            href="/dashboard/profile"
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Edit Profile
          </Link>
          <Link
            href={`/sellers/${sellerProfile.slug}`}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            View Storefront
          </Link>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Inquiries</h2>
          <Link href="/dashboard/inquiries" className="text-green-600 text-sm hover:underline">
            View all
          </Link>
        </div>
        {sellerProfile.inquiries.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {sellerProfile.inquiries.map((inquiry) => (
              <li key={inquiry.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{inquiry.name}</p>
                    <p className="text-sm text-gray-500">{inquiry.email}</p>
                    {inquiry.product && (
                      <p className="text-sm text-gray-500">
                        Product: {inquiry.product.name}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      New
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {inquiry.message}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-8 text-center text-gray-500">
            <p>No inquiries yet. Start by adding some products!</p>
          </div>
        )}
      </div>
    </div>
  );
}
