import { Metadata } from 'next'
import Link from 'next/link'
import { getAllStateLaws, getRecreationalStates, getMedicalOnlyStates, getIllegalStates } from '@/data/cannabis-laws'
import USMap from '@/components/USMap'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const recCount = getRecreationalStates().length
  const medCount = getMedicalOnlyStates().length
  const title = `Cannabis Laws by State 2026 — Where Is Weed Legal? | Leefii`
  const description = `Interactive guide to cannabis laws in all 50 states. ${recCount} states have legalized recreational cannabis, ${medCount} have medical-only programs. Updated 2026.`
  return {
    title,
    description,
    openGraph: { title, description, url: 'https://leefii.com/laws', siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: 'https://leefii.com/laws' },
  }
}

const STATUS_BADGE: Record<string, string> = {
  recreational: 'bg-green-100 text-green-800',
  medical: 'bg-yellow-100 text-yellow-800',
  decriminalized: 'bg-orange-100 text-orange-800',
  illegal: 'bg-red-100 text-red-800',
}

export default function LawsIndexPage() {
  const allStates = getAllStateLaws().sort((a, b) => a.name.localeCompare(b.name))
  const recStates = getRecreationalStates()
  const medStates = getMedicalOnlyStates()
  const illegalStates = getIllegalStates()

  const mapData = allStates.map((s) => ({
    slug: s.slug,
    abbreviation: s.abbreviation,
    name: s.name,
    status: s.status,
  }))

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Cannabis Laws' },
    ],
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Cannabis Laws</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cannabis Laws by State 2026</h1>
          <p className="text-xl text-green-100 max-w-2xl mb-8">
            Complete guide to cannabis legalization across the United States. Find out where weed is legal, medical-only, or still prohibited.
          </p>
          <div className="flex flex-wrap gap-6">
            <div className="bg-white/15 rounded-lg px-5 py-3 text-center">
              <div className="text-3xl font-bold">{recStates.length}</div>
              <div className="text-green-200 text-sm">Recreational</div>
            </div>
            <div className="bg-white/15 rounded-lg px-5 py-3 text-center">
              <div className="text-3xl font-bold">{medStates.length}</div>
              <div className="text-green-200 text-sm">Medical Only</div>
            </div>
            <div className="bg-white/15 rounded-lg px-5 py-3 text-center">
              <div className="text-3xl font-bold">{illegalStates.length}</div>
              <div className="text-green-200 text-sm">Illegal</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Interactive Cannabis Legalization Map</h2>
          <USMap stateData={mapData} />
        </div>
      </section>

      {/* Quick Comparison Table */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All 50 States + D.C. Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl border">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">State</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">Possession Limit</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">Min Age</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">Home Grow</th>
                </tr>
              </thead>
              <tbody>
                {allStates.map((state) => (
                  <tr key={state.slug} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <Link href={`/laws/${state.slug}`} className="text-green-600 hover:text-green-800 font-medium hover:underline">
                        {state.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[state.status]}`}>
                        {state.statusLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{state.possessionLimit}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{state.minimumAge > 0 ? `${state.minimumAge}+` : 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{state.homeGrow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Category Links */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/laws/recreational-states" className="group p-6 bg-green-50 border border-green-200 rounded-xl hover:shadow-lg transition">
              <div className="text-3xl font-bold text-green-700 mb-2">{recStates.length} States</div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700">Recreational Cannabis</h3>
              <p className="text-sm text-gray-600 mt-1">States where adults 21+ can purchase recreational cannabis</p>
            </Link>
            <Link href="/laws/medical-states" className="group p-6 bg-yellow-50 border border-yellow-200 rounded-xl hover:shadow-lg transition">
              <div className="text-3xl font-bold text-yellow-700 mb-2">{medStates.length} States</div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-yellow-700">Medical Only</h3>
              <p className="text-sm text-gray-600 mt-1">States with medical marijuana programs requiring a patient card</p>
            </Link>
            <Link href="/laws/federal" className="group p-6 bg-blue-50 border border-blue-200 rounded-xl hover:shadow-lg transition">
              <div className="text-3xl font-bold text-blue-700 mb-2">Federal</div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">Federal Cannabis Law</h3>
              <p className="text-sm text-gray-600 mt-1">Current federal status, rescheduling updates, and banking legislation</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
