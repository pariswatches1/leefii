import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { getStateLawSlugs } from '@/data/cannabis-laws'
import { getAllForPageSlugs, getAllCrossRefParams } from '@/data/strain-purposes'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://leefii.com'

  // ==================== QUERIES ====================
  const [
    states,
    cities,
    dispensaries,
    strains,
    blogPosts,
    newsArticles,
    doctors,
    products,
    deliveryCities,
  ] = await Promise.all([
    prisma.state.findMany({ select: { slug: true, updatedAt: true, abbreviation: true } }),
    prisma.city.findMany({
      where: { dispensaries: { some: {} } },
      select: { slug: true, updatedAt: true, state: { select: { slug: true } } },
    }),
    prisma.dispensary.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.strain.findMany({
      select: { slug: true, updatedAt: true },
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.newsArticle.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.doctor.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.product.findMany({
      where: { isAvailable: true, seller: { isActive: true } },
      select: { slug: true, updatedAt: true },
    }),
    prisma.city.findMany({
      where: { dispensaries: { some: { isActive: true, hasDelivery: true } } },
      select: { slug: true, updatedAt: true, state: { select: { slug: true } } },
    }),
  ])

  // Find states that have doctors (Doctor.state is abbreviation string)
  const doctorStateAbbreviations = await prisma.doctor.findMany({
    where: { isActive: true },
    select: { state: true },
    distinct: ['state'],
  })
  const doctorStateAbbrevs = new Set(doctorStateAbbreviations.map((d) => d.state).filter(Boolean))
  const doctorStates = states.filter((s) => doctorStateAbbrevs.has(s.abbreviation))

  // ==================== STATIC PAGES ====================
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/dispensaries`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/strains`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/deals`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/delivery`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/doctors`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/marketplace`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/quiz`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/sell`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  // ==================== COMPETITOR COMPARISON PAGES ====================
  const competitorPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/compare/leefii-vs-leafly`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/compare/leefii-vs-weedmaps`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  // ==================== EFFECTS PAGES ====================
  const effectSlugs = ['relaxed', 'energetic', 'happy', 'creative', 'focused', 'sleepy', 'hungry', 'euphoric', 'uplifted', 'calm', 'talkative', 'giggly', 'tingly', 'aroused', 'peaceful']
  const effectPages: MetadataRoute.Sitemap = effectSlugs.map((slug) => ({
    url: `${baseUrl}/strains/effects/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // ==================== STRAIN TYPE PAGES ====================
  const typeSlugs = ['indica', 'sativa', 'hybrid']
  const typePages: MetadataRoute.Sitemap = typeSlugs.flatMap((slug) => [
    {
      url: `${baseUrl}/strains/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/strains/type/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ])

  // ==================== TYPE + EFFECT COMBO PAGES ====================
  const typeEffectPages: MetadataRoute.Sitemap = typeSlugs.flatMap((typeSlug) =>
    effectSlugs.map((effectSlug) => ({
      url: `${baseUrl}/strains/type/${typeSlug}/${effectSlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))
  )

  // ==================== TERPENE PAGES ====================
  const terpeneSlugs = ['myrcene', 'limonene', 'caryophyllene', 'pinene', 'linalool', 'humulene', 'terpinolene', 'ocimene']
  const terpenePages: MetadataRoute.Sitemap = terpeneSlugs.map((slug) => ({
    url: `${baseUrl}/strains/terpene/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // ==================== CONDITION PAGES ====================
  const conditionSlugs = ['anxiety', 'depression', 'stress', 'chronic-pain', 'insomnia', 'ptsd', 'nausea', 'appetite-loss', 'inflammation', 'muscle-spasms', 'arthritis']
  const conditionPages: MetadataRoute.Sitemap = conditionSlugs.map((slug) => ({
    url: `${baseUrl}/strains/conditions/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // ==================== FLAVOR PAGES ====================
  const flavorSlugs = ['earthy','berry','tropical','spicy','sweet','pineapple','citrus','mango','pine','woody','blueberry','pungent','herbal','floral','orange','honey','chemical','nutty','diesel','lemon','grape','cheese','mint','strawberry','lime','coffee','vanilla','lavender','cherry','apple','grapefruit','banana','peach','chocolate','skunk','coconut','rose','watermelon','butter','fruity','ammonia','garlic','creamy']
  const flavorPages: MetadataRoute.Sitemap = flavorSlugs.map((slug) => ({
    url: `${baseUrl}/strains/flavors/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  // ==================== STRAIN COMPARISON PAGES ====================
  const topComparableStrains = await prisma.strain.findMany({
    where: { isActive: true, rating: { gte: 4.0 }, reviewsCount: { gte: 10 } },
    orderBy: [{ reviewsCount: 'desc' }, { rating: 'desc' }],
    take: 100,
    select: { slug: true },
  })
  const comparisonUrls: MetadataRoute.Sitemap = []
  for (let i = 0; i < topComparableStrains.length; i++) {
    for (let j = i + 1; j < topComparableStrains.length && comparisonUrls.length < 4950; j++) {
      comparisonUrls.push({
        url: `${baseUrl}/strains/compare/${topComparableStrains[i].slug}-vs-${topComparableStrains[j].slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.4,
      })
    }
  }

  // ==================== STATE PAGES ====================
  const statePages: MetadataRoute.Sitemap = states.map((s) => ({
    url: `${baseUrl}/dispensaries/${s.slug}`,
    lastModified: s.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // ==================== CITY PAGES ====================
  const cityPages: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${baseUrl}/dispensaries/${c.state.slug}/${c.slug}`,
    lastModified: c.updatedAt || new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // ==================== DELIVERY+CITY PAGES ====================
  const deliveryPages: MetadataRoute.Sitemap = deliveryCities.map((c) => ({
    url: `${baseUrl}/delivery/${c.state.slug}/${c.slug}`,
    lastModified: c.updatedAt || new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }))

  // ==================== DOCTORS+STATE PAGES ====================
  const doctorStatePages: MetadataRoute.Sitemap = doctorStates.map((s) => ({
    url: `${baseUrl}/doctors/${s.slug}`,
    lastModified: s.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // ==================== DISPENSARY DETAIL PAGES ====================
  const dispensaryPages: MetadataRoute.Sitemap = dispensaries.map((d) => ({
    url: `${baseUrl}/dispensary/${d.slug}`,
    lastModified: d.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // ==================== STRAIN DETAIL PAGES ====================
  const strainPages: MetadataRoute.Sitemap = strains.map((s) => ({
    url: `${baseUrl}/strains/${s.slug}`,
    lastModified: s.updatedAt || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // ==================== BLOG & NEWS ====================
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const newsPages: MetadataRoute.Sitemap = newsArticles.map((a) => ({
    url: `${baseUrl}/news/${a.slug}`,
    lastModified: a.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // ==================== DOCTOR DETAIL & PRODUCT PAGES ====================
  const doctorPages: MetadataRoute.Sitemap = doctors.map((d) => ({
    url: `${baseUrl}/doctors/${d.slug}`,
    lastModified: d.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/marketplace/product/${p.slug}`,
    lastModified: p.updatedAt || new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }))

  // ==================== NEAR ME + NEIGHBORHOOD PAGES ====================
  // Near Me landing page
  const nearMeStaticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/near-me`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
  ]

  // Zip code pages: /near-me/[zipcode]
  const distinctZips = await prisma.dispensary.findMany({
    where: { isActive: true },
    select: { zipCode: true },
    distinct: ['zipCode'],
  })
  const zipCodePages: MetadataRoute.Sitemap = distinctZips.map((d) => ({
    url: `${baseUrl}/near-me/${d.zipCode}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Neighborhood pages: /dispensaries/[state]/[city]/[zipcode] (cities with pop >= 50K)
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

  // ==================== LAW PAGES ====================
  const lawStateSlugs = getStateLawSlugs()
  const lawStatePages: MetadataRoute.Sitemap = lawStateSlugs.map((slug) => ({
    url: `${baseUrl}/laws/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  const lawStaticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/laws`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/laws/recreational-states`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/laws/medical-states`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/laws/federal`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
  ]

  // ==================== STRAIN PURPOSE PAGES (/strains/for/[slug]) ====================
  const forPageSlugs = getAllForPageSlugs()
  const strainForPages: MetadataRoute.Sitemap = forPageSlugs.map((slug) => ({
    url: `${baseUrl}/strains/for/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // ==================== CROSS-REFERENCE PAGES (/strains/[category]/for/[purpose]) ====================
  const crossRefParams = getAllCrossRefParams()
  const crossRefPages: MetadataRoute.Sitemap = crossRefParams.map((cr) => ({
    url: `${baseUrl}/strains/${cr.category}/for/${cr.purpose}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // ==================== COMBINE ALL ====================
  return [
    ...staticPages,
    ...competitorPages,
    ...effectPages,
    ...typePages,
    ...typeEffectPages,
    ...terpenePages,
    ...conditionPages,
    ...flavorPages,
    ...comparisonUrls,
    ...statePages,
    ...cityPages,
    ...deliveryPages,
    ...doctorStatePages,
    ...dispensaryPages,
    ...strainPages,
    ...blogPages,
    ...newsPages,
    ...doctorPages,
    ...productPages,
    ...lawStatePages,
    ...lawStaticPages,
    ...nearMeStaticPages,
    ...zipCodePages,
    ...neighborhoodPages,
    ...strainForPages,
    ...crossRefPages,
  ]
}
