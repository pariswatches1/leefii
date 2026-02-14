import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface Props {
  params: Promise<{ effectSlug: string }>
}

export const revalidate = 86400

const EFFECT_META: Record<string, { name: string; description: string; icon: string }> = {
  relaxed: { name: 'Relaxed', description: 'calming and stress-relieving strains perfect for unwinding', icon: '😌' },
  energetic: { name: 'Energetic', description: 'uplifting and energizing strains ideal for daytime use', icon: '⚡' },
  happy: { name: 'Happy', description: 'mood-boosting strains that promote happiness and positivity', icon: '😊' },
  creative: { name: 'Creative', description: 'creativity-enhancing strains for artistic and imaginative activities', icon: '🎨' },
  focused: { name: 'Focused', description: 'concentration-boosting strains for productivity and mental clarity', icon: '🎯' },
  sleepy: { name: 'Sleepy', description: 'sedating strains ideal for nighttime use and sleep', icon: '😴' },
  hungry: { name: 'Hungry', description: 'appetite-stimulating strains that may help with nausea or appetite loss', icon: '🍕' },
  euphoric: { name: 'Euphoric', description: 'euphoria-inducing strains for an uplifted and blissful experience', icon: '🌈' },
  uplifted: { name: 'Uplifted', description: 'mood-lifting strains that promote a sense of well-being', icon: '🙌' },
  calm: { name: 'Calm', description: 'gentle calming strains for easing anxiety and tension', icon: '🧘' },
  talkative: { name: 'Talkative', description: 'social and conversation-enhancing strains for gatherings', icon: '💬' },
  giggly: { name: 'Giggly', description: 'laugh-inducing strains for fun and lighthearted experiences', icon: '😂' },
}

export async function generateStaticParams() {
  return Object.keys(EFFECT_META).map((slug) => ({ effectSlug: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { effectSlug } = await params
  const meta = EFFECT_META[effectSlug]
  if (!meta) return {}

  const count = await prisma.strain.count({ where: { effects: { has: meta.name }, isActive: true } })
  const title = `Best ${meta.name} Cannabis Strains (${count}+ Strains) | Leefii`
  const description = `Browse ${count}+ ${meta.description}. Compare THC levels, terpene profiles, and reviews. Find your perfect ${meta.name.toLowerCase()} strain.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://leefii.com/strains/effects/${effectSlug}`, siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/strains/effects/${effectSlug}` },
  }
}

export default async function EffectPage({ params }: Props) {
  const { effectSlug } = await params
  const meta = EFFECT_META[effectSlug]
  if (!meta) notFound()

  const strains = await prisma.strain.findMany({
    where: { effects: { has: meta.name }, isActive: true },
    orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }],
    take: 50,
    select: {
      slug: true,
      name: true,
      type: true,
      thcMin: true,
      thcMax: true,
      cbdMin: true,
      cbdMax: true,
      rating: true,
      reviewsCount: true,
      effects: true,
      description: true,
    },
  })

  if (strains.length === 0) notFound()

  const totalCount = await prisma.strain.count({ where: { effects: { has: meta.name }, isActive: true } })

  const typeBreakdown = {
    indica: strains.filter((s) => s.type === 'INDICA').length,
    sativa: strains.filter((s) => s.type === 'SATIVA').length,
    hybrid: strains.filter((s) => s.type === 'HYBRID').length,
  }

  const otherEffects = Object.entries(EFFECT_META).filter(([k]) => k !== effectSlug).slice(0, 8)

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
        name: `What strains make you feel ${meta.name.toLowerCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Leefii lists ${totalCount}+ strains with ${meta.name.toLowerCase()} effects. Top picks include ${strains.slice(0, 3).map((s) => s.name).join(', ')}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Are ${meta.name.toLowerCase()} strains indica or sativa?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Among ${meta.name.toLowerCase()} strains on Leefii: ${typeBreakdown.indica} are Indica, ${typeBreakdown.sativa} are Sativa, and ${typeBreakdown.hybrid} are Hybrid. ${typeBreakdown.indica > typeBreakdown.sativa ? 'Indica-dominant strains are most common.' : typeBreakdown.sativa > typeBreakdown.indica ? 'Sativa-dominant strains are most common.' : 'Hybrid strains are most common.'}`,
        },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/strains" className="hover:text-green-600">Strains</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{meta.name}</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-5xl mb-4 block">{meta.icon}</span>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {meta.name} Cannabis Strains
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse {totalCount}+ {meta.description}.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {totalCount} Strains
          </span>
          {typeBreakdown.indica > 0 && (
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              {typeBreakdown.indica} Indica
            </span>
          )}
          {typeBreakdown.sativa > 0 && (
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
              {typeBreakdown.sativa} Sativa
            </span>
          )}
          {typeBreakdown.hybrid > 0 && (
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {typeBreakdown.hybrid} Hybrid
            </span>
          )}
        </div>

        {/* Strain Listings */}
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

        {/* Other Effects */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Effect</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {otherEffects.map(([slug, m]) => (
              <Link key={slug} href={`/strains/effects/${slug}`} className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-100">
                <span className="text-2xl block mb-1">{m.icon}</span>
                <p className="font-medium text-gray-900 text-sm">{m.name}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQ</h2>
          <div className="space-y-3">
            <details className="bg-white rounded-xl shadow-sm border border-gray-100">
              <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">
                What strains make you feel {meta.name.toLowerCase()}?
              </summary>
              <p className="px-4 pb-4 text-gray-600">
                Leefii lists {totalCount}+ strains with {meta.name.toLowerCase()} effects. Top picks include {strains.slice(0, 3).map((s) => s.name).join(', ')}.
              </p>
            </details>
            <details className="bg-white rounded-xl shadow-sm border border-gray-100">
              <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">
                Are {meta.name.toLowerCase()} strains indica or sativa?
              </summary>
              <p className="px-4 pb-4 text-gray-600">
                Among {meta.name.toLowerCase()} strains: {typeBreakdown.indica} are Indica, {typeBreakdown.sativa} are Sativa, and {typeBreakdown.hybrid} are Hybrid.
              </p>
            </details>
          </div>
        </section>
      </div>
    </div>
  )
}
