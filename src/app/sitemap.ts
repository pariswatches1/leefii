import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://leefii.com'

  // Get all states
  const states = await prisma.state.findMany({
    select: { slug: true, updatedAt: true }
  })

  // Get all cities with dispensaries
  const cities = await prisma.city.findMany({
    where: {
      dispensaries: { some: {} }
    },
    select: { 
      slug: true, 
      updatedAt: true,
      state: { select: { slug: true } }
    }
  })

  // Get all dispensaries
  const dispensaries = await prisma.dispensary.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true }
  })

  // Get all strains
  const strains = await prisma.strain.findMany({
    select: { slug: true, updatedAt: true }
  })

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/dispensaries`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/strains`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // State pages
  const statePages: MetadataRoute.Sitemap = states.map((state) => ({
    url: `${baseUrl}/dispensaries/${state.slug}`,
    lastModified: state.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // City pages
  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/dispensaries/${city.state.slug}/${city.slug}`,
    lastModified: city.updatedAt || new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Dispensary pages
  const dispensaryPages: MetadataRoute.Sitemap = dispensaries.map((dispensary) => ({
    url: `${baseUrl}/dispensary/${dispensary.slug}`,
    lastModified: dispensary.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Strain pages
  const strainPages: MetadataRoute.Sitemap = strains.map((strain) => ({
    url: `${baseUrl}/strains/${strain.slug}`,
    lastModified: strain.updatedAt || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...statePages,
    ...cityPages,
    ...dispensaryPages,
    ...strainPages,
  ]
}
