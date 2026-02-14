import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface Props {
  params: Promise<{ typeSlug: string; effectSlug: string }>
}

export const revalidate = 86400

const TYPES: Record<string, { name: string; dbValue: string }> = {
  indica: { name: 'Indica', dbValue: 'INDICA' },
  sativa: { name: 'Sativa', dbValue: 'SATIVA' },
  hybrid: { name: 'Hybrid', dbValue: 'HYBRID' },
}

const EFFECTS: Record<string, string> = {
  relaxed: 'Relaxed', energetic: 'Energetic', happy: 'Happy', creative: 'Creative',
  focused: 'Focused', sleepy: 'Sleepy', hungry: 'Hungry', euphoric: 'Euphoric',
  uplifted: 'Uplifted', calm: 'Calm', talkative: 'Talkative', giggly: 'Giggly',
  tingly: 'Tingly', aroused: 'Aroused', peaceful: 'Peaceful',
}

export async function generateStaticParams() {
  const params: { typeSlug: string; effectSlug: string }[] = []
  for (const typeSlug of Object.keys(TYPES)) {
    for (const effectSlug of Object.keys(EFFECTS)) {
      params.push({ typeSlug, effectSlug })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { typeSlug, effectSlug } = await params
  const typeMeta = TYPES[typeSlug]
  const effectName = EFFECTS[effectSlug]
  if (!typeMeta || !effectName) return {}

  const count = await prisma.strain.count({ where: { type: typeMeta.dbValue as any, effects: { has: effectName }, isActive: true } })
  if (count === 0) return {}

  const title = `${effectName} ${typeMeta.name} Strains (${count}+ Strains) | Leefii`
  const description = `Browse ${count}+ ${effectName.toLowerCase()} ${typeMeta.name.toLowerCase()} cannabis strains. Compare THC levels, terpene profiles, and reviews.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://leefii.com/strains/type/${typeSlug}/${effectSlug}`, siteName: 'Leefii' },
    alternates: { canonical: `https://leefii.com/strains/type/${typeSlug}/${effectSlug}` },
  }
}

export default async function TypeEffectPage({ params }: Props) {
  const { typeSlug, effectSlug } = await params
  const typeMeta = TYPES[typeSlug]
  const effectName = EFFECTS[effectSlug]
  if (!typeMeta || !effectName) notFound()

  const strains = await prisma.strain.findMany({
    where: { type: typeMeta.dbValue as any, effects: { has: effectName }, isActive: true },
    orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }],
    take: 50,
    select: {
      slug: true, name: true, type: true, thcMin: true, thcMax: true,
      cbdMin: true, cbdMax: true, rating: true, reviewsCount: true,
      effects: true, description: true,
    },
  })

  if (strains.length === 0) notFound()

  const totalCount = await prisma.strain.count({ where: { type: typeMeta.dbValue as any, effects: { has: effectName }, isActive: true } })

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Strains', item: 'https://leefii.com/strains' },
      { '@type': 'ListItem', position: 3, name: `${typeMeta.name}`, item: `https://leefii.com/strains/type/${typeSlug}` },
      { '@type': 'ListItem', position: 4, name: `${effectName}` },
    ],
  }

  const otherEffects = Object.entries(EFFECTS).filter(([k]) => k !== effectSlug).slice(0, 6)
  const otherTypes = Object.entries(TYPES).filter(([k]) => k !== typeSlug)

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/strains" className="hover:text-green-600">Strains</Link>
          <span className="mx-2">/</span>
          <Link href={`/strains/type/${typeSlug}`} className="hover:text-green-600">{typeMeta.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{effectName}</span>
        </nav>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {effectName} {typeMeta.name} Strains
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {totalCount}+ {typeMeta.name.toLowerCase()} strains with {effectName.toLowerCase()} effects.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">{totalCount} Strains</span>
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${typeSlug === 'indica' ? 'bg-purple-100 text-purple-800' : typeSlug === 'sativa' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
            {typeMeta.name}
          </span>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">More {typeMeta.name} Effects</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {otherEffects.map(([slug, name]) => (
              <Link key={slug} href={`/strains/type/${typeSlug}/${slug}`} className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-100">
                <p className="font-medium text-gray-900 text-sm">{name} {typeMeta.name}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{effectName} in Other Types</h2>
          <div className="grid grid-cols-2 gap-3">
            {otherTypes.map(([slug, t]) => (
              <Link key={slug} href={`/strains/type/${slug}/${effectSlug}`} className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-100">
                <p className="font-medium text-gray-900 text-sm">{effectName} {t.name}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
