import { NextResponse } from 'next/server'

/**
 * Sitemap Index Route
 * 
 * Next.js 14.2 with generateSitemaps() generates /sitemap/0.xml through /sitemap/5.xml
 * but does NOT automatically generate the index at /sitemap.xml.
 * This route handler serves the sitemap index that Google expects.
 * 
 * The robots.ts points to https://leefii.com/sitemap.xml — this route answers that.
 */
export async function GET() {
  const baseUrl = 'https://leefii.com'
  
  // These match the IDs returned by generateSitemaps() in src/app/sitemap.ts
  const sitemapIds = [0, 1, 2, 3, 4, 5]
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapIds.map((id) => `  <sitemap>
    <loc>${baseUrl}/sitemap/${id}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
