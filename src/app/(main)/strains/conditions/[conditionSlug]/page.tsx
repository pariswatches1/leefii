import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface Props {
  params: Promise<{ conditionSlug: string }>
}

export const revalidate = 86400

const CONDITION_META: Record<string, { name: string; description: string; icon: string }> = {
  anxiety: { name: 'Anxiety', description: 'cannabis strains that may help with anxiety and stress disorders', icon: '😰' },
  depression: { name: 'Depression', description: 'mood-lifting cannabis strains that may help with depression', icon: '😔' },
  stress: { name: 'Stress', description: 'calming cannabis strains for stress relief and relaxation', icon: '😤' },
  'chronic-pain': { name: 'Chronic Pain', description: 'pain-relieving cannabis strains for chronic pain management', icon: '🩹' },
  insomnia: { name: 'Insomnia', description: 'sedating cannabis strains that may help with sleep and insomnia', icon: '😴' },
  ptsd: { name: 'PTSD', description: 'cannabis strains that may help manage PTSD symptoms', icon: '🧠' },
  nausea: { name: 'Nausea', description: 'anti-nausea cannabis strains for relief from nausea and vomiting', icon: '🤢' },
  'appetite-loss': { name: 'Appetite Loss', description: 'appetite-stimulating cannabis strains for those with reduced appetite', icon: '🍽️' },
  inflammation: { name: 'Inflammation', description: 'anti-inflammatory cannabis strains for reducing inflammation', icon: '🔥' },
  'muscle-spasms': { name: 'Muscle Spasms', description: 'muscle-relaxing cannabis strains for spasm relief', icon: '💪' },
  arthritis: { name: 'Arthritis', description: 'cannabis strains that may help with arthritis pain and stiffness', icon: '🦴' },
}

export async function generateStaticParams() {
  return Object.keys(CONDITION_META).map((slug) => ({ conditionSlug: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { conditionSlug } = await params
  const meta = CONDITION_META[conditionSlug]
  if (!meta) return {}

  const count = await prisma.strain.count({ where: { conditions: { has: meta.name }, isActive: true } })
  const title = `Best Cannabis Strains for ${meta.name} (${count}+ Strains) | Leefii`
  const description = `Browse ${count}+ ${meta.description}. Compare THC/CBD levels, effects, and user reviews.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://leefii.com/strains/conditions/${conditionSlug}`, siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/strains/conditions/${conditionSlug}` },
  }
}

export default async function ConditionPage({ params }: Props) {
  const { conditionSlug } = await params
  const meta = CONDITION_META[conditionSlug]
  if (!meta) notFound()

  const strains = await prisma.strain.findMany({
    where: { conditions: { has: meta.name }, isActive: true },
    orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }],
    take: 50,
    select: {
      slug: true, name: true, type: true, thcMin: true, thcMax: true,
      cbdMin: true, cbdMax: true, rating: true, reviewsCount: true,
      effects: true, conditions: true, description: true,
    },
  })

  if (strains.length === 0) notFound()

  const totalCount = await prisma.strain.count({ where: { conditions: { has: meta.name }, isActive: true } })

  const typeBreakdown = {
    indica: strains.filter((s) => s.type === 'INDICA').length,
    sativa: strains.filter((s) => s.type === 'SATIVA').length,
    hybrid: strains.filter((s) => s.type === 'HYBRID').length,
  }

  const otherConditions = Object.entries(CONDITION_META).filter(([k]) => k !== conditionSlug).slice(0, 8)

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Strains', item: 'https://leefii.com/strains' },
      { '@type': 'ListItem', position: 3, name: `Strains for ${meta.name}` },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What strains help with ${meta.name.toLowerCase()}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Leefii lists ${totalCount}+ strains for ${meta.name.toLowerCase()}. Top-rated options include ${strains.slice(0, 3).map((s) => s.name).join(', ')}.` },
      },
      {
        '@type': 'Question',
        name: `Should I use indica or sativa for ${meta.name.toLowerCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Among strains for ${meta.name.toLowerCase()} on Leefii: ${typeBreakdown.indica} are Indica, ${typeBreakdown.sativa} are Sativa, and ${typeBreakdown.hybrid} are Hybrid. ${typeBreakdown.indica > typeBreakdown.sativa ? 'Indica strains are most common for this condition.' : 'Both types are commonly used.'}`,
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
            Best Cannabis Strains for {meta.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse {totalCount}+ {meta.description}.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">{totalCount} Strains</span>
          {typeBreakdown.indica > 0 && <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">{typeBreakdown.indica} Indica</span>}
          {typeBreakdown.sativa > 0 && <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800">{typeBreakdown.sativa} Sativa</span>}
          {typeBreakdown.hybrid > 0 && <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">{typeBreakdown.hybrid} Hybrid</span>}
        </div>

        <section className="mb-12">
          <div className="space-y-3">
            {strains.map((s) => (
              <Link key={s.slug} href={`/strains/${s.slug}`} className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-lg">{s.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.type === 'INDICA' ? 'bg-purple-100 text-purple-800' : s.type === 'SATIVA' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                        {s.type.charAt(0) + s.type.slice(1).toLowerCase()}
                      </span>
                    </div>
                    {s.description && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{s.description}</p>}
                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      {s.thcMax && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">THC: {s.thcMin && s.thcMin !== s.thcMax ? `${s.thcMin}-${s.thcMax}` : s.thcMax}%</span>}
                      {s.cbdMax && s.cbdMax > 0 && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">CBD: {s.cbdMin && s.cbdMin !== s.cbdMax ? `${s.cbdMin}-${s.cbdMax}` : s.cbdMax}%</span>}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Condition</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {otherConditions.map(([slug, m]) => (
              <Link key={slug} href={`/strains/conditions/${slug}`} className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-100">
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
              <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">What strains help with {meta.name.toLowerCase()}?</summary>
              <p className="px-4 pb-4 text-gray-600">Leefii lists {totalCount}+ strains for {meta.name.toLowerCase()}. Top-rated options include {strains.slice(0, 3).map((s) => s.name).join(', ')}.</p>
            </details>
            <details className="bg-white rounded-xl shadow-sm border border-gray-100">
              <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">Should I use indica or sativa for {meta.name.toLowerCase()}?</summary>
              <p className="px-4 pb-4 text-gray-600">Among strains for {meta.name.toLowerCase()} on Leefii: {typeBreakdown.indica} are Indica, {typeBreakdown.sativa} are Sativa, and {typeBreakdown.hybrid} are Hybrid.</p>
            </details>
          </div>
        </section>
      </div>
    </div>
  )
}
