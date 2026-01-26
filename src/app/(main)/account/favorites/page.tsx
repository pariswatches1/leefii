import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  // Get all favorites
  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  // Group favorites by type
  const strainIds = favorites.filter((f) => f.entityType === 'STRAIN').map((f) => f.entityId);
  const dispensaryIds = favorites.filter((f) => f.entityType === 'DISPENSARY').map((f) => f.entityId);
  const productIds = favorites.filter((f) => f.entityType === 'PRODUCT').map((f) => f.entityId);

  // Fetch the actual entities
  const [strains, dispensaries, products] = await Promise.all([
    strainIds.length > 0
      ? prisma.strain.findMany({
          where: { id: { in: strainIds } },
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            imageUrl: true,
            thcMin: true,
            thcMax: true,
          },
        })
      : [],
    dispensaryIds.length > 0
      ? prisma.dispensary.findMany({
          where: { id: { in: dispensaryIds } },
          include: {
            city: { select: { name: true } },
            state: { select: { abbreviation: true } },
          },
        })
      : [],
    productIds.length > 0
      ? prisma.product.findMany({
          where: { id: { in: productIds } },
          include: {
            seller: { select: { businessName: true, slug: true } },
          },
        })
      : [],
  ]);

  const hasAnyFavorites = strains.length > 0 || dispensaries.length > 0 || products.length > 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Saved Items</h1>
        <p className="text-gray-500 mt-1">
          Your favorited strains, dispensaries, and products
        </p>
      </div>

      {!hasAnyFavorites ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No saved items yet</h2>
          <p className="text-gray-500 mb-6">
            Start saving strains, dispensaries, and products you love!
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/strains"
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Browse Strains
            </Link>
            <Link
              href="/marketplace"
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Saved Strains */}
          {strains.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Saved Strains ({strains.length})
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {strains.map((strain) => (
                  <div
                    key={strain.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden group"
                  >
                    <div className="aspect-video bg-gray-100 relative">
                      {strain.imageUrl ? (
                        <img
                          src={strain.imageUrl}
                          alt={strain.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          🌿
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <FavoriteButton
                          entityType="strain"
                          entityId={strain.id}
                          isFavorited={true}
                        />
                      </div>
                    </div>
                    <Link href={`/strains/${strain.slug}`} className="block p-4">
                      <h3 className="font-medium text-gray-900 group-hover:text-green-600">
                        {strain.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          strain.type === 'SATIVA' ? 'bg-orange-100 text-orange-700' :
                          strain.type === 'INDICA' ? 'bg-purple-100 text-purple-700' :
                          strain.type === 'HYBRID' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {strain.type}
                        </span>
                        {(strain.thcMin || strain.thcMax) && (
                          <span className="text-xs text-gray-500">
                            THC: {strain.thcMin || '?'}-{strain.thcMax || '?'}%
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Dispensaries */}
          {dispensaries.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Saved Dispensaries ({dispensaries.length})
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {dispensaries.map((dispensary) => (
                  <div
                    key={dispensary.id}
                    className="bg-white rounded-xl shadow-sm p-4 flex items-start gap-4 group"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      {dispensary.logoUrl ? (
                        <img
                          src={dispensary.logoUrl}
                          alt={dispensary.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-2xl">🏪</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/dispensary/${dispensary.slug}`}
                        className="font-medium text-gray-900 group-hover:text-green-600"
                      >
                        {dispensary.name}
                      </Link>
                      <p className="text-sm text-gray-500 truncate">
                        {dispensary.address}
                      </p>
                      <p className="text-sm text-gray-500">
                        {dispensary.city.name}, {dispensary.state.abbreviation}
                      </p>
                    </div>
                    <FavoriteButton
                      entityType="dispensary"
                      entityId={dispensary.id}
                      isFavorited={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Products */}
          {products.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Saved Products ({products.length})
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden group"
                  >
                    <div className="aspect-square bg-gray-100 relative">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          📦
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <FavoriteButton
                          entityType="product"
                          entityId={product.id}
                          isFavorited={true}
                        />
                      </div>
                    </div>
                    <Link
                      href={`/marketplace/product/${product.slug}`}
                      className="block p-4"
                    >
                      <h3 className="font-medium text-gray-900 group-hover:text-green-600 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {product.seller.businessName}
                      </p>
                      <p className="text-green-600 font-semibold mt-1">
                        ${Number(product.price).toFixed(2)}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
