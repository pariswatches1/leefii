import { prisma } from '@/lib/prisma'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const articles = await prisma.newsArticle.findMany({
    where: {
      isPublished: true,
      publishedAt: {
        gte: new Date(Date.now() - 48 * 60 * 60 * 1000),
      },
    },
    orderBy: { publishedAt: 'desc' },
    take: 1000,
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${articles
  .map(
    (a) => `  <url>
    <loc>https://leefii.com/news/${escapeXml(a.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>Leefii</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${a.publishedAt?.toISOString() || a.createdAt.toISOString()}</news:publication_date>
      <news:title>${escapeXml(a.title)}</news:title>${a.tags?.length ? `
      <news:keywords>${escapeXml(a.tags.join(', '))}</news:keywords>` : ''}
    </news:news>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
