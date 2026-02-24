import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const totalCount = await prisma.dispensary.count({ where: { isActive: true } })
  const stateCount = await prisma.state.count()
  const title = `Cannabis Dispensaries in All ${stateCount} States | ${totalCount.toLocaleString()}+ Verified | Leefii`
  const description = `Browse ${totalCount.toLocaleString()}+ licensed cannabis dispensaries across all ${stateCount} US states and DC. Compare ratings, menus, delivery options, and deals on Leefii.`
  return {
    title,
    description,
    openGraph: { title, description, url: 'https://leefii.com/dispensaries', siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: 'https://leefii.com/dispensaries' },
  }
}

export default async function DispensariesPage() {
  const states = await prisma.state.findMany({
    include: {
      _count: {
        select: { dispensaries: true, cities: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  const totalDispensaries = states.reduce((sum, s) => sum + s._count.dispensaries, 0)
  const totalCities = states.reduce((sum, s) => sum + s._count.cities, 0)

  // Group states by legal status
  const recStates = states.filter((s) => !s.medicalOnly && s.isLegal)
  const medStates = states.filter((s) => s.medicalOnly && s.isLegal)
  const otherStates = states.filter((s) => !s.isLegal)

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Browse Dispensaries by State
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            Find cannabis dispensaries across all {states.length} US states and DC.{' '}
            {totalDispensaries.toLocaleString()} dispensaries in {totalCities} cities and growing.
          </p>
          <div className="flex gap-6 mt-6">
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-2xl font-bold">{recStates.length}</span>
              <span className="text-primary-200 text-sm ml-2">Rec + Med States</span>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-2xl font-bold">{medStates.length}</span>
              <span className="text-primary-200 text-sm ml-2">Medical Only</span>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-2xl font-bold">{otherStates.length}</span>
              <span className="text-primary-200 text-sm ml-2">Other States</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recreational & Medical States */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              Rec + Med
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              Recreational &amp; Medical States ({recStates.length})
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recStates.map((state) => (
              <StateCard key={state.id} state={state} />
            ))}
          </div>
        </div>
      </section>

      {/* Medical Only States */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              Medical
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              Medical Only States ({medStates.length})
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medStates.map((state) => (
              <StateCard key={state.id} state={state} />
            ))}
          </div>
        </div>
      </section>

      {/* Other States */}
      {otherStates.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
                Pending
              </span>
              <h2 className="text-2xl font-bold text-gray-900">
                Other States ({otherStates.length})
              </h2>
            </div>
            <p className="text-gray-500 mb-6">
              These states do not currently have recreational or comprehensive medical cannabis programs.
              Check each state&apos;s page for the latest updates and any limited programs.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherStates.map((state) => (
                <StateCard key={state.id} state={state} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Info Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            About Cannabis in the US
          </h2>
          <div className="prose prose-gray max-w-none">
            <p>
              Cannabis laws vary significantly across the United States. {recStates.length} states
              allow both recreational and medical marijuana, {medStates.length} states
              permit medical use only, and {otherStates.length} states do not currently have cannabis programs.
              Leefii helps you find licensed dispensaries in every state, track law changes, and
              shop at verified, compliant locations.
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

// --- State Card Component ---

type StateWithCounts = {
  id: string
  name: string
  slug: string
  abbreviation: string
  isLegal: boolean
  medicalOnly: boolean
  _count: { dispensaries: number; cities: number }
}

function StateCard({ state }: { state: StateWithCounts }) {
  const hasDispensaries = state._count.dispensaries > 0

  return (
    <Link
      href={`/dispensaries/${state.slug}`}
      className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            {state.name}
          </h3>
          <p className="text-gray-500 mt-1">{state.abbreviation}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            !state.isLegal
              ? 'bg-gray-100 text-gray-600'
              : state.medicalOnly
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
          }`}
        >
          {!state.isLegal ? 'Pending' : state.medicalOnly ? 'Medical' : 'Rec + Med'}
        </span>
      </div>

      <div className="mt-4 flex gap-6 text-sm">
        {hasDispensaries ? (
          <>
            <div>
              <span className="font-semibold text-gray-900">{state._count.dispensaries}</span>
              <span className="text-gray-500 ml-1">dispensaries</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">{state._count.cities}</span>
              <span className="text-gray-500 ml-1">cities</span>
            </div>
          </>
        ) : (
          <span className="text-gray-400">
            {state.isLegal ? 'Dispensaries coming soon' : 'Check law updates'}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center text-primary-600 font-medium">
        {hasDispensaries ? `Browse ${state.name}` : `View ${state.name} Info`}
        <svg
          className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}
