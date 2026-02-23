import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { EFFECTS, getAllEffectSlugs } from '@/data/strain-purposes'
import Link from 'next/link'

interface Props {
  params: Promise<{ effectSlug: string }>
}

export const revalidate = 86400

// Map effects to related medical conditions for cross-linking and FAQ content
const EFFECT_CONDITION_MAP: Record<string, { conditions: string[]; conditionSlugs: string[]; terpenes: string }> = {
  relaxed: { conditions: ['Anxiety', 'Stress', 'Insomnia'], conditionSlugs: ['anxiety', 'stress', 'insomnia'], terpenes: 'myrcene, linalool, and caryophyllene' },
  euphoric: { conditions: ['Depression', 'Stress', 'PTSD'], conditionSlugs: ['depression', 'stress', 'ptsd'], terpenes: 'limonene, terpinolene, and caryophyllene' },
  creative: { conditions: ['Depression', 'ADHD', 'Fatigue'], conditionSlugs: ['depression', 'adhd', 'fatigue'], terpenes: 'pinene, limonene, and terpinolene' },
  sleepy: { conditions: ['Insomnia', 'Anxiety', 'Chronic Pain'], conditionSlugs: ['insomnia', 'anxiety', 'pain'], terpenes: 'myrcene, linalool, and caryophyllene' },
  hungry: { conditions: ['Appetite Loss', 'Nausea', 'Chronic Pain'], conditionSlugs: ['appetite-loss', 'nausea', 'pain'], terpenes: 'myrcene, caryophyllene, and limonene' },
  energetic: { conditions: ['Fatigue', 'Depression', 'ADHD'], conditionSlugs: ['fatigue', 'depression', 'adhd'], terpenes: 'limonene, terpinolene, and pinene' },
  focused: { conditions: ['ADHD', 'Fatigue', 'Depression'], conditionSlugs: ['adhd', 'fatigue', 'depression'], terpenes: 'pinene, limonene, and terpinolene' },
  giggly: { conditions: ['Depression', 'Stress', 'Anxiety'], conditionSlugs: ['depression', 'stress', 'anxiety'], terpenes: 'limonene, terpinolene, and myrcene' },
  talkative: { conditions: ['Anxiety', 'Depression', 'Stress'], conditionSlugs: ['anxiety', 'depression', 'stress'], terpenes: 'limonene, pinene, and terpinolene' },
  uplifted: { conditions: ['Depression', 'Stress', 'Fatigue'], conditionSlugs: ['depression', 'stress', 'fatigue'], terpenes: 'limonene, terpinolene, and pinene' },
  happy: { conditions: ['Depression', 'Anxiety', 'Stress'], conditionSlugs: ['depression', 'anxiety', 'stress'], terpenes: 'limonene, myrcene, and caryophyllene' },
  aroused: { conditions: ['Stress', 'Anxiety', 'Depression'], conditionSlugs: ['stress', 'anxiety', 'depression'], terpenes: 'limonene, linalool, and caryophyllene' },
}

