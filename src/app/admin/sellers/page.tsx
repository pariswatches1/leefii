import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function AdminSellersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const sellers = await prisma.sellerProfile.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { email: true, name: true },
      },
      products: {
        select: { id: true },
      },
      inquiries: {
        select: { id: true },
      },
    },
  });

  const tierLabels: Record<string, string> = {
    BASIC: 'Basic',
    STANDARD: 'Standard',
    PREMIUM: 'Premium',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Active Sellers</h1>
            <p className="text-gray-600 mt-1">
              {sellers.length} seller{sellers.length !== 1 ? 's' : ''} on the platform
            </p>
          </div>
          <Link
            href="/admin/applications"
            className="text-green-600 hover:underline"
          >
            ← View Applications
          </Link>
        </div>

        {sellers.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inquiries
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sellers.map((seller) => (
                  <tr key={seller.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {seller.logo ? (
                            <img
                              src={seller.logo}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-green-600 font-bold">
                              {seller.businessName[0]}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-gray-900">{seller.businessName}</p>
                          <p className="text-sm text-gray-500">{seller.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        seller.subscriptionTier === 'PREMIUM'
                          ? 'bg-yellow-100 text-yellow-700'
                          : seller.subscriptionTier === 'STANDARD'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tierLabels[seller.subscriptionTier]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {seller.products.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {seller.inquiries.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        seller.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {seller.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(seller.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        href={`/sellers/${seller.slug}`}
                        className="text-green-600 hover:underline"
                      >
                        View Store
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🏪</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Sellers Yet</h2>
            <p className="text-gray-600">
              Approved sellers will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
