import { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Search Dispensaries | Leefii',
  description: 'Search for cannabis dispensaries by city or name.',
}

type Props = {
  searchParams: { q?: string }
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q || ''
  
  let dispensaries: any[] = []
  let cities: any[] = []
  
  if (query.length >= 2) {
    // Search dispensaries
    dispensaries = await prisma.dispensary.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
          { chainName: { contains: query, mode: 'insensitive' } },
        ]
      },
      include: {
        city: true,
        state: true,
      },
      take: 20,
      orderBy: { rating: 'desc' }
    })

    // Search cities
    cities = await prisma.city.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' }
      },
      include: {
        state: true,
        _count: { select: { dispensaries: true } }
      },
      take: 10,
      orderBy: { dispensaryCount: 'desc' }
    })
  }

  const hasResults = dispensaries.length > 0 || cities.length > 0

  return (
    <div>
      {/* Search Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Search Dispensaries
          </h1>
          
          <form action="/search" method="GET" className="max-w-2xl">
            <div className="flex gap-3">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search city or dispensary name..."
                className="flex-1 px-5 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                autoComplete="off"
                autoFocus
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {query.length > 0 && (
            <p className="text-gray-600 mb-6">
              {hasResults 
                ? `Showing results for "${query}"`
                : `No results found for "${query}"`
              }
            </p>
          )}

          {/* City Results */}
          {cities.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cities</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cities.map((city) => (
                  <Link
                    key={city.id}
                    href={`/dispensaries/${city.state.slug}/${city.slug}`}
                    className="p-4 bg-white border border-gray-200 rounded-xl hover:border-primary-500 hover:shadow transition-all"
                  >
                    <div className="font-semibold text-gray-900">{city.name}</div>
                    <div className="text-sm text-gray-500">
                      {city.state.name} • {city._count.dispensaries} dispensaries
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Dispensary Results */}
          {dispensaries.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Dispensaries</h2>
              <div className="space-y-4">
                {dispensaries.map((dispensary) => (
                  <Link
                    key={dispensary.id}
                    href={`/dispensary/${dispensary.slug}`}
                    className="block p-5 bg-white border border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-lg font-semibold text-gray-900 hover:text-primary-600">
                          {dispensary.name}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {dispensary.address}, {dispensary.city.name}, {dispensary.state.abbreviation} {dispensary.zipCode}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {dispensary.phone}
                        </div>
                        <div className="mt-2 flex gap-2">
                          {dispensary.hasDelivery && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              🚚 Delivery
                            </span>
                          )}
                          {dispensary.licenseType === 'MEDICAL' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              🏥 Medical
                            </span>
                          )}
                        </div>
                      </div>
                      {dispensary.rating > 0 && (
                        <div className="text-right">
                          <div className="inline-flex items-center px-2 py-1 bg-yellow-50 rounded-lg">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1 font-semibold">{dispensary.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {query.length > 0 && !hasResults && (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">Try searching for a different city or dispensary name.</p>
              <Link
                href="/dispensaries"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                Browse All States
              </Link>
            </div>
          )}

          {/* Empty State */}
          {query.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🌿</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Search for dispensaries</h3>
              <p className="text-gray-600">Enter a city name or dispensary to get started.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
