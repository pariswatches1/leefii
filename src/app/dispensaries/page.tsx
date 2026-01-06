import { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Browse Cannabis Dispensaries by State | Leefii',
  description: 'Find licensed cannabis dispensaries in every legal state. Browse California, Colorado, Florida, Michigan, and more.',
}

export default async function DispensariesPage() {
  const states = await prisma.state.findMany({
    where: { isLegal: true },
    include: {
      _count: {
        select: { dispensaries: true, cities: true }
      }
    },
    orderBy: { name: 'asc' }
  })

  const totalDispensaries = states.reduce((sum, s) => sum + s._count.dispensaries, 0)
  const totalCities = states.reduce((sum, s) => sum + s._count.cities, 0)

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Browse Dispensaries by State
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            Find licensed cannabis dispensaries across {states.length} legal states. 
            {totalDispensaries} dispensaries in {totalCities} cities.
          </p>
        </div>
      </section>

      {/* States Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {states.map((state) => (
              <Link
                key={state.id}
                href={`/dispensaries/${state.slug}`}
                className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {state.name}
                    </h2>
                    <p className="text-gray-500 mt-1">{state.abbreviation}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    state.medicalOnly 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {state.medicalOnly ? 'Medical' : 'Rec + Med'}
                  </span>
                </div>
                
                <div className="mt-4 flex gap-6 text-sm">
                  <div>
                    <span className="font-semibold text-gray-900">{state._count.dispensaries}</span>
                    <span className="text-gray-500 ml-1">dispensaries</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{state._count.cities}</span>
                    <span className="text-gray-500 ml-1">cities</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center text-primary-600 font-medium">
                  Browse {state.name}
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            About Cannabis Legalization in the US
          </h2>
          <div className="prose prose-gray max-w-none">
            <p>
              Cannabis laws vary significantly across the United States. Some states have legalized 
              both recreational and medical marijuana, while others only permit medical use. Leefii 
              helps you find licensed dispensaries in legal states, ensuring you're shopping at 
              verified, compliant locations.
            </p>
            <p>
              Always check your local laws before purchasing cannabis products. Requirements for 
              purchase vary by state and may include minimum age (typically 21+), medical cards, 
              or state residency.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
