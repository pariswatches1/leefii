import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'

type Props = {
  params: Promise<{ state: string; city: string }>
}

function isOpenNow(hours: any[]): boolean {
  if (!hours || hours.length === 0) return false
  const now = new Date()
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  const today = days[now.getDay()]
  const currentTime = now.getHours() * 100 + now.getMinutes()
  const todayHours = hours.find(h => h.dayOfWeek === today)
  if (!todayHours || todayHours.isClosed) return false
  const openTime = parseInt(todayHours.openTime.replace(':', ''))
  const closeTime = parseInt(todayHours.closeTime.replace(':', ''))
  return currentTime >= openTime && currentTime <= closeTime
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params
  const state = await prisma.state.findUnique({ where: { slug: stateSlug } })
  const city = await prisma.city.findFirst({
    where: { slug: citySlug, state: { slug: stateSlug } },
    include: { _count: { select: { dispensaries: true } } }
  })
  if (!state || !city) return { title: 'City Not Found' }
  return {
    title: `${city._count.dispensaries} Dispensaries in ${city.name}, ${state.abbreviation} | Leefii`,
    description: `Find ${city._count.dispensaries} licensed dispensaries in ${city.name}, ${state.name}.`
  }
}

export default async function CityPage({ params }: Props) {
  const { state: stateSlug, city: citySlug } = await params
  const state = await prisma.state.findUnique({ where: { slug: stateSlug } })
  if (!state) notFound()

  const city = await prisma.city.findFirst({
    where: { slug: citySlug, stateId: state.id }
  })
  if (!city) notFound()

  const dispensaries = await prisma.dispensary.findMany({
    where: { cityId: city.id, isActive: true },
    include: { hours: true },
    orderBy: [{ isPremium: 'desc' }, { rating: 'desc' }]
  })

  const nearbyCities = await prisma.city.findMany({
    where: { stateId: state.id, id: { not: city.id } },
    take: 6,
    orderBy: { dispensaryCount: 'desc' }
  })

  const openNowCount = dispensaries.filter(d => isOpenNow(d.hours)).length

  return (
    <div>
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/dispensaries" className="text-gray-500 hover:text-gray-700">Dispensaries</Link>
            <span className="text-gray-400">/</span>
            <Link href={`/dispensaries/${state.slug}`} className="text-gray-500 hover:text-gray-700">{state.name}</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{city.name}</span>
          </nav>
        </div>
      </div>

      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Dispensaries in {city.name}, {state.abbreviation}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            Find {dispensaries.length} licensed cannabis dispensaries in {city.name}, {state.name}.
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
              {dispensaries.length} Dispensaries
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-green-100 rounded-lg text-sm font-medium text-green-700">
              {openNowCount} Open Now
            </span>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {dispensaries.length > 0 ? (
            <div className="space-y-4">
              {dispensaries.map((dispensary) => {
                const open = isOpenNow(dispensary.hours)
                return (
                  <div key={dispensary.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">{dispensary.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{dispensary.address}, {city.name}, {state.abbreviation} {dispensary.zipCode}</p>
                        <p className="text-sm text-gray-600">{dispensary.phone}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {open ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Open</span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Closed</span>
                          )}
                          {dispensary.hasDelivery && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Delivery</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 md:flex-col">
                        <a
                          href={`tel:${dispensary.phone.replace(/[^0-9]/g, '')}`}
                          className="inline-flex items-center justify-center px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                        >
                          Call
                        </a>
                        <a
                          href={`https://maps.google.com/?q=${dispensary.latitude},${dispensary.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-4 py-2.5 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200"
                        >
                          Directions
                        </a>
                        {dispensary.website && (
                          <a
                            href={dispensary.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                          >
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No dispensaries found</h3>
              <p className="text-gray-600">We are adding more dispensaries to {city.name} soon.</p>
            </div>
          )}
        </div>
      </section>

      {nearbyCities.length > 0 && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Nearby Cities</h2>
            <div className="flex flex-wrap gap-3">
              {nearbyCities.map((nearbyCity) => (
                <Link
                  key={nearbyCity.id}
                  href={`/dispensaries/${state.slug}/${nearbyCity.slug}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-green-500"
                >
                  {nearbyCity.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
