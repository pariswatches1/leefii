import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface Props {
  params: Promise<{ pair: string }>
}

export const revalidate = 86400

export async function generateStaticParams() {
  // Pre-generate top 500 comparison pairs from highest-rated strains
  const topStrains = await prisma.strain.findMany({
    where: { isActive: true, rating: { gte: 4.0 }, reviewsCount: { gte: 10 } },
    orderBy: [{ reviewsCount: 'desc' }, { rating: 'desc' }],
    take: 100,
    select: { slug: true },
  })

  const params: { pair: string }[] = []
  for (let i = 0; i < topStrains.length; i++) {
    for (let j = i + 1; j < topStrains.length && params.length < 500; j++) {
      params.push({ pair: `${topStrains[i].slug}-vs-${topStrains[j].slug}` })
    }
  }
  return params
}

function parsePair(pair: string): { slug1: string; slug2: string } | null {
  const idx = pair.indexOf('-vs-')
  if (idx === -1) return null
  return { slug1: pair.slice(0, idx), slug2: pair.slice(idx + 4) }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params
  const parsed = parsePair(pair)
  if (!parsed) return {}

  const [s1, s2] = await Promise.all([
    prisma.strain.findFirst({ where: { slug: parsed.slug1, isActive: true }, select: { name: true } }),
    prisma.strain.findFirst({ where: { slug: parsed.slug2, isActive: true }, select: { name: true } }),
  ])
  if (!s1 || !s2) return {}

  const title = `${s1.name} vs ${s2.name}: Strain Comparison | Leefii`
  const description = `Compare ${s1.name} and ${s2.name} side by side. THC/CBD levels, effects, flavors, terpenes, and user ratings compared.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://leefii.com/strains/compare/${pair}`, siteName: 'Leefii' },
    alternates: { canonical: `https://leefii.com/strains/compare/${pair}` },
  }
}

