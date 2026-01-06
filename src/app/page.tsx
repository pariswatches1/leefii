import { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Find Cannabis Dispensaries Near You | Leefii',
  description: 'Leefii helps you find licensed cannabis dispensaries near you. Browse by state or city, compare hours and locations, and call directly.',
}

// Featured states with dispensary counts
const FEATURED_STATES = [
  { name: 'California', slug: 'california', abbr: 'CA', count: 0 },
  { name: 'Florida', slug: 'florida', abbr: 'FL', count: 0 },
  { name: 'Colorado', slug: 'colorado', abbr: 'CO', count: 0 },
  { name: 'Michigan', slug: 'michigan', abbr: 'MI', count: 0 },
  { name: 'Illinois', slug: 'illinois', abbr: 'IL', count: 0 },
  { name: 'Nevada', slug: 'nevada', abbr: 'NV', count: 0 },
  { name: 'Arizona', slug: 'arizona', abbr: 'AZ', count: 0 },
  { name: 'Massachusetts', slug: 'massachusetts', abbr: 'MA', count: 0 },
]

// Featured cities
const FEATURED_CITIES = [
  { name: 'Los Angeles', state: 'California', slug: 'california/los-angeles' },
  { name: 'Miami', state: 'Florida', slug: 'florida/miami' },
  { name: 'Denver', state: 'Colorado', slug: 'colorado/denver' },
  { name: 'Las Vegas', state: 'Nevada', slug: 'nevada/las-vegas' },
  { name: 'Chicago', state: 'Illinois', slug: 'illinois/chicago' },
  { name: 'Detroit', state: 'Michigan', slug: 'michigan/detroit' },
]

export default async function HomePage() {
  // Get dispensary counts
  let totalDispensaries = 0
  let totalStates = 0
  let totalCities = 0
  
  try {
    totalDispensaries = await prisma.dispensary.count({ where: { isActive: true } })
    totalStates = await prisma.state.count()
    totalCities = await prisma.city.count()
  } catch (e) {
    // Database might not be connected yet
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Find Dispensaries Near You
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-10">
              The fastest way to find licensed cannabis dispensaries in your city
            </p>
            
            {/* Search Box */}
            <div className="max-w-xl mx-auto">
              <form action="/search" method="GET" className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  name="q"
                  placeholder="Search city or dispensary..."
                  className="flex-1 px-5 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-primary-300"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
            
            {/* Stats */}
            <div className="mt-12 flex justify-center gap-8 md:gap-16 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold">{totalDispensaries || '67'}+</div>
                <div className="text-primary-200 text-sm">Dispensaries</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold">{totalStates || '11'}</div>
                <div className="text-primary-200 text-sm">States</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold">{totalCities || '30'}+</div>
                <div className="text-primary-200 text-sm">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by State */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse by State
            </h2>
            <p className="text-xl text-gray-600">
              Find dispensaries in legal cannabis states
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURED_STATES.map((state) => (
              <Link
                key={state.slug}
                href={`/dispensaries/${state.slug}`}
                className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-lg transition-all duration-200"
              >
                <div className="text-2xl font-bold text-gray-900 group-hover:text-primary-600">
                  {state.name}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {state.abbr} • View dispensaries →
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              href="/dispensaries"
              className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700"
            >
              View all states
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Cities
            </h2>
            <p className="text-xl text-gray-600">
              Quick access to top cannabis markets
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {FEATURED_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/dispensaries/${city.slug}`}
                className="group flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-lg transition-all duration-200"
              >
                <div>
                  <div className="font-semibold text-gray-900 group-hover:text-primary-600">
                    {city.name}
                  </div>
                  <div className="text-sm text-gray-500">{city.state}</div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Leefii */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Leefii?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast & Simple</h3>
              <p className="text-gray-600">
                No clutter. Find dispensaries and get directions in seconds, not minutes.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Data</h3>
              <p className="text-gray-600">
                Real phone numbers. Accurate hours. Licensed dispensaries only.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile First</h3>
              <p className="text-gray-600">
                Designed for your phone. One-thumb navigation to call or get directions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to find a dispensary?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Search your city or browse by state to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dispensaries"
              className="px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold text-lg hover:bg-primary-700 transition-colors"
            >
              Browse Dispensaries
            </Link>
            <Link
              href="/search"
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Search Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
