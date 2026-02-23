import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  getCategoryComparisonBySlug,
  getPlatformComparisonBySlug,
  getAllCategoryComparisonSlugs,
  getAllPlatformComparisonSlugs,
  TOP_STRAIN_PAIRS,
} from '@/data/comparison-pages'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 86400

function parsePair(slug: string): { slug1: string; slug2: string } | null {
  const idx = slug.indexOf('-vs-')
  if (idx === -1) return null
  return { slug1: slug.slice(0, idx), slug2: slug.slice(idx + 4) }
}

function formatSlugToName(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export async function generateStaticParams() {
  const categorySlugs = getAllCategoryComparisonSlugs()
  const platformSlugs = getAllPlatformComparisonSlugs()

  const params: { slug: string }[] = [
    ...categorySlugs.map((slug) => ({ slug })),
    ...platformSlugs.map((slug) => ({ slug })),
    ...TOP_STRAIN_PAIRS.map((slug) => ({ slug })),
  ]

  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const categoryData = getCategoryComparisonBySlug(slug)
  if (categoryData) {
    return {
      title: categoryData.metaTitle,
      description: categoryData.metaDescription,
      openGraph: {
        title: categoryData.metaTitle,
        description: categoryData.metaDescription,
        url: `https://leefii.com/compare/${slug}`,
        siteName: 'Leefii',
      },
      alternates: { canonical: `https://leefii.com/compare/${slug}` },
    }
  }

  const platformData = getPlatformComparisonBySlug(slug)
  if (platformData) {
    return {
      title: platformData.metaTitle,
      description: platformData.metaDescription,
      openGraph: {
        title: platformData.metaTitle,
        description: platformData.metaDescription,
        url: `https://leefii.com/compare/${slug}`,
        siteName: 'Leefii',
      },
      alternates: { canonical: `https://leefii.com/compare/${slug}` },
    }
  }

  const parsed = parsePair(slug)
  if (parsed) {
    const [s1, s2] = await Promise.all([
      prisma.strain.findFirst({ where: { slug: parsed.slug1, isActive: true }, select: { name: true } }),
      prisma.strain.findFirst({ where: { slug: parsed.slug2, isActive: true }, select: { name: true } }),
    ])
    if (s1 && s2) {
      const title = `${s1.name} vs ${s2.name} — Side-by-Side Comparison | Leefii`
      const description = `Compare ${s1.name} and ${s2.name} side by side. THC/CBD levels, effects, flavors, terpenes, medical uses, and user ratings compared.`
      return {
        title,
        description,
        openGraph: { title, description, url: `https://leefii.com/compare/${slug}`, siteName: 'Leefii' },
        alternates: { canonical: `https://leefii.com/compare/${slug}` },
      }
    }
  }

  return {}
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================

export default async function CompareSlugPage({ params }: Props) {
  const { slug } = await params

  // 1. Check category comparison
  const categoryData = getCategoryComparisonBySlug(slug)
  if (categoryData) return <CategoryComparison data={categoryData} slug={slug} />

  // 2. Check platform comparison
  const platformData = getPlatformComparisonBySlug(slug)
  if (platformData) return <PlatformComparison data={platformData} slug={slug} />

  // 3. Try strain comparison
  const parsed = parsePair(slug)
  if (parsed) {
    const [strainA, strainB] = await Promise.all([
      prisma.strain.findFirst({
        where: { slug: parsed.slug1, isActive: true },
        select: {
          slug: true, name: true, type: true, thcMin: true, thcMax: true,
          cbdMin: true, cbdMax: true, rating: true, reviewsCount: true,
          effects: true, flavors: true, conditions: true, description: true, difficulty: true,
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
          effects: true, flavors: true, conditions: true, description: true, difficulty: true,
          terpMyrcene: true, terpLimonene: true, terpCaryophyllene: true,
          terpPinene: true, terpLinalool: true, terpHumulene: true,
          terpTerpinolene: true, terpOcimene: true,
        },
      }),
    ])

    if (strainA && strainB) {
      return <StrainComparison strainA={strainA} strainB={strainB} slug={slug} />
    }
  }

  // 4. Not found
  notFound()
}

// ============================================================
// CATEGORY COMPARISON COMPONENT
// ============================================================

interface CategoryComparisonData {
  slug: string
  titleA: string
  titleB: string
  pageTitle: string
  metaTitle: string
  metaDescription: string
  intro: string
  comparisonTable: { label: string; valueA: string; valueB: string }[]
  sections: { heading: string; content: string }[]
  verdict: string
  faqs: { question: string; answer: string }[]
}

function CategoryComparison({ data, slug }: { data: CategoryComparisonData; slug: string }) {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Comparisons', item: 'https://leefii.com/compare' },
      { '@type': 'ListItem', position: 3, name: data.pageTitle },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.pageTitle}</h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            {data.titleA} vs {data.titleB} — a detailed, side-by-side breakdown.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/compare" className="hover:text-green-600">Comparisons</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{data.pageTitle}</span>
        </nav>

        {/* Intro */}
        <section className="mb-10">
          <div className="prose prose-green max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">{data.intro}</p>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {data.titleA} vs {data.titleB}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-gray-50 border-b w-1/3 text-sm">Attribute</th>
                  <th className="text-center p-4 bg-green-50 border-b w-1/3 font-bold text-green-800">
                    {data.titleA}
                  </th>
                  <th className="text-center p-4 bg-blue-50 border-b w-1/3 font-bold text-blue-800">
                    {data.titleB}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.comparisonTable.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-4 border-b text-sm font-medium text-gray-700">{row.label}</td>
                    <td className="p-4 border-b text-center text-sm text-gray-600">{row.valueA}</td>
                    <td className="p-4 border-b text-center text-sm text-gray-600">{row.valueB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Content Sections */}
        {data.sections.map((section) => (
          <section key={section.heading} className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.heading}</h2>
            <div
              className="prose prose-green max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </section>
        ))}

        {/* Verdict */}
        <section className="mb-10">
          <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Which Should You Choose?</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{data.verdict}</p>
          </div>
        </section>

        {/* FAQ */}
        {data.faqs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {data.faqs.map((faq) => (
                <details key={faq.question} className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">
                    {faq.question}
                  </summary>
                  <p className="px-4 pb-4 text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// ============================================================
// PLATFORM COMPARISON COMPONENT
// ============================================================

interface PlatformComparisonData {
  slug: string
  platformA: string
  platformB: string
  pageTitle: string
  metaTitle: string
  metaDescription: string
  intro: string
  comparisonTable: { label: string; valueA: string; valueB: string; winner?: 'a' | 'b' | 'tie' }[]
  sections: { heading: string; content: string }[]
  verdict: string
  faqs: { question: string; answer: string }[]
}

function PlatformComparison({ data, slug }: { data: PlatformComparisonData; slug: string }) {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Comparisons', item: 'https://leefii.com/compare' },
      { '@type': 'ListItem', position: 3, name: data.pageTitle },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.pageTitle}</h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            An honest, side-by-side comparison of {data.platformA} and {data.platformB}.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/compare" className="hover:text-green-600">Comparisons</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{data.pageTitle}</span>
        </nav>

        {/* Intro */}
        <section className="mb-10">
          <p className="text-gray-700 leading-relaxed text-lg">{data.intro}</p>
        </section>

        {/* Feature Comparison Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-gray-50 border-b w-1/3 text-sm">Feature</th>
                  <th className="text-center p-4 bg-green-50 border-b w-1/3 font-bold text-green-800">
                    {data.platformA}
                  </th>
                  <th className="text-center p-4 bg-gray-100 border-b w-1/3 font-bold text-gray-600">
                    {data.platformB}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.comparisonTable.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-4 border-b text-sm font-medium text-gray-700">{row.label}</td>
                    <td
                      className={`p-4 border-b text-center text-sm ${
                        row.winner === 'a' ? 'font-bold text-green-700' : 'text-gray-600'
                      }`}
                    >
                      {row.winner === 'a' && <span className="mr-1">&#10003;</span>}
                      {row.valueA}
                    </td>
                    <td
                      className={`p-4 border-b text-center text-sm ${
                        row.winner === 'b' ? 'font-bold text-gray-700' : 'text-gray-500'
                      }`}
                    >
                      {row.winner === 'b' && <span className="mr-1">&#10003;</span>}
                      {row.valueB}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Content Sections */}
        {data.sections.map((section) => (
          <section key={section.heading} className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.heading}</h2>
            <div
              className="prose prose-green max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </section>
        ))}

        {/* Verdict */}
        <section className="mb-10 bg-green-700 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">The Verdict</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">{data.verdict}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dispensaries"
              className="bg-white text-green-700 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition"
            >
              Try Leefii Free
            </Link>
            <Link
              href="/sell"
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition"
            >
              List Your Dispensary
            </Link>
          </div>
        </section>

        {/* FAQ */}
        {data.faqs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {data.faqs.map((faq) => (
                <details key={faq.question} className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">
                    {faq.question}
                  </summary>
                  <p className="px-4 pb-4 text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// ============================================================
// STRAIN COMPARISON COMPONENT
// ============================================================

type StrainData = {
  slug: string
  name: string
  type: string
  thcMin: number | null
  thcMax: number | null
  cbdMin: number | null
  cbdMax: number | null
  rating: number | null
  reviewsCount: number | null
  effects: string[]
  flavors: string[]
  conditions: string[]
  description: string | null
  difficulty: string | null
  terpMyrcene: number | null
  terpLimonene: number | null
  terpCaryophyllene: number | null
  terpPinene: number | null
  terpLinalool: number | null
  terpHumulene: number | null
  terpTerpinolene: number | null
  terpOcimene: number | null
}

async function StrainComparison({
  strainA,
  strainB,
  slug,
}: {
  strainA: StrainData
  strainB: StrainData
  slug: string
}) {
  const formatType = (t: string) => t.charAt(0) + t.slice(1).toLowerCase()
  const formatThc = (s: StrainData) =>
    s.thcMax ? `${s.thcMin && s.thcMin !== s.thcMax ? `${s.thcMin}-` : ''}${s.thcMax}%` : 'N/A'
  const formatCbd = (s: StrainData) =>
    s.cbdMax && s.cbdMax > 0 ? `${s.cbdMin && s.cbdMin !== s.cbdMax ? `${s.cbdMin}-` : ''}${s.cbdMax}%` : 'Minimal'

  const sharedEffects = strainA.effects?.filter((e) => strainB.effects?.includes(e)) || []
  const uniqueEffectsA = strainA.effects?.filter((e) => !strainB.effects?.includes(e)) || []
  const uniqueEffectsB = strainB.effects?.filter((e) => !strainA.effects?.includes(e)) || []

  const sharedConditions = strainA.conditions?.filter((c) => strainB.conditions?.includes(c)) || []
  const uniqueConditionsA = strainA.conditions?.filter((c) => !strainB.conditions?.includes(c)) || []
  const uniqueConditionsB = strainB.conditions?.filter((c) => !strainA.conditions?.includes(c)) || []

  const terpenes = [
    { name: 'Myrcene', a: strainA.terpMyrcene, b: strainB.terpMyrcene },
    { name: 'Limonene', a: strainA.terpLimonene, b: strainB.terpLimonene },
    { name: 'Caryophyllene', a: strainA.terpCaryophyllene, b: strainB.terpCaryophyllene },
    { name: 'Pinene', a: strainA.terpPinene, b: strainB.terpPinene },
    { name: 'Linalool', a: strainA.terpLinalool, b: strainB.terpLinalool },
    { name: 'Humulene', a: strainA.terpHumulene, b: strainB.terpHumulene },
    { name: 'Terpinolene', a: strainA.terpTerpinolene, b: strainB.terpTerpinolene },
    { name: 'Ocimene', a: strainA.terpOcimene, b: strainB.terpOcimene },
  ].filter((t) => t.a || t.b)

  const maxTerp = Math.max(...terpenes.map((t) => Math.max(t.a || 0, t.b || 0)), 0.01)

  // Related comparisons
  const related = await prisma.strain.findMany({
    where: {
      isActive: true,
      type: strainA.type as any,
      slug: { notIn: [strainA.slug, strainB.slug] },
      rating: { gte: 4 },
    },
    take: 4,
    orderBy: { reviewsCount: 'desc' },
    select: { slug: true, name: true },
  })

  // Determine recommendation logic
  const thcA = strainA.thcMax || 0
  const thcB = strainB.thcMax || 0
  const cbdA = strainA.cbdMax || 0
  const cbdB = strainB.cbdMax || 0
  const totalEffects = Array.from(new Set([...(strainA.effects || []), ...(strainB.effects || [])])).length
  const sharedPercent = totalEffects > 0 ? Math.round((sharedEffects.length / totalEffects) * 100) : 0

  // Build FAQ answers
  const faqItems = [
    {
      question: `Is ${strainA.name} stronger than ${strainB.name}?`,
      answer:
        thcA > thcB
          ? `${strainA.name} generally has higher THC content (up to ${strainA.thcMax}%) compared to ${strainB.name} (up to ${strainB.thcMax}%), suggesting it may produce stronger psychoactive effects. However, individual experience varies based on tolerance, consumption method, and the full cannabinoid and terpene profile.`
          : thcB > thcA
            ? `${strainB.name} generally has higher THC content (up to ${strainB.thcMax}%) compared to ${strainA.name} (up to ${strainA.thcMax}%), suggesting it may produce stronger psychoactive effects. However, individual experience varies based on tolerance, consumption method, and the full cannabinoid and terpene profile.`
            : `${strainA.name} and ${strainB.name} have similar THC levels, so neither is definitively stronger. The overall experience depends on the full terpene profile, your tolerance, and how you consume it.`,
    },
    {
      question: `Which is better for anxiety, ${strainA.name} or ${strainB.name}?`,
      answer: (() => {
        const aHelps = strainA.conditions?.some((c) => c.toLowerCase().includes('anxiety'))
        const bHelps = strainB.conditions?.some((c) => c.toLowerCase().includes('anxiety'))
        if (aHelps && bHelps) return `Both ${strainA.name} and ${strainB.name} are reported to help with anxiety. Consider trying both to see which works better for your individual needs. Strains with higher CBD content may offer more calming effects.`
        if (aHelps) return `${strainA.name} is more commonly reported to help with anxiety. ${strainB.name} may have other therapeutic benefits but is less frequently associated with anxiety relief.`
        if (bHelps) return `${strainB.name} is more commonly reported to help with anxiety. ${strainA.name} may have other therapeutic benefits but is less frequently associated with anxiety relief.`
        return `Neither ${strainA.name} nor ${strainB.name} is primarily known for anxiety relief. If anxiety management is your goal, consider strains with higher CBD content or those specifically reported to help with anxiety. Always consult a medical professional.`
      })(),
    },
    {
      question: `What's the difference between ${strainA.name} and ${strainB.name}?`,
      answer: `${strainA.name} is a ${formatType(strainA.type).toLowerCase()} strain${strainA.effects?.length ? ` known for ${strainA.effects.slice(0, 3).join(', ').toLowerCase()} effects` : ''}. ${strainB.name} is a ${formatType(strainB.type).toLowerCase()} strain${strainB.effects?.length ? ` known for ${strainB.effects.slice(0, 3).join(', ').toLowerCase()} effects` : ''}. They share ${sharedEffects.length} effect${sharedEffects.length !== 1 ? 's' : ''} in common and differ in THC content, terpene profiles, and medical applications.`,
    },
    {
      question: `Which has more CBD, ${strainA.name} or ${strainB.name}?`,
      answer:
        cbdA > cbdB
          ? `${strainA.name} has more CBD (up to ${strainA.cbdMax}%) compared to ${strainB.name} (${strainB.cbdMax ? `up to ${strainB.cbdMax}%` : 'minimal CBD'}). Higher CBD content is associated with more balanced effects and potential therapeutic benefits without as much psychoactive intensity.`
          : cbdB > cbdA
            ? `${strainB.name} has more CBD (up to ${strainB.cbdMax}%) compared to ${strainA.name} (${strainA.cbdMax ? `up to ${strainA.cbdMax}%` : 'minimal CBD'}). Higher CBD content is associated with more balanced effects and potential therapeutic benefits without as much psychoactive intensity.`
            : `${strainA.name} and ${strainB.name} have similar CBD levels. Both strains are primarily THC-dominant. If you need higher CBD content, consider a CBD-specific strain.`,
    },
    {
      question: `Are ${strainA.name} and ${strainB.name} similar strains?`,
      answer:
        sharedPercent >= 60
          ? `Yes, ${strainA.name} and ${strainB.name} share about ${sharedPercent}% of their reported effects, making them relatively similar strains. Both are ${strainA.type === strainB.type ? formatType(strainA.type).toLowerCase() + ' strains' : 'different types (' + formatType(strainA.type).toLowerCase() + ' vs ' + formatType(strainB.type).toLowerCase() + ')'}, and users may find them somewhat interchangeable, though subtle differences in terpene profiles and potency create distinct experiences.`
          : sharedPercent >= 30
            ? `${strainA.name} and ${strainB.name} share some similarities with about ${sharedPercent}% of their effects in common, but they have notable differences. ${strainA.type !== strainB.type ? `They are different types (${formatType(strainA.type).toLowerCase()} vs ${formatType(strainB.type).toLowerCase()}).` : ''} Each strain offers a unique experience despite the overlap.`
            : `${strainA.name} and ${strainB.name} are quite different strains, sharing only about ${sharedPercent}% of their reported effects. ${strainA.type !== strainB.type ? `${strainA.name} is ${formatType(strainA.type).toLowerCase()} while ${strainB.name} is ${formatType(strainB.type).toLowerCase()}.` : ''} They offer distinctly different experiences and may suit different preferences.`,
    },
  ]

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Comparisons', item: 'https://leefii.com/compare' },
      { '@type': 'ListItem', position: 3, name: `${strainA.name} vs ${strainB.name}` },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {strainA.name} vs {strainB.name}
          </h1>
          <p className="text-green-100 text-lg">
            Side-by-side strain comparison with THC, CBD, effects, terpenes, and medical uses.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/compare" className="hover:text-green-600">Comparisons</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{strainA.name} vs {strainB.name}</span>
        </nav>

        {/* Quick Stats Cards */}
        <section className="mb-10">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border-2 border-green-500 shadow-sm">
              <Link href={`/strains/${strainA.slug}`} className="hover:underline">
                <h2 className="text-xl font-bold text-green-700 mb-3">{strainA.name}</h2>
              </Link>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold">Type:</span> {formatType(strainA.type)}</p>
                <p><span className="font-semibold">THC:</span> {formatThc(strainA)}</p>
                <p><span className="font-semibold">CBD:</span> {formatCbd(strainA)}</p>
                <p>
                  <span className="font-semibold">Rating:</span>{' '}
                  {strainA.rating ? `${strainA.rating.toFixed(1)} / 5` : 'N/A'}
                  {strainA.reviewsCount ? ` (${strainA.reviewsCount} reviews)` : ''}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-blue-500 shadow-sm">
              <Link href={`/strains/${strainB.slug}`} className="hover:underline">
                <h2 className="text-xl font-bold text-blue-700 mb-3">{strainB.name}</h2>
              </Link>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold">Type:</span> {formatType(strainB.type)}</p>
                <p><span className="font-semibold">THC:</span> {formatThc(strainB)}</p>
                <p><span className="font-semibold">CBD:</span> {formatCbd(strainB)}</p>
                <p>
                  <span className="font-semibold">Rating:</span>{' '}
                  {strainB.rating ? `${strainB.rating.toFixed(1)} / 5` : 'N/A'}
                  {strainB.reviewsCount ? ` (${strainB.reviewsCount} reviews)` : ''}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Side-by-Side Comparison Table */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Detailed Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-gray-50 border-b w-1/3 text-sm">Attribute</th>
                  <th className="text-center p-4 bg-green-50 border-b w-1/3 font-bold text-green-800">
                    <Link href={`/strains/${strainA.slug}`} className="hover:underline">{strainA.name}</Link>
                  </th>
                  <th className="text-center p-4 bg-blue-50 border-b w-1/3 font-bold text-blue-800">
                    <Link href={`/strains/${strainB.slug}`} className="hover:underline">{strainB.name}</Link>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="p-4 border-b text-sm font-medium text-gray-700">Type</td>
                  <td className="p-4 border-b text-center text-sm">{formatType(strainA.type)}</td>
                  <td className="p-4 border-b text-center text-sm">{formatType(strainB.type)}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 border-b text-sm font-medium text-gray-700">THC</td>
                  <td className={`p-4 border-b text-center text-sm ${thcA > thcB ? 'font-bold text-green-700' : ''}`}>{formatThc(strainA)}</td>
                  <td className={`p-4 border-b text-center text-sm ${thcB > thcA ? 'font-bold text-blue-700' : ''}`}>{formatThc(strainB)}</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-4 border-b text-sm font-medium text-gray-700">CBD</td>
                  <td className={`p-4 border-b text-center text-sm ${cbdA > cbdB ? 'font-bold text-green-700' : ''}`}>{formatCbd(strainA)}</td>
                  <td className={`p-4 border-b text-center text-sm ${cbdB > cbdA ? 'font-bold text-blue-700' : ''}`}>{formatCbd(strainB)}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 border-b text-sm font-medium text-gray-700">Rating</td>
                  <td className={`p-4 border-b text-center text-sm font-bold ${(strainA.rating || 0) >= (strainB.rating || 0) ? 'text-green-700' : ''}`}>
                    {strainA.rating ? `${strainA.rating.toFixed(1)} / 5` : 'N/A'}
                  </td>
                  <td className={`p-4 border-b text-center text-sm font-bold ${(strainB.rating || 0) > (strainA.rating || 0) ? 'text-blue-700' : ''}`}>
                    {strainB.rating ? `${strainB.rating.toFixed(1)} / 5` : 'N/A'}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="p-4 border-b text-sm font-medium text-gray-700">Reviews</td>
                  <td className="p-4 border-b text-center text-sm">{strainA.reviewsCount || 0}</td>
                  <td className="p-4 border-b text-center text-sm">{strainB.reviewsCount || 0}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 border-b text-sm font-medium text-gray-700">Top Effects</td>
                  <td className="p-4 border-b text-center text-sm">{strainA.effects?.slice(0, 3).join(', ') || 'N/A'}</td>
                  <td className="p-4 border-b text-center text-sm">{strainB.effects?.slice(0, 3).join(', ') || 'N/A'}</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-4 border-b text-sm font-medium text-gray-700">Top Flavors</td>
                  <td className="p-4 border-b text-center text-sm">{strainA.flavors?.slice(0, 3).join(', ') || 'N/A'}</td>
                  <td className="p-4 border-b text-center text-sm">{strainB.flavors?.slice(0, 3).join(', ') || 'N/A'}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 border-b text-sm font-medium text-gray-700">Medical Uses</td>
                  <td className="p-4 border-b text-center text-sm">{strainA.conditions?.join(', ') || 'N/A'}</td>
                  <td className="p-4 border-b text-center text-sm">{strainB.conditions?.join(', ') || 'N/A'}</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-4 border-b text-sm font-medium text-gray-700">Grow Difficulty</td>
                  <td className="p-4 border-b text-center text-sm">{strainA.difficulty || 'N/A'}</td>
                  <td className="p-4 border-b text-center text-sm">{strainB.difficulty || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Effects Comparison */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Effects Comparison</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {sharedEffects.length > 0 && (
              <div className="bg-white rounded-xl p-5 border">
                <h3 className="font-semibold text-gray-900 mb-3">Shared Effects</h3>
                <div className="flex flex-wrap gap-2">
                  {sharedEffects.map((e) => (
                    <span key={e} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{e}</span>
                  ))}
                </div>
              </div>
            )}
            {uniqueEffectsA.length > 0 && (
              <div className="bg-white rounded-xl p-5 border">
                <h3 className="font-semibold text-green-700 mb-3">Only {strainA.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {uniqueEffectsA.map((e) => (
                    <span key={e} className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">{e}</span>
                  ))}
                </div>
              </div>
            )}
            {uniqueEffectsB.length > 0 && (
              <div className="bg-white rounded-xl p-5 border">
                <h3 className="font-semibold text-blue-700 mb-3">Only {strainB.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {uniqueEffectsB.map((e) => (
                    <span key={e} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">{e}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Terpene Profile Comparison */}
        {terpenes.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Terpene Profile Comparison</h2>
            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <div className="flex items-center gap-4 mb-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-green-500 rounded-full inline-block" /> {strainA.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-blue-500 rounded-full inline-block" /> {strainB.name}
                </span>
              </div>
              <div className="space-y-4">
                {terpenes.map((t) => {
                  const pctA = maxTerp > 0 ? Math.round(((t.a || 0) / maxTerp) * 100) : 0
                  const pctB = maxTerp > 0 ? Math.round(((t.b || 0) / maxTerp) * 100) : 0
                  return (
                    <div key={t.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 w-28">{t.name}</span>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="text-green-700">{t.a?.toFixed(2) || '0.00'}%</span>
                          <span>/</span>
                          <span className="text-blue-700">{t.b?.toFixed(2) || '0.00'}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${Math.max(pctA, 2)}%` }}
                          />
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.max(pctB, 2)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Which Should You Choose? */}
        <section className="mb-10">
          <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Which Should You Choose?</h2>
            <div className="space-y-4 text-gray-700">
              {thcA !== thcB && (
                <p>
                  <span className="font-semibold">For stronger effects:</span>{' '}
                  {thcA > thcB
                    ? `Choose ${strainA.name} with up to ${strainA.thcMax}% THC for a more potent experience.`
                    : `Choose ${strainB.name} with up to ${strainB.thcMax}% THC for a more potent experience.`}
                </p>
              )}
              {strainA.type !== strainB.type && (
                <p>
                  <span className="font-semibold">Different vibes:</span>{' '}
                  {strainA.type === 'INDICA'
                    ? `Choose ${strainA.name} (${formatType(strainA.type).toLowerCase()}) for relaxation and body effects, or ${strainB.name} (${formatType(strainB.type).toLowerCase()}) for ${strainB.type === 'SATIVA' ? 'energy and cerebral stimulation' : 'a balanced experience'}.`
                    : strainA.type === 'SATIVA'
                      ? `Choose ${strainA.name} (${formatType(strainA.type).toLowerCase()}) for energy and focus, or ${strainB.name} (${formatType(strainB.type).toLowerCase()}) for ${strainB.type === 'INDICA' ? 'relaxation and body effects' : 'a balanced experience'}.`
                      : `Choose ${strainA.name} (${formatType(strainA.type).toLowerCase()}) for a balanced experience, or ${strainB.name} (${formatType(strainB.type).toLowerCase()}) for ${strainB.type === 'INDICA' ? 'relaxation' : 'energy'}.`}
                </p>
              )}
              {(uniqueConditionsA.length > 0 || uniqueConditionsB.length > 0) && (
                <p>
                  <span className="font-semibold">Medical considerations:</span>{' '}
                  {uniqueConditionsA.length > 0 && (
                    <>{strainA.name} may uniquely help with {uniqueConditionsA.join(', ').toLowerCase()}. </>
                  )}
                  {uniqueConditionsB.length > 0 && (
                    <>{strainB.name} may uniquely help with {uniqueConditionsB.join(', ').toLowerCase()}.</>
                  )}
                </p>
              )}
              {cbdA !== cbdB && (cbdA > 0 || cbdB > 0) && (
                <p>
                  <span className="font-semibold">For higher CBD:</span>{' '}
                  {cbdA > cbdB
                    ? `${strainA.name} offers more CBD (${strainA.cbdMax}%), which may provide additional therapeutic benefits and a more balanced experience.`
                    : `${strainB.name} offers more CBD (${strainB.cbdMax}%), which may provide additional therapeutic benefits and a more balanced experience.`}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Find Near You CTA */}
        <section className="mb-10 bg-green-700 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Find These Strains Near You</h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Search dispensaries carrying {strainA.name} and {strainB.name} in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dispensaries"
              className="bg-white text-green-700 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition"
            >
              Find Dispensaries
            </Link>
            <Link
              href={`/strains/${strainA.slug}`}
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition"
            >
              View {strainA.name}
            </Link>
            <Link
              href={`/strains/${strainB.slug}`}
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition"
            >
              View {strainB.name}
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqItems.map((faq) => (
              <details key={faq.question} className="bg-white rounded-xl shadow-sm border border-gray-100">
                <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">
                  {faq.question}
                </summary>
                <p className="px-4 pb-4 text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related Comparisons */}
        {related.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Comparisons</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {related.map((r) => (
                <div key={r.slug} className="flex gap-2">
                  <Link
                    href={`/compare/${strainA.slug}-vs-${r.slug}`}
                    className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm hover:shadow-md transition border border-gray-100 text-sm font-medium text-gray-900 hover:text-green-700"
                  >
                    {strainA.name} vs {r.name}
                  </Link>
                  <Link
                    href={`/compare/${strainB.slug}-vs-${r.slug}`}
                    className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm hover:shadow-md transition border border-gray-100 text-sm font-medium text-gray-900 hover:text-green-700"
                  >
                    {strainB.name} vs {r.name}
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
