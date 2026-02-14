import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface Props {
  params: Promise<{ terpeneSlug: string }>
}

export const revalidate = 86400

const TERPENE_META: Record<string, { name: string; field: string; description: string; aroma: string; benefits: string; icon: string }> = {
  myrcene: { name: 'Myrcene', field: 'terpMyrcene', description: 'the most common cannabis terpene, known for earthy, musky aromas', aroma: 'Earthy, musky, herbal', benefits: 'Relaxation, sedation, anti-inflammatory', icon: '🌿' },
  limonene: { name: 'Limonene', field: 'terpLimonene', description: 'a citrus-scented terpene associated with mood elevation', aroma: 'Citrus, lemon, orange', benefits: 'Mood elevation, stress relief, anti-anxiety', icon: '🍋' },
  caryophyllene: { name: 'Caryophyllene', field: 'terpCaryophyllene', description: 'a spicy terpene that acts on CB2 receptors', aroma: 'Pepper, spicy, woody', benefits: 'Anti-inflammatory, pain relief, anxiety reduction', icon: '🌶️' },
  pinene: { name: 'Pinene', field: 'terpPinene', description: 'a pine-scented terpene known for promoting alertness', aroma: 'Pine, fresh, earthy', benefits: 'Alertness, memory retention, bronchodilator', icon: '🌲' },
  linalool: { name: 'Linalool', field: 'terpLinalool', description: 'a floral terpene found in lavender, known for calming effects', aroma: 'Floral, lavender, sweet', benefits: 'Calming, anxiety relief, sleep aid', icon: '💐' },
  humulene: { name: 'Humulene', field: 'terpHumulene', description: 'an earthy terpene found in hops, known for appetite suppression', aroma: 'Earthy, woody, herbal', benefits: 'Appetite suppression, anti-inflammatory, antibacterial', icon: '🍺' },
  terpinolene: { name: 'Terpinolene', field: 'terpTerpinolene', description: 'a floral terpene associated with uplifting effects', aroma: 'Floral, herbal, piney', benefits: 'Uplifting, antioxidant, sedative in high doses', icon: '🌸' },
  ocimene: { name: 'Ocimene', field: 'terpOcimene', description: 'a sweet terpene with antiviral and decongestant properties', aroma: 'Sweet, herbal, woody', benefits: 'Antiviral, anti-fungal, decongestant', icon: '🍃' },
}

