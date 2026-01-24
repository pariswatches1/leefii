import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Cannabis Marketplace - Shop Products | Leefii',
  description: 'Browse cannabis flowers, edibles, concentrates, CBD products, and accessories from verified sellers on Leefii Marketplace.',
};

export const revalidate = 60;

interface SearchParams {
  category?: string;
  search?: string;
  page?: string;
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const pageSize = 12;

  const where = {
    isAvailable: true,
    seller: {
      isActive: true,
    },
    ...(params.search && {
      OR: [
        { name: { contains: params.search, mode: 'insensitive' as const } },
        { description: { contains: params.search, mode: 'insensitive' as const } },
        { brand: { contains: params.search, mode: 'insensitive' as const } },
      ],
    }),
    ...(params.category && {
      category: { slug: params.category },
    }),
  };

  const [products, totalCount, categories, featuredProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        seller: {
          select: { businessName: true, slug: true },
        },
        category: {
          select: { name: true, slug: true },
        },
      },
    }),
    prisma.product.count({ where }),
    prisma.productCategory.findMany({
      where: { parentId: null },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.product.findMany({
      where: {
        isFeatured: true,
        isAvailable: true,
        seller: { isActive: true },
      },
      take: 4,
      include: {
        seller: { select: { businessName: true, slug: true } },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">Marketplace</h1>
          <p className="text-green-100 text-lg mb-6">
            Shop cannabis and CBD products from verified sellers
          </p>

          {/* Search */}
          <form className="max-w-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                name="search"
                defaultValue={params.search}
                placeholder="Search products..."
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button
                type="submit"
                className="bg-green-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-900 transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Categories</h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/marketplace"
                    className={`block px-3 py-2 rounded-lg transition ${
                      !params.category
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    All Products
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/marketplace?category=${cat.slug}`}
                      className={`block px-3 py-2 rounded-lg transition ${
                        params.category === cat.slug
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Become a Seller CTA */}
            <div className="bg-green-600 rounded-xl p-6 mt-6 text-white">
              <h3 className="font-semibold mb-2">Want to Sell?</h3>
              <p className="text-green-100 text-sm mb-4">
                Join our marketplace and reach thousands of customers.
              </p>
              <Link
                href="/sell"
                className="block text-center bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition"
              >
                Become a Seller
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Featured Products */}
            {!params.search && !params.category && featuredProducts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Products</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {featuredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/marketplace/product/${product.slug}`}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group"
                    >
                      <div className="aspect-square bg-gray-100 relative">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            📦
                          </div>
                        )}
                        <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
                          Featured
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                        <p className="text-green-600 font-semibold">${Number(product.price).toFixed(2)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {totalCount} product{totalCount !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/marketplace/product/${product.slug}`}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group"
                  >
                    <div className="aspect-square bg-gray-100 relative">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">
                          📦
                        </div>
                      )}
                      {product.compareAtPrice && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          Sale
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      {product.category && (
                        <span className="text-xs text-gray-500">{product.category.name}</span>
                      )}
                      <h3 className="font-medium text-gray-900 mt-1 line-clamp-2 group-hover:text-green-600 transition">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{product.seller.businessName}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-green-600 font-semibold">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-gray-400 text-sm line-through">
                            ${Number(product.compareAtPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                      {product.strainType && (
                        <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {product.strainType}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No products found</h2>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters to find what you are looking for.
                </p>
                <Link
                  href="/marketplace"
                  className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
                >
                  View All Products
                </Link>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/marketplace?page=${page - 1}${params.category ? `&category=${params.category}` : ''}${params.search ? `&search=${params.search}` : ''}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                )}
                <span className="px-4 py-2 text-gray-600">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/marketplace?page=${page + 1}${params.category ? `&category=${params.category}` : ''}${params.search ? `&search=${params.search}` : ''}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
