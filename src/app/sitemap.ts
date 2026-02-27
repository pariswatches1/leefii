import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { getStateLawSlugs, getStateLawBySlug } from '@/data/cannabis-laws'
import { getAllForPageSlugs, getAllCrossRefParams } from '@/data/strain-purposes'
import { getAllDealPageSlugs } from '@/data/deal-categories'
import { getAllMedicalCardGuideSlugs } from '@/data/medical-card-guides'
import { getAllCategorySlugs, getAllStaticArticleSlugs } from '@/data/blog'
import { getAllNewsCategorySlugs } from '@/data/news-categories'
import { getAllCategoryComparisonSlugs, getAllPlatformComparisonSlugs, TOP_STRAIN_PAIRS } from '@/data/comparison-pages'
import { getAllToolSlugs } from '@/data/tools'
import { PHOENIX_NEIGHBORHOODS, PHOENIX_STRAINS, PHOENIX_BEST_FOR } from '@/data/phoenix'

/**
 * Split sitemap index.
 * Google recommends splitting large sitemaps for better crawl efficiency.
 *
 * Index:
 *  /sitemap/0.xml — Static pages, tools, laws, medical cards, comparisons, shop
 *  /sitemap/1.xml — Dispensaries (state + city + detail + neighborhoods)
 *  /sitemap/2.xml — Strains (detail + effects + types + terpenes + conditions + flavors + comparisons)
 *  /sitemap/3.xml — Deals, delivery, doctors, near-me, zip codes
 *  /sitemap/4.xml — Blog, news, marketplace products
 *  /sitemap/5.xml — Phoenix SEO domination pages
 */
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://leefii.com'

  try {
    switch (id) {
      case 0:
        return buildStaticSitemap(baseUrl)
      case 1:
        return buildDispensarySitemap(baseUrl)
      case 2:
        return buildStrainSitemap(baseUrl)
      case 3:
        return buildLocalSitemap(baseUrl)
      case 4:
        return buildContentSitemap(baseUrl)
      case 5:
        return buildPhoenixSitemap(baseUrl)
      default:
        return []
    }
  } catch (error) {
    console.error(`[Sitemap ${id}] Error generating sitemap:`, error)
    // Fallback: return minimal entries for sitemap 0 only
    if (id === 0) {
      return [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/dispensaries`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/strains`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/deals`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/doctors`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/delivery`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
      ]
    }
    return []
  }
}

// =====================================================================
// Sitemap 0: Static pages, tools, laws, medical cards, comparisons, shop
// =====================================================================
async function buildStaticSitemap(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/dispensaries`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/strains`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/deals`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/delivery`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/doctors`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/marketplace`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/quiz`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/sell`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/how-we-verify`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/accuracy-guarantee`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Competitor comparison pages
  const competitorPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/compare/leefii-vs-leafly`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/compare/leefii-vs-weedmaps`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  // Comparison pages
  const comparisonPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...getAllCategoryComparisonSlugs().map((slug) => ({
      url: `${baseUrl}/compare/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...getAllPlatformComparisonSlugs().map((slug) => ({
      url: `${baseUrl}/compare/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...TOP_STRAIN_PAIRS.map((pair) => ({
      url: `${baseUrl}/compare/${pair}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ]

  // Tools pages
  const toolPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ...getAllToolSlugs().map((slug) => ({
      url: `${baseUrl}/tools/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  // Badge pages
  const badgePages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/badges`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/badges/all`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]

  // API docs
  const apiDocPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/api-docs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/api-docs/keys`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/api-docs/quickstart`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/api-docs/examples`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  // Cannabis law pages
  const lawStateSlugs = getStateLawSlugs()
  const lawPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/laws`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/laws/recreational-states`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/laws/medical-states`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/laws/federal`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...lawStateSlugs.map((slug) => ({
      url: `${baseUrl}/laws/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]

  // Medical card guide pages
  const medicalCardSlugs = getAllMedicalCardGuideSlugs()
  const medicalCardPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/medical-card/qualifying-conditions`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...medicalCardSlugs.map((slug) => ({
      url: `${baseUrl}/medical-card/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  return [
    ...staticPages,
    ...competitorPages,
    ...comparisonPages,
    ...toolPages,
    ...badgePages,
    ...apiDocPages,
    ...lawPages,
    ...medicalCardPages,
  ]
}

// =====================================================================
// Sitemap 1: Dispensaries (state + city + detail + neighborhoods)
// =====================================================================
async function buildDispensarySitemap(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const [states, cities, dispensaries] = await Promise.all([
    prisma.state.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.city.findMany({
      where: { dispensaries: { some: {} } },
      select: { slug: true, updatedAt: true, state: { select: { slug: true } } },
    }),
    prisma.dispensary.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
  ])

  // State listing pages
  const statePages: MetadataRoute.Sitemap = states.map((s) => ({
    url: `${baseUrl}/dispensaries/${s.slug}`,
    lastModified: s.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // City listing pages
  const cityPages: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${baseUrl}/dispensaries/${c.state.slug}/${c.slug}`,
    lastModified: c.updatedAt || new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Individual dispensary pages
  const dispensaryPages: MetadataRoute.Sitemap = dispensaries.map((d) => ({
    url: `${baseUrl}/dispensary/${d.slug}`,
    lastModified: d.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Neighborhood pages (cities with pop >= 50K)
  const neighborhoodCities = await prisma.city.findMany({
    where: { dispensaryCount: { gt: 0 }, population: { gte: 50000 } },
    select: { id: true, slug: true, state: { select: { slug: true } } },
  })
  const neighborhoodPages: MetadataRoute.Sitemap = []
  for (const nc of neighborhoodCities) {
    const cityZips = await prisma.dispensary.findMany({
      where: { cityId: nc.id, isActive: true },
      select: { zipCode: true },
      distinct: ['zipCode'],
    })
    for (const d of cityZips) {
      neighborhoodPages.push({
        url: `${baseUrl}/dispensaries/${nc.state.slug}/${nc.slug}/${d.zipCode}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      })
    }
  }

  return [...statePages, ...cityPages, ...dispensaryPages, ...neighborhoodPages]
}

// =====================================================================
// Sitemap 2: Strains (all strain-related pages)
// =====================================================================
async function buildStrainSitemap(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const activeStrains = await prisma.strain.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  })

  // Individual strain pages
  const strainPages: MetadataRoute.Sitemap = activeStrains.map((s) => ({
    url: `${baseUrl}/strains/${s.slug}`,
    lastModified: s.updatedAt || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Effects pages
  const effectSlugs = ['relaxed', 'energetic', 'happy', 'creative', 'focused', 'sleepy', 'hungry', 'euphoric', 'uplifted', 'calm', 'talkative', 'giggly', 'tingly', 'aroused', 'peaceful']
  const effectPages: MetadataRoute.Sitemap = effectSlugs.map((slug) => ({
    url: `${baseUrl}/strains/effects/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Type pages (indica, sativa, hybrid)
  const typeSlugs = ['indica', 'sativa', 'hybrid']
  const typePages: MetadataRoute.Sitemap = typeSlugs.flatMap((slug) => [
    { url: `${baseUrl}/strains/${slug}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/strains/type/${slug}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
  ])

  // Type + Effect combo pages
  const typeEffectPages: MetadataRoute.Sitemap = typeSlugs.flatMap((typeSlug) =>
    effectSlugs.map((effectSlug) => ({
      url: `${baseUrl}/strains/type/${typeSlug}/${effectSlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))
  )

  // Terpene pages
  const terpeneSlugs = ['myrcene', 'limonene', 'caryophyllene', 'pinene', 'linalool', 'humulene', 'terpinolene', 'ocimene']
  const terpenePages: MetadataRoute.Sitemap = terpeneSlugs.map((slug) => ({
    url: `${baseUrl}/strains/terpene/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Condition pages
  const conditionSlugs = ['anxiety', 'depression', 'stress', 'chronic-pain', 'insomnia', 'ptsd', 'nausea', 'appetite-loss', 'inflammation', 'muscle-spasms', 'arthritis']
  const conditionPages: MetadataRoute.Sitemap = conditionSlugs.map((slug) => ({
    url: `${baseUrl}/strains/conditions/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Flavor pages
  const flavorSlugs = ['earthy','berry','tropical','spicy','sweet','pineapple','citrus','mango','pine','woody','blueberry','pungent','herbal','floral','orange','honey','chemical','nutty','diesel','lemon','grape','cheese','mint','strawberry','lime','coffee','vanilla','lavender','cherry','apple','grapefruit','banana','peach','chocolate','skunk','coconut','rose','watermelon','butter','fruity','ammonia','garlic','creamy']
  const flavorPages: MetadataRoute.Sitemap = flavorSlugs.map((slug) => ({
    url: `${baseUrl}/strains/flavors/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  // Strain comparison pages (top rated strains only)
  const topComparableStrains = await prisma.strain.findMany({
    where: { isActive: true, rating: { gte: 4.0 }, reviewsCount: { gte: 10 } },
    orderBy: [{ reviewsCount: 'desc' }, { rating: 'desc' }],
    take: 32,
    select: { slug: true },
  })
  const comparisonUrls: MetadataRoute.Sitemap = []
  for (let i = 0; i < topComparableStrains.length; i++) {
    for (let j = i + 1; j < topComparableStrains.length && comparisonUrls.length < 500; j++) {
      comparisonUrls.push({
        url: `${baseUrl}/strains/compare/${topComparableStrains[i].slug}-vs-${topComparableStrains[j].slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.4,
      })
    }
  }

  // Strain purpose pages (/strains/for/[slug])
  const forPageSlugs = getAllForPageSlugs()
  const strainForPages: MetadataRoute.Sitemap = forPageSlugs.map((slug) => ({
    url: `${baseUrl}/strains/for/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Cross-reference pages (/strains/[category]/for/[purpose])
  const crossRefParams = getAllCrossRefParams()
  const crossRefPages: MetadataRoute.Sitemap = crossRefParams.map((cr) => ({
    url: `${baseUrl}/strains/${cr.category}/for/${cr.purpose}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    ...strainPages,
    ...effectPages,
    ...typePages,
    ...typeEffectPages,
    ...terpenePages,
    ...conditionPages,
    ...flavorPages,
    ...comparisonUrls,
    ...strainForPages,
    ...crossRefPages,
  ]
}

// =====================================================================
// Sitemap 3: Deals, delivery, doctors, near-me, zip codes
// =====================================================================
async function buildLocalSitemap(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const [states, deliveryCities, distinctZips] = await Promise.all([
    prisma.state.findMany({ select: { slug: true, updatedAt: true, abbreviation: true } }),
    prisma.city.findMany({
      where: { dispensaries: { some: { isActive: true, hasDelivery: true } } },
      select: { slug: true, updatedAt: true, state: { select: { slug: true } } },
    }),
    prisma.dispensary.findMany({
      where: { isActive: true },
      select: { zipCode: true },
      distinct: ['zipCode'],
    }),
  ])

  // Delivery state + city pages (only where delivery is legal)
  const deliveryCityPages: MetadataRoute.Sitemap = deliveryCities
    .filter((c) => {
      const law = getStateLawBySlug(c.state.slug)
      return law && law.deliveryAllowed.startsWith('Yes')
    })
    .map((c) => ({
      url: `${baseUrl}/delivery/${c.state.slug}/${c.slug}`,
      lastModified: c.updatedAt || new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }))

  const deliveryStateSlugs = Array.from(new Set(deliveryCities.map((c) => c.state.slug)))
  const deliveryStatePages: MetadataRoute.Sitemap = deliveryStateSlugs
    .filter((stateSlug) => {
      const law = getStateLawBySlug(stateSlug)
      return law && law.deliveryAllowed.startsWith('Yes')
    })
    .map((stateSlug) => ({
      url: `${baseUrl}/delivery/${stateSlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  // Doctor state pages
  const doctorStateAbbreviations = await prisma.doctor.findMany({
    where: { isActive: true },
    select: { state: true },
    distinct: ['state'],
  })
  const doctorStateAbbrevs = new Set(doctorStateAbbreviations.map((d) => d.state).filter(Boolean))
  const doctorStates = states.filter((s) => doctorStateAbbrevs.has(s.abbreviation))

  const doctorStatePages: MetadataRoute.Sitemap = doctorStates.map((s) => ({
    url: `${baseUrl}/doctors/${s.slug}`,
    lastModified: s.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Doctor city pages (cities with 3+ doctors)
  const doctorCityData = await prisma.doctor.groupBy({
    by: ['state', 'city'],
    where: { isActive: true },
    _count: { id: true },
  })
  const doctorCityPages: MetadataRoute.Sitemap = []
  for (const d of doctorCityData.filter((g) => g._count.id >= 3 && g.state && g.city)) {
    const stateRecord = states.find((s) => s.abbreviation === d.state)
    if (!stateRecord) continue
    const cityRecord = await prisma.city.findFirst({
      where: { name: { equals: d.city!, mode: 'insensitive' }, state: { abbreviation: d.state! } },
      select: { slug: true },
    })
    if (cityRecord) {
      doctorCityPages.push({
        url: `${baseUrl}/doctors/${stateRecord.slug}/${cityRecord.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })
    }
  }

  // Deal pages
  const dealPageSlugs = getAllDealPageSlugs()
  const dealTypePages: MetadataRoute.Sitemap = dealPageSlugs.map((slug) => ({
    url: `${baseUrl}/deals/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const cityDealsDistinct = await prisma.deal.findMany({
    where: { isActive: true },
    select: { stateSlug: true, citySlug: true },
    distinct: ['stateSlug', 'citySlug'],
  })
  const cityDealPages: MetadataRoute.Sitemap = cityDealsDistinct
    .filter((d) => d.stateSlug && d.citySlug)
    .map((d) => ({
      url: `${baseUrl}/deals/${d.stateSlug}/${d.citySlug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }))

  // Near-me pages
  const nearMePages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/near-me`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ]
  const zipCodePages: MetadataRoute.Sitemap = distinctZips.map((d) => ({
    url: `${baseUrl}/near-me/${d.zipCode}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    ...deliveryStatePages,
    ...deliveryCityPages,
    ...doctorStatePages,
    ...doctorCityPages,
    ...dealTypePages,
    ...cityDealPages,
    ...nearMePages,
    ...zipCodePages,
  ]
}

// =====================================================================
// Sitemap 4: Blog, news, marketplace products
// =====================================================================
async function buildContentSitemap(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, newsArticles, products] = await Promise.all([
    prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.newsArticle.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.product.findMany({
      where: { isAvailable: true, seller: { isActive: true } },
      select: { slug: true, updatedAt: true },
    }),
  ])

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Blog category pages
  const blogCategoryPages: MetadataRoute.Sitemap = getAllCategorySlugs().map((slug) => ({
    url: `${baseUrl}/blog/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Static pillar articles (deduplicated against DB posts)
  const dbBlogSlugs = new Set(blogPosts.map((p) => p.slug))
  const staticArticlePages: MetadataRoute.Sitemap = getAllStaticArticleSlugs()
    .filter((slug) => !dbBlogSlugs.has(slug))
    .map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  // News pages
  const newsPages: MetadataRoute.Sitemap = newsArticles.map((a) => ({
    url: `${baseUrl}/news/${a.slug}`,
    lastModified: a.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // News category pages
  const newsCategoryPages: MetadataRoute.Sitemap = getAllNewsCategorySlugs().map((slug) => ({
    url: `${baseUrl}/news/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // News state pages
  const newsStatePages: MetadataRoute.Sitemap = [
    'florida', 'california', 'colorado', 'new-york', 'texas', 'illinois',
    'ohio', 'michigan', 'arizona', 'new-jersey', 'pennsylvania', 'virginia',
    'oklahoma', 'hawaii', 'new-hampshire',
  ].map((slug) => ({
    url: `${baseUrl}/news/state/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }))

  // Marketplace product pages
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/marketplace/product/${p.slug}`,
    lastModified: p.updatedAt || new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }))

  return [
    ...blogPages,
    ...blogCategoryPages,
    ...staticArticlePages,
    ...newsPages,
    ...newsCategoryPages,
    ...newsStatePages,
    ...productPages,
  ]
}

// =====================================================================
// Sitemap 5: Phoenix SEO domination pages
// =====================================================================
async function buildPhoenixSitemap(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  // Phoenix neighborhood pages (20 pages)
  const neighborhoodPages: MetadataRoute.Sitemap = PHOENIX_NEIGHBORHOODS.map((n) => ({
    url: `${baseUrl}/dispensaries/arizona/phoenix/${n.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Strain x Phoenix pages (15 pages)
  const strainPages: MetadataRoute.Sitemap = PHOENIX_STRAINS.map((s) => ({
    url: `${baseUrl}/strains/${s.slug}/phoenix-az`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // "Best For" x Phoenix pages (10 pages)
  const bestForPages: MetadataRoute.Sitemap = PHOENIX_BEST_FOR.map((b) => ({
    url: `${baseUrl}/best/${b.slug}/phoenix-az`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...neighborhoodPages, ...strainPages, ...bestForPages]
}
