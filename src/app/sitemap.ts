import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

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
  const effectSlugs = ['relaxed', 'energetic', 'happy', 'creative', 'focused', 'sleepy', 'hungry', 'euphoric', 'uplifted', 'calm', 'talkative', 'giggly']
  const effectPages: MetadataRoute.Sitemap = effectSlugs.map((slug) => ({
    url: `${baseUrl}/strains/effects/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

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

  // ==================== COMBINE ALL ====================
  return [
    ...staticPages,
    ...competitorPages,
    ...effectPages,
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
  ]
}
