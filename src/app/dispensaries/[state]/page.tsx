import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'

type Props = {
  params: Promise<{ state: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params
  const state = await prisma.state.findUnique({
    where: { slug: stateSlug },
    include: { _count: { select: { dispensaries: true, cities: true } } }
  })

  if (!state) {
    return { title: 'State Not Found' }
  }

  return {
    title: `Dispensaries in ${state.name} | Leefii`,
    description: `Find ${state._count.dispensaries} licensed cannabis dispensaries in ${state.name}. Browse ${state._count.cities} cities with dispensary locations.`
  }
}

export async function generateStaticParams() {
  const states = await prisma.state.findMany({ select: { slug: true } })
  return states.map((state) => ({ state: state.slug }))
}

export default async function StatePage({ params }: Props) {
  const { state: stateSlug } = await params
  const state = await prisma.state.findUnique({
    where: { slug: stateSlug },
    include: {
      cities: {
        orderBy: { dispensaryCount: 'desc' },
        include: { _count: { select: { dispensaries: true } } }
      },
      _count: { select: { dispensaries: true } }
    }
  })

  if (!state) {
    notFound()
  }

  return (
    <div>
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/dispensaries" className="text-gray-500 hover:text-gray-700">Dispensaries</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{state.name}</span>
          </nav>
        </div>
      </div>

      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Dispensaries in {state.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            {state.description || `Find licensed cannabis dispensaries in ${state.name}. Browse by city to find dispensaries near you.`}
          </p>
          
          <div className="mt-6 flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">{state._count.dispensaries}</span>
              <span className="text-gray-600">Dispensaries</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">{state.cities.length}</span>
              <span className="text-gray-600">Cities</span>
            </div>
            <div className="flex items-center space-x-2">
              {state.medicalOnly ? (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Medical Only</span>
              ) : (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Recreational and Medical</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Cities in {state.name}
          </h2>
          
          {state.cities.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {state.cities.map((city) => (
                <Link
                  key={city.id}
                  href={`/dispensaries/${state.slug}/${city.slug}`}
                  className="group p-5 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-lg transition-all duration-200"
                >
                  <div className="font-semibold text-gray-900 group-hover:text-green-600">
                    {city.name}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {city._count.dispensaries} dispensaries
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-600">No cities found for {state.name} yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