export default async function StrainComparePage({ params }: Props) {
  const { pair } = await params
  const parsed = parsePair(pair)
  if (!parsed) notFound()

  const [strain1, strain2] = await Promise.all([
    prisma.strain.findFirst({
      where: { slug: parsed.slug1, isActive: true },
      select: {
        slug: true, name: true, type: true, thcMin: true, thcMax: true,
        cbdMin: true, cbdMax: true, rating: true, reviewsCount: true,
        effects: true, flavors: true, conditions: true, description: true,
        terpMyrcene: true, terpLimonene: true, terpCaryophyllene: true,
        terpPinene: true, terpLinalool: true, terpHumulene: true,
        terpTerpinolene: true, terpOcimene: true,
      },
    }),
    prisma.strain.findFirst({
      where: { slug: parsed.slug2, isActive: true },
      select: {
        slug: true, name: true, type: true, thcMin: true, thcMax: true,
        cbdMin: true, cbdMax: true, rating: true, reviewsCount: true,
        effects: true, flavors: true, conditions: true, description: true,
        terpMyrcene: true, terpLimonene: true, terpCaryophyllene: true,
        terpPinene: true, terpLinalool: true, terpHumulene: true,
        terpTerpinolene: true, terpOcimene: true,
      },
    }),
  ])

  if (!strain1 || !strain2) notFound()

  const sharedEffects = strain1.effects?.filter((e) => strain2.effects?.includes(e)) || []
  const uniqueEffects1 = strain1.effects?.filter((e) => !strain2.effects?.includes(e)) || []
  const uniqueEffects2 = strain2.effects?.filter((e) => !strain1.effects?.includes(e)) || []

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Strains', item: 'https://leefii.com/strains' },
      { '@type': 'ListItem', position: 3, name: `${strain1.name} vs ${strain2.name}` },
    ],
  }

  const terpenes = [
    { name: 'Myrcene', v1: strain1.terpMyrcene, v2: strain2.terpMyrcene },
    { name: 'Limonene', v1: strain1.terpLimonene, v2: strain2.terpLimonene },
    { name: 'Caryophyllene', v1: strain1.terpCaryophyllene, v2: strain2.terpCaryophyllene },
    { name: 'Pinene', v1: strain1.terpPinene, v2: strain2.terpPinene },
    { name: 'Linalool', v1: strain1.terpLinalool, v2: strain2.terpLinalool },
    { name: 'Humulene', v1: strain1.terpHumulene, v2: strain2.terpHumulene },
    { name: 'Terpinolene', v1: strain1.terpTerpinolene, v2: strain2.terpTerpinolene },
    { name: 'Ocimene', v1: strain1.terpOcimene, v2: strain2.terpOcimene },
  ].filter((t) => t.v1 || t.v2)

  // Get related comparison suggestions
  const related = await prisma.strain.findMany({
    where: { isActive: true, type: strain1.type, slug: { notIn: [strain1.slug, strain2.slug] }, rating: { gte: 4 } },
    take: 4,
    orderBy: { reviewsCount: 'desc' },
    select: { slug: true, name: true },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/strains" className="hover:text-green-600">Strains</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{strain1.name} vs {strain2.name}</span>
        </nav>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {strain1.name} vs {strain2.name}
          </h1>
          <p className="text-lg text-gray-600">Side-by-side strain comparison</p>
        </div>

        {/* Main Comparison Table */}
        <section className="mb-10">
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-gray-50 border-b w-1/3 text-sm">Attribute</th>
                  <th className="text-center p-4 bg-purple-50 border-b w-1/3 font-bold text-purple-800">
                    <Link href={`/strains/${strain1.slug}`} className="hover:underline">{strain1.name}</Link>
                  </th>
                  <th className="text-center p-4 bg-green-50 border-b w-1/3 font-bold text-green-800">
                    <Link href={`/strains/${strain2.slug}`} className="hover:underline">{strain2.name}</Link>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="p-4 border-b text-sm font-medium text-gray-700">Type</td>
                  <td className="p-4 border-b text-center text-sm">{strain1.type.charAt(0) + strain1.type.slice(1).toLowerCase()}</td>
                  <td className="p-4 border-b text-center text-sm">{strain2.type.charAt(0) + strain2.type.slice(1).toLowerCase()}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 border-b text-sm font-medium text-gray-700">THC</td>
                  <td className="p-4 border-b text-center text-sm">{strain1.thcMax ? `${strain1.thcMin && strain1.thcMin !== strain1.thcMax ? `${strain1.thcMin}-` : ''}${strain1.thcMax}%` : 'N/A'}</td>
                  <td className="p-4 border-b text-center text-sm">{strain2.thcMax ? `${strain2.thcMin && strain2.thcMin !== strain2.thcMax ? `${strain2.thcMin}-` : ''}${strain2.thcMax}%` : 'N/A'}</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-4 border-b text-sm font-medium text-gray-700">CBD</td>
                  <td className="p-4 border-b text-center text-sm">{strain1.cbdMax && strain1.cbdMax > 0 ? `${strain1.cbdMax}%` : 'Minimal'}</td>
                  <td className="p-4 border-b text-center text-sm">{strain2.cbdMax && strain2.cbdMax > 0 ? `${strain2.cbdMax}%` : 'Minimal'}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 border-b text-sm font-medium text-gray-700">Rating</td>
                  <td className="p-4 border-b text-center text-sm font-bold">{strain1.rating ? `★ ${strain1.rating.toFixed(1)}` : 'N/A'}</td>
                  <td className="p-4 border-b text-center text-sm font-bold">{strain2.rating ? `★ ${strain2.rating.toFixed(1)}` : 'N/A'}</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-4 border-b text-sm font-medium text-gray-700">Reviews</td>
                  <td className="p-4 border-b text-center text-sm">{strain1.reviewsCount || 0}</td>
                  <td className="p-4 border-b text-center text-sm">{strain2.reviewsCount || 0}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 border-b text-sm font-medium text-gray-700">Effects</td>
                  <td className="p-4 border-b text-center text-sm">{strain1.effects?.join(', ') || 'N/A'}</td>
                  <td className="p-4 border-b text-center text-sm">{strain2.effects?.join(', ') || 'N/A'}</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-4 border-b text-sm font-medium text-gray-700">Flavors</td>
                  <td className="p-4 border-b text-center text-sm">{strain1.flavors?.join(', ') || 'N/A'}</td>
                  <td className="p-4 border-b text-center text-sm">{strain2.flavors?.join(', ') || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Terpene Comparison */}
        {terpenes.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Terpene Profile Comparison</h2>
            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <div className="space-y-3">
                {terpenes.map((t) => (
                  <div key={t.name} className="flex items-center gap-4">
                    <span className="w-28 text-sm font-medium text-gray-700">{t.name}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-xs text-purple-700 w-12 text-right">{t.v1?.toFixed(2) || '—'}%</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex">
                        <div className="bg-purple-400 h-full" style={{ width: `${Math.min((t.v1 || 0) * 100, 50)}%` }} />
                        <div className="bg-green-400 h-full" style={{ width: `${Math.min((t.v2 || 0) * 100, 50)}%` }} />
                      </div>
                      <span className="text-xs text-green-700 w-12">{t.v2?.toFixed(2) || '—'}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Shared & Unique Effects */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Effects Breakdown</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {sharedEffects.length > 0 && (
              <div className="bg-white rounded-xl p-4 border">
                <h3 className="font-semibold text-gray-900 mb-2">Shared Effects</h3>
                <div className="flex flex-wrap gap-1">{sharedEffects.map((e) => <span key={e} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{e}</span>)}</div>
              </div>
            )}
            {uniqueEffects1.length > 0 && (
              <div className="bg-white rounded-xl p-4 border">
                <h3 className="font-semibold text-gray-900 mb-2">Only {strain1.name}</h3>
                <div className="flex flex-wrap gap-1">{uniqueEffects1.map((e) => <span key={e} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{e}</span>)}</div>
              </div>
            )}
            {uniqueEffects2.length > 0 && (
              <div className="bg-white rounded-xl p-4 border">
                <h3 className="font-semibold text-gray-900 mb-2">Only {strain2.name}</h3>
                <div className="flex flex-wrap gap-1">{uniqueEffects2.map((e) => <span key={e} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{e}</span>)}</div>
              </div>
            )}
          </div>
        </section>

        {/* Related Comparisons */}
        {related.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Compare More Strains</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {related.map((r) => (
                <div key={r.slug} className="flex gap-2">
                  <Link href={`/strains/compare/${strain1.slug}-vs-${r.slug}`} className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm hover:shadow-md transition border border-gray-100 text-sm">
                    {strain1.name} vs {r.name}
                  </Link>
                  <Link href={`/strains/compare/${strain2.slug}-vs-${r.slug}`} className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm hover:shadow-md transition border border-gray-100 text-sm">
                    {strain2.name} vs {r.name}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
