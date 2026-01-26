import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProductBuySection from './ProductBuySection';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, isAvailable: true, seller: { isActive: true } },
    include: { seller: { select: { businessName: true } } },
  });

  if (!product) {
    return { title: 'Product Not Found | Leefii' };
  }

  return {
    title: `${product.name} | Leefii Marketplace`,
    description: product.description.slice(0, 160),
  };
}

export const revalidate = 60;

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: { slug, isAvailable: true, seller: { isActive: true } },
    include: {
      seller: {
        select: {
          id: true,
          businessName: true,
          slug: true,
          logo: true,
          city: true,
          state: true,
          website: true,
          phone: true,
        },
      },
      category: {
        select: { name: true, slug: true },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Increment view count
  await prisma.product.update({
    where: { id: product.id },
    data: { viewCount: { increment: 1 } },
  });

  // Get related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      sellerId: product.sellerId,
      id: { not: product.id },
      isAvailable: true,
    },
    take: 4,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/marketplace" className="hover:text-green-600">
            Marketplace
          </Link>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/marketplace?category=${product.category.slug}`}
                className="hover:text-green-600"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-8xl">
                  📦
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {product.images.slice(1, 5).map((img, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg overflow-hidden shadow-sm"
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i + 2}`}
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
              {product.category && (
                <Link
                  href={`/marketplace?category=${product.category.slug}`}
                  className="inline-block text-sm text-green-600 hover:underline mb-2"
                >
                  {product.category.name}
                </Link>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-gray-500 mb-4">by {product.brand}</p>
              )}

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-green-600">
                  ${Number(product.price).toFixed(2)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ${Number(product.compareAtPrice).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-3 mb-6">
                {product.weight && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Weight</span>
                    <span className="text-gray-900">{product.weight}</span>
                  </div>
                )}
                {product.strainType && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Type</span>
                    <span className="text-gray-900">{product.strainType}</span>
                  </div>
                )}
                {product.strain && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Strain</span>
                    <span className="text-gray-900">{product.strain}</span>
                  </div>
                )}
                {product.thcContent && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">THC</span>
                    <span className="text-gray-900">{product.thcContent}</span>
                  </div>
                )}
                {product.cbdContent && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">CBD</span>
                    <span className="text-gray-900">{product.cbdContent}</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>

              {/* Seller Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    {product.seller.logo ? (
                      <img
                        src={product.seller.logo}
                        alt={product.seller.businessName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-green-600 font-bold text-lg">
                        {product.seller.businessName[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/sellers/${product.seller.slug}`}
                      className="font-medium text-gray-900 hover:text-green-600"
                    >
                      {product.seller.businessName}
                    </Link>
                    {(product.seller.city || product.seller.state) && (
                      <p className="text-sm text-gray-500">
                        {[product.seller.city, product.seller.state]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Buy Section */}
              <ProductBuySection
                productId={product.id}
                sellerId={product.seller.id}
                productName={product.name}
                sellerWebsite={product.seller.website}
                sellerPhone={product.seller.phone}
                sellerName={product.seller.businessName}
              />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              More from {product.seller.businessName}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/marketplace/product/${related.slug}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group"
                >
                  <div className="aspect-square bg-gray-100">
                    {related.images[0] ? (
                      <img
                        src={related.images[0]}
                        alt={related.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        📦
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 truncate">
                      {related.name}
                    </h3>
                    <p className="text-green-600 font-semibold">
                      ${Number(related.price).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
