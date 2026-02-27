import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/dashboard/',
          '/doctor-dashboard/',
          '/seller/',
          '/journal/',
          '/favorites/',
          '/login',
          '/register',
          '/search',
          '/offline',
          '/strapi-admin/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/dashboard/',
          '/doctor-dashboard/',
          '/seller/',
          '/journal/',
          '/favorites/',
          '/login',
          '/register',
          '/search',
          '/offline',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/dashboard/',
          '/journal/',
          '/favorites/',
          '/login',
          '/register',
          '/search',
        ],
      },
      // AI crawlers — allow full access to public content
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/journal/', '/favorites/', '/login', '/register'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        userAgent: 'Applebot',
        allow: '/',
      },
      {
        userAgent: 'Bytespider',
        allow: '/',
      },
      {
        userAgent: 'cohere-ai',
        allow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
      },
      {
        userAgent: 'YouBot',
        allow: '/',
      },
      {
        userAgent: 'CCBot',
        allow: '/',
      },
    ],
    // Next.js generates /sitemap.xml as a sitemap index pointing to /sitemap/0.xml through /sitemap/5.xml
    sitemap: 'https://leefii.com/sitemap.xml',
  }
}
