import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface Props {
  params: Promise<{ flavorSlug: string }>
}

export const revalidate = 86400

const FLAVOR_META: Record<string, { name: string; icon: string }> = {
  earthy: { name: 'Earthy', icon: '🌍' }, berry: { name: 'Berry', icon: '🫐' }, tropical: { name: 'Tropical', icon: '🏝️' },
  spicy: { name: 'Spicy', icon: '🌶️' }, sweet: { name: 'Sweet', icon: '🍬' }, pineapple: { name: 'Pineapple', icon: '🍍' },
  citrus: { name: 'Citrus', icon: '🍊' }, mango: { name: 'Mango', icon: '🥭' }, pine: { name: 'Pine', icon: '🌲' },
  woody: { name: 'Woody', icon: '🪵' }, blueberry: { name: 'Blueberry', icon: '🫐' }, pungent: { name: 'Pungent', icon: '👃' },
  herbal: { name: 'Herbal', icon: '🌿' }, floral: { name: 'Floral', icon: '🌸' }, orange: { name: 'Orange', icon: '🍊' },
  honey: { name: 'Honey', icon: '🍯' }, chemical: { name: 'Chemical', icon: '⚗️' }, nutty: { name: 'Nutty', icon: '🥜' },
  diesel: { name: 'Diesel', icon: '⛽' }, lemon: { name: 'Lemon', icon: '🍋' }, grape: { name: 'Grape', icon: '🍇' },
  cheese: { name: 'Cheese', icon: '🧀' }, mint: { name: 'Mint', icon: '🌿' }, strawberry: { name: 'Strawberry', icon: '🍓' },
  lime: { name: 'Lime', icon: '🟢' }, coffee: { name: 'Coffee', icon: '☕' }, vanilla: { name: 'Vanilla', icon: '🍦' },
  lavender: { name: 'Lavender', icon: '💜' }, cherry: { name: 'Cherry', icon: '🍒' }, apple: { name: 'Apple', icon: '🍎' },
  grapefruit: { name: 'Grapefruit', icon: '🍊' }, banana: { name: 'Banana', icon: '🍌' }, peach: { name: 'Peach', icon: '🍑' },
  chocolate: { name: 'Chocolate', icon: '🍫' }, skunk: { name: 'Skunk', icon: '🦨' }, coconut: { name: 'Coconut', icon: '🥥' },
  rose: { name: 'Rose', icon: '🌹' }, watermelon: { name: 'Watermelon', icon: '🍉' }, butter: { name: 'Butter', icon: '🧈' },
  fruity: { name: 'Fruity', icon: '🍇' }, ammonia: { name: 'Ammonia', icon: '💨' }, garlic: { name: 'Garlic', icon: '🧄' },
  creamy: { name: 'Creamy', icon: '🍶' },
}

export async function generateStaticParams() {
  return Object.keys(FLAVOR_META).map((slug) => ({ flavorSlug: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { flavorSlug } = await params
  const meta = FLAVOR_META[flavorSlug]
  if (!meta) return {}

  const count = await prisma.strain.count({ where: { flavors: { has: meta.name }, isActive: true } })
  const title = `${meta.name} Flavored Cannabis Strains (${count}+ Strains) | Leefii`
  const description = `Browse ${count}+ cannabis strains with ${meta.name.toLowerCase()} flavors. Compare THC levels, effects, and reviews.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://leefii.com/strains/flavors/${flavorSlug}`, siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/strains/flavors/${flavorSlug}` },
  }
}

export default async function FlavorPage({ params }: Props) {
  const { flavorSlug } = await params
  const meta = FLAVOR_META[flavorSlug]
  if (!meta) notFound()

  const strains = await prisma.strain.findMany({
    where: { flavors: { has: meta.name }, isActive: true },
    orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }],
    take: 50,
    select: {
      slug: true, name: true, type: true, thcMin: true, thcMax: true,
      cbdMin: true, cbdMax: true, rating: true, reviewsCount: true,
      effects: true, flavors: true, description: true,
    },
  })

  if (strains.length === 0) notFound()

  const totalCount = await prisma.strain.count({ where: { flavors: { has: meta.name }, isActive: true } })

  const typeBreakdown = {
    indica: strains.filter((s) => s.type === 'INDICA').length,
    sativa: strains.filter((s) => s.type === 'SATIVA').length,
    hybrid: strains.filter((s) => s.type === 'HYBRID').length,
  }

  const otherFlavors = Object.entries(FLAVOR_META).filter(([k]) => k !== flavorSlug).slice(0, 12)

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Strains', item: 'https://leefii.com/strains' },
      { '@type': 'ListItem', position: 3, name: `${meta.name} Strains` },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/strains" className="hover:text-green-600">Strains</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{meta.name} Flavor</span>
        </nav>

        <div className="text-center mb-10">
          <span className="text-5xl mb-4 block">{meta.icon}</span>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {meta.name} Flavored Cannabis Strains
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse {totalCount}+ cannabis strains with {meta.name.toLowerCase()} flavor profiles.
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
                      {s.flavors?.slice(0, 3).map((f) => (
                        <span key={f} className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">{f}</span>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Flavor</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {otherFlavors.map(([slug, m]) => (
              <Link key={slug} href={`/strains/flavors/${slug}`} className="bg-white rounded-xl p-3 text-center shadow-sm hover:shadow-md transition border border-gray-100">
                <span className="text-xl block mb-1">{m.icon}</span>
                <p className="font-medium text-gray-900 text-xs">{m.name}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