export async function generateStaticParams() {
  return getAllEffectSlugs().map((slug) => ({ effectSlug: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { effectSlug } = await params
  const effect = EFFECTS[effectSlug]
  if (!effect) return {}

  const count = await prisma.strain.count({ where: { effects: { has: effect.name }, isActive: true } })
  const title = `Best ${effect.name} Strains — Top Cannabis for Feeling ${effect.name} | Leefii`
  const description = `Browse ${count}+ ${effect.description}. Compare THC levels, terpene profiles, and reviews. Find your perfect ${effect.name.toLowerCase()} strain on Leefii.`

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
  const effect = EFFECTS[effectSlug]
  if (!effect) notFound()

  const relatedData = EFFECT_CONDITION_MAP[effectSlug] || { conditions: ['Stress'], conditionSlugs: ['stress'], terpenes: 'myrcene, limonene, and caryophyllene' }

  const strains = await prisma.strain.findMany({
    where: { effects: { has: effect.name }, isActive: true },
    orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }],
    take: 20,
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

  const totalCount = await prisma.strain.count({ where: { effects: { has: effect.name }, isActive: true } })

  const typeBreakdown = {
    indica: strains.filter((s) => s.type === 'INDICA').length,
    sativa: strains.filter((s) => s.type === 'SATIVA').length,
    hybrid: strains.filter((s) => s.type === 'HYBRID').length,
  }

  const dominantType = typeBreakdown.indica >= typeBreakdown.sativa && typeBreakdown.indica >= typeBreakdown.hybrid
    ? 'Indica'
    : typeBreakdown.sativa >= typeBreakdown.indica && typeBreakdown.sativa >= typeBreakdown.hybrid
      ? 'Sativa'
      : 'Hybrid'

  const avgThc = strains.filter((s) => s.thcMax).length > 0
    ? (strains.reduce((sum, s) => sum + (s.thcMax || 0), 0) / strains.filter((s) => s.thcMax).length).toFixed(0)
    : null

  const otherEffects = Object.entries(EFFECTS).filter(([k]) => k !== effectSlug).slice(0, 8)

  const topThreeNames = strains.slice(0, 3).map((s) => s.name).join(', ')

  // --- FAQ data ---
  const faqItems = [
    {
      question: `What strains make you ${effect.name.toLowerCase()}?`,
      answer: `There are ${totalCount}+ cannabis strains known to produce ${effect.name.toLowerCase()} effects. Some of the highest-rated ${effect.name.toLowerCase()} strains include ${topThreeNames}. The ${effect.name.toLowerCase()} effect can be found across indica, sativa, and hybrid varieties, though the intensity and character may differ between types. Browse the full list on this page to find one that fits your preferences.`,
    },
    {
      question: `Is indica or sativa more ${effect.name.toLowerCase()}?`,
      answer: `Among the top ${effect.name.toLowerCase()} strains on Leefii, ${typeBreakdown.indica} are Indica, ${typeBreakdown.sativa} are Sativa, and ${typeBreakdown.hybrid} are Hybrid. ${dominantType} strains are the most common type to produce ${effect.name.toLowerCase()} effects. However, the specific terpene profile and cannabinoid content of each strain matter more than the indica/sativa classification alone.`,
    },
    {
      question: `What terpenes make you feel ${effect.name.toLowerCase()}?`,
      answer: `The terpenes most associated with ${effect.name.toLowerCase()} effects are ${relatedData.terpenes}. These aromatic compounds work alongside THC and CBD through the entourage effect to shape the overall experience of each strain. When browsing ${effect.name.toLowerCase()} strains, look for these terpenes in the strain profile to find the most consistent results.`,
    },
    {
      question: `Can ${effect.name.toLowerCase()} strains help with ${relatedData.conditions[0].toLowerCase()}?`,
      answer: `Many people who use cannabis for ${relatedData.conditions[0].toLowerCase()} report that strains with ${effect.name.toLowerCase()} effects provide meaningful relief. The ${effect.name.toLowerCase()} sensation is closely related to how these strains interact with the endocannabinoid system. However, individual responses vary, and cannabis should complement — not replace — professional medical advice. Browse our ${relatedData.conditions[0].toLowerCase()} strains page for targeted recommendations.`,
    },
    {
      question: `How much THC do ${effect.name.toLowerCase()} strains have?`,
      answer: `${effect.name} strains on Leefii range widely in THC content.${avgThc ? ` The top-rated ${effect.name.toLowerCase()} strains average around ${avgThc}% THC.` : ''} Both high-THC and moderate-THC strains can produce ${effect.name.toLowerCase()} effects — the terpene profile and overall cannabinoid balance play a significant role. Beginners should start with lower-THC options (12-18%) and increase gradually to find their ideal dose.`,
    },
  ]

  // --- JSON-LD: BreadcrumbList ---
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Strains', item: 'https://leefii.com/strains' },
      { '@type': 'ListItem', position: 3, name: 'Effects', item: 'https://leefii.com/strains/effects' },
      { '@type': 'ListItem', position: 4, name: `${effect.name} Strains` },
    ],
  }

  // --- JSON-LD: FAQPage ---
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  // --- JSON-LD: ItemList ---
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best ${effect.name} Cannabis Strains`,
    numberOfItems: strains.length,
    itemListElement: strains.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.name,
      url: `https://leefii.com/strains/${s.slug}`,
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-green-100 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/strains" className="hover:text-white">Strains</Link>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">{effect.name}</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{effect.icon}</span>
            <h1 className="text-3xl md:text-5xl font-bold">
              Best {effect.name} Strains
            </h1>
          </div>
          <p className="text-xl text-green-50 max-w-3xl">
            Top cannabis strains for feeling {effect.name.toLowerCase()}. Browse {totalCount}+ {effect.description}.
          </p>

          {/* Stats pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
              {totalCount} Total Strains
            </span>
            {typeBreakdown.indica > 0 && (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
                {typeBreakdown.indica} Indica
              </span>
            )}
            {typeBreakdown.sativa > 0 && (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
                {typeBreakdown.sativa} Sativa
              </span>
            )}
            {typeBreakdown.hybrid > 0 && (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
                {typeBreakdown.hybrid} Hybrid
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Intro Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What Are {effect.name} Cannabis Strains?
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {effect.intro}
            </p>
          </div>
        </section>

        {/* Type Filter Tabs (static display) */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold bg-green-600 text-white">
              All ({totalCount})
            </span>
            <Link
              href="/strains/indica"
              className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition"
            >
              Indica ({typeBreakdown.indica})
            </Link>
            <Link
              href="/strains/sativa"
              className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-medium bg-orange-100 text-orange-800 hover:bg-orange-200 transition"
            >
              Sativa ({typeBreakdown.sativa})
            </Link>
            <Link
              href="/strains/hybrid"
              className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
            >
              Hybrid ({typeBreakdown.hybrid})
            </Link>
          </div>
        </section>

        {/* Strain Listings */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Top {strains.length} {effect.name} Strains
          </h2>
          <div className="space-y-3">
            {strains.map((s, index) => (
              <Link
                key={s.slug}
                href={`/strains/${s.slug}`}
                className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-400 font-medium">#{index + 1}</span>
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
                      {s.thcMax && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          THC: {s.thcMin && s.thcMin !== s.thcMax ? `${s.thcMin}-${s.thcMax}` : s.thcMax}%
                        </span>
                      )}
                      {s.cbdMax && s.cbdMax > 0 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          CBD: {s.cbdMin && s.cbdMin !== s.cbdMax ? `${s.cbdMin}-${s.cbdMax}` : s.cbdMax}%
                        </span>
                      )}
                      {s.effects?.slice(0, 4).map((e) => (
                        <span key={e} className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{e}</span>
                      ))}
                    </div>
                  </div>
                  {s.rating && s.rating > 0 && (
                    <div className="text-right ml-4 flex-shrink-0">
                      <span className="text-yellow-500 font-bold text-lg">&#9733; {s.rating.toFixed(1)}</span>
                      <p className="text-xs text-gray-400">{s.reviewsCount} reviews</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Cross-links: Related Conditions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Related Conditions
          </h2>
          <p className="text-gray-600 mb-6">
            {effect.name} strains are often used by people managing these conditions. Explore strains specifically recommended for each.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {relatedData.conditions.map((condition, i) => (
              <Link
                key={condition}
                href={`/strains/conditions/${relatedData.conditionSlugs[i]}`}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100 text-center"
              >
                <p className="font-semibold text-gray-900">{condition}</p>
                <p className="text-sm text-gray-500 mt-1">Strains for {condition.toLowerCase()}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Cross-links: Browse by Type */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Browse by Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/strains/indica" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100 text-center">
              <span className="text-2xl block mb-1">&#127811;</span>
              <p className="font-semibold text-purple-800">Indica Strains</p>
              <p className="text-sm text-gray-500 mt-1">Relaxing body effects</p>
            </Link>
            <Link href="/strains/sativa" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100 text-center">
              <span className="text-2xl block mb-1">&#9728;&#65039;</span>
              <p className="font-semibold text-orange-800">Sativa Strains</p>
              <p className="text-sm text-gray-500 mt-1">Energizing head effects</p>
            </Link>
            <Link href="/strains/hybrid" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100 text-center">
              <span className="text-2xl block mb-1">&#9878;&#65039;</span>
              <p className="font-semibold text-blue-800">Hybrid Strains</p>
              <p className="text-sm text-gray-500 mt-1">Balanced effects</p>
            </Link>
          </div>
        </section>

        {/* Other Effects */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Effect</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {otherEffects.map(([slug, e]) => (
              <Link key={slug} href={`/strains/effects/${slug}`} className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-100">
                <span className="text-2xl block mb-1">{e.icon}</span>
                <p className="font-medium text-gray-900 text-sm">{e.name}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions About {effect.name} Strains
          </h2>
          <div className="space-y-3">
            {faqItems.map((faq, i) => (
              <details key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 group">
                <summary className="p-4 font-semibold cursor-pointer hover:text-green-700 list-none flex items-center justify-between">
                  <span>{faq.question}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform ml-2">&#9660;</span>
                </summary>
                <p className="px-4 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Medical Disclaimer */}
        <section className="mb-12">
          <div className="bg-gray-100 rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 leading-relaxed">
              <strong>Disclaimer:</strong> Strain effects vary by individual. This information is for educational purposes only. Cannabis affects everyone differently based on factors like tolerance, body chemistry, and dosage. Consult with a healthcare professional before using cannabis for medical purposes. Leefii does not provide medical advice.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
