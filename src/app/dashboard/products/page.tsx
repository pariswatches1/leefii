import Link from 'next/link';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function ProductsPage() {
  const session = await auth();

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: session!.user!.id },
    include: {
      products: {
        orderBy: { createdAt: 'desc' },
        include: {
          category: {
            select: { name: true },
          },
        },
      },
    },
  });

  if (!sellerProfile) {
    return null;
  }

  const tierLimits: Record<string, number> = {
    BASIC: 10,
    STANDARD: 50,
    PREMIUM: Infinity,
  };

  const productLimit = tierLimits[sellerProfile.subscriptionTier] || 10;
  const canAddMore = sellerProfile.products.length < productLimit;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            {sellerProfile.products.length} of {productLimit === Infinity ? 'unlimited' : productLimit} products
          </p>
        </div>
        {canAddMore ? (
          <Link
            href="/dashboard/products/new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            + Add Product
          </Link>
        ) : (
          <button
            disabled
            className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg font-medium cursor-not-allowed"
            title="Upgrade to add more products"
          >
            Limit Reached
          </button>
        )}
      </div>

      {sellerProfile.products.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sellerProfile.products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0">
                        {product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">{product.name}</p>
                        {product.brand && (
                          <p className="text-sm text-gray-500">{product.brand}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.viewCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        product.isAvailable
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {product.isAvailable ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h2>
          <p className="text-gray-600 mb-6">
            Start listing your products to reach more customers.
          </p>
          <Link
            href="/dashboard/products/new"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Add Your First Product
          </Link>
        </div>
      )}
    </div>
  );
}