export async function generateStaticParams() {
  return Object.keys(TERPENE_META).map((slug) => ({ terpeneSlug: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { terpeneSlug } = await params
  const meta = TERPENE_META[terpeneSlug]
  if (!meta) return {}

  const count = await prisma.strain.count({ where: { [meta.field]: { not: null, gt: 0 }, isActive: true } })
  const title = `${meta.name} Terpene: Cannabis Strains High in ${meta.name} | Leefii`
  const description = `Browse ${count}+ cannabis strains high in ${meta.name}. ${meta.benefits}. Compare terpene profiles, THC levels, and effects.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://leefii.com/strains/terpene/${terpeneSlug}`, siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/strains/terpene/${terpeneSlug}` },
  }
}

export default async function TerpenePage({ params }: Props) {
  const { terpeneSlug } = await params
  const meta = TERPENE_META[terpeneSlug]
  if (!meta) notFound()

  const strains = await prisma.strain.findMany({
    where: { [meta.field]: { not: null, gt: 0 }, isActive: true },
    orderBy: { [meta.field]: 'desc' },
    take: 50,
    select: {
      slug: true, name: true, type: true, thcMin: true, thcMax: true,
      rating: true, reviewsCount: true, effects: true, description: true,
      terpMyrcene: true, terpLimonene: true, terpCaryophyllene: true,
      terpPinene: true, terpLinalool: true, terpHumulene: true,
      terpTerpinolene: true, terpOcimene: true,
    },
  })

  if (strains.length === 0) notFound()

  const totalCount = await prisma.strain.count({ where: { [meta.field]: { not: null, gt: 0 }, isActive: true } })

  const typeBreakdown = {
    indica: strains.filter((s) => s.type === 'INDICA').length,
    sativa: strains.filter((s) => s.type === 'SATIVA').length,
    hybrid: strains.filter((s) => s.type === 'HYBRID').length,
  }

  const otherTerpenes = Object.entries(TERPENE_META).filter(([k]) => k !== terpeneSlug)

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Strains', item: 'https://leefii.com/strains' },
      { '@type': 'ListItem', position: 3, name: `${meta.name} Terpene` },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${meta.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `${meta.name} is ${meta.description}. It has an aroma of ${meta.aroma.toLowerCase()} and is associated with ${meta.benefits.toLowerCase()}.` },
      },
      {
        '@type': 'Question',
        name: `Which strains are high in ${meta.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Leefii lists ${totalCount}+ strains with ${meta.name}. Top strains include ${strains.slice(0, 3).map((s) => s.name).join(', ')}.` },
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
          <span className="text-gray-900 font-medium">{meta.name} Terpene</span>
        </nav>

        <div className="text-center mb-10">
          <span className="text-5xl mb-4 block">{meta.icon}</span>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {meta.name} Terpene Strains
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {totalCount}+ strains high in {meta.name}. {meta.description.charAt(0).toUpperCase() + meta.description.slice(1)}.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border mb-10">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Aroma</p>
              <p className="font-semibold text-gray-900">{meta.aroma}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Benefits</p>
              <p className="font-semibold text-gray-900">{meta.benefits}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Strain Breakdown</p>
              <p className="font-semibold text-gray-900">{typeBreakdown.indica} Indica · {typeBreakdown.sativa} Sativa · {typeBreakdown.hybrid} Hybrid</p>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <div className="space-y-3">
            {strains.map((s) => {
              const terpValue = (s as any)[meta.field] as number | null
              return (
                <Link key={s.slug} href={`/strains/${s.slug}`} className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 text-lg">{s.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          s.type === 'INDICA' ? 'bg-purple-100 text-purple-800' : s.type === 'SATIVA' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {s.type.charAt(0) + s.type.slice(1).toLowerCase()}
                        </span>
                        {terpValue && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-800">
                            {meta.name}: {terpValue.toFixed(2)}%
                          </span>
                        )}
                      </div>
                      {s.description && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{s.description}</p>}
                      <div className="flex flex-wrap gap-2 mt-2 text-xs">
                        {s.thcMax && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">THC: {s.thcMin && s.thcMin !== s.thcMax ? `${s.thcMin}-${s.thcMax}` : s.thcMax}%</span>}
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
              )
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Terpene</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {otherTerpenes.map(([slug, m]) => (
              <Link key={slug} href={`/strains/terpene/${slug}`} className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-100">
                <span className="text-2xl block mb-1">{m.icon}</span>
                <p className="font-medium text-gray-900 text-sm">{m.name}</p>
                <p className="text-xs text-gray-500">{m.aroma}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQ</h2>
          <div className="space-y-3">
            <details className="bg-white rounded-xl shadow-sm border border-gray-100">
              <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">What is {meta.name}?</summary>
              <p className="px-4 pb-4 text-gray-600">{meta.name} is {meta.description}. It has an aroma of {meta.aroma.toLowerCase()} and is associated with {meta.benefits.toLowerCase()}.</p>
            </details>
            <details className="bg-white rounded-xl shadow-sm border border-gray-100">
              <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">Which strains are high in {meta.name}?</summary>
              <p className="px-4 pb-4 text-gray-600">Leefii lists {totalCount}+ strains with {meta.name}. Top strains include {strains.slice(0, 3).map((s) => s.name).join(', ')}.</p>
            </details>
          </div>
        </section>
      </div>
    </div>
  )
}
