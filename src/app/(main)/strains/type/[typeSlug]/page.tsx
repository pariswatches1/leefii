import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface Props {
  params: Promise<{ typeSlug: string }>
}

export const revalidate = 86400

const TYPE_META: Record<string, { name: string; dbValue: string; description: string; icon: string }> = {
  indica: { name: 'Indica', dbValue: 'INDICA', description: 'relaxing indica strains known for body highs and sedating effects', icon: '🌙' },
  sativa: { name: 'Sativa', dbValue: 'SATIVA', description: 'energizing sativa strains known for cerebral highs and creativity', icon: '☀️' },
  hybrid: { name: 'Hybrid', dbValue: 'HYBRID', description: 'balanced hybrid strains combining indica and sativa characteristics', icon: '🔄' },
}

export async function generateStaticParams() {
  return Object.keys(TYPE_META).map((slug) => ({ typeSlug: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { typeSlug } = await params
  const meta = TYPE_META[typeSlug]
  if (!meta) return {}

  const count = await prisma.strain.count({ where: { type: meta.dbValue as any, isActive: true } })
  const title = `Best ${meta.name} Strains (${count}+ Strains) | Leefii`
  const description = `Browse ${count}+ ${meta.description}. Compare THC levels, effects, terpene profiles, and reviews.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://leefii.com/strains/type/${typeSlug}`, siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/strains/type/${typeSlug}` },
  }
}

export default async function StrainTypePage({ params }: Props) {
  const { typeSlug } = await params
  const meta = TYPE_META[typeSlug]
  if (!meta) notFound()

  const strains = await prisma.strain.findMany({
    where: { type: meta.dbValue as any, isActive: true },
    orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }],
    take: 50,
    select: {
      slug: true, name: true, type: true, thcMin: true, thcMax: true,
      cbdMin: true, cbdMax: true, rating: true, reviewsCount: true,
      effects: true, description: true,
    },
  })

  if (strains.length === 0) notFound()

  const totalCount = await prisma.strain.count({ where: { type: meta.dbValue as any, isActive: true } })

  const effectBreakdown: Record<string, number> = {}
  strains.forEach((s) => s.effects?.forEach((e) => { effectBreakdown[e] = (effectBreakdown[e] || 0) + 1 }))
  const topEffects = Object.entries(effectBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 6)

  const otherTypes = Object.entries(TYPE_META).filter(([k]) => k !== typeSlug)

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Strains', item: 'https://leefii.com/strains' },
      { '@type': 'ListItem', position: 3, name: `${meta.name} Strains` },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is an ${meta.name.toLowerCase()} strain?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: typeSlug === 'indica'
            ? 'Indica strains are cannabis varieties known for producing relaxing, body-focused effects. They are often used for nighttime consumption, pain relief, and sleep.'
            : typeSlug === 'sativa'
            ? 'Sativa strains are cannabis varieties known for uplifting, cerebral effects. They are often used for daytime consumption, creativity, and energy.'
            : 'Hybrid strains are cannabis varieties that combine genetics from both indica and sativa plants, offering a balanced mix of effects.',
        },
      },
      {
        '@type': 'Question',
        name: `How many ${meta.name.toLowerCase()} strains are there?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Leefii lists ${totalCount}+ ${meta.name.toLowerCase()} strains. Top picks include ${strains.slice(0, 3).map((s) => s.name).join(', ')}.`,
        },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/strains" className="hover:text-green-600">Strains</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{meta.name}</span>
        </nav>

        <div className="text-center mb-10">
          <span className="text-5xl mb-4 block">{meta.icon}</span>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {meta.name} Cannabis Strains
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse {totalCount}+ {meta.description}.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {totalCount} Strains
          </span>
          {topEffects.map(([effect, count]) => (
            <span key={effect} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
              {effect} ({count})
            </span>
          ))}
        </div>

        <section className="mb-12">
          <div className="space-y-3">
            {strains.map((s) => (
              <Link
                key={s.slug}
                href={`/strains/${s.slug}`}
                className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-lg">{s.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        s.type === 'INDICA' ? 'bg-purple-100 text-purple-800' : s.type === 'SATIVA' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {s.type.charAt(0) + s.type.slice(1).toLowerCase()}
                      </span>
                    </div>
                    {s.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{s.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      {s.thcMax && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">THC: {s.thcMin && s.thcMin !== s.thcMax ? `${s.thcMin}-${s.thcMax}` : s.thcMax}%</span>}
                      {s.cbdMax && s.cbdMax > 0 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">CBD: {s.cbdMin && s.cbdMin !== s.cbdMax ? `${s.cbdMin}-${s.cbdMax}` : s.cbdMax}%</span>
                      )}
                      {s.effects?.slice(0, 3).map((e) => (
                        <span key={e} className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{e}</span>
                      ))}
                    </div>
                  </div>
                  {s.rating && s.rating > 0 && (
                    <div className="text-right ml-4 flex-shrink-0">
                      <span className="text-yellow-500 font-bold text-lg">★ {s.rating.toFixed(1)}</span>
                      <p className="text-xs text-gray-400">{s.reviewsCount} reviews</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {otherTypes.map(([slug, m]) => (
              <Link key={slug} href={`/strains/type/${slug}`} className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-100">
                <span className="text-2xl block mb-1">{m.icon}</span>
                <p className="font-medium text-gray-900 text-sm">{m.name}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQ</h2>
          <div className="space-y-3">
            <details className="bg-white rounded-xl shadow-sm border border-gray-100">
              <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">
                What is an {meta.name.toLowerCase()} strain?
              </summary>
              <p className="px-4 pb-4 text-gray-600">
                {typeSlug === 'indica'
                  ? 'Indica strains are cannabis varieties known for producing relaxing, body-focused effects. They are often used for nighttime consumption, pain relief, and sleep.'
                  : typeSlug === 'sativa'
                  ? 'Sativa strains are cannabis varieties known for uplifting, cerebral effects. They are often used for daytime consumption, creativity, and energy.'
                  : 'Hybrid strains are cannabis varieties that combine genetics from both indica and sativa plants, offering a balanced mix of effects.'}
              </p>
            </details>
            <details className="bg-white rounded-xl shadow-sm border border-gray-100">
              <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">
                How many {meta.name.toLowerCase()} strains does Leefii have?
              </summary>
              <p className="px-4 pb-4 text-gray-600">
                Leefii lists {totalCount}+ {meta.name.toLowerCase()} strains with ratings, effects, and terpene profiles.
              </p>
            </details>
          </div>
        </section>
      </div>
    </div>
  )
}
